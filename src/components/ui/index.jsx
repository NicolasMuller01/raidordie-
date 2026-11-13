// Componentes al estilo de React Bits, Skiper UI, Vengeance UI y Animata.
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'motion/react'

/* React Bits — SplitText */
export function SplitText({ text, className = '', delay = 0.04 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((c, i) => (
        <motion.span key={i} className="inline-block" aria-hidden
          initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: i * delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </span>
  )
}

/* React Bits — ShinyText */
export const ShinyText = ({ children, className = '' }) => <span className={`shiny ${className}`}>{children}</span>

/* React Bits — CountUp */
export function CountUp({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: x => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref} className={className}>{v.toLocaleString('es')}{suffix}</span>
}

/* React Bits — Aurora background */
export function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/3 left-1/4 h-[70vh] w-[70vh] rounded-full bg-blood/30 blur-[120px]" style={{ animation: 'aurora 14s ease-in-out infinite' }} />
      <div className="absolute top-0 right-0 h-[50vh] w-[50vh] rounded-full bg-ember/20 blur-[120px]" style={{ animation: 'aurora 18s ease-in-out infinite reverse' }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  )
}

/* React Bits — SpotlightCard */
export function SpotlightCard({ children, className = '', color = 'rgba(225,29,46,.18)' }) {
  const ref = useRef(null)
  const [p, setP] = useState({ x: 0, y: 0, o: 0 })
  return (
    <div ref={ref}
      onMouseMove={e => { const r = ref.current.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top, o: 1 }) }}
      onMouseLeave={() => setP(s => ({ ...s, o: 0 }))}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur ${className}`}>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: p.o, background: `radial-gradient(500px circle at ${p.x}px ${p.y}px, ${color}, transparent 40%)` }} />
      <div className="relative">{children}</div>
    </div>
  )
}

/* Skiper UI — Magnetic button */
export function MagneticButton({ children, className = '', href, onClick }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 })
  const M = href ? motion.a : motion.button
  return (
    <M href={href} onClick={onClick} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
      style={{ x: sx, y: sy }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.3) }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className={`relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 font-display text-lg font-bold uppercase tracking-wider transition-colors ${className}`}>
      {children}
    </M>
  )
}

/* Vengeance UI — Glow border card */
export function GlowCard({ children, className = '' }) {
  return (
    <div className={`group relative rounded-2xl bg-gradient-to-b from-white/15 to-white/5 p-px transition-all duration-500 hover:from-blood hover:to-ember ${className}`}>
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blood to-ember opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
      <div className="relative h-full rounded-2xl bg-[#0d0d12] p-6">{children}</div>
    </div>
  )
}

/* Animata — Marquee */
export function Marquee({ items }) {
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max gap-12" style={{ animation: 'marquee 30s linear infinite' }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-2xl font-bold uppercase tracking-widest text-white/30">{t} <span className="text-blood">✦</span></span>
        ))}
      </div>
    </div>
  )
}

export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay }}>{children}</motion.div>
)

export function SectionHeader({ label, title, sub }) {
  return (
    <Reveal className="mb-10 text-center">
      {label && <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.3em] text-blood">{label}</p>}
      <h2 className="font-display text-4xl font-bold uppercase md:text-6xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-white/60">{sub}</p>}
    </Reveal>
  )
}

export const Page = ({ children }) => <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">{children}</div>
