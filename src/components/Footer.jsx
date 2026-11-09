import { Link } from 'react-router-dom'
import { FOOTER_COLUMNS, PAYMENT_METHODS } from '../lib/site.js'
import Icon from './Icon.jsx'
import Newsletter from './Newsletter.jsx'

const SOCIALS = [
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'twitter', label: 'X' },
  { icon: 'youtube', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <Newsletter />

      <div className="border-t border-white/10">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Nexora home">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-navy-900">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M5 18V6l14 12V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              <span className="font-display text-[22px] font-extrabold leading-none tracking-[-0.02em] text-white">
                nexora<span className="text-brand-400">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/55">
              Your one-stop destination for premium laptops, desktops, monitors and accessories. Genuine products,
              official warranty and specialist advice — since 2014.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-white/25 hover:bg-white/5 hover:text-white"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Contact</p>
            <ul className="space-y-3 text-[13px] text-white/70">
              <li className="flex gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>Suite 1204, Ocean Tower,<br />Clifton Block 9, Karachi 75600</span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href="tel:+922135870000" className="hover:text-white">+92 21 3587 0000</a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href="mailto:hello@nexora.pk" className="hover:text-white">hello@nexora.pk</a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>Mon–Sat, 9:00 – 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
              Better technology, a brighter tomorrow. © {new Date().getFullYear()} Nexora Technologies. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
              <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
              <Link to="/return-policy" className="hover:text-white">Returns</Link>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <div className="flex items-center gap-1.5">
                {PAYMENT_METHODS.map((p) => (
                  <span key={p} className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/60">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
