import { Link } from 'react-router-dom'
import { money } from '../lib/format.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icon.jsx'
import { EmptyState } from '../components/Ui.jsx'

export default function Cart() {
  usePageMeta('Shopping cart', 'Review the items in your Nexora shopping cart before checkout.')
  const { cart, subtotal, updateQty, removeFromCart, clearCart } = useStore()

  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 15
  const total = subtotal + shipping
  const remaining = Math.max(0, 499 - subtotal)

  return (
    <div className="container-x py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Shopping cart</h1>
          <p className="mt-1 text-[13px] text-muted">
            {cart.length === 0 ? 'Your cart is empty.' : `${cart.length} product${cart.length > 1 ? 's' : ''} in your cart.`}
          </p>
        </div>
        {cart.length > 0 && (
          <button type="button" onClick={clearCart} className="text-[12.5px] font-medium text-muted underline-offset-4 hover:text-discount hover:underline">
            Clear cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          text="Browse our laptops, desktops and accessories — everything ships with an official warranty."
          action="/shop"
          actionLabel="Start shopping"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-xl2 border border-line">
              <div className="hidden grid-cols-12 gap-3 border-b border-line bg-surface/70 px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted sm:grid">
                <span className="col-span-6">Product</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              <ul className="divide-y divide-line">
                {cart.map((line) => (
                  <li key={`${line.id}-${line.color}`} className="grid grid-cols-12 items-center gap-3 px-4 py-4">
                    <div className="col-span-12 flex gap-3 sm:col-span-6">
                      <Link to={`/product/${line.slug}`} className="shrink-0 overflow-hidden rounded-lg bg-surface">
                        <img src={line.image} alt={line.name} className="h-16 w-20 object-cover" loading="lazy" />
                      </Link>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{line.brand}</p>
                        <Link to={`/product/${line.slug}`} className="mt-0.5 line-clamp-2 text-[13px] font-semibold text-ink hover:text-brand-700">
                          {line.name}
                        </Link>
                        {line.color && <p className="mt-0.5 text-[11.5px] text-muted">Colour: {line.color}</p>}
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.id, line.color)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-muted transition-colors hover:text-discount"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-4 text-[13px] font-medium text-ink sm:col-span-2 sm:text-center">
                      <span className="sm:hidden text-[11px] text-muted">Price </span>{money(line.price)}
                    </div>

                    <div className="col-span-5 sm:col-span-2">
                      <div className="mx-auto flex w-fit items-center rounded-lg border border-line">
                        <button
                          type="button"
                          onClick={() => updateQty(line.id, line.color, line.qty - 1)}
                          disabled={line.qty <= 1}
                          className="flex h-8 w-8 items-center justify-center text-muted disabled:opacity-40 hover:text-ink"
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          <Icon name="minus" className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-[12.5px] font-semibold">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.id, line.color, line.qty + 1)}
                          disabled={line.qty >= 10}
                          className="flex h-8 w-8 items-center justify-center text-muted disabled:opacity-40 hover:text-ink"
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          <Icon name="plus" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-3 text-right text-[13.5px] font-bold text-ink sm:col-span-2">
                      {money(line.price * line.qty)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link to="/shop" className="btn btn-outline btn-sm">
                <Icon name="chevronLeft" className="h-3.5 w-3.5" /> Continue shopping
              </Link>
              {remaining > 0 ? (
                <p className="text-[12px] text-muted">
                  Add <span className="font-semibold text-ink">{money(remaining)}</span> more for free shipping.
                </p>
              ) : (
                <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-success">
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} /> You qualify for free shipping.
                </p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="card sticky top-[132px] p-5">
              <h2 className="font-display text-base font-bold text-ink">Order summary</h2>
              <dl className="mt-4 space-y-2.5 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-medium text-ink">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="font-medium text-ink">{shipping === 0 ? 'Free' : money(shipping)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Estimated tax</dt>
                  <dd className="text-muted">Included</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-display text-lg font-extrabold text-ink">{money(total)}</dd>
                </div>
              </dl>

              <Link to="/checkout" className="btn btn-primary mt-5 w-full">
                Proceed to checkout
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>

              <div className="mt-4 space-y-2 border-t border-line pt-4">
                {[
                  { icon: 'lock', text: 'Secure encrypted checkout' },
                  { icon: 'returns', text: '30-day returns on unopened items' },
                  { icon: 'shield', text: 'Official manufacturer warranty' },
                ].map((item) => (
                  <p key={item.text} className="flex items-center gap-2 text-[11.5px] text-muted">
                    <Icon name={item.icon} className="h-3.5 w-3.5 text-brand-600" />
                    {item.text}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
