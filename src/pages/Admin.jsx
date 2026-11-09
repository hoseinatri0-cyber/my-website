import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icon.jsx'
import { StatusBadge } from './Account.jsx'
import { Spinner } from '../components/Ui.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'trending' },
  { id: 'products', label: 'Products', icon: 'grid' },
  { id: 'orders', label: 'Orders', icon: 'package' },
  { id: 'customers', label: 'Customers', icon: 'user' },
  { id: 'subscribers', label: 'Subscribers', icon: 'mail' },
  { id: 'messages', label: 'Messages', icon: 'support' },
]

const STATUSES = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

const IMAGE_OPTIONS = [
  '/images/laptop-01.jpg', '/images/laptop-02.jpg', '/images/laptop-04.jpg', '/images/laptop-05.jpg',
  '/images/laptop-06.jpg', '/images/laptop-08.jpg', '/images/laptop-09.jpg', '/images/laptop-12.jpg',
  '/images/gaming-01.jpg', '/images/gaming-02.jpg', '/images/desktop-02.jpg', '/images/monitor-01.jpg',
  '/images/acc-mouse-02.jpg', '/images/acc-keyboard-02.jpg', '/images/acc-headphones-02.jpg', '/images/acc-bag-01.jpg',
]

const emptyProduct = {
  name: '', brand: '', categorySlug: '', price: '', originalPrice: '', stock: 20,
  badge: '', description: '', image: IMAGE_OPTIONS[0], featured: false, bestSeller: false,
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/50 p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-xl2 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="font-display text-sm font-bold text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

export default function Admin() {
  usePageMeta('Admin dashboard', 'Manage products, orders, customers and marketing for Nexora.')
  const { user, loading } = useAuth()
  const { toast } = useStore()

  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [messages, setMessages] = useState([])
  const [categories, setCategories] = useState([])
  const [brandNames, setBrandNames] = useState([])
  const [busy, setBusy] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)

  const loadAll = useCallback(async () => {
    setBusy(true)
    try {
      const [s, p, o, c, n, m, cats, brandList] = await Promise.all([
        api.adminStats(),
        api.products({ limit: 100 }),
        api.adminOrders(),
        api.adminCustomers(),
        api.adminNewsletter(),
        api.adminMessages(),
        api.categories(),
        api.brands(),
      ])
      setStats(s)
      setProducts(p.items)
      setOrders(o)
      setCustomers(c)
      setSubscribers(n)
      setMessages(m)
      setCategories(cats)
      setBrandNames(brandList.map((b) => b.name))
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }, [toast])

  useEffect(() => { if (user?.role === 'admin') loadAll() }, [user, loadAll])

  if (loading) return <div className="container-x py-16"><div className="skeleton h-48 w-full" /></div>
  if (!user) return <Navigate to="/signin" replace state={{ from: '/admin' }} />

  if (user.role !== 'admin') {
    return (
      <div className="container-x py-20 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-discount/10 text-discount">
          <Icon name="lock" className="h-5 w-5" />
        </span>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">Administrator access required</h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-muted">
          This dashboard manages the catalogue and customer orders. Your account does not have permission to view it.
        </p>
        <Link to="/account" className="btn btn-primary mt-5">Back to my account</Link>
      </div>
    )
  }

  const openCreate = () => {
    setForm({ ...emptyProduct, brand: brandNames[0] || '', categorySlug: categories[0]?.slug || '' })
    setModal({ mode: 'create' })
  }

  const openEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand,
      categorySlug: product.categorySlug,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      badge: product.badge || '',
      description: product.description || '',
      image: product.images?.[0] || IMAGE_OPTIONS[0],
      featured: product.featured,
      bestSeller: product.bestSeller,
    })
    setModal({ mode: 'edit' })
  }

  const saveProduct = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        await api.adminCreateProduct({
          name: form.name,
          brand: form.brand,
          categorySlug: form.categorySlug,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice) || Number(form.price),
          stock: Number(form.stock),
          badge: form.badge || null,
          description: form.description,
          images: [form.image],
          featured: form.featured,
          bestSeller: form.bestSeller,
        })
        toast('Product created')
      } else {
        await api.adminUpdateProduct(form.id, {
          name: form.name,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice),
          stock: Number(form.stock),
          badge: form.badge || null,
          description: form.description,
          categorySlug: form.categorySlug,
          featured: form.featured,
          bestSeller: form.bestSeller,
        })
        toast('Product updated')
      }
      setModal(null)
      await loadAll()
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return
    try {
      await api.adminDeleteProduct(product.id)
      toast('Product deleted', 'neutral')
      await loadAll()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const changeStatus = async (order, status) => {
    try {
      await api.adminUpdateOrder(order.id, status)
      setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status } : o)))
      toast(`Order ${order.orderNumber} marked ${status}`)
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  const filteredOrders = orders.filter((o) => statusFilter === 'all' || o.status === statusFilter)

  return (
    <div className="bg-surface/40">
      <div className="border-b border-line bg-white">
        <div className="container-x flex flex-wrap items-end justify-between gap-3 py-6">
          <div>
            <p className="eyebrow mb-1">Administration</p>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">Store dashboard</h1>
            <p className="mt-1 text-[12.5px] text-muted">Signed in as {user.email} · administrator</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={loadAll} className="btn btn-outline btn-sm">
              <Icon name="returns" className="h-3.5 w-3.5" /> Refresh
            </button>
            <Link to="/" className="btn btn-outline btn-sm">View storefront</Link>
          </div>
        </div>
      </div>

      <div className="container-x py-6">
        <div className="no-scrollbar mb-5 flex gap-1.5 overflow-x-auto rounded-xl2 border border-line bg-white p-1.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={tab === item.id}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                tab === item.id ? 'bg-navy-900 text-white' : 'text-muted hover:bg-surface hover:text-ink'
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {busy && !stats ? (
          <div className="grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24" />)}
          </div>
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[
                    { label: 'Revenue', value: money(stats.revenue), icon: 'trending', sub: `${stats.orders} orders` },
                    { label: 'Products', value: stats.products, icon: 'grid', sub: `${stats.lowStock.length} low stock` },
                    { label: 'Customers', value: stats.customers, icon: 'user', sub: `Avg order ${money(stats.averageOrder)}` },
                    { label: 'Subscribers', value: stats.subscribers, icon: 'mail', sub: 'Newsletter list' },
                  ].map((card) => (
                    <div key={card.label} className="card p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{card.label}</p>
                        <Icon name={card.icon} className="h-4 w-4 text-brand-600" />
                      </div>
                      <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">{card.value}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{card.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                  <div className="card overflow-hidden lg:col-span-7">
                    <div className="flex items-center justify-between border-b border-line px-4 py-3">
                      <h2 className="font-display text-sm font-bold text-ink">Recent orders</h2>
                      <button type="button" onClick={() => setTab('orders')} className="link-arrow text-[12px]">All orders</button>
                    </div>
                    <ul className="divide-y divide-line">
                      {stats.recentOrders.map((order) => (
                        <li key={order.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                          <div className="min-w-0">
                            <p className="font-mono text-[12px] font-bold text-ink">{order.orderNumber}</p>
                            <p className="truncate text-[11px] text-muted">{order.customerName} · {dateLabel(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} />
                            <span className="text-[12.5px] font-bold text-ink">{money(order.total)}</span>
                          </div>
                        </li>
                      ))}
                      {stats.recentOrders.length === 0 && <li className="px-4 py-6 text-center text-[12px] text-muted">No orders yet.</li>}
                    </ul>
                  </div>

                  <div className="card p-4 lg:col-span-5">
                    <h2 className="font-display text-sm font-bold text-ink">Low stock</h2>
                    <ul className="mt-2 space-y-1.5">
                      {stats.lowStock.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2 text-[12px]">
                          <span className="truncate text-ink/75">{item.name}</span>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-bold ${item.stock <= 5 ? 'bg-discount/10 text-discount' : 'bg-amber-50 text-amber-700'}`}>
                            {item.stock} left
                          </span>
                        </li>
                      ))}
                      {stats.lowStock.length === 0 && <li className="text-[12px] text-muted">All products well stocked.</li>}
                    </ul>
                    <h2 className="mt-4 border-t border-line pt-3 font-display text-sm font-bold text-ink">Top sellers</h2>
                    <ul className="mt-2 space-y-1.5">
                      {stats.topProducts.map((item) => (
                        <li key={item.name} className="flex items-center justify-between gap-2 text-[12px]">
                          <span className="truncate text-ink/75">{item.name}</span>
                          <span className="shrink-0 text-muted">{item.units} sold</span>
                        </li>
                      ))}
                      {stats.topProducts.length === 0 && <li className="text-[12px] text-muted">No sales recorded yet.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {tab === 'products' && (
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-sm font-bold text-ink">Catalogue</h2>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">{products.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products…"
                      aria-label="Search products"
                      className="input h-9 w-44 text-[12.5px]"
                    />
                    <button type="button" onClick={openCreate} className="btn btn-primary btn-sm">
                      <Icon name="plus" className="h-3.5 w-3.5" /> Add product
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line bg-surface/60 text-[10.5px] uppercase tracking-[0.1em] text-muted">
                        <th className="px-4 py-2.5 font-bold">Product</th>
                        <th className="px-4 py-2.5 font-bold">Category</th>
                        <th className="px-4 py-2.5 font-bold">Price</th>
                        <th className="px-4 py-2.5 font-bold">Stock</th>
                        <th className="px-4 py-2.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-surface/40">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <img src={product.images[0]} alt="" className="h-9 w-12 rounded object-cover" loading="lazy" />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-ink">{product.name}</p>
                                <p className="text-[10.5px] text-muted">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-muted">{product.category}</td>
                          <td className="px-4 py-2.5 font-semibold text-ink">{money(product.price)}</td>
                          <td className="px-4 py-2.5">
                            <span className={product.stock <= 10 ? 'font-semibold text-amber-700' : 'text-ink/70'}>{product.stock}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex justify-end gap-1">
                              <button type="button" onClick={() => openEdit(product)} className="flex h-7 w-7 items-center justify-center rounded border border-line text-muted hover:text-brand-700" aria-label={`Edit ${product.name}`}>
                                <Icon name="edit" className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" onClick={() => deleteProduct(product)} className="flex h-7 w-7 items-center justify-center rounded border border-line text-muted hover:text-discount" aria-label={`Delete ${product.name}`}>
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                  <h2 className="font-display text-sm font-bold text-ink">Orders ({filteredOrders.length})</h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                    className="h-9 rounded-lg border border-line bg-white px-2.5 text-[12.5px]"
                  >
                    <option value="all">All statuses</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line bg-surface/60 text-[10.5px] uppercase tracking-[0.1em] text-muted">
                        <th className="px-4 py-2.5 font-bold">Order</th>
                        <th className="px-4 py-2.5 font-bold">Customer</th>
                        <th className="px-4 py-2.5 font-bold">Date</th>
                        <th className="px-4 py-2.5 font-bold">Total</th>
                        <th className="px-4 py-2.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface/40">
                          <td className="px-4 py-2.5">
                            <p className="font-mono font-bold text-ink">{order.orderNumber}</p>
                            <p className="text-[10.5px] text-muted">{order.items.length} items</p>
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="text-ink">{order.customerName}</p>
                            <p className="text-[10.5px] text-muted">{order.email}</p>
                          </td>
                          <td className="px-4 py-2.5 text-muted">{dateLabel(order.createdAt)}</td>
                          <td className="px-4 py-2.5 font-semibold text-ink">{money(order.total)}</td>
                          <td className="px-4 py-2.5">
                            <select
                              value={order.status}
                              onChange={(e) => changeStatus(order, e.target.value)}
                              aria-label={`Status for ${order.orderNumber}`}
                              className="rounded-lg border border-line bg-white px-2 py-1 text-[11.5px]"
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">No orders match this filter.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'customers' && (
              <div className="card overflow-hidden">
                <div className="border-b border-line px-4 py-3">
                  <h2 className="font-display text-sm font-bold text-ink">Customers ({customers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-line bg-surface/60 text-[10.5px] uppercase tracking-[0.1em] text-muted">
                        <th className="px-4 py-2.5 font-bold">Name</th>
                        <th className="px-4 py-2.5 font-bold">Email</th>
                        <th className="px-4 py-2.5 font-bold">Role</th>
                        <th className="px-4 py-2.5 font-bold">Orders</th>
                        <th className="px-4 py-2.5 font-bold">Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-surface/40">
                          <td className="px-4 py-2.5 font-medium text-ink">{c.name}</td>
                          <td className="px-4 py-2.5 text-muted">{c.email}</td>
                          <td className="px-4 py-2.5">
                            <span className={`rounded px-1.5 py-0.5 text-[10.5px] font-bold uppercase ${c.role === 'admin' ? 'bg-navy-900 text-white' : 'bg-surface text-muted'}`}>
                              {c.role}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-ink/75">{c.order_count}</td>
                          <td className="px-4 py-2.5 font-semibold text-ink">{money(c.spend)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'subscribers' && (
              <div className="card overflow-hidden">
                <div className="border-b border-line px-4 py-3">
                  <h2 className="font-display text-sm font-bold text-ink">Newsletter subscribers ({subscribers.length})</h2>
                </div>
                <ul className="divide-y divide-line">
                  {subscribers.map((s) => (
                    <li key={s.id} className="flex items-center justify-between px-4 py-2.5 text-[12.5px]">
                      <span className="text-ink">{s.email}</span>
                      <span className="text-[11px] text-muted">{dateLabel(s.created_at)}</span>
                    </li>
                  ))}
                  {subscribers.length === 0 && <li className="px-4 py-8 text-center text-[12px] text-muted">No subscribers yet.</li>}
                </ul>
              </div>
            )}

            {tab === 'messages' && (
              <div className="space-y-3">
                {messages.map((m) => (
                  <article key={m.id} className="card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-ink">{m.subject}</p>
                        <p className="text-[11.5px] text-muted">{m.name} · {m.email}</p>
                      </div>
                      <span className="text-[11px] text-muted">{dateLabel(m.created_at)}</span>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-ink/75">{m.message}</p>
                  </article>
                ))}
                {messages.length === 0 && (
                  <div className="card px-4 py-10 text-center text-[12.5px] text-muted">No contact messages yet.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Add product' : 'Edit product'} onClose={() => setModal(null)}>
          <form onSubmit={saveProduct} className="space-y-3">
            <div>
              <label className="label" htmlFor="p-name">Product name</label>
              <input id="p-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" required />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="p-brand">Brand</label>
                <select id="p-brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input">
                  {brandNames.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-category">Category</label>
                <select id="p-category" value={form.categorySlug} onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))} className="input">
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="p-price">Price (USD)</label>
                <input id="p-price" type="number" min="1" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="label" htmlFor="p-original">Original price</label>
                <input id="p-original" type="number" min="1" step="1" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="p-stock">Stock</label>
                <input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="p-badge">Badge</label>
                <input id="p-badge" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="input" placeholder="e.g. Best Seller" />
              </div>
            </div>
            {modal.mode === 'create' && (
              <div>
                <label className="label" htmlFor="p-image">Primary image</label>
                <select id="p-image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="input">
                  {IMAGE_OPTIONS.map((img) => <option key={img} value={img}>{img.replace('/images/', '')}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label" htmlFor="p-desc">Description</label>
              <textarea id="p-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[12.5px] text-ink/80">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-3.5 w-3.5 rounded border-line text-brand-600" />
                Featured on home
              </label>
              <label className="flex items-center gap-2 text-[12.5px] text-ink/80">
                <input type="checkbox" checked={form.bestSeller} onChange={(e) => setForm((f) => ({ ...f, bestSeller: e.target.checked }))} className="h-3.5 w-3.5 rounded border-line text-brand-600" />
                Best seller
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-line pt-3">
              <button type="button" onClick={() => setModal(null)} className="btn btn-outline btn-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                {saving && <Spinner className="h-3.5 w-3.5" />}
                {modal.mode === 'create' ? 'Create product' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
