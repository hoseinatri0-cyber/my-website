import express from 'express'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import { db } from './db.js'
import { seed } from './seed.js'
import { attachUser, clearSession, requireAdmin, requireAuth, setSession } from './auth.js'

seed(db)

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(attachUser(db))

const PORT = Number(process.env.PORT || 5000)

const PRODUCT_SELECT = `
  SELECT p.*, b.name AS brand, b.slug AS brand_slug, c.name AS category, c.slug AS category_slug
  FROM products p
  LEFT JOIN brands b ON b.id = p.brand_id
  LEFT JOIN categories c ON c.id = p.category_id`

function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function shapeProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    brandSlug: row.brand_slug,
    category: row.category,
    categorySlug: row.category_slug,
    price: row.price,
    originalPrice: row.original_price,
    discount: row.original_price ? Math.round(((row.original_price - row.price) / row.original_price) * 100) : 0,
    rating: row.rating,
    reviewCount: row.review_count,
    specs: parseJson(row.specs, {}),
    images: parseJson(row.images, []),
    colors: parseJson(row.colors, []),
    description: row.description,
    stock: row.stock,
    badge: row.badge,
    featured: !!row.featured,
    bestSeller: !!row.best_seller,
    createdAt: row.created_at,
  }
}

function shapeOrder(order, items) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    customerName: order.customer_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    postalCode: order.postal_code,
    country: order.country,
    notes: order.notes,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.payment_method,
    coupon: order.coupon,
    createdAt: order.created_at,
    items: items || [],
  }
}

function loadOrder(where, value) {
  const order = db.prepare(`SELECT * FROM orders WHERE ${where} = ?`).get(value)
  if (!order) return null
  const items = db.prepare('SELECT name, price, qty, image FROM order_items WHERE order_id = ?').all(order.id)
  return shapeOrder(order, items)
}

const asyncRoute = (fn) => (req, res, next) => {
  try {
    fn(req, res, next)
  } catch (err) {
    next(err)
  }
}

/* ------------------------------------------------------------------ health */

app.get('/api/health', (_req, res) => {
  const row = db.prepare('SELECT COUNT(*) AS n FROM products').get()
  res.json({ ok: true, products: row.n })
})

/* ----------------------------------------------------------------- catalog */

app.get('/api/categories', (_req, res) => {
  const rows = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
    FROM categories c ORDER BY c.sort_order ASC`).all()
  res.json(rows.map((c) => ({
    id: c.id, name: c.name, slug: c.slug, subtitle: c.subtitle,
    image: c.image, group: c.grp, productCount: c.product_count,
  })))
})

app.get('/api/brands', (_req, res) => {
  const rows = db.prepare(`
    SELECT b.id, b.name, b.slug, (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id) AS product_count
    FROM brands b ORDER BY b.name ASC`).all()
  res.json(rows.map((b) => ({ id: b.id, name: b.name, slug: b.slug, productCount: b.product_count })))
})

app.get('/api/products', (req, res) => {
  const { q, category, brand, min, max, rating, sort, featured, bestseller } = req.query
  const where = []
  const params = []

  if (q) {
    where.push('(p.name LIKE ? OR b.name LIKE ? OR p.description LIKE ?)')
    const like = `%${q}%`
    params.push(like, like, like)
  }
  if (category) {
    where.push('(c.slug = ? OR c.grp = ?)')
    params.push(category, category)
  }
  if (brand) {
    const list = String(brand).split(',').filter(Boolean)
    if (list.length) {
      where.push(`b.slug IN (${list.map(() => '?').join(',')})`)
      params.push(...list)
    }
  }
  if (min) { where.push('p.price >= ?'); params.push(Number(min)) }
  if (max) { where.push('p.price <= ?'); params.push(Number(max)) }
  if (rating) { where.push('p.rating >= ?'); params.push(Number(rating)) }
  if (featured === '1') where.push('p.featured = 1')
  if (bestseller === '1') where.push('p.best_seller = 1')

  const orderBy = {
    featured: 'p.featured DESC, p.review_count DESC',
    best: 'p.best_seller DESC, p.review_count DESC',
    'price-asc': 'p.price ASC',
    'price-desc': 'p.price DESC',
    rating: 'p.rating DESC, p.review_count DESC',
    newest: 'p.created_at DESC',
  }[sort] || 'p.featured DESC, p.review_count DESC'

  const limit = Math.min(Number(req.query.limit) || 60, 100)
  const offset = Number(req.query.offset) || 0
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const total = db.prepare(`SELECT COUNT(*) AS n FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id ${clause}`).get(...params).n

  const rows = db.prepare(`${PRODUCT_SELECT} ${clause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`)
    .all(...params, limit, offset)

  res.json({ items: rows.map(shapeProduct), total, limit, offset })
})

app.get('/api/products/:slug', (req, res) => {
  const row = db.prepare(`${PRODUCT_SELECT} WHERE p.slug = ?`).get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Product not found.' })
  const product = shapeProduct(row)
  const related = db.prepare(`${PRODUCT_SELECT} WHERE p.category_id = ? AND p.id != ? ORDER BY p.rating DESC LIMIT 4`)
    .all(row.category_id, row.id).map(shapeProduct)
  res.json({ ...product, related })
})

app.get('/api/products/:slug/reviews', (req, res) => {
  const product = db.prepare('SELECT id FROM products WHERE slug = ?').get(req.params.slug)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  const rows = db.prepare('SELECT id, name, rating, title, body, verified, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC')
    .all(product.id)
  res.json(rows.map((r) => ({ ...r, verified: !!r.verified })))
})

app.post('/api/products/:slug/reviews', requireAuth, (req, res) => {
  const product = db.prepare('SELECT id, rating, review_count FROM products WHERE slug = ?').get(req.params.slug)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  const rating = Math.round(Number(req.body.rating))
  const body = String(req.body.body || '').trim()
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Please choose a rating between 1 and 5.' })
  if (body.length < 10) return res.status(400).json({ error: 'Please write at least 10 characters.' })

  db.prepare('INSERT INTO reviews (product_id, user_id, name, rating, title, body, verified) VALUES (?, ?, ?, ?, ?, ?, 1)')
    .run(product.id, req.user.id, req.user.name, rating, String(req.body.title || '').trim() || null, body)
  const agg = db.prepare('SELECT AVG(rating) AS avg, COUNT(*) AS n FROM reviews WHERE product_id = ?').get(product.id)
  db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?')
    .run(Math.round(agg.avg * 10) / 10, agg.n, product.id)
  res.status(201).json({ ok: true, rating: Math.round(agg.avg * 10) / 10, count: agg.n })
})

/* -------------------------------------------------------------------- auth */

app.post('/api/auth/register', asyncRoute((req, res) => {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your full name.' })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' })
  }
  const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name, email, bcrypt.hashSync(password, 10), 'customer')
  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(Number(info.lastInsertRowid))
  setSession(res, user)
  res.status(201).json({ user })
}))

app.post('/api/auth/login', asyncRoute((req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }
  setSession(res, row)
  res.json({ user: { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, created_at: row.created_at } })
}))

app.post('/api/auth/logout', (req, res) => {
  clearSession(res)
  res.json({ ok: true })
})

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.user || null })
})

app.patch('/api/auth/profile', requireAuth, (req, res) => {
  const name = String(req.body.name || req.user.name).trim()
  const phone = String(req.body.phone || '').trim() || null
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your full name.' })
  db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(name, phone, req.user.id)
  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user.id)
  res.json({ user })
})

/* ------------------------------------------------------------------ orders */

app.post('/api/orders', (req, res) => {
  const body = req.body || {}
  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) return res.status(400).json({ error: 'Your cart is empty.' })

  const customerName = String(body.customerName || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const address = String(body.address || '').trim()
  const city = String(body.city || '').trim()
  if (customerName.length < 2) return res.status(400).json({ error: 'Please enter your full name.' })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (address.length < 5) return res.status(400).json({ error: 'Please enter your shipping address.' })
  if (city.length < 2) return res.status(400).json({ error: 'Please enter your city.' })

  const resolved = []
  for (const item of items) {
    const product = db.prepare('SELECT id, name, price, images, stock FROM products WHERE id = ?').get(item.id)
    if (!product) return res.status(400).json({ error: 'One of the products in your cart is no longer available.' })
    const qty = Math.max(1, Math.min(Number(item.qty) || 1, 10))
    resolved.push({ id: product.id, name: product.name, price: product.price, qty, image: parseJson(product.images, [])[0] || null })
  }

  let discount = 0
  let couponCode = null
  if (body.coupon) {
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').get(String(body.coupon).toUpperCase())
    if (coupon) {
      couponCode = coupon.code
      discount = 0
      body.couponPercent = coupon.percent
    } else {
      return res.status(400).json({ error: 'That coupon code is not valid.' })
    }
  }

  const subtotal = Math.round(resolved.reduce((sum, i) => sum + i.price * i.qty, 0) * 100) / 100
  if (couponCode) discount = Math.round(subtotal * (Number(body.couponPercent) / 100) * 100) / 100
  const shipping = subtotal - discount >= 499 ? 0 : 15
  const total = Math.round((subtotal - discount + shipping) * 100) / 100

  const orderNumber = 'NX-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10)
  const info = db.prepare(`INSERT INTO orders
    (order_number, user_id, email, customer_name, phone, address, city, postal_code, country, notes, subtotal, shipping, discount, total, status, payment_method, coupon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing', ?, ?)`)
    .run(orderNumber, req.user?.id || null, email, customerName, String(body.phone || '').trim() || null, address,
      city, String(body.postalCode || '').trim() || null, String(body.country || '').trim() || 'Pakistan',
      String(body.notes || '').trim() || null, subtotal, shipping, discount, total,
      String(body.paymentMethod || 'Cash on Delivery (demo)'), couponCode)

  const orderId = Number(info.lastInsertRowid)
  const insItem = db.prepare('INSERT INTO order_items (order_id, product_id, name, price, qty, image) VALUES (?, ?, ?, ?, ?, ?)')
  for (const item of resolved) {
    insItem.run(orderId, item.id, item.name, item.price, item.qty, item.image)
    db.prepare('UPDATE products SET stock = MAX(stock - ?, 0) WHERE id = ?').run(item.qty, item.id)
  }

  res.status(201).json(loadOrder('id', orderId))
})

app.get('/api/orders/mine', requireAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY created_at DESC')
    .all(req.user.id, req.user.email)
  const itemsStmt = db.prepare('SELECT name, price, qty, image FROM order_items WHERE order_id = ?')
  res.json(orders.map((o) => shapeOrder(o, itemsStmt.all(o.id))))
})

app.get('/api/orders/track', (req, res) => {
  const number = String(req.query.number || '').trim().toUpperCase()
  const email = String(req.query.email || '').trim().toLowerCase()
  if (!number || !email) return res.status(400).json({ error: 'Order number and email are required.' })
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ? AND email = ?').get(number, email)
  if (!order) return res.status(404).json({ error: 'No order matches that number and email.' })
  res.json(loadOrder('id', order.id))
})

app.get('/api/orders/:number', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.number.toUpperCase())
  if (!order) return res.status(404).json({ error: 'Order not found.' })
  const isOwner = req.user && (req.user.id === order.user_id || req.user.email === order.email)
  const isAdmin = req.user?.role === 'admin'
  if (!isOwner && !isAdmin) return res.status(403).json({ error: 'You do not have access to this order.' })
  res.json(loadOrder('id', order.id))
})

/* --------------------------------------------------------------- marketing */

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (db.prepare('SELECT id FROM newsletter WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'You are already subscribed to the Nexora newsletter.' })
  }
  db.prepare('INSERT INTO newsletter (email) VALUES (?)').run(email)
  res.status(201).json({ ok: true })
})

app.post('/api/contact', (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const message = String(req.body.message || '').trim()
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' })
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (message.length < 10) return res.status(400).json({ error: 'Please tell us a little more (at least 10 characters).' })
  db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
    .run(name, email, String(req.body.subject || 'General enquiry').trim(), message)
  res.status(201).json({ ok: true })
})

app.post('/api/coupons/validate', (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase()
  const coupon = db.prepare('SELECT code, percent FROM coupons WHERE code = ? AND active = 1').get(code)
  if (!coupon) return res.status(404).json({ error: 'That coupon code is not valid.' })
  res.json(coupon)
})

/* ------------------------------------------------------------------- admin */

app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) AS v FROM orders WHERE status != 'Cancelled'").get().v
  const orders = db.prepare('SELECT COUNT(*) AS n FROM orders').get().n
  const customers = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'customer'").get().n
  const subscribers = db.prepare('SELECT COUNT(*) AS n FROM newsletter').get().n
  const lowStock = db.prepare('SELECT id, name, stock FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 5').all()
  const recent = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all()
    .map((o) => shapeOrder(o, db.prepare('SELECT name, price, qty, image FROM order_items WHERE order_id = ?').all(o.id)))
  const top = db.prepare(`SELECT oi.name, SUM(oi.qty) AS units, SUM(oi.qty * oi.price) AS revenue
    FROM order_items oi GROUP BY oi.name ORDER BY units DESC LIMIT 5`).all()
  const statuses = db.prepare('SELECT status, COUNT(*) AS n FROM orders GROUP BY status').all()
  res.json({
    revenue: Math.round(revenue * 100) / 100,
    orders,
    customers,
    subscribers,
    products: db.prepare('SELECT COUNT(*) AS n FROM products').get().n,
    averageOrder: orders ? Math.round((revenue / orders) * 100) / 100 : 0,
    lowStock, recentOrders: recent, topProducts: top, statuses,
  })
})

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const status = req.query.status
  const rows = status && status !== 'all'
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  const itemsStmt = db.prepare('SELECT name, price, qty, image FROM order_items WHERE order_id = ?')
  res.json(rows.map((o) => shapeOrder(o, itemsStmt.all(o.id))))
})

app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const allowed = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
  const status = String(req.body.status || '')
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Unknown order status.' })
  const info = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, Number(req.params.id))
  if (!info.changes) return res.status(404).json({ error: 'Order not found.' })
  res.json({ ok: true, status })
})

app.get('/api/admin/customers', requireAdmin, (_req, res) => {
  const rows = db.prepare(`SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
      (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id OR o.email = u.email) AS order_count,
      (SELECT COALESCE(SUM(total), 0) FROM orders o WHERE o.user_id = u.id OR o.email = u.email) AS spend
    FROM users u ORDER BY u.created_at DESC`).all()
  res.json(rows)
})

app.get('/api/admin/newsletter', requireAdmin, (_req, res) => {
  res.json(db.prepare('SELECT * FROM newsletter ORDER BY created_at DESC').all())
})

app.get('/api/admin/messages', requireAdmin, (_req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all())
})

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const b = req.body || {}
  const name = String(b.name || '').trim()
  if (name.length < 2) return res.status(400).json({ error: 'Product name is required.' })
  const slug = String(b.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  if (db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
    return res.status(409).json({ error: 'A product with that slug already exists.' })
  }
  const brand = db.prepare('SELECT id FROM brands WHERE name = ?').get(String(b.brand || ''))
  const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(String(b.categorySlug || ''))
  if (!category) return res.status(400).json({ error: 'Please choose a category.' })
  const price = Number(b.price)
  if (!price || price <= 0) return res.status(400).json({ error: 'Please enter a valid price.' })

  const info = db.prepare(`INSERT INTO products
    (slug, name, brand_id, category_id, price, original_price, rating, review_count, specs, images, colors, description, stock, badge, featured, best_seller)
    VALUES (?, ?, ?, ?, ?, ?, 4.5, 0, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(slug, name, brand?.id || null, category.id, price, Number(b.originalPrice) || price,
      JSON.stringify(b.specs || {}), JSON.stringify(b.images?.length ? b.images : ['/images/laptop-01.jpg']),
      JSON.stringify(b.colors || []), String(b.description || ''), Number(b.stock) || 20,
      b.badge || null, b.featured ? 1 : 0, b.bestSeller ? 1 : 0)
  const row = db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(Number(info.lastInsertRowid))
  res.status(201).json(shapeProduct(row))
})

app.patch('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'Product not found.' })
  const b = req.body || {}
  const fields = []
  const params = []
  const push = (column, value) => { fields.push(`${column} = ?`); params.push(value) }

  if (b.name !== undefined) push('name', String(b.name).trim())
  if (b.price !== undefined) push('price', Number(b.price))
  if (b.originalPrice !== undefined) push('original_price', Number(b.originalPrice))
  if (b.stock !== undefined) push('stock', Number(b.stock))
  if (b.badge !== undefined) push('badge', b.badge || null)
  if (b.description !== undefined) push('description', String(b.description))
  if (b.featured !== undefined) push('featured', b.featured ? 1 : 0)
  if (b.bestSeller !== undefined) push('best_seller', b.bestSeller ? 1 : 0)
  if (b.categorySlug !== undefined) {
    const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(String(b.categorySlug))
    if (!category) return res.status(400).json({ error: 'Unknown category.' })
    push('category_id', category.id)
  }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update.' })
  params.push(id)
  db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...params)
  res.json(shapeProduct(db.prepare(`${PRODUCT_SELECT} WHERE p.id = ?`).get(id)))
})

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(Number(req.params.id))
  if (!info.changes) return res.status(404).json({ error: 'Product not found.' })
  res.json({ ok: true })
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))

app.use((err, _req, res, _next) => {
  console.error('[api]', err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexora API listening on 0.0.0.0:${PORT}`)
})
