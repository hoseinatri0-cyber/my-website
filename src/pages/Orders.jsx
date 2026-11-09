import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import { EmptyState } from '../components/Ui.jsx'
import { OrderTimeline } from './OrderConfirmation.jsx'
import { StatusBadge } from './Account.jsx'

export default function Orders() {
  usePageMeta('Order history', 'Every order you have placed with Nexora, with live status.')
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    api.myOrders()
      .then((list) => { setOrders(list); setExpanded(list[0]?.id ?? null) })
      .catch(() => setOrders([]))
      .finally(() => setFetching(false))
  }, [user])

  if (loading) return <div className="container-x py-16"><div className="skeleton h-48 w-full" /></div>
  if (!user) return <Navigate to="/signin" replace state={{ from: '/account/orders' }} />

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1.5 text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link to="/account" className="hover:text-brand-700">My account</Link></li>
              <li><Icon name="chevronRight" className="h-3 w-3" /></li>
              <li className="text-ink">Order history</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Order history</h1>
        </div>
        <Link to="/shop" className="btn btn-outline btn-sm">Continue shopping</Link>
      </div>

      {fetching ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="No orders yet"
          text="Once you place an order it will appear here with its delivery status."
          action="/shop"
          actionLabel="Browse products"
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                aria-expanded={expanded === order.id}
                className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface/60"
              >
                <div>
                  <p className="font-mono text-[13px] font-bold text-ink">{order.orderNumber}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    Placed {dateLabel(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-[13.5px] font-bold text-ink">{money(order.total)}</span>
                  <Icon name="chevronDown" className={`h-4 w-4 text-muted transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expanded === order.id && (
                <div className="grid gap-5 border-t border-line px-4 py-4 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <ul className="divide-y divide-line">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 py-2.5">
                          <img src={item.image} alt="" className="h-12 w-14 rounded-md object-cover" loading="lazy" />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{item.name}</p>
                            <p className="text-[11px] text-muted">Qty {item.qty} · {money(item.price)}</p>
                          </div>
                          <span className="text-[12.5px] font-semibold text-ink">{money(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[12.5px]">
                      <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="text-ink">{money(order.subtotal)}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="text-ink">{order.shipping === 0 ? 'Free' : money(order.shipping)}</dd></div>
                      {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="text-success">−{money(order.discount)}</dd></div>}
                      <div className="flex justify-between font-semibold"><dt>Total</dt><dd className="text-ink">{money(order.total)}</dd></div>
                    </dl>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Delivery status</p>
                    <OrderTimeline status={order.status} />
                    <address className="mt-3 border-t border-line pt-3 text-[11.5px] not-italic leading-relaxed text-muted">
                      {order.customerName}<br />{order.address}<br />{order.city} {order.postalCode}<br />{order.country}
                    </address>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
