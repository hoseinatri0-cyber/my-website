import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { Spinner } from '../components/Ui.jsx'
import { useStore } from '../context/StoreContext.jsx'

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-xl2 bg-navy-900 p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-[70px]" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow text-brand-400">Nexora account</p>
            <h2 className="mt-2 max-w-sm font-display text-[28px] font-extrabold leading-tight tracking-tight text-white">
              Faster checkout, saved wishlists and live order tracking.
            </h2>
            <ul className="mt-6 space-y-3">
              {[
                'One-click reorder from your history',
                'Wishlist and comparison saved to your account',
                'Warranty and invoice documents in one place',
                'Early access to member-only pricing',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/70">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" strokeWidth={2.4} />
                  {item}
                </li>
              ))}
            </ul>
            <img src="/images/laptop-02.jpg" alt="" className="mt-7 h-40 w-full rounded-lg object-cover opacity-80" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="card p-6 sm:p-7">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-[13px] text-muted">{subtitle}</p>
          <div className="mt-5">{children}</div>
        </div>
        <div className="mt-4 text-center text-[13px] text-muted">{footer}</div>
      </div>
    </div>
  )
}

export function DemoAccounts() {
  return (
    <div className="mt-5 rounded-lg border border-dashed border-line bg-surface/70 p-3">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Demo accounts</p>
      <ul className="mt-1.5 space-y-1 text-[11.5px] text-ink/70">
        <li><span className="font-semibold text-ink">Customer:</span> demo@nexora.pk / Demo@1234</li>
        <li><span className="font-semibold text-ink">Administrator:</span> admin@nexora.pk / Admin@1234</li>
      </ul>
    </div>
  )
}

export default function SignIn() {
  usePageMeta('Sign in', 'Sign in to your Nexora account to track orders and manage your wishlist.')
  const { login } = useAuth()
  const { toast } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      toast(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={<>New to Nexora? <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-3.5" noValidate>
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p role="alert" className="rounded-lg bg-discount/10 px-3 py-2 text-[12px] font-medium text-discount">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading && <Spinner className="h-4 w-4" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <DemoAccounts />
    </AuthShell>
  )
}
