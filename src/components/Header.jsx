import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { NAV } from '../lib/site.js'
import { money, currencyOptions } from '../lib/format.js'
import { useStore } from '../context/StoreContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from './Icon.jsx'

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`} aria-label="Nexora home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy-900 text-white shadow-[0_8px_18px_-12px_rgba(16,27,45,0.9)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M5 18V6l14 12V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
      </span>
      <span className="font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-navy-900">
        nexora<span className="text-brand-600">.</span>
      </span>
    </Link>
  )
}

const ANNOUNCEMENTS = [
  { icon: 'truck', label: 'Free shipping on orders over $499' },
  { icon: 'returns', label: '30-day easy returns' },
  { icon: 'shield', label: 'Official warranty on every product' },
]

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cartCount, wishlist, compare, subtotal, currency, changeCurrency } = useStore()
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMega, setOpenMega] = useState(-1)
  const [scrolled, setScrolled] = useState(false)
  const blurTimer = useRef(null)

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions(null)
      return undefined
    }
    setSuggestLoading(true)
    const handle = setTimeout(() => {
      api.products({ q: query.trim(), limit: 5 })
        .then((data) => setSuggestions(data.items))
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestLoading(false))
    }, 220)
    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Any navigation dismisses the mega menu, otherwise it stays painted over the
  // next page because the header is shared across routes.
  useEffect(() => {
    setOpenMega(-1)
    setSuggestions(null)
  }, [pathname])

  const submitSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('category', category)
    setSuggestions(null)
    navigate(`/shop${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const goToProduct = (slug) => {
    setSuggestions(null)
    setQuery('')
    navigate(`/product/${slug}`)
  }

  const iconBadge = (count) => (count > 0 ? (
    <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null)

  return (
    <>
      {/* Announcement bar */}
      <div className="hidden bg-navy-900 text-white lg:block">
        <div className="container-x flex h-9 items-center justify-between text-[11.5px]">
          <div className="flex items-center gap-6">
            {ANNOUNCEMENTS.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5 text-white/70">
                <Icon name={item.icon} className="h-3.5 w-3.5 text-brand-400" />
                {item.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <Link to="/track-order" className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white">
              <Icon name="package" className="h-3.5 w-3.5" />
              Track Order
            </Link>
            <Link to="/contact" className="text-white/80 transition-colors hover:text-white">Support</Link>
            <span className="h-3 w-px bg-white/15" />
            <label className="sr-only" htmlFor="currency">Currency</label>
            <div className="relative">
              <select
                id="currency"
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="cursor-pointer appearance-none rounded bg-transparent py-0.5 pl-1 pr-4 text-[11.5px] font-semibold text-white/90 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
              >
                {currencyOptions().map((c) => <option key={c} value={c} className="text-ink">{c}</option>)}
              </select>
              <Icon name="chevronDown" className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-white/60" />
            </div>
            <span className="text-white/60">EN</span>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_8px_24px_-18px_rgba(16,27,45,0.5)]' : ''}`}>
        {/* Main row */}
        <div className="container-x flex h-16 items-center gap-3 sm:h-[76px] lg:gap-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface lg:hidden"
            aria-label="Open menu"
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          <Logo />

          <form onSubmit={submitSearch} className="relative hidden flex-1 lg:block" role="search">
            <div className="flex h-11 w-full items-center rounded-full border border-line bg-surface/60 pl-1 pr-1 transition-colors focus-within:border-brand-400 focus-within:bg-white">
              <label htmlFor="search-category" className="sr-only">Category</label>
              <select
                id="search-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 max-w-[9.5rem] cursor-pointer appearance-none rounded-full bg-transparent pl-4 pr-7 text-[13px] font-medium text-ink focus:outline-none"
                style={{ backgroundImage: 'none' }}
              >
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              <span className="h-5 w-px bg-line" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && suggestions && setSuggestions(suggestions)}
                onBlur={() => { blurTimer.current = setTimeout(() => setSuggestions(null), 160) }}
                placeholder="Search laptops, desktops, accessories…"
                aria-label="Search products"
                className="h-full flex-1 bg-transparent px-3 text-sm text-ink placeholder:text-muted/80 focus:outline-none"
              />
              <button type="submit" className="btn btn-primary h-9 rounded-full px-4" aria-label="Search">
                <Icon name="search" className="h-4 w-4" />
                <span className="hidden xl:inline">Search</span>
              </button>
            </div>

            {query.trim().length >= 2 && (suggestions !== null || suggestLoading) && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-line bg-white shadow-lift">
                {suggestLoading && !suggestions?.length ? (
                  <p className="px-4 py-4 text-sm text-muted">Searching…</p>
                ) : suggestions.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-muted">No products match “{query}”.</p>
                ) : (
                  <ul className="divide-y divide-line/70">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => goToProduct(p.slug)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-surface"
                        >
                          <img src={p.images[0]} alt="" className="h-10 w-14 rounded object-cover" loading="lazy" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-ink">{p.name}</span>
                            <span className="text-xs text-muted">{p.brand} · {p.category}</span>
                          </span>
                          <span className="text-[13px] font-bold text-ink">{money(p.price)}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={submitSearch}
                        className="flex w-full items-center justify-between bg-surface/60 px-4 py-2.5 text-[13px] font-semibold text-brand-700"
                      >
                        See all results for “{query}”
                        <Icon name="arrowRight" className="h-4 w-4" />
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </form>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <Link
              to={user ? '/account' : '/signin'}
              className="hidden items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-surface sm:flex"
            >
              <Icon name="user" className="h-[18px] w-[18px]" />
              <span className="hidden flex-col leading-tight xl:flex">
                <span className="text-[10px] font-normal uppercase tracking-wide text-muted">
                  {user ? 'Signed in' : 'Account'}
                </span>
                <span className="font-semibold">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
              </span>
            </Link>
            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface"
              aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ''}`}
            >
              <Icon name="heart" className="h-[19px] w-[19px]" />
              {iconBadge(wishlist.length)}
            </Link>
            <Link
              to="/compare"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface"
              aria-label={`Compare${compare.length ? `, ${compare.length} products` : ''}`}
            >
              <Icon name="compare" className="h-[19px] w-[19px]" />
              {iconBadge(compare.length)}
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 items-center gap-2 rounded-lg px-2 text-ink transition-colors hover:bg-surface"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
            >
              <span className="relative">
                <Icon name="bag" className="h-[19px] w-[19px]" />
                {iconBadge(cartCount)}
              </span>
              <span className="hidden flex-col leading-tight lg:flex">
                <span className="text-[10px] font-normal uppercase tracking-wide text-muted">Cart</span>
                <span className="text-[13px] font-semibold">{money(subtotal)}</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="container-x pb-3 lg:hidden">
          <form onSubmit={submitSearch} className="relative flex items-center rounded-full border border-line bg-surface/60 pl-3 focus-within:border-brand-400 focus-within:bg-white">
            <Icon name="search" className="h-4 w-4 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="h-10 flex-1 bg-transparent px-2.5 text-sm focus:outline-none"
            />
            <button type="submit" className="btn btn-primary btn-sm m-1 rounded-full px-3">Go</button>
          </form>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-line/80 lg:block" onMouseLeave={() => setOpenMega(-1)} aria-label="Main">
          <div className="container-x flex items-center gap-1">
            <Link
              to="/shop"
              className="my-1.5 flex items-center gap-2 rounded-lg bg-navy-900 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Icon name="grid" className="h-4 w-4" />
              Shop by Category
            </Link>
            {NAV.map((item, index) => (
              <div key={item.label} className="relative" onMouseEnter={() => setOpenMega(item.mega ? index : -1)}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `flex items-center gap-1 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive ? 'text-brand-700' : 'text-ink/80 hover:bg-surface hover:text-ink'
                  }`}
                >
                  {item.label}
                  {item.mega && <Icon name="chevronDown" className="h-3 w-3 text-muted" />}
                </NavLink>
              </div>
            ))}
            <Link
              to="/shop?sort=price-asc"
              className="ml-auto my-1.5 flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-700"
            >
              <Icon name="sparkles" className="h-4 w-4" />
              Deals
            </Link>
          </div>

          {openMega >= 0 && NAV[openMega]?.mega && (
            <div className="absolute inset-x-0 top-full border-t border-line bg-white shadow-[0_28px_40px_-28px_rgba(16,27,45,0.45)]">
              <div className="container-x grid grid-cols-12 gap-8 py-7">
                {NAV[openMega].mega.columns.map((col) => (
                  <div key={col.title} className="col-span-3">
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{col.title}</p>
                    <ul className="space-y-1.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.to}
                            onClick={() => setOpenMega(-1)}
                            className="text-[13.5px] text-ink/80 transition-colors hover:text-brand-700"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  to={NAV[openMega].mega.promo.to}
                  onClick={() => setOpenMega(-1)}
                  className="group col-span-3 flex items-center gap-3 overflow-hidden rounded-xl2 border border-line bg-surface p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">Featured</p>
                    <p className="mt-1 font-display text-sm font-bold text-ink">{NAV[openMega].mega.promo.title}</p>
                    <p className="mt-1 text-xs leading-snug text-muted">{NAV[openMega].mega.promo.body}</p>
                  </div>
                  <img
                    src={NAV[openMega].mega.promo.image}
                    alt=""
                    className="h-20 w-24 shrink-0 rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface"
                aria-label="Close menu"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
              <ul className="space-y-0.5">
                {NAV.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                    >
                      {item.label}
                      <Icon name="chevronRight" className="h-4 w-4 text-muted" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/shop?sort=price-asc"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700"
                  >
                    Special Deals
                    <Icon name="sparkles" className="h-4 w-4" />
                  </Link>
                </li>
              </ul>

              <p className="mb-1.5 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Categories</p>
              <ul className="space-y-0.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/category/${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-[13.5px] text-ink/80 hover:bg-surface"
                    >
                      {c.name}
                      <span className="text-xs text-muted">{c.productCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mb-1.5 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Account</p>
              <ul className="space-y-0.5">
                <li>
                  <Link to={user ? '/account' : '/signin'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-ink/80 hover:bg-surface">
                    <Icon name="user" className="h-4 w-4" /> {user ? 'My Account' : 'Sign In / Register'}
                  </Link>
                </li>
                <li>
                  <Link to="/account/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-ink/80 hover:bg-surface">
                    <Icon name="package" className="h-4 w-4" /> Order History
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-ink/80 hover:bg-surface">
                    <Icon name="truck" className="h-4 w-4" /> Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-ink/80 hover:bg-surface">
                    <Icon name="support" className="h-4 w-4" /> Contact Support
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex items-center justify-between border-t border-line px-4 py-3">
              <span className="text-xs text-muted">Currency</span>
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                className="rounded-lg border border-line px-2 py-1.5 text-sm font-semibold text-ink"
                aria-label="Currency"
              >
                {currencyOptions().map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
