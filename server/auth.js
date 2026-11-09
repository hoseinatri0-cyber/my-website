import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'nexora-development-secret-change-me'
export const COOKIE_NAME = 'nexora_session'

export function signToken(user) {
  return jwt.sign({ uid: user.id, role: user.role }, SECRET, { expiresIn: '7d' })
}

export function setSession(res, user) {
  res.cookie(COOKIE_NAME, signToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 3600 * 1000,
    path: '/',
  })
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}

export function attachUser(db) {
  return (req, _res, next) => {
    const token = req.cookies?.[COOKIE_NAME]
    req.user = null
    if (token) {
      try {
        const payload = jwt.verify(token, SECRET)
        const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(payload.uid)
        if (user) req.user = user
      } catch {
        /* expired or tampered token: treat as anonymous */
      }
    }
    next()
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' })
  next()
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' })
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' })
  next()
}
