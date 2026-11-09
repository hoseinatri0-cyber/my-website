const CURRENCIES = {
  USD: { symbol: '$', rate: 1, locale: 'en-US', decimals: 0 },
  PKR: { symbol: 'PKR ', rate: 278, locale: 'en-PK', decimals: 0 },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE', decimals: 0 },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB', decimals: 0 },
}

let active = localStorage.getItem('nexora.currency') || 'USD'
if (!CURRENCIES[active]) active = 'USD'

export function getCurrency() {
  return active
}

export function setCurrency(code) {
  if (CURRENCIES[code]) {
    active = code
    localStorage.setItem('nexora.currency', code)
  }
}

export function currencyOptions() {
  return Object.keys(CURRENCIES)
}

export function money(value, options = {}) {
  const conf = CURRENCIES[active] || CURRENCIES.USD
  const amount = Math.round(Number(value || 0) * conf.rate * 100) / 100
  const formatted = new Intl.NumberFormat(conf.locale, {
    minimumFractionDigits: options.decimals ?? 0,
    maximumFractionDigits: options.decimals ?? 0,
  }).format(amount)
  return `${conf.symbol}${formatted}`
}

export function dateLabel(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function dateTimeLabel(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function classNames(...items) {
  return items.filter(Boolean).join(' ')
}

export const ORDER_STAGES = ['Processing', 'Packed', 'Shipped', 'Delivered']
