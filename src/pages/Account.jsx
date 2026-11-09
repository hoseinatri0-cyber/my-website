import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icon.jsx'
import { Spinner } from '../components/Ui.jsx'
import { OrderTimeline } from './OrderConfirmation.jsx'

const STATUS_STYLES = {
  Processing: 'bg-brand-50 text-brand-700',
  Packed: 'bg-amber-50 text-amber-700',
  Shipped: 'bg-indigo-50 text-indigo-700',
  Delivered: 'bg-success/10 text-success',
  Cancelled: 'bg-discount/10 text-discount',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${STATUS_STYLES[status] || 'bg-surface text-muted'}`}>
      {status}
    </span>
  )
}

export default function Account() {
  usePageMeta('My account', 'Manage your Nexora profile, orders and saved products.')
  const { user, loading, logout, setUser } = useAuth()
  const { wishlist, compare, toast } = useStore()
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone || '' })
  }, [user])

  useEffect(() => {
    if (!user) return
    api.myOrders().then(setOrders).catch(() => setOrders([]))
  }, [user])

  if (loading) return <div className="container-x py-16"><div className="skeleton h-48 w-full" /></div>
  if (!user) return <Navigate to="/signin" replace state={{ from: '/account' }} />

  const spend = orders.reduce((sum, o) => sum + o.total, 0)

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const res = await api.updateProfile(form)
      setUser(res.user)
      toast('Profile updated')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1.5">My account</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Hello, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-[13px] text-muted">Member since {dateLabel(user.created_at)} · {user.email}</p>
        </div>
        <div className="flex gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className="btn btn-navy btn-sm">
              <Icon name="sliders" className="h-3.5 w-3.5" /> Admin dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={async () => { await logout(); toast('Signed out', 'neutral') }}
            className="btn btn-outline btn-sm"
          >
            <Icon name="logout" className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Orders placed', value: orders.length, icon: 'package' },
          { label: 'Lifetime spend', value: money(spend), icon: 'card' },
          { label: 'Wishlist items', value: wishlist.length, icon: 'heart' },
          { label: 'In comparison', value: compare.length, icon: 'compare' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <Icon name={stat.icon} className="h-4.5 w-4.5 text-brand-600" />
            <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-ink">{stat.value}</p>
            <p className="text-[11.5px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-ink">Recent orders</h2>
              <Link to="/account/orders" className="link-arrow text-[12px]">
                Order history <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center">
                <p className="text-[13px] text-muted">You haven't placed an order yet.</p>
                <Link to="/shop" className="btn btn-primary btn-sm mt-3">Start shopping</Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {orders.slice(0, 3).map((order) => (
                  <li key={order.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-[12.5px] font-bold text-ink">{order.orderNumber}</p>
                        <p className="text-[11px] text-muted">{dateLabel(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <span className="text-[13px] font-bold text-ink">{money(order.total)}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      {order.items.slice(0, 4).map((item, i) => (
                        <img key={i} src={item.image} alt="" className="h-9 w-11 rounded object-cover" loading="lazy" />
                      ))}
                      <Link to={`/order/${order.orderNumber}`} className="ml-auto text-[11.5px] font-semibold text-brand-600 hover:text-brand-700">
                        View order
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-display text-sm font-bold text-ink">Track an order</h2>
            <div className="flex items-center gap-3 rounded-lg bg-surface px-3 py-3">
              <Icon name="truck" className="h-5 w-5 shrink-0 text-brand-600" />
              <p className="flex-1 text-[12.5px] text-ink/75">Enter your order number and email to see live delivery status.</p>
              <Link to="/track-order" className="btn btn-outline btn-sm shrink-0">Track</Link>
            </div>
          </section>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <section className="card p-5">
            <h2 className="mb-4 font-display text-sm font-bold text-ink">Profile details</h2>
            <form onSubmit={saveProfile} className="space-y-3">
              <div>
                <label className="label" htmlFor="account-name">Full name</label>
                <input id="account-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="account-email">Email</label>
                <input id="account-email" value={user.email} disabled className="input bg-surface text-muted" />
              </div>
              <div>
                <label className="label" htmlFor="account-phone">Phone</label>
                <input id="account-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" placeholder="+92 300 0000000" />
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm w-full">
                {saving && <Spinner className="h-3.5 w-3.5" />} Save changes
              </button>
            </form>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-display text-sm font-bold text-ink">Order status guide</h2>
            <OrderTimeline status={orders[0]?.status || 'Processing'} />
          </section>
        </div>
      </div>
    </div>
  )
}
