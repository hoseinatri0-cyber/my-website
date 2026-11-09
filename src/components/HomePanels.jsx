import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import Rating from './Rating.jsx'
import { money } from '../lib/format.js'
import { useStore } from '../context/StoreContext.jsx'

export function BestSellers({ products = [], loading }) {
  const items = products.slice(0, 5)
  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-extrabold tracking-tight text-ink">Best Sellers</h3>
        <Link to="/shop?sort=best" className="link-arrow text-[12px]">
          All <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14" />)}
        </div>
      ) : (
        <ul className="divide-y divide-line/70">
          {items.map((product, index) => (
            <li key={product.id}>
              <Link to={`/product/${product.slug}`} className="group flex items-center gap-3 py-2.5">
                <span className="w-4 shrink-0 font-display text-sm font-extrabold text-line group-hover:text-brand-600">
                  {index + 1}
                </span>
                <img
                  src={product.images[0]}
                  alt=""
                  loading="lazy"
                  className="h-12 w-14 shrink-0 rounded-md bg-surface object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-ink group-hover:text-brand-700">
                    {product.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[12.5px] font-bold text-ink">{money(product.price)}</span>
                    <Rating value={product.rating} showValue={false} count={product.reviewCount} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const COMPARE_ROWS = [
  { key: 'cpu', label: 'Processor' },
  { key: 'ram', label: 'Memory' },
  { key: 'storage', label: 'Storage' },
  { key: 'display', label: 'Display' },
]

export function ComparePanel({ products = [] }) {
  const { compare, toggleCompare } = useStore()
  const chosen = compare.length >= 2 ? compare.slice(0, 2) : products.slice(0, 2)
  const usingSaved = compare.length >= 2

  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-extrabold tracking-tight text-ink">Compare &amp; choose</h3>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
          {usingSaved ? 'Your picks' : 'Popular'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {chosen.map((product) => (
          <div key={product.id} className="flex flex-col">
            <Link to={`/product/${product.slug}`} className="group block overflow-hidden rounded-lg bg-surface">
              <img
                src={product.images?.[0]}
                alt={product.name}
                loading="lazy"
                className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="mt-1.5 line-clamp-1 text-[11.5px] font-semibold text-ink">{product.name}</p>
            <dl className="mt-1 space-y-0.5">
              {COMPARE_ROWS.map((row) => (
                <div key={row.key} className="flex justify-between gap-1 text-[10.5px]">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="max-w-[60%] truncate text-right font-medium text-ink">
                    {product.specs?.[row.key] || '—'}
                  </dd>
                </div>
              ))}
            </dl>
            {!usingSaved && (
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                className="mt-1.5 text-[10.5px] font-semibold text-brand-600 hover:text-brand-700"
              >
                + Add to compare
              </button>
            )}
          </div>
        ))}
        {chosen.length < 2 && (
          <p className="col-span-2 text-xs text-muted">Add two products to compare them side by side.</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-[11px] text-muted">{compare.length ? `${compare.length} selected` : 'Select up to 4'}</span>
        <Link to="/compare" className="btn btn-navy btn-sm">
          Compare now
          <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

const ACCESSORY_ITEMS = [
  { title: 'Wireless Mouse', image: '/images/acc-mouse-02.jpg', to: '/category/keyboards-mice' },
  { title: 'Mechanical Keyboards', image: '/images/acc-keyboard-02.jpg', to: '/category/keyboards-mice' },
  { title: 'Laptop Bags', image: '/images/acc-bag-01.jpg', to: '/category/laptop-accessories' },
  { title: 'Headphones', image: '/images/acc-headphones-02.jpg', to: '/category/laptop-accessories' },
]

export function AccessoriesPanel({ products = [] }) {
  const bySlugPrice = (slug) => {
    const found = products.find((p) => p.slug === slug)
    return found ? found.price : null
  }
  const items = [
    { ...ACCESSORY_ITEMS[0], price: bySlugPrice('logitech-mx-master-3s') ?? 99 },
    { ...ACCESSORY_ITEMS[1], price: bySlugPrice('keychron-q1-pro') ?? 179 },
    { ...ACCESSORY_ITEMS[2], price: bySlugPrice('nexora-tech-backpack-16') ?? 89 },
    { ...ACCESSORY_ITEMS[3], price: bySlugPrice('sony-wh-1000xm5') ?? 349 },
  ]

  return (
    <div className="card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[15px] font-extrabold tracking-tight text-ink">Accessories</h3>
        <Link to="/category/laptop-accessories" className="link-arrow text-[12px]">
          All <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.title} to={item.to} className="group flex flex-col">
            <div className="overflow-hidden rounded-lg bg-surface">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-[62px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-1.5 line-clamp-1 text-[11.5px] font-semibold text-ink group-hover:text-brand-700">{item.title}</p>
            <p className="text-[11px] text-muted">From {money(item.price)}</p>
          </Link>
        ))}
      </div>
      <Link to="/shop" className="btn btn-outline btn-sm mt-4 w-full">
        Shop all accessories
      </Link>
    </div>
  )
}
