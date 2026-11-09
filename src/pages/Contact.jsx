import { useState } from 'react'
import { api } from '../lib/api.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import Icon from '../components/Icon.jsx'
import { PageHeader, Spinner } from '../components/Ui.jsx'

const CHANNELS = [
  { icon: 'phone', title: 'Call us', lines: ['+92 21 3587 0000', 'Mon–Sat, 9:00 – 21:00'] },
  { icon: 'mail', title: 'Email', lines: ['hello@nexora.pk', 'Replies within 4 working hours'] },
  { icon: 'pin', title: 'Visit', lines: ['Suite 1204, Ocean Tower', 'Clifton Block 9, Karachi'] },
  { icon: 'support', title: 'Live chat', lines: ['Available in-app', '09:00 – 21:00, seven days'] },
]

export default function Contact() {
  usePageMeta('Contact us', 'Contact the Nexora team about orders, warranty, business pricing or product advice.')
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' })
  const [state, setState] = useState({ loading: false, success: false, error: '' })

  const submit = async (event) => {
    event.preventDefault()
    setState({ loading: true, success: false, error: '' })
    try {
      await api.contact(form)
      setState({ loading: false, success: true, error: '' })
      setForm({ name: '', email: '', subject: 'General enquiry', message: '' })
    } catch (err) {
      setState({ loading: false, success: false, error: err.message })
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Contact us"
        text="Product advice, order questions or business pricing — a specialist, not a bot, will reply."
        crumbs={[{ label: 'Contact us' }]}
      />

      <div className="container-x py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={submit} className="card p-5 sm:p-6" noValidate>
              <h2 className="font-display text-base font-bold text-ink">Send us a message</h2>
              <p className="mt-1 text-[12.5px] text-muted">We reply to every message within one working day.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="contact-name">Your name</label>
                  <input id="contact-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" required />
                </div>
                <div>
                  <label className="label" htmlFor="contact-email">Email address</label>
                  <input id="contact-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input">
                    {['General enquiry', 'Order status', 'Warranty claim', 'Business pricing', 'Returns', 'Product advice'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="input resize-none"
                    placeholder="Include your order number if your message is about an existing order."
                    required
                  />
                </div>
              </div>

              {state.error && <p role="alert" className="mt-3 rounded-lg bg-discount/10 px-3 py-2 text-[12px] font-medium text-discount">{state.error}</p>}
              {state.success && (
                <p role="status" className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                  Thanks — your message is with our support team. We'll reply within one working day.
                </p>
              )}

              <button type="submit" disabled={state.loading} className="btn btn-primary mt-4">
                {state.loading ? <Spinner className="h-4 w-4" /> : <Icon name="mail" className="h-4 w-4" />}
                {state.loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>

          <div className="space-y-3 lg:col-span-5">
            {CHANNELS.map((channel) => (
              <div key={channel.title} className="card flex items-start gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon name={channel.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">{channel.title}</p>
                  {channel.lines.map((line) => <p key={line} className="text-[12px] text-muted">{line}</p>)}
                </div>
              </div>
            ))}
            <div className="rounded-xl2 border border-brand-100 bg-brand-50/60 p-4">
              <p className="text-[12.5px] font-semibold text-brand-900">Business &amp; education enquiries</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-900/70">
                Ask for volume pricing, 30-day invoicing and pre-configured imaging. Dedicated account managers
                for orders above 10 units.
              </p>
              <a href="mailto:business@nexora.pk" className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                business@nexora.pk <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
