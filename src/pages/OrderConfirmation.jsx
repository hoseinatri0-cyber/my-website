import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money, ORDER_STAGES } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { EmptyState } from '../components/Ui.jsx'

export function OrderTimeline({ status }) {
  const cancelled = status === 'Cancelled'
  const index = ORDER_STAGES.indexOf(status)
  return (
    <ol className="mt-4 space-y-0">
      {ORDER_STAGES.map((stage, i) => {
        const done = !cancelled && i <= index
        return (
          <li key={stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                done ? 'bg-success text-white' : 'border border-line bg-white text-muted'
              }`}>
                {done ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              {i < ORDER_STAGES.length - 1 && <span className={`h-6 w-px ${done ? 'bg-success' : 'bg-line'}`} />}
            </div>
            <span className={`pb-1 text-[12.5px] leading-6 ${done ? 'font-semibold text-ink' : 'text-muted'}`}>{stage}</span>
          </li>
        )
      })}
      {cancelled && <li className="ml-9 mt-1 text-[12px] font-semibold text-discount">This order was cancelled.</li>}
    </ol>
  )
}

export default function OrderConfirmation() {
  const { number } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [error, setError] = useState('')

  usePageMeta(`Order ${number}`, 'Your Nexora order confirmation and tracking status.')

  useEffect(() => {
    if (order) return
    try {
      const cached = JSON.parse(localStorage.getItem('nexora.lastOrder') || 'null')
      if (cached?.orderNumber === number) {
        setOrder(cached)
        return
      }
    } catch { /* ignore */ }
    api.order(number)
      .then(setOrder)
      .catch((err) => setError(err.message))
  }, [number, order])

  if (error) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon="package"
          title="We couldn't open that order"
          text="For privacy, guest orders can be opened with the order number and email used at checkout."
          action="/track-order"
          actionLabel="Track your order"
        />
      </div>
    )
  }

  if (!order) {
    return <div className="container-x py-16"><div className="skeleton h-64 w-full" /></div>
  }

  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-3xl">
        <div className="card p-6 text-center sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Thank you — your order is confirmed</h1>
          <p className="mt-2 text-[13.5px] text-muted">
            We emailed a confirmation to <span className="font-medium text-ink">{order.email}</span>. Keep your order number handy.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 font-mono text-sm font-bold tracking-wide text-ink">
            {order.orderNumber}
          </p>
          <p className="mt-3 text-[11.5px] text-muted">
            Demonstration order — no payment has been captured.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="card p-5">
            <h2 className="font-display text-sm font-bold text-ink">Order status</h2>
            <OrderTimeline status={order.status} />
          </div>
          <div className="card p-5">
            <h2 className="font-display text-sm font-bold text-ink">Shipping to</h2>
            <address className="mt-2.5 not-italic text-[13px] leading-relaxed text-ink/75">
              {order.customerName}<br />
              {order.address}<br />
              {order.city}{order.postalCode ? `, ${order.postalCode}` : ''}<br />
              {order.country}<br />
              {order.phone && <span className="text-muted">{order.phone}</span>}
            </address>
            <p className="mt-3 text-[11.5px] text-muted">Placed {dateLabel(order.createdAt)}</p>
            <p className="mt-1 text-[11.5px] text-muted">Payment: {order.paymentMethod}</p>
          </div>
        </div>

        <div className="card mt-5 overflow-hidden">
          <div className="border-b border-line px-5 py-3">
            <h2 className="font-display text-sm font-bold text-ink">Items ({order.items.length})</h2>
          </div>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.name} className="flex items-center gap-3 px-5 py-3">
                <img src={item.image} alt="" className="h-12 w-14 rounded-md object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{item.name}</p>
                  <p className="text-[11px] text-muted">Qty {item.qty}</p>
                </div>
                <span className="text-[12.5px] font-semibold text-ink">{money(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-line px-5 py-4 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="text-ink">{money(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount {order.coupon ? `(${order.coupon})` : ''}</dt><dd className="text-success">−{money(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="text-ink">{order.shipping === 0 ? 'Free' : money(order.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2"><dt className="font-semibold text-ink">Total</dt><dd className="font-display text-base font-extrabold text-ink">{money(order.total)}</dd></div>
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn btn-primary">Continue shopping</Link>
          <Link to="/track-order" className="btn btn-outline">Track this order</Link>
        </div>
      </div>
    </div>
  )
}
