import { usePageMeta } from '../hooks/usePageMeta.js'
import { PageHeader } from '../components/Ui.jsx'

const POLICIES = {
  'privacy-policy': {
    eyebrow: 'Legal',
    title: 'Privacy policy',
    text: 'How Nexora collects, uses and protects your personal information.',
    updated: 'January 2026',
    sections: [
      { h: 'Information we collect', p: 'We collect the details you provide at checkout and when creating an account: name, email address, phone number and shipping address. Order contents and totals are stored so we can fulfil orders and support warranty claims. Payment card details are never collected or stored by this demonstration storefront.' },
      { h: 'How we use your information', p: 'Your data is used to process orders, provide delivery updates, handle returns and warranty claims, and — only with your consent — send marketing emails. You can unsubscribe from any marketing email at any time.' },
      { h: 'Cookies and sessions', p: 'We use a first-party session cookie to keep you signed in and to protect forms against cross-site requests. Cart, wishlist and comparison selections are stored in your browser so they survive a refresh. No third-party advertising trackers are used.' },
      { h: 'Data sharing', p: 'We share only the minimum information required with our delivery partners and, where you have chosen a card payment, a payment processor. We do not sell personal data.' },
      { h: 'Your rights', p: 'You may request a copy of your data, correct it, or ask us to delete your account by writing to privacy@nexora.pk. Deletion requests are actioned within 30 days, except records we must retain for tax and warranty purposes.' },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms & conditions',
    text: 'The terms that apply when you shop with Nexora.',
    updated: 'January 2026',
    sections: [
      { h: 'Using this store', p: 'By placing an order you confirm that you are at least 18 years old and that the information you provide is accurate. Orders are only accepted once confirmed by email.' },
      { h: 'Pricing and availability', p: 'Prices are shown in your selected currency, converted from USD at a displayed reference rate, and include applicable taxes. We reserve the right to correct pricing errors before dispatch; you will always be contacted first.' },
      { h: 'Demonstration checkout', p: 'This storefront is a demonstration. Placing an order records a demo transaction in our database and does not capture payment, reserve stock permanently or create a binding contract.' },
      { h: 'Accounts', p: 'You are responsible for keeping your account credentials secure. Accounts may be suspended where fraudulent or abusive activity is detected.' },
      { h: 'Limitation of liability', p: 'Where permitted by law, our liability for any claim relating to a product is limited to the amount you paid for that product.' },
    ],
  },
  'shipping-policy': {
    eyebrow: 'Support',
    title: 'Shipping & delivery',
    text: 'Dispatch times, delivery windows and tracking for every order.',
    updated: 'January 2026',
    sections: [
      { h: 'Dispatch', p: 'Orders confirmed before 4pm on a working day are dispatched the same day. Orders placed after 4pm, at weekends or on public holidays are dispatched on the next working day.' },
      { h: 'Delivery times and cost', p: 'Metro deliveries arrive within 1–3 working days; other cities within 3–5 working days. Delivery is free on orders above $499. Below that threshold a flat $15 fee applies. Business orders on 30-day invoicing are subject to the same schedule.' },
      { h: 'Tracking', p: 'A tracking number is emailed as soon as the parcel is packed. You can also check live status on the Track Order page using your order number and the email address used at checkout.' },
      { h: 'Failed deliveries', p: 'Couriers attempt delivery twice. If both attempts fail, the parcel returns to our warehouse and we contact you to arrange redelivery; a redelivery fee may apply for repeated failures.' },
    ],
  },
  'return-policy': {
    eyebrow: 'Support',
    title: 'Returns & refunds',
    text: 'Our 30-day return policy and how warranty claims work.',
    updated: 'January 2026',
    sections: [
      { h: 'Change of mind', p: 'Unopened products can be returned within 30 days of delivery for a full refund to the original payment method. The retail seal must be intact.' },
      { h: 'Opened products', p: 'Opened products can be returned within 7 days provided they are in as-new condition with all accessories and packaging. A 10% restocking fee may apply for opened laptops that show signs of use.' },
      { h: 'Faulty products', p: 'Products that fail within the warranty period are covered by our in-house service desk. We diagnose, repair or replace at our discretion, with loaner units available for business customers.' },
      { h: 'How to start a return', p: 'Contact support with your order number and the reason for the return. We issue a return authorisation and arrange a collection where available.' },
      { h: 'Refund timing', p: 'Refunds are processed within 3 working days of the returned item passing inspection. Bank posting times vary by provider.' },
    ],
  },
}

export default function Policy({ slug }) {
  const policy = POLICIES[slug]
  usePageMeta(policy?.title || 'Policy', policy?.text)

  if (!policy) {
    return <div className="container-x py-16"><p className="text-sm text-muted">Policy not found.</p></div>
  }

  return (
    <>
      <PageHeader
        eyebrow={policy.eyebrow}
        title={policy.title}
        text={policy.text}
        crumbs={[{ label: policy.title }]}
      />
      <div className="container-x grid gap-8 py-9 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <p className="text-[11.5px] uppercase tracking-[0.12em] text-muted">Last updated {policy.updated}</p>
          <div className="mt-5 space-y-6">
            {policy.sections.map((section) => (
              <section key={section.h}>
                <h2 className="font-display text-[17px] font-bold text-ink">{section.h}</h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/75">{section.p}</p>
              </section>
            ))}
          </div>
        </article>
        <aside className="lg:col-span-4">
          <div className="card sticky top-[132px] p-5">
            <h2 className="font-display text-sm font-bold text-ink">On this page</h2>
            <ul className="mt-2 space-y-1.5">
              {policy.sections.map((section) => (
                <li key={section.h} className="text-[12.5px] text-muted">{section.h}</li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted">
              Questions about this policy? Email legal@nexora.pk or contact our support desk.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
