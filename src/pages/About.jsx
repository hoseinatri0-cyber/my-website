import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { PageHeader } from '../components/Ui.jsx'
import { BRAND_VALUES } from '../lib/site.js'

export default function About() {
  usePageMeta('About Nexora', 'Nexora is a specialist technology retailer — curated hardware, expert advice and warranty handled in-house.')
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Technology retail, done properly."
        text="Nexora started in 2014 as a two-person service desk in Karachi. Today we supply laptops, desktops and accessories to 40,000 customers and 600 businesses — with the same rule we started with: only sell hardware we would buy ourselves."
        crumbs={[{ label: 'About us' }]}
      />

      <div className="container-x py-9">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              <img src="/images/setup-01.jpg" alt="Nexora workshop with a multi-monitor setup" className="h-56 w-full rounded-xl2 object-cover" loading="lazy" />
              <img src="/images/laptop-05.jpg" alt="Technician preparing a laptop for delivery" className="h-56 w-full rounded-xl2 object-cover" loading="lazy" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { value: '40k+', label: 'Customers served' },
                { value: '12', label: 'Years trading' },
                { value: '4.8/5', label: 'Average rating' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl2 border border-line bg-surface/60 p-4 text-center">
                  <p className="font-display text-2xl font-extrabold tracking-tight text-ink">{stat.value}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Built around three promises</h2>
            <ul className="mt-4 space-y-4">
              {BRAND_VALUES.map((value) => (
                <li key={value.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">{value.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{value.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary mt-6">
              Talk to a specialist <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 rounded-xl2 border border-line bg-surface/50 p-6 sm:grid-cols-3">
          {[
            { icon: 'shield', title: 'Authorised distribution', text: 'We buy directly from brand distributors, so every serial number is traceable and warranty-valid.' },
            { icon: 'support', title: 'In-house service desk', text: 'Diagnostics, upgrades and warranty claims are handled by our own technicians, not a third party.' },
            { icon: 'truck', title: 'Same-day dispatch', text: 'Orders confirmed before 4pm leave our warehouse the same working day, with live tracking.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
