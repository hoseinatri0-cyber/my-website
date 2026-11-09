import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { dateLabel, money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStore } from '../context/StoreContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import Rating from '../components/Rating.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { EmptyState, Spinner } from '../components/Ui.jsx'

const SPEC_LABELS = {
  cpu: 'Processor',
  ram: 'Memory',
  storage: 'Storage',
  gpu: 'Graphics',
  display: 'Display',
  resolution: 'Resolution',
  refresh: 'Refresh rate',
  battery: 'Battery life',
  weight: 'Weight',
  os: 'Operating system',
  warranty: 'Warranty',
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, toggleCompare, inWishlist, inCompare, toast } = useStore()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [color, setColor] = useState('')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('overview')
  const [activeImage, setActiveImage] = useState(0)
  const [zoom, setZoom] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [reviewState, setReviewState] = useState({ loading: false, error: '', success: '' })
  const zoomBox = useRef(null)

  usePageMeta(product?.name || 'Product', product?.description?.slice(0, 155))

  useEffect(() => {
    let alive = true
    setProduct(null)
    setError('')
    setActiveImage(0)
    setQty(1)
    api.product(slug)
      .then((data) => {
        if (!alive) return
        setProduct(data)
        setColor(data.colors?.[0] || '')
        window.scrollTo({ top: 0 })
      })
      .catch((err) => { if (alive) setError(err.message) })
    api.reviews(slug).then((list) => { if (alive) setReviews(list) }).catch(() => {})
    return () => { alive = false }
  }, [slug])

  if (error) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon="search"
          title="We couldn't find that product"
          text="It may have sold out or the link may be out of date."
          action="/shop"
          actionLabel="Browse all products"
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-x grid gap-8 py-10 lg:grid-cols-2">
        <div className="skeleton aspect-[4/3] w-full" />
        <div className="space-y-3">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-10 w-40" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    )
  }

  const saved = inWishlist(product.id)
  const compared = inCompare(product.id)
  const images = product.images?.length ? product.images : ['/images/laptop-01.jpg']
  const specs = product.specs || {}
  const specEntries = Object.entries(specs).filter(([, v]) => v && v !== '—')

  const handleZoom = (event) => {
    const box = zoomBox.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setZoom({ x, y })
  }

  const submitReview = async (event) => {
    event.preventDefault()
    setReviewState({ loading: true, error: '', success: '' })
    try {
      const res = await api.addReview(product.slug, reviewForm)
      const list = await api.reviews(product.slug)
      setReviews(list)
      setProduct((p) => ({ ...p, rating: res.rating, reviewCount: res.count }))
      setReviewForm({ rating: 5, title: '', body: '' })
      setReviewState({ loading: false, error: '', success: 'Thanks — your review is published.' })
    } catch (err) {
      setReviewState({ loading: false, error: err.message, success: '' })
    }
  }

  return (
    <div>
      <div className="border-b border-line bg-white">
        <div className="container-x py-3.5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link to="/" className="hover:text-brand-700">Home</Link></li>
              <li><Icon name="chevronRight" className="h-3 w-3" /></li>
              <li><Link to="/shop" className="hover:text-brand-700">Shop</Link></li>
              <li><Icon name="chevronRight" className="h-3 w-3" /></li>
              <li><Link to={`/category/${product.categorySlug}`} className="hover:text-brand-700">{product.category}</Link></li>
              <li><Icon name="chevronRight" className="h-3 w-3" /></li>
              <li className="line-clamp-1 text-ink">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-10">
        {/* Gallery */}
        <div>
          <div
            ref={zoomBox}
            onMouseMove={handleZoom}
            onMouseLeave={() => setZoom(null)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl2 border border-line bg-surface"
          >
            <img
              src={images[activeImage]}
              alt={`${product.name} — image ${activeImage + 1}`}
              className="h-full w-full object-cover transition-transform duration-300"
              style={zoom ? { transform: 'scale(1.7)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-navy-950/70 px-2.5 py-1 text-[10.5px] font-medium text-white backdrop-blur">
              <Icon name="zoom" className="h-3.5 w-3.5" /> Hover to zoom
            </span>
            {product.badge && (
              <span className="absolute left-3 top-3 rounded bg-navy-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-3 flex gap-2.5">
            {images.map((image, index) => (
              <button
                key={image + index}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={activeImage === index}
                className={`overflow-hidden rounded-lg border-2 transition-colors ${activeImage === index ? 'border-brand-600' : 'border-line hover:border-brand-300'}`}
              >
                <img src={image} alt="" className="h-16 w-20 object-cover sm:h-20 sm:w-24" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: 'truck', title: 'Free delivery', text: 'Orders over $499' },
              { icon: 'returns', title: '30-day returns', text: 'No questions asked' },
              { icon: 'shield', title: 'Official warranty', text: specs.warranty || '1 year' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5">
                <Icon name={item.icon} className="h-4.5 w-4.5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-[12px] font-semibold leading-none text-ink">{item.title}</p>
                  <p className="mt-1 text-[11px] text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:sticky lg:top-[132px] lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">{product.brand}</p>
          <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink sm:text-[30px]">
            {product.name}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} />
            <button type="button" onClick={() => setTab('reviews')} className="text-[12px] font-medium text-brand-600 hover:text-brand-700">
              Read reviews
            </button>
            <span className={`text-[12px] font-medium ${product.stock > 0 ? 'text-success' : 'text-discount'}`}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-display text-[32px] font-extrabold leading-none tracking-tight text-ink">{money(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm text-muted line-through">{money(product.originalPrice)}</span>
                <span className="rounded bg-discount/10 px-1.5 py-0.5 text-[11.5px] font-bold text-discount">
                  Save {money(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-[11.5px] text-muted">Inclusive of all taxes. Shipping calculated at checkout.</p>

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[12px] font-semibold text-ink">
                Colour: <span className="font-normal text-muted">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-pressed={color === c}
                    className={`rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      color === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line text-ink/75 hover:border-brand-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-stretch gap-3">
            <div className="flex items-center rounded-lg border border-line">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="flex h-11 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
                aria-label="Decrease quantity"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <span className="w-9 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((v) => Math.min(10, v + 1))}
                className="flex h-11 w-10 items-center justify-center text-muted transition-colors hover:text-ink"
                aria-label="Increase quantity"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product, qty, color)}
              disabled={product.stock <= 0}
              className="btn btn-primary h-11 flex-1"
            >
              <Icon name="bag" className="h-4 w-4" />
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => { addToCart(product, qty, color); navigate('/cart') }}
              disabled={product.stock <= 0}
              className="btn btn-navy h-11 px-5"
            >
              Buy now
            </button>
          </div>

          <div className="mt-3 flex gap-2.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={saved}
              className={`btn btn-outline btn-sm flex-1 ${saved ? 'border-brand-300 text-brand-700' : ''}`}
            >
              <Icon name="heart" filled={saved} className="h-4 w-4" />
              {saved ? 'Saved to wishlist' : 'Add to wishlist'}
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(product)}
              aria-pressed={compared}
              className={`btn btn-outline btn-sm flex-1 ${compared ? 'border-brand-300 text-brand-700' : ''}`}
            >
              <Icon name="compare" className="h-4 w-4" />
              {compared ? 'In comparison' : 'Compare'}
            </button>
          </div>

          <div className="mt-5 rounded-xl2 border border-line bg-surface/70 p-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {specEntries.slice(0, 6).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{SPEC_LABELS[key] || key}</dt>
                  <dd className="mt-0.5 text-[12.5px] font-medium leading-snug text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={() => setTab('specs')} className="link-arrow mt-3 text-[12px]">
              Full specifications <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-brand-100 bg-brand-50/60 p-3">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <p className="text-[11.5px] leading-relaxed text-brand-900/80">
              Demo storefront — checkout records a demonstration order and no payment is captured.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-line">
        <div className="container-x">
          <div className="flex gap-1 overflow-x-auto border-b border-line">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-selected={tab === item.id}
                role="tab"
                className={`relative whitespace-nowrap px-4 py-3.5 text-[13px] font-semibold transition-colors ${
                  tab === item.id ? 'text-brand-700' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
                {tab === item.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="container-x py-7">
          {tab === 'overview' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="font-display text-lg font-bold text-ink">About the {product.name}</h2>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/75">{product.description}</p>
                <ul className="mt-4 space-y-2">
                  {specEntries.slice(0, 5).map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2 text-[13px] text-ink/75">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.4} />
                      <span><span className="font-medium text-ink">{SPEC_LABELS[key] || key}:</span> {value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-xl2 border border-line bg-surface/70 p-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">In the box</p>
                  <ul className="space-y-1.5 text-[13px] text-ink/75">
                    <li>{product.name}</li>
                    <li>Power adapter and cable</li>
                    <li>Warranty card and quick-start guide</li>
                    <li>Original retail packaging</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'specs' && (
            <div className="max-w-3xl overflow-hidden rounded-xl2 border border-line">
              <table className="w-full text-left text-[13px]">
                <tbody>
                  {Object.entries(SPEC_LABELS).map(([key, label], index) => (
                    <tr key={key} className={index % 2 ? 'bg-white' : 'bg-surface/60'}>
                      <th scope="row" className="w-1/3 px-4 py-2.5 font-medium text-muted">{label}</th>
                      <td className="px-4 py-2.5 font-medium text-ink">{specs[key] || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-4 flex items-center gap-4 rounded-xl2 border border-line bg-surface/60 p-4">
                  <div className="text-center">
                    <p className="font-display text-3xl font-extrabold leading-none text-ink">{product.rating.toFixed(1)}</p>
                    <Rating value={product.rating} showValue={false} className="mt-1.5 justify-center" />
                    <p className="mt-1 text-[11px] text-muted">{product.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const share = stars === Math.round(product.rating) ? 62 : stars === 4 ? 24 : stars === 3 ? 9 : stars === 2 ? 3 : 2
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-8 text-[11px] text-muted">{stars}★</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${share}%` }} />
                          </div>
                          <span className="w-7 text-right text-[10.5px] text-muted">{share}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li key={review.id} className="border-b border-line pb-4 last:border-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink">
                            {review.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                          <div>
                            <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                              {review.name}
                              {review.verified && (
                                <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-success">
                                  Verified
                                </span>
                              )}
                            </p>
                            <p className="text-[10.5px] text-muted">{dateLabel(review.created_at)}</p>
                          </div>
                        </div>
                        <Rating value={review.rating} showValue={false} />
                      </div>
                      {review.title && <p className="mt-2 text-[13px] font-semibold text-ink">{review.title}</p>}
                      <p className="mt-1 text-[13px] leading-relaxed text-ink/75">{review.body}</p>
                    </li>
                  ))}
                  {reviews.length === 0 && <li className="text-sm text-muted">No reviews yet — be the first to write one.</li>}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="card p-5">
                  <h3 className="font-display text-sm font-bold text-ink">Write a review</h3>
                  {user ? (
                    <form onSubmit={submitReview} className="mt-3 space-y-3">
                      <div>
                        <span className="label">Your rating</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                              aria-label={`${star} star${star > 1 ? 's' : ''}`}
                              aria-pressed={reviewForm.rating === star}
                            >
                              <Icon name="star" filled className={`h-5 w-5 ${reviewForm.rating >= star ? 'text-amber-400' : 'text-line'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="label" htmlFor="review-title">Title</label>
                        <input
                          id="review-title"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                          className="input"
                          placeholder="Sums up your experience"
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="review-body">Review</label>
                        <textarea
                          id="review-body"
                          rows={4}
                          value={reviewForm.body}
                          onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                          className="input resize-none"
                          placeholder="What stood out about this product?"
                          required
                        />
                      </div>
                      {reviewState.error && <p className="text-xs font-medium text-discount">{reviewState.error}</p>}
                      {reviewState.success && <p className="text-xs font-medium text-success">{reviewState.success}</p>}
                      <button type="submit" disabled={reviewState.loading} className="btn btn-primary btn-sm w-full">
                        {reviewState.loading ? <Spinner className="h-4 w-4" /> : null}
                        Publish review
                      </button>
                    </form>
                  ) : (
                    <div className="mt-2">
                      <p className="text-[13px] leading-relaxed text-muted">
                        Reviews are tied to a verified account. Sign in to leave feedback for this product.
                      </p>
                      <Link to="/signin" className="btn btn-primary btn-sm mt-3 w-full">Sign in to review</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {product.related?.length > 0 && (
        <section className="container-x border-t border-line py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-1.5">You may also like</p>
              <h2 className="section-title">Related products</h2>
            </div>
            <Link to={`/category/${product.categorySlug}`} className="link-arrow">
              View category <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {product.related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
