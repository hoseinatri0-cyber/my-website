import { useState } from 'react'
import { api } from '../lib/api.js'
import Icon from './Icon.jsx'
import { Spinner } from './Ui.jsx'

export default function Newsletter({ tone = 'dark' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setState('loading')
    try {
      await api.newsletter(email.trim())
      setState('success')
      setMessage('You are subscribed. Look out for our next drop.')
      setEmail('')
    } catch (err) {
      setState('error')
      setError(err.message)
    }
  }

  const dark = tone === 'dark'

  return (
    <div className={dark ? 'bg-navy-900' : ''}>
      <div className="container-x py-10 sm:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-2 text-brand-400">Newsletter</p>
            <h2 className={`font-display text-2xl font-extrabold tracking-tight sm:text-[28px] ${dark ? 'text-white' : 'text-ink'}`}>
              Stay ahead of technology.
            </h2>
            <p className={`mt-2 max-w-lg text-sm leading-relaxed ${dark ? 'text-white/60' : 'text-muted'}`}>
              Subscribe to receive exclusive offers, new arrivals, product updates and special promotions.
            </p>
          </div>
          <div className="lg:col-span-7">
            <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Icon name="mail" className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? 'text-white/40' : 'text-muted'}`} />
                <label htmlFor={`newsletter-${tone}`} className="sr-only">Email address</label>
                <input
                  id={`newsletter-${tone}`}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setState('idle'); setError('') }}
                  placeholder="Enter your email address"
                  className={`h-12 w-full rounded-lg border pl-10 pr-3 text-sm transition-colors focus:outline-none focus:ring-4 ${
                    dark
                      ? 'border-white/15 bg-white/[0.06] text-white placeholder:text-white/40 focus:border-brand-400 focus:ring-brand-500/20'
                      : 'border-line bg-white text-ink placeholder:text-muted/70 focus:border-brand-400 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              <button type="submit" disabled={state === 'loading'} className="btn btn-primary h-12 shrink-0 px-6">
                {state === 'loading' ? <Spinner className="h-4 w-4" /> : <Icon name="arrowRight" className="h-4 w-4" />}
                Subscribe
              </button>
            </form>
            <div aria-live="polite" className="mt-2 min-h-[18px]">
              {error && <p className={`text-xs font-medium ${dark ? 'text-rose-300' : 'text-discount'}`}>{error}</p>}
              {state === 'success' && (
                <p className={`flex items-center gap-1.5 text-xs font-medium ${dark ? 'text-emerald-300' : 'text-success'}`}>
                  <Icon name="check" className="h-3.5 w-3.5" />
                  {message}
                </p>
              )}
              {!error && state !== 'success' && (
                <p className={`text-[11px] ${dark ? 'text-white/35' : 'text-muted'}`}>
                  No spam. Unsubscribe at any time.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
