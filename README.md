# RaidOrDie

Website for the RaidOrDie ARK: Survival Evolved PvP cluster. Built with React, Vite, Tailwind CSS and Motion. Available in English, Spanish and Russian, with Steam sign-in.

## Development

```bash
npm install
npm run dev
```

`npm run dev` starts the site (http://localhost:5173) and the Steam login API (port 3001).

## Configuration

- Server data (IP, Discord, release date, shop): `src/data/site.js`
- Translations: `src/i18n.jsx`
- API environment variables: `PUBLIC_URL`, `SESSION_SECRET`, `STEAM_API_KEY` (optional), `API_PORT`

## Payments (Stripe + ArkShop)

Players buy point packs (`shared/packs.js`) with Stripe Checkout. When Stripe confirms the payment, the webhook `/api/stripe/webhook` adds the points in-game through RCON (`AddPoints {steamid} {points}` from ArkShop).

Environment variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`, `RCON_POINTS_CMD` (optional).
