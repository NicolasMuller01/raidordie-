import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Copy, Check, Play, Trophy, Skull, Users, ShieldAlert, Gift, Share2, Clock, ExternalLink, Search, ShoppingCart, Trash2,
  Plus, Gauge, Bone, Timer, Sparkles, Ban, Swords, MessageSquare, Medal, Award, MapPin, Signal, CircleCheck, Vote as VoteIcon, Ticket,
} from 'lucide-react'
import { Page, SectionHeader, SpotlightCard, GlowCard, Reveal, CountUp } from '../components/ui'
import { SITE, SERVERS, SHOP, CATEGORIES, POINTS_ICON, PLAYERS, TRIBES, RATES, LEVELS, LIMITS, VOTE_SITES, TOP_VOTERS, POLL_COUNTS } from '../data/site'
import { useLang } from '../i18n'
import { useAuth, RequireSteam } from '../auth'

const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}
const Pts = ({ v, className = '' }) => <span className={`inline-flex items-center gap-1 ${className}`}><POINTS_ICON size={14} className="text-yellow-400" />{v.toLocaleString()}</span>

/* ---------- Servers ---------- */
// Nota: el estado real necesita un backend que consulte los servidores (protocolo Steam A2S). Ahora son datos de ejemplo.
export function Servers() {
  const { t } = useLang()
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setStats(SERVERS.map(() => ({ online: Math.random() > 0.1, players: Math.floor(Math.random() * 60) }))), 700)
    return () => clearTimeout(id)
  }, [])
  const total = stats?.reduce((a, s) => a + (s.online ? s.players : 0), 0) ?? 0
  const copy = addr => { navigator.clipboard?.writeText(addr); setCopied(addr); setTimeout(() => setCopied(''), 1500) }
  return (
    <Page>
      <SectionHeader label={t.servers.label} title={t.servers.title} sub={t.servers.sub} />
      <div className="mb-8 flex items-center justify-center gap-2 text-white/60"><Users size={18} /> {t.servers.players}: <b className="font-display text-2xl text-white">{stats ? <CountUp to={total} /> : '…'}</b></div>
      <div className="grid gap-3 md:grid-cols-2">
        {SERVERS.map((s, i) => {
          const st = stats?.[i], addr = `${SITE.ip}:${s.port}`
          return (
            <Reveal key={s.name} delay={i * 0.03}>
              <SpotlightCard className="flex items-center gap-4 p-4">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${!st ? 'bg-white/5 text-white/30' : st.online ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}><MapPin size={20} /></div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xl font-bold uppercase">{s.name}</div>
                  <button onClick={() => copy(addr)} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
                    {addr} {copied === addr ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                  <div className="mt-2 h-1.5 overflow-hidden rounded bg-white/10">
                    <motion.div className="h-full bg-gradient-to-r from-blood to-ember" initial={{ width: 0 }} animate={{ width: st?.online ? `${(st.players / s.max) * 100}%` : 0 }} transition={{ duration: 1 }} />
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center justify-end gap-1 text-white/70"><Signal size={14} />{!st ? '…' : st.online ? `${st.players}/${s.max}` : t.common.offline}</div>
                  <a href={`steam://connect/${addr}`} className="mt-1 inline-flex items-center gap-1 rounded-lg bg-blood px-3 py-1.5 text-xs font-bold uppercase hover:bg-red-500"><Play size={12} fill="currentColor" /> {t.common.connect}</a>
                </div>
              </SpotlightCard>
            </Reveal>
          )
        })}
      </div>
    </Page>
  )
}

/* ---------- Shop ---------- */
export function Shop() {
  const { t } = useLang()
  const { user } = useAuth()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [cart, setCart] = useState([])
  const [needLogin, setNeedLogin] = useState(false)
  const label = i => i.vip ? `${i.name} · ${t.shop.days}` : i.name
  const items = useMemo(() => SHOP.filter(i => (cat === 'all' || i.cat === cat) && label(i).toLowerCase().includes(q.toLowerCase())), [cat, q, t])
  const total = cart.reduce((a, i) => a + i.price, 0)
  const add = i => user ? setCart(c => [...c, i]) : setNeedLogin(true)
  return (
    <Page>
      <SectionHeader label={t.shop.label} title={t.shop.title} sub={t.shop.sub} />
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {['all', ...CATEGORIES].map(c => {
          const n = c === 'all' ? SHOP.length : SHOP.filter(i => i.cat === c).length
          return (
            <button key={c} onClick={() => setCat(c)} className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${cat === c ? 'text-white' : 'text-white/60 hover:text-white'}`}>
              {cat === c && <motion.span layoutId="cat" className="absolute inset-0 rounded-full bg-blood" />}
              <span className="relative">{c === 'all' ? t.common.all : t.shop.cats[c]} <span className="opacity-60">{n}</span></span>
            </button>
          )
        })}
      </div>
      <div className="relative mx-auto mb-8 max-w-md">
        <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={t.common.search} className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pr-4 pl-10 outline-none focus:border-blood" />
      </div>
      <AnimatePresence>{needLogin && !user && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8"><RequireSteam /></motion.div>}</AnimatePresence>
      <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {items.map(i => {
            const Icon = i.icon
            return (
              <motion.div key={i.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <GlowCard className="h-full">
                  <div className="relative mb-3 grid aspect-square place-items-center overflow-hidden rounded-xl" style={{ background: `radial-gradient(circle at 50% 40%, ${i.color}33, transparent 70%)` }}>
                    <Icon size={64} strokeWidth={1.4} style={{ color: i.color, filter: `drop-shadow(0 0 18px ${i.color}88)` }} className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-blood">{t.shop.cats[i.cat]}</div>
                  <div className="font-semibold">{label(i)}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-xl font-bold"><Pts v={i.price} /> <span className="text-sm text-white/50">pts</span></span>
                    <button onClick={() => add(i)} className="rounded-lg bg-blood p-1.5 hover:bg-red-500" aria-label={t.shop.buy}><Plus size={18} /></button>
                  </div>
                </GlowCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-2xl border border-white/10 bg-ink/90 p-4 backdrop-blur-xl">
            <span className="flex items-center gap-2"><ShoppingCart size={18} /> {cart.length} {t.shop.items} · <b><Pts v={total} /></b></span>
            <div className="flex gap-2">
              <button onClick={() => setCart([])} className="rounded-lg p-2 text-white/60 hover:text-white" aria-label={t.shop.clear}><Trash2 size={16} /></button>
              <button onClick={() => alert(t.shop.checkout)} className="rounded-lg bg-blood px-4 py-1.5 text-sm font-bold">{t.shop.buy}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}

/* ---------- Leaderboard ---------- */
export function Leaderboard() {
  const { t } = useLang()
  const [tab, setTab] = useState('kills')
  const rows = useMemo(() => {
    if (tab === 'tribes') return TRIBES.map(([n, k, m]) => [n, `${m} ${t.common.members}`, k])
    const s = [...PLAYERS].sort((a, b) => tab === 'kills' ? b[2] - a[2] : b[3] - a[3])
    return s.map(([n, tr, k, d]) => [n, tr, tab === 'kills' ? k : d])
  }, [tab, t])
  const tabs = [['kills', t.ranking.kills, Swords], ['deaths', t.ranking.deaths, Skull], ['tribes', t.ranking.tribes, Users]]
  const medal = [<Trophy key={0} className="text-yellow-400" />, <Medal key={1} className="text-zinc-300" />, <Award key={2} className="text-amber-600" />]
  return (
    <Page>
      <SectionHeader label={t.ranking.label} title={t.ranking.title} sub={t.ranking.sub} />
      <div className="mb-6 flex justify-center gap-2">
        {tabs.map(([k, l, I]) => (
          <button key={k} onClick={() => setTab(k)} className={`relative flex items-center gap-2 rounded-xl px-4 py-2 ${tab === k ? '' : 'text-white/60'}`}>
            {tab === k && <motion.span layoutId="lb" className="absolute inset-0 rounded-xl border border-blood/50 bg-blood/15" />}<I size={16} className="relative" /><span className="relative">{l}</span>
          </button>
        ))}
      </div>
      <SpotlightCard className="mx-auto max-w-3xl">
        {rows.map(([n, sub, v], i) => (
          <motion.div key={tab + n} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 border-b border-white/5 px-5 py-3 last:border-0">
            <span className="grid w-8 place-items-center font-display text-xl font-bold text-white/30">{medal[i] ?? `#${i + 1}`}</span>
            <div className="flex-1"><div className="font-semibold">{n}</div><div className="text-xs text-white/50">{sub}</div></div>
            <span className="font-display text-xl font-bold text-ember">{v}</span>
          </motion.div>
        ))}
      </SpotlightCard>
    </Page>
  )
}

/* ---------- About ---------- */
export function About() {
  const { t } = useLang()
  const i = t.info
  const Box = ({ title, icon: I, children, className = '' }) => (
    <Reveal className={className}><GlowCard className="h-full"><h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold uppercase"><I size={22} className="text-blood" />{title}</h3>{children}</GlowCard></Reveal>
  )
  const Row = ({ k, v }) => <div className="flex justify-between border-b border-white/5 py-2 text-sm last:border-0"><span className="text-white/60">{k}</span><b className="text-ember">{v}</b></div>
  return (
    <Page>
      <SectionHeader label={i.label} title={i.title} sub={i.sub} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Box title={i.rates} icon={Gauge}>{i.rateNames.map((k, n) => <Row key={k} k={k} v={RATES[n]} />)}</Box>
        <Box title={i.levels} icon={Bone}>{i.levelNames.map((k, n) => <Row key={k} k={k} v={LEVELS[n]} />)}</Box>
        <Box title={i.limits} icon={Users}>{i.limitNames.map((k, n) => <Row key={k} k={k} v={LIMITS[n]} />)}</Box>
        <Box title={i.timings} icon={Timer}>{i.timingRows.map(([k, v]) => <Row key={k} k={k} v={v} />)}</Box>
        <Box title={i.features} icon={Sparkles} className="md:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2">{i.featureList.map(f => <div key={f} className="flex items-center gap-2 text-sm"><CircleCheck size={16} className="text-green-400" />{f}</div>)}</div>
        </Box>
      </div>
    </Page>
  )
}

/* ---------- Rules ---------- */
export function Rules() {
  const { t } = useLang()
  const icons = [Ban, Swords, MessageSquare]
  return (
    <Page>
      <SectionHeader label={t.rules.label} title={t.rules.title} sub={t.rules.sub} />
      <div className="mx-auto max-w-3xl space-y-6">
        {t.rules.sections.map((s, si) => {
          const I = icons[si]
          return (
            <Reveal key={si}>
              <SpotlightCard className="p-6">
                <h3 className="mb-4 flex items-center gap-3 font-display text-2xl font-bold uppercase"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blood/15 text-blood"><I size={18} /></span>{si + 1}. {s.title}</h3>
                <ol className="space-y-2">{s.items.map((r, n) => <li key={n} className="flex gap-3 text-white/80"><span className="font-mono text-blood">{si + 1}.{n + 1}</span>{r}</li>)}</ol>
              </SpotlightCard>
            </Reveal>
          )
        })}
        <Reveal><div className="flex gap-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <ShieldAlert className="shrink-0 text-yellow-400" />
          <div><h3 className="font-display text-xl font-bold uppercase text-yellow-400">{t.rules.warnTitle}</h3>
            <p className="mt-1 text-sm text-white/70">{t.rules.warnText}</p></div>
        </div></Reveal>
      </div>
    </Page>
  )
}

/* ---------- Vote ---------- */
export function Vote() {
  const { t } = useLang()
  const { user } = useAuth()
  const key = `rod-voted-${user?.steamid}`
  const [voted, setVoted] = useState({})
  useEffect(() => { if (user) setVoted(store.get(key, {})) }, [user, key])
  const doVote = s => { const v = { ...voted, [s.name]: Date.now() }; setVoted(v); store.set(key, v) }
  const canVote = n => !voted[n] || Date.now() - voted[n] > 864e5
  return (
    <Page>
      <SectionHeader label={t.vote.label} title={t.vote.title} sub={t.vote.sub} />
      <RequireSteam>
        <div className="grid gap-4 md:grid-cols-3">
          {VOTE_SITES.map(s => (
            <GlowCard key={s.name}>
              <div className="mb-3 inline-flex rounded-xl bg-blood/15 p-3 text-blood"><VoteIcon /></div>
              <h3 className="font-display text-xl font-bold uppercase">{s.name}</h3>
              <p className="flex items-center gap-1 text-sm text-white/60"><Pts v={s.pts} /> {t.vote.perVote}</p>
              {canVote(s.name)
                ? <a href={s.url} target="_blank" rel="noreferrer" onClick={() => doVote(s)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blood px-4 py-2 text-sm font-bold">{t.vote.btn} <ExternalLink size={14} /></a>
                : <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/50"><Clock size={14} /> {t.vote.done}</span>}
            </GlowCard>
          ))}
        </div>
      </RequireSteam>
      <h3 className="mt-16 mb-4 flex items-center justify-center gap-2 font-display text-3xl font-bold uppercase"><Trophy className="text-yellow-400" /> {t.vote.top}</h3>
      <SpotlightCard className="mx-auto max-w-md">
        {TOP_VOTERS.map(([n, v], i) => <div key={n} className="flex justify-between border-b border-white/5 px-5 py-3 last:border-0"><span><b className="mr-3 text-blood">#{i + 1}</b>{n}</span><b>{v} {t.common.votes}</b></div>)}
      </SpotlightCard>
    </Page>
  )
}

/* ---------- Polls ---------- */
export function Polls() {
  const { t } = useLang()
  const { user } = useAuth()
  const key = `rod-polls-${user?.steamid}`
  const [votes, setVotes] = useState({})
  useEffect(() => { if (user) setVotes(store.get(key, {})) }, [user, key])
  const choose = (id, i) => { const v = { ...votes, [id]: i }; setVotes(v); store.set(key, v) }
  return (
    <Page>
      <SectionHeader label={t.polls.label} title={t.polls.title} sub={t.polls.sub} />
      <RequireSteam>
        <div className="mx-auto max-w-2xl space-y-6">
          {t.polls.list.map((p, pi) => {
            const counts = POLL_COUNTS[pi].map((c, i) => c + (votes[pi] === i ? 1 : 0))
            const total = counts.reduce((a, b) => a + b, 0)
            const done = votes[pi] !== undefined
            return (
              <SpotlightCard key={pi} className="p-6">
                <h3 className="mb-4 text-lg font-semibold">{p.q}</h3>
                <div className="space-y-2">
                  {p.o.map((o, i) => {
                    const pct = Math.round((counts[i] / total) * 100), mine = votes[pi] === i
                    return (
                      <button key={i} onClick={() => choose(pi, i)} className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left ${mine ? 'border-blood' : 'border-white/10 hover:border-white/30'}`}>
                        <motion.div className="absolute inset-y-0 left-0 bg-blood/20" animate={{ width: done ? `${pct}%` : 0 }} />
                        <span className="relative flex items-center justify-between"><span className="flex items-center gap-2">{mine && <CircleCheck size={16} className="text-blood" />}{o}</span>{done && <b>{pct}%</b>}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-white/40">{total} {t.common.votes}</p>
              </SpotlightCard>
            )
          })}
        </div>
      </RequireSteam>
    </Page>
  )
}

/* ---------- Invite ---------- */
export function Invite() {
  const { t } = useLang()
  const { user } = useAuth()
  // Código derivado del SteamID (en producción, genéralo y guárdalo en el backend)
  const code = user ? 'ROD-' + Number(BigInt(user.steamid) % 2176782336n).toString(36).toUpperCase().padStart(6, '0') : ''
  const [copied, setCopied] = useState(false)
  const icons = [Share2, Gift, Clock]
  return (
    <Page>
      <SectionHeader label={t.invite.label} title={t.invite.title} />
      <div className="mb-12">
        <RequireSteam>
          <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-dashed border-blood/50 bg-blood/5 p-4">
            <span className="flex items-center gap-3 font-mono text-2xl tracking-widest"><Ticket className="text-blood" />{code}</span>
            <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) }} className="flex items-center gap-2 rounded-lg bg-blood px-4 py-2 text-sm font-bold">
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? t.common.copied : t.common.copy}
            </button>
          </div>
        </RequireSteam>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {t.invite.steps.map(([title, d], i) => {
          const I = icons[i]
          return (
            <Reveal key={i} delay={i * 0.1}><GlowCard className="h-full">
              <div className="mb-4 flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blood/15 text-blood"><I size={20} /></span><span className="font-display text-5xl font-bold text-white/10">0{i + 1}</span></div>
              <h3 className="font-display text-xl font-bold uppercase">{title}</h3><p className="mt-2 text-sm text-white/60">{d}</p>
            </GlowCard></Reveal>
          )
        })}
      </div>
    </Page>
  )
}
