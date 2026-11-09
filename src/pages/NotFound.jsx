import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  usePageMeta('Page not found', 'That page could not be found at Nexora.')
  return (
    <div className="container-x flex flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[64px] font-extrabold leading-none tracking-tight text-brand-600">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">This page took a different route</h1>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
        The link may be outdated. Try the shop, or use the search above to find what you were looking for.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">Back to home</Link>
        <Link to="/shop" className="btn btn-outline">
          Browse products <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
