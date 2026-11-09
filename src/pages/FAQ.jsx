import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQS } from '../lib/site.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { PageHeader } from '../components/Ui.jsx'

export default function FAQ() {
  usePageMeta('Frequently asked questions', 'Answers about delivery, returns, warranty, payments and business orders at Nexora.')
  const [open, setOpen] = useState(0)

  return (
    <>
      <PageHeader
        eyebrow="Help centre"
        title="Frequently asked questions"
        text="Everything about shipping, returns, warranty and payments. Still stuck? Our team replies within a working day."
        crumbs={[{ label: 'FAQ' }]}
      />

      <div className="container-x grid gap-8 py-9 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="space-y-2.5">
            {FAQS.map((item, index) => (
              <li key={item.q} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === index ? -1 : index)}
                  aria-expanded={open === index}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-surface/60"
                >
                  <span className="text-[13.5px] font-semibold text-ink">{item.q}</span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-transform ${open === index ? 'rotate-180' : ''}`}>
                    <Icon name="chevronDown" className="h-3.5 w-3.5" />
                  </span>
                </button>
                {open === index && <p className="border-t border-line px-4 py-3.5 text-[13px] leading-relaxed text-ink/70">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-4">
          <div className="card p-5">
            <h2 className="font-display text-sm font-bold text-ink">Still need help?</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              Our support desk is staffed by product specialists, not scripts. Call, email or message us.
            </p>
            <div className="mt-3 space-y-2">
              <Link to="/contact" className="btn btn-primary btn-sm w-full">
                <Icon name="mail" className="h-4 w-4" /> Send a message
              </Link>
              <Link to="/track-order" className="btn btn-outline btn-sm w-full">
                <Icon name="package" className="h-4 w-4" /> Track an order
              </Link>
            </div>
            <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-[12px] text-muted">
              <p className="flex items-center gap-2"><Icon name="phone" className="h-3.5 w-3.5 text-brand-600" /> +92 21 3587 0000</p>
              <p className="flex items-center gap-2"><Icon name="mail" className="h-3.5 w-3.5 text-brand-600" /> hello@nexora.pk</p>
              <p className="flex items-center gap-2"><Icon name="clock" className="h-3.5 w-3.5 text-brand-600" /> Mon–Sat, 9:00 – 21:00</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
