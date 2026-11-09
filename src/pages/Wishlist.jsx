import { Link } from 'react-router-dom'
import { money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icon.jsx'
import Rating from '../components/Rating.jsx'
import { EmptyState } from '../components/Ui.jsx'

export default function Wishlist() {
  usePageMeta('Wishlist', 'Products you have saved for later at Nexora.')
  const { wishlist, toggleWishlist, addToCart, toggleCompare, inCompare } = useStore()

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Wishlist</h1>
          <p className="mt-1 text-[13px] text-muted">
            {wishlist.length === 0 ? 'Nothing saved yet.' : `${wishlist.length} saved product${wishlist.length > 1 ? 's' : ''}.`}
          </p>
        </div>
        <Link to="/shop" className="btn btn-outline btn-sm">Continue shopping</Link>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          text="Tap the heart on any product to keep it here while you decide."
          action="/shop"
          actionLabel="Find something you love"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {wishlist.map((item) => {
            const product = { ...item, images: [item.image] }
            return (
              <article key={item.id} className="card group flex flex-col overflow-hidden">
                <div className="relative overflow-hidden bg-surface">
                  <Link to={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} loading="lazy" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/95 text-brand-600 shadow-soft"
                  >
                    <Icon name="heart" filled className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{item.brand}</p>
                  <h2 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-ink">
                    <Link to={`/product/${item.slug}`} className="hover:text-brand-700">{item.name}</Link>
                  </h2>
                  {item.rating !== undefined && <div className="mt-1.5"><Rating value={item.rating} count={item.reviewCount} /></div>}
                  <p className="mt-2 text-[16px] font-extrabold text-ink">{money(item.price)}</p>
                  <div className="mt-auto space-y-2 pt-3">
                    <button type="button" onClick={() => addToCart(product, 1)} className="btn btn-primary btn-sm w-full">
                      <Icon name="bag" className="h-4 w-4" /> Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(product)}
                      className={`btn btn-outline btn-sm w-full ${inCompare(item.id) ? 'border-brand-300 text-brand-700' : ''}`}
                    >
                      <Icon name="compare" className="h-4 w-4" /> {inCompare(item.id) ? 'In comparison' : 'Compare'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
