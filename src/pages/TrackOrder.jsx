import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { PageHeader, Spinner } from '../components/Ui.jsx'
import { OrderTimeline } from './OrderConfirmation.jsx'
import { StatusBadge } from './Account.jsx'

export default function TrackOrder() {
  usePageMeta('Track order', 'Track your Nexora order status with your order number and email address.')
  const [form, setForm] = useState({ number: '', email: '' })
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const res = await api.trackOrder(form.number.trim(), form.email.trim())
      setOrder(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Order support"
        title="Track your order"
        text="Enter the order number from your confirmation email together with the email address used at checkout."
        crumbs={[{ label: 'Track order' }]}
      />

      <div className="container-x py-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={submit} className="card p-5 sm:p-6" noValidate>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <label className="label" htmlFor="order-number">Order number</label>
                <input
                  id="order-number"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                  className="input font-mono"
                  placeholder="NX-AB12CD34"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="track-email">Email address</label>
                <input
                  id="track-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary h-[42px] w-full sm:w-auto">
                {loading ? <Spinner className="h-4 w-4" /> : <Icon name="search" className="h-4 w-4" />}
                Track
              </button>
            </div>
            {error && <p role="alert" className="mt-3 rounded-lg bg-discount/10 px-3 py-2 text-[12px] font-medium text-discount">{error}</p>}
            <p className="mt-3 text-[11.5px] text-muted">
              Tip: signed-in customers can see every order in <Link to="/account/orders" className="font-medium text-brand-600 hover:text-brand-700">order history</Link>.
            </p>
          </form>

          {order && (
            <div className="mt-5 space-y-4">
              <div className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-bold text-ink">{order.orderNumber}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">Placed {dateLabel(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Delivery progress</p>
                    <OrderTimeline status={order.status} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Ship to</p>
                    <address className="mt-2 text-[12.5px] not-italic leading-relaxed text-ink/75">
                      {order.customerName}<br />{order.address}<br />{order.city} {order.postalCode}<br />{order.country}
                    </address>
                    <p className="mt-2 text-[11.5px] text-muted">Payment: {order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="card overflow-hidden">
                <ul className="divide-y divide-line">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 px-5 py-3">
                      <img src={item.image} alt="" className="h-12 w-14 rounded-md object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{item.name}</p>
                        <p className="text-[11px] text-muted">Qty {item.qty}</p>
                      </div>
                      <span className="text-[12.5px] font-semibold text-ink">{money(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-line px-5 py-3">
                  <span className="text-[12px] text-muted">Order total</span>
                  <span className="font-display text-base font-extrabold text-ink">{money(order.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
