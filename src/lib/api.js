const request = async (path, options = {}) => {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.')
    error.status = res.status
    throw error
  }
  return data
}

export const api = {
  categories: () => request('/categories'),
  brands: () => request('/brands'),
  products: (params = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== false) qs.set(k, v)
    })
    return request(`/products?${qs.toString()}`)
  },
  product: (slug) => request(`/products/${slug}`),
  reviews: (slug) => request(`/products/${slug}/reviews`),
  addReview: (slug, payload) => request(`/products/${slug}/reviews`, { method: 'POST', body: JSON.stringify(payload) }),

  me: () => request('/auth/me'),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  updateProfile: (payload) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(payload) }),

  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  myOrders: () => request('/orders/mine'),
  order: (number) => request(`/orders/${number}`),
  trackOrder: (number, email) => request(`/orders/track?number=${encodeURIComponent(number)}&email=${encodeURIComponent(email)}`),

  newsletter: (email) => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
  contact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  validateCoupon: (code) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code }) }),

  adminStats: () => request('/admin/stats'),
  adminOrders: (status) => request(`/admin/orders${status && status !== 'all' ? `?status=${status}` : ''}`),
  adminUpdateOrder: (id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  adminCustomers: () => request('/admin/customers'),
  adminNewsletter: () => request('/admin/newsletter'),
  adminMessages: () => request('/admin/messages'),
  adminCreateProduct: (payload) => request('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
  adminUpdateProduct: (id, payload) => request(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  adminDeleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
}
