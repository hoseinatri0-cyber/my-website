import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icon.jsx'
import { ProductGridSkeleton } from '../components/Ui.jsx'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'best', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
]

const PRICE_PRESETS = [
  { label: 'Under $600', min: '', max: '600' },
  { label: '$600 – $1,000', min: '600', max: '1000' },
  { label: '$1,000 – $1,600', min: '1000', max: '1600' },
  { label: '$1,600+', min: '1600', max: '' },
]

const RATING_PRESETS = [
  { label: '4.5 & up', value: '4.5' },
  { label: '4.0 & up', value: '4' },
  { label: '3.5 & up', value: '3.5' },
]

export default function Shop({ lockedCategory }) {
  const params = useParams()
  const categorySlug = lockedCategory || params.slug
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [data, setData] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = searchParams.get('q') || ''
  const category = categorySlug || searchParams.get('category') || ''
  const brandList = (searchParams.get('brand') || '').split(',').filter(Boolean)
  const min = searchParams.get('min') || ''
  const max = searchParams.get('max') || ''
  const rating = searchParams.get('rating') || ''
  const sort = searchParams.get('sort') || 'featured'

  const [minDraft, setMinDraft] = useState(min)
  const [maxDraft, setMaxDraft] = useState(max)

  useEffect(() => { setMinDraft(min); setMaxDraft(max) }, [min, max])

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {})
    api.brands().then(setBrands).catch(() => {})
  }, [])

  const query = useMemo(() => ({
    q: q || undefined,
    category: category || undefined,
    brand: brandList.join(',') || undefined,
    min: min || undefined,
    max: max || undefined,
    rating: rating || undefined,
    sort,
    limit: 60,
  }), [q, category, brandList, min, max, rating, sort])

  useEffect(() => {
    let alive = true
    setLoading(true)
    api.products(query)
      .then((res) => { if (alive) setData(res) })
      .catch(() => { if (alive) setData({ items: [], total: 0 }) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, brandList.join(','), min, max, rating, sort])

  const activeCategory = categories.find((c) => c.slug === category)
  const title = activeCategory?.name || (q ? `Results for “${q}”` : 'All products')

  usePageMeta(
    title,
    `${title} at Nexora — genuine technology with official warranty, free shipping over $499 and 30-day returns.`,
  )

  const update = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === null || value === undefined) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const toggleBrand = (slug) => {
    const next = brandList.includes(slug) ? brandList.filter((b) => b !== slug) : [...brandList, slug]
    update('brand', next.join(','))
  }

  const resetAll = () => {
    setSearchParams(categorySlug ? {} : new URLSearchParams(q ? { q } : {}), { replace: true })
  }

  const activeCount = [brandList.length > 0, min, max, rating].filter(Boolean).length

  const filterBody = (
    <div className="space-y-6">
      {!categorySlug && (
        <div>
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Category</p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => update('category', '')}
                className={`w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${!category ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink/80 hover:bg-surface'}`}
              >
                All categories
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => update('category', c.slug)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${category === c.slug ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink/80 hover:bg-surface'}`}
                >
                  {c.name}
                  <span className="text-[11px] text-muted">{c.productCount}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Brand</p>
        <ul className="space-y-1.5">
          {brands.filter((b) => b.productCount > 0).map((b) => (
            <li key={b.slug}>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-[13px] text-ink/80 hover:bg-surface">
                <input
                  type="checkbox"
                  checked={brandList.includes(b.slug)}
                  onChange={() => toggleBrand(b.slug)}
                  className="h-3.5 w-3.5 rounded border-line text-brand-600 focus:ring-brand-500"
                />
                <span className="flex-1">{b.name}</span>
                <span className="text-[11px] text-muted">{b.productCount}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Price range</p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active = min === preset.min && max === preset.max
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => { update('min', preset.min); update('max', preset.max) }}
                className={`chip ${active ? 'chip-active' : ''}`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const next = new URLSearchParams(searchParams)
            if (minDraft) next.set('min', minDraft); else next.delete('min')
            if (maxDraft) next.set('max', maxDraft); else next.delete('max')
            setSearchParams(next, { replace: true })
          }}
        >
          <label className="sr-only" htmlFor="min-price">Minimum price</label>
          <input
            id="min-price"
            type="number"
            min="0"
            value={minDraft}
            onChange={(e) => setMinDraft(e.target.value)}
            placeholder="Min"
            className="input h-9 text-[12.5px]"
          />
          <span className="text-muted">–</span>
          <label className="sr-only" htmlFor="max-price">Maximum price</label>
          <input
            id="max-price"
            type="number"
            min="0"
            value={maxDraft}
            onChange={(e) => setMaxDraft(e.target.value)}
            placeholder="Max"
            className="input h-9 text-[12.5px]"
          />
          <button type="submit" className="btn btn-outline btn-sm shrink-0">Go</button>
        </form>
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Customer rating</p>
        <ul className="space-y-1">
          {RATING_PRESETS.map((preset) => (
            <li key={preset.value}>
              <button
                type="button"
                onClick={() => update('rating', rating === preset.value ? '' : preset.value)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${rating === preset.value ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink/80 hover:bg-surface'}`}
              >
                <span className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" filled className={`h-3 w-3 ${i + 0.5 < Number(preset.value) ? '' : 'text-line'}`} />
                  ))}
                </span>
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={resetAll} className="btn btn-outline btn-sm w-full">
        <Icon name="close" className="h-3.5 w-3.5" /> Clear all filters
      </button>
    </div>
  )

  return (
    <>
      <div className="border-b border-line bg-surface/70">
        <div className="container-x py-7 sm:py-9">
          <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
              <li><Icon name="chevronRight" className="h-3 w-3" /></li>
              <li className="text-ink">{activeCategory?.name || 'Shop'}</li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[34px]">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-[13.5px] text-muted">
            {activeCategory?.subtitle
              ? `${activeCategory.subtitle} — ${data.total} products, all covered by official warranty.`
              : `${data.total} products across laptops, desktops, monitors and accessories.`}
          </p>
        </div>
      </div>

      <div className="container-x py-7 sm:py-9">
        <div className="grid gap-7 lg:grid-cols-[232px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[132px] card p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-sm font-bold text-ink">Filters</p>
                {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{activeCount}</span>}
              </div>
              {filterBody}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12.5px] text-muted">
                {loading ? 'Loading products…' : `Showing ${data.items.length} of ${data.total} products`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="btn btn-outline btn-sm lg:hidden"
                >
                  <Icon name="filter" className="h-4 w-4" />
                  Filters{activeCount ? ` (${activeCount})` : ''}
                </button>
                <label htmlFor="shop-sort" className="text-[12px] font-medium text-muted">Sort</label>
                <div className="relative">
                  <select
                    id="shop-sort"
                    value={sort}
                    onChange={(e) => update('sort', e.target.value === 'featured' ? '' : e.target.value)}
                    className="h-9 cursor-pointer appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[12.5px] font-medium text-ink focus:border-brand-400 focus:outline-none"
                  >
                    {SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>

            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : data.items.length === 0 ? (
              <div className="card px-6 py-16 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name="search" className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-bold text-ink">No products match those filters</h2>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                  Try widening the price range or clearing a brand selection.
                </p>
                <button type="button" onClick={resetAll} className="btn btn-primary btn-sm mt-5">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
                {data.items.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-sm font-bold">Filters</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface"
                aria-label="Close filters"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterBody}</div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full">
                Show {data.total} products
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
