import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Map, Swords, Zap, CreditCard, ChevronDown, CalendarClock, Trophy, Gamepad2, ShoppingCart, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Aurora, SplitText, ShinyText, MagneticButton, CountUp, SpotlightCard, Marquee, SectionHeader, Reveal, GlowCard } from '../components/ui'
import { SITE, SERVERS, RATES } from '../data/site'
import { useLang } from '../i18n'
import { useAuth, SteamButton, SteamIcon, DiscordIcon } from '../auth'

const FEATURE_ICONS = [Map, Swords, Zap, CreditCard]

export default function Home() {
  const { t } = useLang()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(0)
  const nav = useNavigate()
  const h = t.home
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        <div className="absolute inset-0 bg-[url(/hero-bg.webp)] bg-cover bg-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink from-15% via-ink/50 via-50% to-ink" />
        <Aurora />
        <div className="relative z-10 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 inline-block rounded-full border border-blood/40 bg-blood/10 px-4 py-1 text-sm">
            <ShinyText>{h.badge}</ShinyText>
          </motion.p>
          <h1 className="font-brand whitespace-nowrap text-[13vw] leading-none uppercase sm:text-7xl md:text-8xl lg:text-9xl">
            <motion.span initial={{ opacity: 0, scale: 1.3, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.7 }} className="stone inline-block">RAID</motion.span><motion.span initial={{ opacity: 0, rotate: -25, scale: 2 }} animate={{ opacity: 1, rotate: -8, scale: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 12 }} className="brush mx-1 inline-block align-middle text-[0.85em]">OR</motion.span><motion.span initial={{ opacity: 0, scale: 1.3, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.7, delay: 0.2 }} className="stone inline-block">DIE</motion.span>
          </h1>
          <motion.p key={h.tagline} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            {h.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton onClick={() => nav('/servers')} className="bg-blood text-white shadow-[0_0_40px_-5px] shadow-blood hover:bg-red-500">
              <Gamepad2 size={20} /> {h.play}
            </MagneticButton>
            <MagneticButton href={SITE.discord} className="border border-blood/60 bg-blood/10 text-white hover:bg-blood/25"><DiscordIcon size={20} /> Discord</MagneticButton>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="mx-auto mt-14 grid max-w-3xl grid-cols-3 divide-x divide-white/10 border-y border-white/10 bg-ink/40 py-6 backdrop-blur-sm">
            {[['', 3, h.weeks, h.perMap, CalendarClock], ['$', 150, 'USD', h.prizes, Trophy], ['', SERVERS.length, h.maps, h.cluster, Map]].map(([pre, n, unit, l, Icon]) => (
              <div key={l} className="px-2">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="font-display text-5xl font-bold leading-none text-white sm:text-7xl">{pre}<CountUp to={n} /></span>
                  <span className="font-display text-lg font-bold uppercase text-blood sm:text-2xl">{unit}</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/50 sm:text-xs"><Icon size={13} className="text-blood" />{l}</div>
              </div>
            ))}
          </motion.div>
          <Countdown />

        </div>
      </section>

      <Marquee items={SERVERS.map(s => s.name)} />

      <section className="mx-auto max-w-6xl px-4 py-24">
        <SectionHeader label={h.whyLabel} title={h.whyTitle} sub={h.whySub} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.features.map(([title, d], i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <Reveal key={i} delay={i * 0.1}>
                <SpotlightCard className="h-full p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blood/30 to-ember/10 p-3 text-blood ring-1 ring-blood/30"><Icon size={24} /></div>
                  <h3 className="font-display text-xl font-bold uppercase">{title}</h3>
                  <p className="mt-2 text-sm text-white/60">{d}</p>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Conectar con Steam */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[#e11d2e]/25 bg-gradient-to-br from-[#2a0a0e] via-[#140608] to-ink p-8 md:p-12">
            <SteamIcon size={260} className="pointer-events-none absolute -right-10 -bottom-16 text-[#e11d2e]/10" />
            <div className="relative max-w-xl">
              <h2 className="flex items-center gap-3 font-display text-4xl font-bold uppercase md:text-5xl"><SteamIcon size={36} className="text-[#e11d2e]" /> {h.steamTitle}</h2>
              <p className="mt-3 text-white/70">{h.steamText}</p>
              <div className="mt-6">
                {user ? <span className="inline-flex items-center gap-2 rounded-xl bg-green-500/15 px-4 py-2.5 text-green-400"><CheckCircle2 size={18} /> {user.name}</span> : <SteamButton />}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-4 md:grid-cols-2">
          <GlowCard>
            <h3 className="font-display text-3xl font-bold uppercase">{h.rates}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {t.info.rateNames.slice(0, 6).map((k, i) => <div key={k} className="flex justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"><span className="text-white/60">{k}</span><b className="text-ember">{RATES[i]}</b></div>)}
            </div>
          </GlowCard>
          <GlowCard>
            <h3 className="flex items-center gap-2 font-display text-3xl font-bold uppercase"><ShoppingCart className="text-blood" /> {h.shop}</h3>
            <p className="mt-2 text-white/60">{h.shopText}</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 font-display text-lg font-bold uppercase text-blood hover:text-ember">{h.shopCta} <ArrowRight size={18} /></Link>
          </GlowCard>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24">
        <SectionHeader label="FAQ" title={h.faqTitle} />
        <div className="space-y-3">
          {h.faq.map(([q, a], i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between px-5 py-4 text-left font-medium">
                {q}<motion.span animate={{ rotate: openFaq === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}><p className="px-5 pb-4 text-white/60">{a}</p></motion.div>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Countdown() {
  const { t, lang } = useLang()
  const target = new Date(SITE.release).getTime()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const left = Math.max(0, target - now)
  const parts = [[Math.floor(left / 864e5), t.home.cd[0]], [Math.floor(left / 36e5) % 24, t.home.cd[1]], [Math.floor(left / 6e4) % 60, t.home.cd[2]], [Math.floor(left / 1e3) % 60, t.home.cd[3]]]
  const date = new Date(target).toLocaleDateString({ en: 'en-US', es: 'es-ES', ru: 'ru-RU' }[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-10">
      <div className="mb-3 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.3em] text-white/70">
        <span className="h-2 w-2 rounded-full bg-blood" style={{ animation: 'pulse-dot 2s infinite' }} />
        {left ? t.home.release : t.home.live} · <span className="text-blood">{date}</span>
      </div>
      {left > 0 && (
        <div className="flex justify-center gap-2 sm:gap-3">
          {parts.map(([v, l]) => (
            <div key={l} className="w-16 rounded-xl border border-white/10 bg-ink/60 py-2 backdrop-blur sm:w-20">
              <div className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{String(v).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">{l}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
