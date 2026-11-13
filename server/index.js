// Backend mínimo: login con Steam (OpenID 2.0) + sesión en cookie firmada.
// Variables de entorno (archivo .env o sistema):
//   API_PORT        puerto de la API (por defecto 3001)
//   PUBLIC_URL      URL pública de la web (por defecto http://localhost:5173)
//   SESSION_SECRET  cadena larga y aleatoria para firmar cookies
//   STEAM_API_KEY   opcional, para mostrar nombre y avatar (https://steamcommunity.com/dev/apikey)
import express from 'express'
import cookieParser from 'cookie-parser'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// --prod (npm start): sirve también la web compilada en dist/ y usa el PORT del hosting
const PROD = process.argv.includes('--prod')
const PORT = PROD ? (process.env.PORT || 3000) : (process.env.API_PORT || 3001)
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:5173'
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')
const STEAM_API_KEY = process.env.STEAM_API_KEY || ''
const OPENID = 'https://steamcommunity.com/openid/login'

const app = express()
app.use(cookieParser(SECRET))

app.get('/auth/steam', (req, res) => {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${PUBLIC_URL}/auth/steam/return`,
    'openid.realm': PUBLIC_URL,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  })
  res.redirect(`${OPENID}?${params}`)
})

app.get('/auth/steam/return', async (req, res) => {
  try {
    const q = req.query
    if (q['openid.return_to'] !== `${PUBLIC_URL}/auth/steam/return`) throw new Error('bad return_to')
    // Verificar la firma directamente con Steam
    const body = new URLSearchParams({ ...q, 'openid.mode': 'check_authentication' })
    const r = await fetch(OPENID, { method: 'POST', body })
    const text = await r.text()
    if (!/is_valid\s*:\s*true/.test(text)) throw new Error('invalid')
    const m = String(q['openid.claimed_id']).match(/^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/)
    if (!m) throw new Error('bad id')
    res.cookie('steamid', m[1], { signed: true, httpOnly: true, sameSite: 'lax', secure: PUBLIC_URL.startsWith('https'), maxAge: 30 * 864e5 })
    res.redirect('/')
  } catch {
    res.redirect('/?login=error')
  }
})

app.get('/api/me', async (req, res) => {
  const steamid = req.signedCookies.steamid
  if (!steamid) return res.json({ user: null })
  let user = { steamid, name: `Steam ${steamid.slice(-5)}`, avatar: '' }
  if (STEAM_API_KEY) {
    try {
      const r = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamid}`)
      const p = (await r.json()).response.players[0]
      if (p) user = { steamid, name: p.personaname, avatar: p.avatarmedium }
    } catch {}
  }
  res.json({ user })
})

app.post('/auth/logout', (req, res) => { res.clearCookie('steamid'); res.json({ ok: true }) })

if (PROD) {
  const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
  app.use(express.static(dist))
  app.get(/^(?!\/(api|auth)\/).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.set('trust proxy', 1)
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}${PROD ? ' (producción)' : ''}`))
