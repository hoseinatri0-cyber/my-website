import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Hero, { TrustBar } from '../components/Hero.jsx'
import { BrandStrip, CategoryGrid } from '../components/CategoryGrid.jsx'
import PromoBanners from '../components/PromoBanners.jsx'
import Testimonials, { Benefits } from '../components/Testimonials.jsx'
import { AccessoriesPanel, BestSellers, ComparePanel } from '../components/HomePanels.jsx'
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

export default function Home() {
  usePageMeta(
    'Premium Laptops, Desktops & Technology',
    'Shop premium laptops, desktops, monitors and accessories at Nexora. Genuine products, official warranty, free shipping over $499 and 30-day returns.',
  )

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [accessories, setAccessories] = useState([])
  const [comparePool, setComparePool] = useState([])
  const [sort, setSort] = useState('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      api.categories(),
      api.brands(),
      api.products({ bestseller: 1, limit: 5 }),
      api.products({ category: 'laptop-accessories', limit: 20 }),
      api.products({ category: 'laptops', sort: 'rating', limit: 4 }),
    ]).then(([cats, brandList, best, acc, top]) => {
      if (!alive) return
      setCategories(cats)
      setBrands(brandList)
      setBestSellers(best.items)
      setAccessories(acc.items)
      setComparePool(top.items)
    }).catch(() => {}).finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    api.products({ featured: 1, sort, limit: 8 })
      .then((data) => { if (alive) setFeatured(data.items) })
      .catch(() => {})
    return () => { alive = false }
  }, [sort])

  return (
    <>
      <Hero />
      <TrustBar />

      <div className="space-y-12 py-12 sm:space-y-16 sm:py-14">
        <section className="container-x">
          <CategoryGrid categories={categories} />
        </section>

        <section className="container-x">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow mb-1.5">Handpicked</p>
              <h2 className="section-title">Popular laptops</h2>
              <p className="mt-1.5 text-[13px] text-muted">The machines our customers reach for most this month.</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-[12px] font-medium text-muted">Sort by</label>
              <div className="relative">
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[12.5px] font-medium text-ink focus:border-brand-400 focus:outline-none"
                  style={{ backgroundImage: 'none' }}
                >
                  {SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <Icon name="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              </div>
            </div>
          </div>

          {loading && featured.length === 0 ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {featured.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link to="/shop" className="btn btn-outline">
              Browse all products
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="container-x">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4"><BestSellers products={bestSellers} loading={loading} /></div>
            <div className="lg:col-span-4"><ComparePanel products={comparePool} /></div>
            <div className="lg:col-span-4"><AccessoriesPanel products={accessories} /></div>
          </div>
        </section>

        <PromoBanners />

        <Testimonials />

        <Benefits />

        <section className="container-x">
          <BrandStrip brands={brands} />
        </section>

        <section className="container-x">
          <div className="relative overflow-hidden rounded-xl2 bg-navy-900 px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-[80px]" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="eyebrow mb-2 text-brand-400">Business &amp; education</p>
                <h2 className="max-w-xl font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
                  Buying for a team or a campus?
                </h2>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/60">
                  Volume pricing, 30-day invoicing, pre-configured imaging and dedicated account management.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="btn btn-primary">Talk to sales</Link>
                <Link to="/about" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
                  How we work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
