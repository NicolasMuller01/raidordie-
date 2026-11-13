// ⚙️ Datos del servidor (los textos traducibles están en src/i18n.jsx).
import { Star, Gem, Crown, Flame, Bone, Feather, Crosshair, Rocket, Armchair, Pickaxe, Hexagon, Castle, ShieldHalf, Swords, Backpack, Zap } from 'lucide-react'

export const SITE = {
  name: 'RAIDORDIE',
  discord: 'https://discord.gg/eb9rWTXHwr', // <-- tu invitación
  ip: '127.0.0.1', // <-- IP pública de tu servidor
  release: '2026-12-01T00:00:00Z', // <-- fecha y hora de apertura (UTC)
}

const MAP_NAMES = ['The Island', 'Scorched Earth', 'Aberration', 'Extinction', 'Ragnarok', 'The Center', 'Valguero', 'Genesis 1', 'Crystal Isles', 'Genesis 2', 'Lost Island', 'Fjordur']
export const SERVERS = MAP_NAMES.map((name, i) => ({ name, port: 27015 + i, max: 70 }))

export const CATEGORIES = ['VIP', 'Dinos', 'Weapons', 'Saddles', 'Resources', 'Structures', 'Kits']
// `vip: true` añade "· 30 días" traducido al nombre. color = color del icono.
export const SHOP = [
  { name: 'VIP', vip: true, cat: 'VIP', price: 369, icon: Star, color: '#facc15' },
  { name: 'Premium', vip: true, cat: 'VIP', price: 769, icon: Gem, color: '#22d3ee' },
  { name: 'Elite', vip: true, cat: 'VIP', price: 1899, icon: Crown, color: '#f59e0b' },
  { name: 'Legendary', vip: true, cat: 'VIP', price: 5499, icon: Flame, color: '#ef4444' },
  { name: 'Rex 300 lvl', cat: 'Dinos', price: 450, icon: Bone, color: '#a3e635' },
  { name: 'Giganotosaurus', cat: 'Dinos', price: 1200, icon: Bone, color: '#f97316' },
  { name: 'Fire Wyvern', cat: 'Dinos', price: 800, icon: Feather, color: '#fb7185' },
  { name: 'Tek Rifle', cat: 'Weapons', price: 300, icon: Crosshair, color: '#60a5fa' },
  { name: 'Rocket Launcher', cat: 'Weapons', price: 250, icon: Rocket, color: '#f87171' },
  { name: 'Ascendant Rex Saddle', cat: 'Saddles', price: 220, icon: Armchair, color: '#c084fc' },
  { name: '10k Metal', cat: 'Resources', price: 90, icon: Pickaxe, color: '#94a3b8' },
  { name: '5k Element', cat: 'Resources', price: 400, icon: Hexagon, color: '#38bdf8' },
  { name: 'Tek Base Pack', cat: 'Structures', price: 600, icon: Castle, color: '#a78bfa' },
  { name: 'Tek Turrets x10', cat: 'Structures', price: 700, icon: ShieldHalf, color: '#34d399' },
  { name: 'Gamma Boss Kit', cat: 'Kits', price: 500, icon: Swords, color: '#f43f5e' },
  { name: 'Starter Kit', cat: 'Kits', price: 50, icon: Backpack, color: '#fbbf24' },
]
export const POINTS_ICON = Zap

// [jugador, tribu, kills, muertes]
export const PLAYERS = [
  ['xDarkRex', 'Los Caídos', 412, 88], ['NightRaid', 'Blood Pact', 380, 102], ['Tekzilla', 'Los Caídos', 341, 77],
  ['GigaKing', 'Apex', 299, 120], ['Shadowfang', 'Blood Pact', 270, 91], ['Morbius', 'Apex', 244, 60],
  ['Kraken_ES', 'Leviatán', 220, 85], ['Zeta', 'Leviatán', 199, 70], ['Raptorella', 'Apex', 180, 99], ['Coyote', 'Solo', 150, 40],
]
// [tribu, kills, miembros]
export const TRIBES = [['Los Caídos', 1340, 4], ['Blood Pact', 1210, 4], ['Apex', 1100, 4], ['Leviatán', 860, 3]]

// Valores en el mismo orden que info.rateNames / levelNames / limitNames de i18n
export const RATES = ['x10', 'x15', 'x10', 'x15', 'x5', 'x10', 'x2', 'x2']
export const LEVELS = [220, 250, 190]
export const LIMITS = ['105 / 205', '4', '12']

export const VOTE_SITES = [
  { name: 'Top ARK Servers', url: '#', pts: 20 },
  { name: 'ARK-Servers.net', url: '#', pts: 20 },
  { name: 'TrackyServer', url: '#', pts: 15 },
]
export const TOP_VOTERS = [['NightRaid', 31], ['xDarkRex', 29], ['Zeta', 27], ['Coyote', 22], ['Morbius', 18]]

// Votos base de cada opción, en el orden de polls.list de i18n
export const POLL_COUNTS = [[48, 31, 61], [120, 34]]
