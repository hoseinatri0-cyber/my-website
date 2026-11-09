import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { Spinner } from '../components/Ui.jsx'
import { AuthShell, DemoAccounts } from './SignIn.jsx'

export default function SignUp() {
  usePageMeta('Create an account', 'Create a Nexora account for faster checkout, order history and saved wishlists.')
  const { register } = useAuth()
  const { toast } = useStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password })
      toast(`Account created — welcome, ${user.name.split(' ')[0]}`)
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes less than a minute and speeds up every future order."
      footer={<>Already have an account? <Link to="/signin" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-3.5" noValidate>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input"
            placeholder="Ayesha Khan"
            required
          />
        </div>
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
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="input"
              placeholder="8+ characters"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
              className="input"
              placeholder="Repeat password"
              required
            />
          </div>
        </div>
        {error && <p role="alert" className="rounded-lg bg-discount/10 px-3 py-2 text-[12px] font-medium text-discount">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading && <Spinner className="h-4 w-4" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
          <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Passwords are hashed with bcrypt. This demonstration store stores accounts in its own local database.
        </p>
      </form>
      <DemoAccounts />
    </AuthShell>
  )
}
