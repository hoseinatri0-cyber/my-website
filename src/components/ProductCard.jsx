import { Link } from 'react-router-dom'
import { money } from '../lib/format.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icon.jsx'
import Rating from './Rating.jsx'

export default function ProductCard({ product, className = '' }) {
  const { addToCart, toggleWishlist, toggleCompare, inWishlist, inCompare } = useStore()
  const saved = inWishlist(product.id)
  const compared = inCompare(product.id)
  const discount = product.discount || (product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0)

  const specLine = [product.specs?.ram, product.specs?.storage, product.specs?.display].filter(Boolean).join(' · ')

  return (
    <article className={`group card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift ${className}`}>
      <div className="relative overflow-hidden bg-surface">
        <Link to={`/product/${product.slug}`} className="block" aria-label={product.name}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-48"
          />
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="rounded bg-navy-900/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded bg-discount px-2 py-0.5 text-[10px] font-bold text-white">-{discount}%</span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-soft transition-colors ${
              saved ? 'border-brand-200 text-brand-600' : 'border-line text-muted hover:text-brand-600'
            }`}
          >
            <Icon name="heart" filled={saved} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(product)}
            aria-label={compared ? `Remove ${product.name} from comparison` : `Compare ${product.name}`}
            aria-pressed={compared}
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white/95 shadow-soft transition-colors ${
              compared ? 'border-brand-200 text-brand-600' : 'border-line text-muted hover:text-brand-600'
            }`}
          >
            <Icon name="compare" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.4rem] text-[13.5px] font-semibold leading-snug text-ink">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        {specLine && <p className="mt-1 line-clamp-1 text-[11.5px] text-muted">{specLine}</p>}

        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[17px] font-extrabold tracking-tight text-ink">{money(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted line-through">{money(product.originalPrice)}</span>
          )}
        </div>

        {product.stock !== undefined && product.stock <= 10 && (
          <p className="mt-1 text-[11px] font-medium text-amber-600">Only {product.stock} left in stock</p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="btn btn-primary btn-sm flex-1"
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name="bag" className="h-4 w-4" />
            Add to cart
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="btn btn-outline btn-sm px-2.5"
            aria-label={`View details for ${product.name}`}
          >
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
