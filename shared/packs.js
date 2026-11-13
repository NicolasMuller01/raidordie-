// Packs de puntos que se venden con dinero real (Stripe).
// Los puntos se entregan en ArkShop por RCON. Edita precios aquí: lo usa la web y el servidor.
export const CURRENCY = 'usd'
export const PACKS = [
  { id: 'p500', points: 500, usd: 5 },
  { id: 'p1100', points: 1100, usd: 10, bonus: 10 },
  { id: 'p2400', points: 2400, usd: 20, bonus: 20, popular: true },
  { id: 'p6500', points: 6500, usd: 50, bonus: 30 },
]
