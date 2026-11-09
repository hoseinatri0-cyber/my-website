import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the top on navigation. Keyed by the active currency so a currency
 * switch remounts the route tree (every price is formatted at render time).
 */
export default function ScrollRestoration({ currency, children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, currency])

  return children
}
