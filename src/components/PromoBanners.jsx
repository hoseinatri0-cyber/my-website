import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function PromoBanners() {
  return (
    <section className="container-x">
      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          to="/shop?category=student-laptops&sort=price-asc"
          className="group relative flex min-h-[230px] overflow-hidden rounded-xl2 border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-50/40 p-6 transition-shadow hover:shadow-card sm:p-8"
        >
          <div className="relative z-10 max-w-[58%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-700 shadow-soft">
              <Icon name="award" className="h-3.5 w-3.5" /> Student deals
            </span>
            <h3 className="mt-3 font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-[26px]">
              Campus-ready machines, student pricing.
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Save up to 20% on selected laptops with a valid student ID. Free sleeve with every order.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-700">
              Shop student deals <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <img
            src="/images/laptop-13.jpg"
            alt="Student working on a laptop"
            loading="lazy"
            className="absolute -bottom-2 right-0 h-[85%] w-[46%] rounded-tl-2xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <Link
          to="/category/gaming-laptops"
          className="group relative flex min-h-[230px] overflow-hidden rounded-xl2 border border-navy-800 bg-navy-900 p-6 transition-shadow hover:shadow-lift sm:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand-500/30 blur-[70px]" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-[60px]" aria-hidden="true" />
          <div className="relative z-10 max-w-[58%]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-200">
              <Icon name="sparkles" className="h-3.5 w-3.5" /> Gaming collection
            </span>
            <h3 className="mt-3 font-display text-[22px] font-extrabold leading-tight tracking-tight text-white sm:text-[26px]">
              Frame rates that keep up with you.
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              RTX graphics, 240Hz panels and vapour-chamber cooling — built for competitive play.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-white">
              Explore gaming laptops <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <img
            src="/images/gaming-01.jpg"
            alt="Gaming laptop setup with neon lighting"
            loading="lazy"
            className="absolute -bottom-1 right-0 h-[88%] w-[46%] rounded-tl-2xl object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      </div>
    </section>
  )
}
