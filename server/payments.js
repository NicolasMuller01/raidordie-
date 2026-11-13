// Pagos con Stripe Checkout + entrega de puntos en ArkShop por RCON.
// Variables de entorno:
//   STRIPE_SECRET_KEY      sk_test_... / sk_live_...
//   STRIPE_WEBHOOK_SECRET  whsec_... (del endpoint /api/stripe/webhook en Stripe)
//   RCON_HOST, RCON_PORT, RCON_PASSWORD   servidor ARK con ArkShop
//   RCON_POINTS_CMD        por defecto "AddPoints {steamid} {points}"
import express from 'express'
import Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'
import { PACKS, CURRENCY } from '../shared/packs.js'
import { rcon } from './rcon.js'

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || ''
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const RCON = { host: process.env.RCON_HOST, port: process.env.RCON_PORT || 27020, password: process.env.RCON_PASSWORD }
const POINTS_CMD = process.env.RCON_POINTS_CMD || 'AddPoints {steamid} {points}'
const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY) : null

// Registro de pagos ya entregados (evita entregar dos veces si Stripe reintenta).
const LOG = path.resolve(process.env.ORDERS_FILE || 'orders.json')
const delivered = new Set((() => { try { return JSON.parse(fs.readFileSync(LOG, 'utf8')) } catch { return [] } })())
const markDelivered = id => { delivered.add(id); try { fs.writeFileSync(LOG, JSON.stringify([...delivered])) } catch {} }

export async function deliverPoints(steamid, points) {
  if (!RCON.host || !RCON.password) throw new Error('RCON no configurado')
  const cmd = POINTS_CMD.replace('{steamid}', steamid).replace('{points}', points)
  return rcon(cmd, RCON)
}

export function mountPayments(app, { publicUrl }) {
  // El webhook necesita el cuerpo sin procesar para verificar la firma: va antes de express.json()
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) return res.status(503).end()
    let event
    try { event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], WEBHOOK_SECRET) }
    catch (e) { return res.status(400).send(`Webhook error: ${e.message}`) }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const s = event.data.object
      if (s.payment_status !== 'paid' || delivered.has(s.id)) return res.json({ ok: true })
      const { steamid, points } = s.metadata || {}
      try {
        const out = await deliverPoints(steamid, points)
        markDelivered(s.id)
        console.log(`[pago] ${s.id} → ${points} pts a ${steamid}: ${out}`)
      } catch (e) {
        console.error(`[pago] Error entregando ${s.id}:`, e.message)
        return res.status(500).send('delivery failed') // Stripe reintentará
      }
    }
    res.json({ ok: true })
  })

  app.use('/api', express.json())

  app.post('/api/checkout', async (req, res) => {
    const steamid = req.signedCookies.steamid
    if (!steamid) return res.status(401).json({ error: 'login' })
    if (!stripe) return res.status(503).json({ error: 'Stripe no configurado' })
    const pack = PACKS.find(p => p.id === req.body?.packId)
    if (!pack) return res.status(400).json({ error: 'pack' })
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{ quantity: 1, price_data: { currency: CURRENCY, unit_amount: Math.round(pack.usd * 100), product_data: { name: `RaidOrDie · ${pack.points.toLocaleString('en')} points` } } }],
        metadata: { steamid, points: String(pack.points), packId: pack.id },
        client_reference_id: steamid,
        success_url: `${publicUrl}/shop?paid=1`,
        cancel_url: `${publicUrl}/shop?paid=0`,
      })
      res.json({ url: session.url })
    } catch (e) {
      console.error('[checkout]', e.message)
      res.status(500).json({ error: 'stripe' })
    }
  })
}
