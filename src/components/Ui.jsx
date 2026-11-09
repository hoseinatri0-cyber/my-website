import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export function SectionHeading({ eyebrow, title, action, actionLabel, className = '' }) {
  return (
    <div className={`mb-6 flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
      </div>
      {action && (
        <Link to={action} className="link-arrow">
          {actionLabel || 'View all'}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function EmptyState({ icon = 'bag', title, text, action, actionLabel }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {text && <p className="mt-1.5 max-w-md text-sm text-muted">{text}</p>}
      {action && (
        <Link to={action} className="btn btn-primary mt-6">
          {actionLabel || 'Continue shopping'}
        </Link>
      )}
    </div>
  )
}

export function PageHeader({ eyebrow, title, text, crumbs = [] }) {
  return (
    <div className="border-b border-line bg-surface/70">
      <div className="container-x py-8 sm:py-10">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-brand-700">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <Icon name="chevronRight" className="h-3 w-3" />
                  {c.to ? <Link to={c.to} className="hover:text-brand-700">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{text}</p>}
      </div>
    </div>
  )
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="presentation"
    />
  )
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton h-40 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
