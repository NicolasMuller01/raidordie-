import { useEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X, Server, ShoppingCart, Trophy, Info, ScrollText, Vote, UserPlus, BarChart3, Globe, LogOut, ChevronDown } from 'lucide-react'
import { SITE } from './data/site'
import { useLang, LANGS } from './i18n'
import { useAuth, SteamButton, DiscordIcon, SteamIcon } from './auth'
import Home from './pages/Home'
import { Servers, Shop, Leaderboard, Rules, Vote as VotePage, About, Polls, Invite } from './pages/Pages'

const NAV = [['/servers', 'servers', Server], ['/shop', 'shop', ShoppingCart], ['/leaderboard', 'ranking', Trophy], ['/about', 'info', Info], ['/rules', 'rules', ScrollText], ['/vote', 'vote', Vote], ['/invite', 'invite', UserPlus], ['/polls', 'polls', BarChart3]]

function useClickAway(cb) {
  const ref = useRef(null)
  useEffect(() => { const f = e => ref.current && !ref.current.contains(e.target) && cb(); document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f) }, [cb])
  return ref
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useClickAway(() => setOpen(false))
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-sm hover:bg-white/5" aria-label="Language">
        <Globe size={16} /> {lang.toUpperCase()} <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#111117] py-1 shadow-xl">
            {LANGS.map(([code, name, short]) => (
              <button key={code} onClick={() => { setLang(code); setOpen(false) }} className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-white/5 ${lang === code ? 'text-blood' : ''}`}>
                {name}<span className="text-xs text-white/40">{short}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useClickAway(() => setOpen(false))
  if (!user) return <SteamButton className="!px-3 !py-2 text-sm" />
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-lg border border-[#e11d2e]/30 bg-blood/15 py-1 pr-3 pl-1 text-sm">
        {user.avatar ? <img src={user.avatar} alt="" className="h-7 w-7 rounded-md" /> : <span className="grid h-7 w-7 place-items-center rounded-md bg-[#e11d2e]/20 text-[#e11d2e]"><SteamIcon size={16} /></span>}
        <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#111117] p-1 shadow-xl">
            <div className="px-3 py-2 text-xs text-white/40">SteamID {user.steamid}</div>
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/5"><LogOut size={16} /> {t.auth.logout}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); addEventListener('scroll', f); return () => removeEventListener('scroll', f) }, [])
  const Logo = () => (
    <Link to="/" className="flex flex-col gap-1.5">
      <span className="font-brand text-3xl leading-none"><span className="stone">RAID</span><span className="brush mx-0.5 inline-block -rotate-6">OR</span><span className="stone">DIE</span></span>
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" style={{ animation: 'pulse-dot 2s infinite' }} /> {t.common.online}
      </span>
    </Link>
  )
  const NavList = ({ id }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map(([to, key, Icon], i) => (
        <motion.div key={to} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
          <NavLink to={to} className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-4 py-3 font-display text-lg font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}>
            {({ isActive }) => <>
              {isActive && <motion.span layoutId={id} className="absolute inset-0 rounded-xl border border-blood/40 bg-gradient-to-r from-blood/25 to-transparent"><span className="absolute top-2 bottom-2 left-0 w-1 rounded-r bg-blood shadow-[0_0_12px] shadow-blood" /></motion.span>}
              <Icon size={19} className={`relative transition-colors ${isActive ? 'text-blood' : 'group-hover:text-blood'}`} /><span className="relative">{t.nav[key]}</span>
            </>}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  )
  const SideFooter = () => (
    <a href={SITE.discord} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-blood/50 bg-blood/10 px-4 py-3 font-display font-bold uppercase tracking-wide hover:bg-blood/25">
      <DiscordIcon size={18} /> Discord
    </a>
  )
  return (
    <>
      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col gap-8 border-r border-white/10 bg-ink/80 p-5 backdrop-blur-xl lg:flex">
        <Logo />
        <div className="flex-1 overflow-y-auto"><NavList id="side" /></div>
        <SideFooter />
      </aside>

      {/* Barra superior: idioma + Steam (y menú en móvil) */}
      <header className={`fixed top-0 right-0 left-0 z-40 transition-all lg:left-64 ${scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : ''}`}>
        <div className="flex h-16 items-center justify-between gap-2 px-4 lg:justify-end lg:px-8">
          <Link to="/" className="font-brand text-2xl lg:hidden"><span className="stone">RAID</span><span className="brush mx-0.5 inline-block -rotate-6">OR</span><span className="stone">DIE</span></Link>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <UserMenu />
            <button onClick={() => setOpen(true)} className="rounded-lg border border-white/10 p-2 lg:hidden" aria-label="Menu"><Menu size={18} /></button>
          </div>
        </div>
      </header>

      {/* Cajón lateral (móvil) */}
      <AnimatePresence>
        {open && <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" />
          <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-8 border-r border-white/10 bg-ink p-5 lg:hidden">
            <div className="flex items-start justify-between"><Logo /><button onClick={() => setOpen(false)} className="rounded-lg border border-white/10 p-2" aria-label="Close"><X size={18} /></button></div>
            <div className="flex-1 overflow-y-auto"><NavList id="drawer" /></div>
            <SideFooter />
          </motion.aside>
        </>}
      </AnimatePresence>
    </>
  )
}

function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-white/10 py-10 text-center text-sm text-white/40">
      © {new Date().getFullYear()} RaidOrDie · ARK: Survival Evolved — {t.footer}
    </footer>
  )
}

function LoginError() {
  const { t } = useLang()
  const [show, setShow] = useState(() => new URLSearchParams(location.search).get('login') === 'error')
  if (!show) return null
  return <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-center text-sm backdrop-blur" onClick={() => setShow(false)}>{t.auth.error}</div>
}

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen lg:pl-64">
      <Header />
      <LoginError />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
