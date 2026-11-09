import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStore } from '../context/StoreContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import { EmptyState, Spinner } from '../components/Ui.jsx'

const PAYMENTS = [
  { value: 'Cash on Delivery (demo)', label: 'Cash on delivery', text: 'Pay the courier when your order arrives.' },
  { value: 'Card (demo)', label: 'Card — demo only', text: 'No card is charged. The order is recorded as a demonstration.' },
  { value: 'Bank Transfer (demo)', label: 'Bank transfer', text: 'We email transfer details after the order is placed.' },
]

export default function Checkout() {
  usePageMeta('Checkout', 'Complete your Nexora order — demo checkout, no payment is captured.')
  const { cart, subtotal, clearCart, toast } = useStore()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    customerName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    notes: '',
    paymentMethod: PAYMENTS[0].value,
  })
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.percent / 100) * 100) / 100 : 0
  const shipping = subtotal - discount >= 499 ? 0 : 15
  const total = Math.round((subtotal - discount + shipping) * 100) / 100

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const applyCoupon = async () => {
    setCouponError('')
    if (!coupon.trim()) return
    try {
      const res = await api.validateCoupon(coupon.trim())
      setAppliedCoupon(res)
      toast(`Coupon ${res.code} applied — ${res.percent}% off`)
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err.message)
    }
  }

  const validate = () => {
    const next = {}
    if (form.customerName.trim().length < 2) next.customerName = 'Please enter your full name.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.'
    if (form.address.trim().length < 5) next.address = 'Please enter your shipping address.'
    if (form.city.trim().length < 2) next.city = 'Please enter your city.'
    if (form.phone.trim().length < 6) next.phone = 'Please enter a contact number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setSubmitting(true)
    try {
      const order = await api.createOrder({
        ...form,
        coupon: appliedCoupon?.code,
        items: cart.map((line) => ({ id: line.id, qty: line.qty })),
      })
      try { localStorage.setItem('nexora.lastOrder', JSON.stringify(order)) } catch { /* ignore */ }
      clearCart()
      navigate(`/order/${order.orderNumber}`, { state: { order } })
    } catch (err) {
      setServerError(err.message)
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container-x py-16">
        <EmptyState
          title="Nothing to check out"
          text="Add a product to your cart and come back to complete the order."
          action="/shop"
          actionLabel="Browse products"
        />
      </div>
    )
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Checkout</h1>
        <p className="mt-1 text-[13px] text-muted">
          {user ? `Signed in as ${user.email}.` : 'Checking out as a guest — you can still track this order with your email.'}
        </p>
      </div>

      <form id="checkout-form" onSubmit={placeOrder} noValidate className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <section className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">1</span>
              Contact details
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="customerName">Full name</label>
                <input id="customerName" value={form.customerName} onChange={(e) => setField('customerName', e.target.value)} className="input" autoComplete="name" />
                {errors.customerName && <p className="mt-1 text-[11.5px] font-medium text-discount">{errors.customerName}</p>}
              </div>
              <div>
                <label className="label" htmlFor="email">Email address</label>
                <input id="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="input" autoComplete="email" />
                {errors.email && <p className="mt-1 text-[11.5px] font-medium text-discount">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="phone">Phone number</label>
                <input id="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="input" autoComplete="tel" />
                {errors.phone && <p className="mt-1 text-[11.5px] font-medium text-discount">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">2</span>
              Shipping address
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Street address</label>
                <input id="address" value={form.address} onChange={(e) => setField('address', e.target.value)} className="input" autoComplete="street-address" placeholder="House / flat, street, area" />
                {errors.address && <p className="mt-1 text-[11.5px] font-medium text-discount">{errors.address}</p>}
              </div>
              <div>
                <label className="label" htmlFor="city">City</label>
                <input id="city" value={form.city} onChange={(e) => setField('city', e.target.value)} className="input" autoComplete="address-level2" />
                {errors.city && <p className="mt-1 text-[11.5px] font-medium text-discount">{errors.city}</p>}
              </div>
              <div>
                <label className="label" htmlFor="postalCode">Postal code</label>
                <input id="postalCode" value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} className="input" autoComplete="postal-code" />
              </div>
              <div>
                <label className="label" htmlFor="country">Country</label>
                <select id="country" value={form.country} onChange={(e) => setField('country', e.target.value)} className="input">
                  {['Pakistan', 'United Arab Emirates', 'United Kingdom', 'Germany', 'United States'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">Order notes <span className="font-normal text-muted">(optional)</span></label>
                <textarea id="notes" rows={2} value={form.notes} onChange={(e) => setField('notes', e.target.value)} className="input resize-none" placeholder="Delivery instructions, landmark, etc." />
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">3</span>
              Payment method
            </h2>
            <div className="space-y-2">
              {PAYMENTS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    form.paymentMethod === option.value ? 'border-brand-400 bg-brand-50/50' : 'border-line hover:border-brand-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={form.paymentMethod === option.value}
                    onChange={() => setField('paymentMethod', option.value)}
                    className="mt-0.5 h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  <span>
                    <span className="block text-[13px] font-semibold text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-[11.5px] text-muted">{option.text}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-surface px-3 py-2 text-[11.5px] leading-relaxed text-muted">
              <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
              This is a demonstration checkout. No card details are collected and no money is captured.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="card sticky top-[132px] p-5">
            <h2 className="font-display text-base font-bold text-ink">Your order</h2>
            <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.map((line) => (
                <li key={`${line.id}-${line.color}`} className="flex gap-3">
                  <img src={line.image} alt="" className="h-12 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{line.name}</p>
                    <p className="text-[11px] text-muted">Qty {line.qty}{line.color ? ` · ${line.color}` : ''}</p>
                  </div>
                  <span className="text-[12.5px] font-semibold text-ink">{money(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-line pt-4">
              <label className="label" htmlFor="coupon">Coupon code</label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError('') }}
                  placeholder="SAVE10"
                  className="input h-9 text-[12.5px] uppercase"
                />
                <button type="button" onClick={applyCoupon} className="btn btn-outline btn-sm shrink-0">Apply</button>
              </div>
              {couponError && <p className="mt-1 text-[11.5px] font-medium text-discount">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-success">
                  <Icon name="check" className="h-3.5 w-3.5" /> {appliedCoupon.code} applied ({appliedCoupon.percent}% off)
                  <button type="button" onClick={() => { setAppliedCoupon(null); setCoupon('') }} className="ml-auto text-muted underline">Remove</button>
                </p>
              )}
            </div>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium text-ink">{money(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="font-medium text-success">−{money(discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="font-medium text-ink">{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display text-lg font-extrabold text-ink">{money(total)}</dd>
              </div>
            </dl>

            {serverError && <p className="mt-3 rounded-lg bg-discount/10 px-3 py-2 text-[12px] font-medium text-discount">{serverError}</p>}

            <button type="submit" disabled={submitting} className="btn btn-primary mt-4 w-full">
              {submitting ? <Spinner className="h-4 w-4" /> : <Icon name="lock" className="h-4 w-4" />}
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
            <Link to="/cart" className="btn btn-ghost btn-sm mt-1 w-full">Back to cart</Link>
          </div>
        </aside>
      </form>
    </div>
  )
}
