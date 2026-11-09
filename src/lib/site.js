export const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Laptops',
    to: '/category/ultrabooks',
    mega: {
      columns: [
        {
          title: 'By Type',
          links: [
            { label: 'Ultrabooks', to: '/category/ultrabooks' },
            { label: 'Gaming Laptops', to: '/category/gaming-laptops' },
            { label: 'Business Laptops', to: '/category/business-laptops' },
            { label: '2-in-1 Laptops', to: '/category/2-in-1-laptops' },
            { label: 'Student Laptops', to: '/category/student-laptops' },
            { label: 'Workstations', to: '/category/workstations' },
          ],
        },
        {
          title: 'Top Brands',
          links: [
            { label: 'Apple', to: '/shop?brand=apple' },
            { label: 'Dell', to: '/shop?brand=dell' },
            { label: 'HP', to: '/shop?brand=hp' },
            { label: 'Lenovo', to: '/shop?brand=lenovo' },
            { label: 'ASUS', to: '/shop?brand=asus' },
            { label: 'Acer', to: '/shop?brand=acer' },
          ],
        },
        {
          title: 'Shop by Budget',
          links: [
            { label: 'Under $600', to: '/shop?max=600' },
            { label: '$600 – $1,000', to: '/shop?min=600&max=1000' },
            { label: '$1,000 – $1,600', to: '/shop?min=1000&max=1600' },
            { label: '$1,600 and above', to: '/shop?min=1600' },
            { label: 'All laptops', to: '/shop' },
          ],
        },
      ],
      promo: {
        title: 'MacBook Air M3',
        body: '18-hour battery, fanless silence — now $200 off.',
        to: '/product/apple-macbook-air-m3',
        image: '/images/laptop-02.jpg',
      },
    },
  },
  { label: 'Desktops', to: '/category/desktop-computers' },
  { label: 'Monitors', to: '/category/monitors' },
  { label: 'Accessories', to: '/category/laptop-accessories' },
  {
    label: 'Gaming',
    to: '/category/gaming-laptops',
    mega: {
      columns: [
        {
          title: 'Gaming',
          links: [
            { label: 'Gaming Laptops', to: '/category/gaming-laptops' },
            { label: 'Gaming Desktops', to: '/category/desktop-computers' },
            { label: 'Gaming Monitors', to: '/category/monitors' },
            { label: 'Gaming Accessories', to: '/category/gaming-accessories' },
          ],
        },
        {
          title: 'By Brand',
          links: [
            { label: 'ASUS ROG', to: '/shop?brand=asus' },
            { label: 'Razer', to: '/shop?brand=razer' },
            { label: 'MSI', to: '/shop?brand=msi' },
            { label: 'Acer Nitro', to: '/shop?brand=acer' },
          ],
        },
      ],
      promo: {
        title: 'Built for high refresh',
        body: 'Up to 240Hz panels with RTX graphics.',
        to: '/category/gaming-laptops',
        image: '/images/gaming-01.jpg',
      },
    },
  },
  { label: 'Business', to: '/category/business-laptops' },
  { label: 'Student Deals', to: '/shop?category=student-laptops&sort=price-asc' },
  { label: 'Brands', to: '/shop' },
  { label: 'Support', to: '/faq' },
]

export const TRUST_ITEMS = [
  { icon: 'shield', title: 'Authentic Products', text: 'Sealed stock, official warranty' },
  { icon: 'truck', title: 'Free Shipping', text: 'On orders over $499' },
  { icon: 'returns', title: 'Easy Returns', text: '30-day no-questions returns' },
  { icon: 'lock', title: 'Secure Payments', text: 'Encrypted checkout' },
]

export const BENEFITS = [
  { icon: 'truck', title: 'Free Express Shipping', text: 'Complimentary delivery on every order above $499, across all major cities.' },
  { icon: 'returns', title: '30-Day Returns', text: 'Changed your mind? Return unopened items within 30 days for a full refund.' },
  { icon: 'shield', title: 'Genuine Products', text: 'Every unit is sourced through authorised distribution with a valid warranty.' },
  { icon: 'lock', title: 'Secure Payments', text: 'Card data never touches our servers — checkout runs over encrypted transport.' },
  { icon: 'support', title: 'Dedicated Support', text: 'Real specialists on chat and phone, seven days a week, 9am to 9pm.' },
  { icon: 'award', title: 'Official Warranty', text: 'Manufacturer-backed warranty handled in-house, not outsourced.' },
]

export const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    role: 'Product designer · Karachi',
    rating: 5,
    quote: 'I ordered the MacBook Air on a Tuesday and had it by Thursday. The packaging was flawless and the invoice included the warranty card. This is how online tech retail should feel.',
  },
  {
    name: 'Daniel Mercer',
    role: 'Software engineer · Berlin',
    rating: 5,
    quote: 'The comparison tool actually helped — I narrowed four laptops down to the Zephyrus in about ten minutes. Delivery tracking was accurate to the hour.',
  },
  {
    name: 'Sofia Alvarez',
    role: 'Architecture student · Madrid',
    rating: 4,
    quote: 'Bought a Yoga 7i with the student discount plus a hub. Support answered my warranty question in under five minutes on chat. Will buy my next machine here.',
  },
]

export const FAQS = [
  {
    q: 'Are all products genuine and covered by warranty?',
    a: 'Yes. Every product is sourced through authorised distribution and ships sealed with a manufacturer warranty card. Warranty claims are handled in-house by our service desk, so you never deal with a third party.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Metro deliveries arrive in 1–3 business days. Other cities take 3–5 business days. Orders above $499 ship free; below that a flat $15 delivery fee applies. You receive a tracking number as soon as the parcel is packed.',
  },
  {
    q: 'Can I return a laptop if it is not what I expected?',
    a: 'Unopened products can be returned within 30 days for a full refund. Opened products are accepted within 7 days if they are in as-new condition with all accessories. Faulty units are covered by the manufacturer warranty.',
  },
  {
    q: 'Do you offer instalments or business invoicing?',
    a: 'Yes. Business customers can request 30-day invoicing at checkout by entering a company name and tax number. Consumer instalment plans are available on selected banks at the payment step.',
  },
  {
    q: 'How do I track my order?',
    a: 'Use the Track Order page with your order number and the email address used at checkout. You can also see live status inside My Account → Order History.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Card details are never stored on our servers. This demonstration storefront does not process real payments — orders are recorded as demo transactions and no money is captured.',
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Laptops', to: '/category/ultrabooks' },
      { label: 'Gaming Laptops', to: '/category/gaming-laptops' },
      { label: 'Desktops', to: '/category/desktop-computers' },
      { label: 'Monitors', to: '/category/monitors' },
      { label: 'Accessories', to: '/category/laptop-accessories' },
    ],
  },
  {
    title: 'Customer Support',
    links: [
      { label: 'Track Order', to: '/track-order' },
      { label: 'Shipping & Delivery', to: '/shipping-policy' },
      { label: 'Returns & Refunds', to: '/return-policy' },
      { label: 'Warranty', to: '/faq' },
      { label: 'FAQs', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Nexora', to: '/about' },
      { label: 'Brands', to: '/shop' },
      { label: 'Deals', to: '/shop?sort=price-asc' },
      { label: 'My Account', to: '/account' },
      { label: 'Order History', to: '/account/orders' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
]

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay']

export const BRAND_VALUES = [
  { title: 'Curated, not crowded', text: 'We stock a focused catalogue of machines we would buy ourselves — no filler SKUs.' },
  { title: 'Advice from specialists', text: 'Every support agent is trained on the hardware they sell, not reading from a script.' },
  { title: 'Warranty without friction', text: 'Claims are processed in-house, with loaner units available for business customers.' },
]
