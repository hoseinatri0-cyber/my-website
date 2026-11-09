import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { SectionHeading } from './Ui.jsx'

export function CategoryGrid({ categories = [] }) {
  if (!categories.length) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-32" />)}
      </div>
    )
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Shop by category"
        title="Find your next upgrade"
        action="/shop"
        actionLabel="View all categories"
        className="mb-5"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl2 border border-line bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
          >
            <div className="relative mb-3 overflow-hidden rounded-lg bg-surface">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-[74px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-[13px] font-semibold leading-tight text-ink transition-colors group-hover:text-brand-700">
              {category.name}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{category.subtitle}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
              Shop now <Icon name="arrowRight" className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BrandStrip({ brands = [] }) {
  if (!brands.length) return null
  return (
    <div className="rounded-xl2 border border-line bg-surface/60 px-4 py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Authorised retailer for</span>
        {brands.slice(0, 8).map((brand) => (
          <Link
            key={brand.slug}
            to={`/shop?brand=${brand.slug}`}
            className="font-display text-[15px] font-bold tracking-tight text-ink/40 transition-colors hover:text-brand-700"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
