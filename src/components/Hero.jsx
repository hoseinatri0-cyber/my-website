import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { TRUST_ITEMS } from '../lib/site.js'

export function TrustBar() {
  return (
    <div className="container-x relative z-10 -mt-8 sm:-mt-10">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-line bg-line shadow-card lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-3 bg-white px-4 py-4 sm:px-5 sm:py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-tight text-ink">{item.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-[520px] w-[520px] rounded-full bg-brand-600/25 blur-[110px]" />
        <div className="absolute right-0 top-1/2 h-[460px] w-[460px] -translate-y-1/3 rounded-full bg-brand-500/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.22) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 30% 40%, black, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black, transparent 72%)',
          }}
        />
      </div>

      <div className="container-x relative grid items-center gap-8 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
            </span>
            New arrivals · 2026 line-up
          </div>

          <h1 className="mt-5 font-display text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[46px] lg:text-[54px]">
            Powerful technology.
            <span className="mt-1 block text-brand-400">Limitless possibilities.</span>
          </h1>

          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/65 sm:text-base">
            Discover the perfect laptop, desktop and technology accessories designed to power your productivity,
            creativity and gaming experience — with official warranty and free delivery over $499.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn btn-primary px-6">
              Shop Now
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link
              to="/category/ultrabooks"
              className="btn border border-white/20 bg-white/[0.04] px-5 text-white backdrop-blur transition-colors hover:border-white/35 hover:bg-white/10"
            >
              <Icon name="grid" className="h-4 w-4" />
              Explore Categories
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            {[
              { icon: 'shield', label: 'Authentic products' },
              { icon: 'truck', label: 'Free delivery' },
              { icon: 'returns', label: '30-day returns' },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 text-[12.5px] text-white/60">
                <Icon name={item.icon} className="h-4 w-4 text-brand-400" />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-[560px]">
            <div className="absolute inset-6 rounded-[28px] bg-brand-500/30 blur-[60px]" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
              <img
                src="/images/laptop-03.jpg"
                alt="Premium gaming laptop with an illuminated keyboard"
                className="aspect-[5/4] w-full object-cover"
                fetchpriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-navy-950/70 px-3 py-2 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-300">Featured build</p>
                <p className="mt-0.5 text-sm font-semibold text-white">ROG Zephyrus G14 · RTX 4060</p>
              </div>
            </div>

            <div className="absolute -right-2 -top-3 flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full border border-white/20 bg-brand-600 text-center shadow-[0_16px_32px_-12px_rgba(37,99,235,0.9)] sm:-right-4 sm:h-[104px] sm:w-[104px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/80">Save up to</span>
              <span className="font-display text-2xl font-extrabold leading-none text-white sm:text-3xl">25%</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/80">this week</span>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 shadow-lift sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                <Icon name="check" className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
              <div>
                <p className="text-[12px] font-semibold leading-none text-ink">In stock &amp; ready to ship</p>
                <p className="mt-1 text-[11px] text-muted">Order before 4pm for same-day dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
