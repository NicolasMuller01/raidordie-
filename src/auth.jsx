import { createContext, useContext, useEffect, useState } from 'react'
import { siSteam, siDiscord } from 'simple-icons'
import { Lock } from 'lucide-react'
import { useLang } from './i18n'

const Brand = ({ icon, size = 18, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden><path d={icon.path} /></svg>
)
export const SteamIcon = p => <Brand icon={siSteam} {...p} />
export const DiscordIcon = p => <Brand icon={siDiscord} {...p} />

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => setUser(d.user)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])
  const login = () => { window.location.href = '/auth/steam' }
  const logout = async () => { await fetch('/auth/logout', { method: 'POST' }).catch(() => {}); setUser(null) }
  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)

export function SteamButton({ className = '' }) {
  const { login } = useAuth()
  const { t } = useLang()
  return (
    <button onClick={login} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blood to-ember px-5 py-2.5 font-semibold text-white ring-1 ring-white/10 shadow-[0_0_25px_-6px] shadow-blood transition hover:brightness-110 ${className}`}>
      <SteamIcon size={20} /> {t.auth.login}
    </button>
  )
}

/** Muestra el contenido solo si el usuario ha iniciado sesión con Steam. */
export function RequireSteam({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLang()
  if (loading) return <div className="py-20 text-center text-white/40">…</div>
  if (user) return children
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#e11d2e]/30 bg-blood/10 p-8 text-center backdrop-blur">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e11d2e]/15 text-[#e11d2e]"><Lock /></div>
      <h3 className="font-display text-2xl font-bold uppercase">{t.auth.required}</h3>
      <p className="mt-2 mb-6 text-sm text-white/60">{t.auth.requiredText}</p>
      <SteamButton />
    </div>
  )
}
