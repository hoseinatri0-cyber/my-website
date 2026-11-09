import { useRef } from 'react'
import Icon from './Icon.jsx'
import Rating from './Rating.jsx'
import { BENEFITS, TESTIMONIALS } from '../lib/site.js'
import { SectionHeading } from './Ui.jsx'

export default function Testimonials() {
  const trackRef = useRef(null)

  const scrollBy = (direction) => {
    const node = trackRef.current
    if (!node) return
    const card = node.querySelector('[data-card]')
    const width = card ? card.getBoundingClientRect().width + 16 : 320
    node.scrollBy({ left: direction * width, behavior: 'smooth' })
  }

  return (
    <section className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1.5">Customer reviews</p>
          <h2 className="section-title">Trusted by 40,000+ customers</h2>
          <p className="mt-1.5 text-[13px] text-muted">
            Verified purchase reviews. <span className="text-muted/80">Illustrative demo content.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
            aria-label="Previous reviews"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
            aria-label="Next reviews"
          >
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            data-card
            className="card w-[88%] shrink-0 snap-start p-5 sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-navy-800 text-sm font-bold text-white">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                  {t.name}
                  <span className="inline-flex items-center gap-0.5 rounded bg-success/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-success">
                    <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} /> Verified
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted">{t.role}</p>
              </div>
            </div>
            <div className="mt-3">
              <Rating value={t.rating} showValue={false} />
            </div>
            <blockquote className="mt-2.5 text-[13px] leading-relaxed text-ink/75">“{t.quote}”</blockquote>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function Benefits() {
  return (
    <section className="container-x">
      <SectionHeading eyebrow="Why Nexora" title="Why choose Nexora?" className="mb-5" />
      <div className="grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((item) => (
          <div key={item.title} className="flex gap-3.5 bg-white p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
