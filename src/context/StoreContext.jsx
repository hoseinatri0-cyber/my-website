import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getCurrency, setCurrency as persistCurrency } from '../lib/format.js'

const StoreContext = createContext(null)

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function usePersisted(key, fallback) {
  const [value, setValue] = useState(() => read(key, fallback))
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full or disabled */ }
  }, [key, value])
  return [value, setValue]
}

const lineKey = (id, color) => `${id}::${color || ''}`

export function StoreProvider({ children }) {
  const [cart, setCart] = usePersisted('nexora.cart', [])
  const [wishlist, setWishlist] = usePersisted('nexora.wishlist', [])
  const [compare, setCompare] = usePersisted('nexora.compare', [])
  const [currency, setCurrencyState] = useState(() => getCurrency())
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  useEffect(() => () => {
    timers.current.forEach((t) => clearTimeout(t))
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((list) => [...list, { id, message, tone }])
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
      timers.current.delete(id)
    }, 3200)
    timers.current.set(id, timer)
  }, [])

  const addToCart = useCallback((product, qty = 1, color) => {
    const chosen = color || (Array.isArray(product.colors) ? product.colors[0] : '') || ''
    const key = lineKey(product.id, chosen)
    setCart((list) => {
      const existing = list.find((line) => lineKey(line.id, line.color) === key)
      if (existing) {
        return list.map((line) => (lineKey(line.id, line.color) === key
          ? { ...line, qty: Math.min(line.qty + qty, 10) }
          : line))
      }
      return [...list, {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || '',
        stock: product.stock,
        color: chosen,
        qty: Math.min(qty, 10),
      }]
    })
    toast(`${product.name} added to cart`)
  }, [setCart, toast])

  const removeFromCart = useCallback((id, color) => {
    setCart((list) => list.filter((line) => lineKey(line.id, line.color) !== lineKey(id, color)))
  }, [setCart])

  const updateQty = useCallback((id, color, qty) => {
    const next = Math.max(1, Math.min(Number(qty) || 1, 10))
    setCart((list) => list.map((line) => (lineKey(line.id, line.color) === lineKey(id, color) ? { ...line, qty: next } : line)))
  }, [setCart])

  const clearCart = useCallback(() => setCart([]), [setCart])

  const toggleWishlist = useCallback((product) => {
    setWishlist((list) => {
      const exists = list.some((item) => item.id === product.id)
      if (exists) {
        toast(`${product.name} removed from wishlist`, 'neutral')
        return list.filter((item) => item.id !== product.id)
      }
      toast(`${product.name} saved to wishlist`)
      return [...list, {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        image: product.images?.[0] || '',
      }]
    })
  }, [setWishlist, toast])

  const toggleCompare = useCallback((product) => {
    setCompare((list) => {
      const exists = list.some((item) => item.id === product.id)
      if (exists) {
        toast(`${product.name} removed from comparison`, 'neutral')
        return list.filter((item) => item.id !== product.id)
      }
      if (list.length >= 4) {
        toast('You can compare up to 4 products at once', 'error')
        return list
      }
      toast(`${product.name} added to comparison`)
      return [...list, {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        image: product.images?.[0] || '',
        specs: product.specs || {},
      }]
    })
  }, [setCompare, toast])

  const clearCompare = useCallback(() => setCompare([]), [setCompare])

  const changeCurrency = useCallback((code) => {
    persistCurrency(code)
    setCurrencyState(code)
  }, [])

  const inCompare = useCallback((id) => compare.some((item) => item.id === id), [compare])
  const inWishlist = useCallback((id) => wishlist.some((item) => item.id === id), [wishlist])

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = Math.round(cart.reduce((sum, line) => sum + line.price * line.qty, 0) * 100) / 100

  const value = useMemo(() => ({
    cart, cartCount, subtotal,
    wishlist, compare,
    addToCart, removeFromCart, updateQty, clearCart,
    toggleWishlist, toggleCompare, clearCompare, inCompare, inWishlist,
    currency, changeCurrency,
    toasts, toast, dismissToast,
  }), [cart, cartCount, subtotal, wishlist, compare, addToCart, removeFromCart, updateQty, clearCart,
    toggleWishlist, toggleCompare, clearCompare, inCompare, inWishlist, currency, changeCurrency, toasts, toast, dismissToast])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
