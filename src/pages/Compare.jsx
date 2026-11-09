import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icon.jsx'
import Rating from '../components/Rating.jsx'
import { EmptyState } from '../components/Ui.jsx'

const ROWS = [
  { key: 'brand', label: 'Brand', get: (p) => p.brand },
  { key: 'cpu', label: 'Processor', get: (p) => p.specs?.cpu },
  { key: 'ram', label: 'Memory', get: (p) => p.specs?.ram },
  { key: 'storage', label: 'Storage', get: (p) => p.specs?.storage },
  { key: 'gpu', label: 'Graphics', get: (p) => p.specs?.gpu },
  { key: 'display', label: 'Display size', get: (p) => p.specs?.display },
  { key: 'resolution', label: 'Resolution', get: (p) => p.specs?.resolution },
  { key: 'refresh', label: 'Refresh rate', get: (p) => p.specs?.refresh },
  { key: 'battery', label: 'Battery life', get: (p) => p.specs?.battery },
  { key: 'weight', label: 'Weight', get: (p) => p.specs?.weight },
  { key: 'os', label: 'Operating system', get: (p) => p.specs?.os },
  { key: 'warranty', label: 'Warranty', get: (p) => p.specs?.warranty },
  { key: 'price', label: 'Price', get: (p) => money(p.price) },
  { key: 'rating', label: 'Rating', get: (p) => `${p.rating?.toFixed?.(1) ?? p.rating} / 5` },
]

export default function Compare() {
  usePageMeta('Compare products', 'Compare laptops and hardware side by side — specifications, price and warranty.')
  const { compare, toggleCompare, clearCompare, addToCart } = useStore()
  const [allProducts, setAllProducts] = useState([])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    api.products({ limit: 100 }).then((data) => setAllProducts(data.items)).catch(() => {})
  }, [])

  const addProduct = async (slug) => {
    if (!slug) return
    const product = allProducts.find((p) => p.slug === slug)
    if (product) toggleCompare(product)
    setSelected('')
  }

  const suggestions = allProducts
    .filter((p) => !compare.some((c) => c.id === p.id))
    .slice(0, 4)

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Compare products</h1>
          <p className="mt-1 text-[13px] text-muted">
            Side-by-side specifications for up to 4 products. Differences are highlighted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {compare.length > 0 && (
            <button type="button" onClick={clearCompare} className="btn btn-outline btn-sm">
              <Icon name="trash" className="h-3.5 w-3.5" /> Clear comparison
            </button>
          )}
          <Link to="/shop" className="btn btn-primary btn-sm">Browse products</Link>
        </div>
      </div>

      {compare.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon="compare"
            title="Nothing to compare yet"
            text="Add two or more products to see specifications side by side. Use the compare icon on any product card."
            action="/shop"
            actionLabel="Choose products"
          />
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Popular comparisons</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((p) => (
                <button key={p.id} type="button" onClick={() => toggleCompare(p)} className="chip">
                  <Icon name="plus" className="h-3.5 w-3.5" /> {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="compare-add" className="text-[12px] font-medium text-muted">Add product</label>
            <select
              id="compare-add"
              value={selected}
              onChange={(e) => addProduct(e.target.value)}
              disabled={compare.length >= 4}
              className="h-9 max-w-xs rounded-lg border border-line bg-white px-3 text-[12.5px] text-ink disabled:opacity-50"
            >
              <option value="">{compare.length >= 4 ? 'Maximum of 4 reached' : 'Select a product…'}</option>
              {allProducts.filter((p) => !compare.some((c) => c.id === p.id)).map((p) => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
            <span className="text-[11.5px] text-muted">{compare.length} of 4 selected</span>
          </div>

          <div className="overflow-x-auto rounded-xl2 border border-line">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className="w-40 border-b border-line bg-surface/70 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    Product
                  </th>
                  {compare.map((product) => (
                    <th key={product.id} scope="col" className="min-w-[190px] border-b border-l border-line bg-white px-4 py-3 align-top">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleCompare(product)}
                          aria-label={`Remove ${product.name} from comparison`}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-muted hover:text-discount"
                        >
                          <Icon name="close" className="h-3 w-3" />
                        </button>
                        <Link to={`/product/${product.slug}`} className="block">
                          <img src={product.image} alt="" className="h-24 w-full rounded-lg object-cover" loading="lazy" />
                        </Link>
                        <Link to={`/product/${product.slug}`} className="mt-2 block text-[12.5px] font-semibold leading-snug text-ink hover:text-brand-700">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-[13px] font-extrabold text-ink">{money(product.price)}</p>
                        {product.rating !== undefined && (
                          <div className="mt-1"><Rating value={product.rating} count={product.reviewCount} /></div>
                        )}
                        <button
                          type="button"
                          onClick={() => addToCart({ ...product, images: [product.image] }, 1)}
                          className="btn btn-primary btn-sm mt-2 w-full"
                        >
                          Add to cart
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, rowIndex) => {
                  const values = compare.map((p) => row.get(p) || '—')
                  const differs = new Set(values).size > 1
                  return (
                    <tr key={row.key} className={rowIndex % 2 ? 'bg-surface/40' : 'bg-white'}>
                      <th scope="row" className="border-t border-line px-4 py-2.5 text-[12px] font-medium text-muted">
                        {row.label}
                      </th>
                      {values.map((value, i) => (
                        <td
                          key={`${row.key}-${compare[i].id}`}
                          className={`border-l border-t border-line px-4 py-2.5 text-[12.5px] ${
                            differs ? 'font-semibold text-ink' : 'text-ink/75'
                          } ${differs && values[i] !== values[0] ? 'bg-brand-50/60' : ''}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <Icon name="info" className="h-3.5 w-3.5 text-brand-600" />
            Highlighted cells are where this product differs from the first selection.
          </p>
        </div>
      )}
    </div>
  )
}
