import { useState, useEffect, useRef, CSSProperties } from "react"
import { motion } from "motion/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import {
  LayoutDashboard, Users, Calendar, ImageIcon, MessageSquare, Settings,
  TrendingUp, Clock, CheckCircle2, Package, ChevronDown,
  Zap, ArrowRight, Menu, X, FileText, Bell,
  Layers, Filter, BarChart3, Inbox
} from "lucide-react"
import inkdeskIcon from "../assets/inkdesk-icon-friendly-urikana.svg"
import LaserFlow from "./components/LaserFlow/LaserFlow"

gsap.registerPlugin(SplitText)

const T = {
  teal: "#004741",
  amber: "#C8B99C",
  green: "#2F7F68",
  bg: "#020605",
  bgSec: "#07110F",
  card: "#0B1714",
  border: "rgba(240,237,228,0.1)",
  text: "#F0EDE4",
  muted: "#A9A69C",
}

function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

function fs(visible: boolean, delay = 0): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  }
}

function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <img
      src={inkdeskIcon}
      alt=""
      className="inline-flex shrink-0 object-contain"
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0 0 18px rgba(0,71,65,0.18))",
      }}
      aria-hidden="true"
    />
  )
}

function LaptopMockup() {
  return (
    <div className="relative w-full max-w-[1320px] mx-auto select-none">
      <div
        className="absolute -inset-x-20 bottom-[-18%] h-72 blur-3xl opacity-[0.16] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${T.teal} 0%, transparent 68%)` }}
      />
      <div
        className="absolute inset-x-0 z-0 pointer-events-none"
        style={{
          top: "calc(-1 * clamp(360px, 52vh, 620px))",
          height: "calc(clamp(360px, 52vh, 620px) + clamp(220px, 30vh, 340px))",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 16%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16%)",
        }}
        aria-hidden
      >
        <LaserFlow
          className="h-full w-full"
          horizontalBeamOffset={0.12}
          verticalBeamOffset={-0.13}
          verticalSizing={3.0}
          horizontalSizing={0.42}
          color="#4FC5D4"
          fogIntensity={0.55}
          wispIntensity={5}
          flowSpeed={0.35}
          mouseTiltStrength={0.012}
          wispDensity={1.1}
        />
      </div>
      <div
        className="relative z-10 overflow-visible border rounded-[10px]"
        style={{
          borderColor: "rgba(240,237,228,0.13)",
          background: T.bgSec,
          boxShadow: `0 0 0 1px rgba(240,237,228,0.04), 0 80px 150px rgba(0,0,0,0.9), 0 -18px 80px rgba(240,237,228,0.035) inset`,
        }}
      >
        <a
          href="#"
          className="group absolute right-0 z-40 hidden items-center gap-2 md:flex"
          style={{ bottom: "100%", marginBottom: "0.625rem", color: "rgba(240,237,228,0.64)", fontSize: 15, fontWeight: 500 }}
        >
          <span className="font-semibold" style={{ color: T.text }}>Novo</span>
          Veja o painel
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
        <div className="overflow-hidden rounded-[10px]">
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: T.border, background: "#040608" }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(239,68,68,0.5)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(234,179,8,0.5)" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(34,197,94,0.5)" }} />
          </div>
          <div
            className="flex-1 max-w-[200px] mx-auto rounded-md px-3 py-1 text-[10px] font-mono text-center"
            style={{ background: "rgba(240,237,228,0.04)", color: "rgba(240,237,228,0.24)" }}
          >
            app.inkdesk.com.br
          </div>
          <Bell size={11} style={{ color: "rgba(240,237,228,0.22)" }} />
        </div>
        <div className="flex" style={{ height: "min(46vw, 520px)", minHeight: 360 }}>
          <div
            className="w-48 flex-shrink-0 flex flex-col p-3 gap-0.5 border-r"
            style={{ background: "#040608", borderColor: T.border }}
          >
            <div className="flex items-center gap-2 px-2 py-2.5 mb-1 text-[13px] font-bold" style={{ color: T.text }}>
              <BrandMark size={14} />
              InkDesk
            </div>
            {([
              { Icon: LayoutDashboard, label: "Visão geral", active: true, badge: 0 },
              { Icon: FileText, label: "Orçamentos", active: false, badge: 0 },
              { Icon: Users, label: "Clientes", active: false, badge: 0 },
              { Icon: Calendar, label: "Agenda", active: false, badge: 0 },
              { Icon: ImageIcon, label: "Portfólio", active: false, badge: 0 },
              { Icon: MessageSquare, label: "Mensagens", active: false, badge: 3 },
            ] as const).map(({ Icon, label, active, badge }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] cursor-default"
                style={{ background: active ? `${T.teal}14` : "transparent", color: active ? T.text : "rgba(240,237,228,0.42)" }}
              >
                <Icon size={13} />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: T.amber, color: T.bg }}>{badge}</span>
                )}
              </div>
            ))}
            <div className="mt-auto border-t pt-2" style={{ borderColor: T.border }}>
              <div className="flex items-center gap-2.5 px-2.5 py-2 text-[11px]" style={{ color: "rgba(240,237,228,0.28)" }}>
                <Settings size={13} /><span>Configurações</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold" style={{ color: T.text }}>Visão geral</span>
              <div className="text-[10px] px-2.5 py-1 rounded-full border" style={{ background: `${T.teal}10`, color: T.teal, borderColor: `${T.teal}20` }}>Julho 2026</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {([
                { label: "Novos pedidos", value: "18", Icon: Package, color: T.teal },
                { label: "Ag. resposta", value: "7", Icon: Clock, color: T.amber },
                { label: "Sessões fechadas", value: "12", Icon: CheckCircle2, color: T.green },
                { label: "Valor estimado", value: "R$8.450", Icon: TrendingUp, color: T.teal },
              ] as const).map(({ label, value, Icon, color }) => (
                <div key={label} className="rounded-xl p-3 border" style={{ background: T.card, borderColor: T.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px]" style={{ color: T.muted }}>{label}</span>
                    <Icon size={10} style={{ color }} />
                  </div>
                  <div className="text-[13px] font-bold" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium" style={{ color: T.muted }}>Orçamentos recentes</span>
              <span className="text-[9px]" style={{ color: T.teal }}>Ver todos →</span>
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
              {[
                { label: "Novo", dot: T.teal, cards: ["Flor oriental · R$800", "Lobo realista · R$1.200"] },
                { label: "Respondido", dot: T.amber, cards: ["Dragão old school · R$950"] },
                { label: "Ag. sinal", dot: "#6b7e89", cards: ["Fênix aquarela · R$1.400", "Tribal · R$600"] },
                { label: "Fechado", dot: T.green, cards: ["Mandala P&B · R$700"] },
              ].map(({ label, dot, cards }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                    <span className="text-[9px] font-medium" style={{ color: T.muted }}>{label}</span>
                    <span className="ml-auto text-[8px] px-1.5 rounded-full" style={{ background: "rgba(240,237,228,0.05)", color: T.muted }}>{cards.length}</span>
                  </div>
                  {cards.map((c) => (
                    <div key={c} className="rounded-lg p-2 border text-[9px] leading-4" style={{ background: T.bgSec, borderColor: T.border, color: "rgba(240,237,228,0.58)" }}>{c}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])
  const links = ["Produto", "Recursos", "Clientes", "Preços", "Novidades", "Contato"]
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(3,4,5,0.9)" : "rgba(3,4,5,0.76)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: "1px solid rgba(240,237,228,0.08)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex items-center justify-between h-[68px]">
        <a href="#" className="flex items-center gap-3.5" style={{ color: T.text }}>
          <BrandMark size={36} />
          <span
            className="text-[22px] font-bold leading-none"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em" }}
          >
            InkDesk
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a key={l} href="#" className="text-[13px] transition-colors duration-200" style={{ color: "rgba(240,237,228,0.58)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = T.text)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,228,0.58)")}>{l}</a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-5">
          <a href="#" className="text-[13px] transition-colors duration-200" style={{ color: "rgba(240,237,228,0.58)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = T.text)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,228,0.58)")}>Entrar</a>
          <a href="#" className="text-[13px] font-semibold px-4 py-2 rounded-full transition-all duration-200" style={{ background: T.text, color: T.bg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px rgba(240,237,228,0.16)` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
            Começar
          </a>
        </div>
        <button className="lg:hidden p-2" style={{ color: T.muted }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t px-6 py-6 flex flex-col gap-4" style={{ background: "rgba(3,4,5,0.97)", borderColor: T.border }}>
          {links.map((l) => <a key={l} href="#" className="text-sm py-1" style={{ color: T.muted }}>{l}</a>)}
          <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: T.border }}>
            <a href="#" className="text-sm text-center py-2" style={{ color: T.muted }}>Entrar</a>
            <a href="#" className="text-sm font-semibold py-3 rounded-full text-center" style={{ background: T.text, color: T.bg }}>Começar</a>
          </div>
        </div>
      )}
    </header>
  )
}

function HeroHeadline() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const title = root.querySelector("[data-hero-title]")
    const sub = root.querySelector("[data-hero-sub]")
    if (!title || !sub) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([title, sub], { opacity: 1 })
      return
    }

    const splitTitle = new SplitText(title, { type: "words,chars" })
    const splitSub = new SplitText(sub, { type: "lines" })
    // background-clip: text do pai quebra quando os chars ganham transform; aplica o gradiente char a char
    const gradChars = splitTitle.chars.filter((c) => (c as HTMLElement).closest("[data-grad]"))
    gsap.set(gradChars, {
      backgroundImage: "linear-gradient(92deg, #4FC5D4 0%, #BDFFFF 55%, #4FC5D4 100%)",
      webkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    })
    gsap.set([title, sub], { opacity: 1 })

    const tl = gsap.timeline({ delay: 0.25 })
    tl.from(splitTitle.chars, {
      opacity: 0,
      y: 48,
      rotateX: -70,
      filter: "blur(10px)",
      transformOrigin: "50% 100%",
      duration: 0.9,
      ease: "power4.out",
      stagger: { each: 0.018, from: "start" },
    }).from(
      splitSub.lines,
      { opacity: 0, y: 22, filter: "blur(6px)", duration: 0.8, ease: "power3.out", stagger: 0.1 },
      "-=0.45",
    )

    return () => {
      tl.kill()
      splitTitle.revert()
      splitSub.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className="relative z-10 flex w-full max-w-[680px] flex-col items-start px-2 text-left">
      <h1
        data-hero-title
        className="text-[44px] font-semibold leading-[1.02] tracking-tight opacity-0 md:text-[60px] lg:text-[72px]"
        style={{ color: T.text, fontFamily: "Poppins, sans-serif", perspective: 800 }}
      >
        Sua arte no corpo.{" "}
        <span
          data-grad
          style={{
            background: "linear-gradient(92deg, #4FC5D4 0%, #BDFFFF 55%, #4FC5D4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Seu estúdio no controle.
        </span>
      </h1>
      <p
        data-hero-sub
        className="mt-6 max-w-[520px] text-base leading-7 opacity-0 md:text-lg"
        style={{ color: "rgba(240,237,228,0.6)" }}
      >
        Orçamentos, agenda, clientes e portfólio em um único painel — menos WhatsApp, mais tatuagem.
      </p>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[112vh] flex-col pt-[68px] px-5 md:px-8 overflow-hidden" style={{ background: "#020303" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(240,237,228,0.018) 0%, transparent 38%), radial-gradient(ellipse 70% 34% at 50% 102%, rgba(0,71,65,0.34) 0%, transparent 72%)"
      }} />
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-end">
        <div className="flex flex-1 items-center justify-start pt-14 pb-8 md:pt-20">
          <HeroHeadline />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.985, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.45 }} className="w-full pb-4 md:pb-5">
          <LaptopMockup />
        </motion.div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const { ref, visible } = useFadeIn()
  const accent = "#4FC5D4"
  const problems = [
    { Icon: Inbox, title: "Orçamentos perdidos no WhatsApp", desc: "Pedidos importantes somem entre conversas, áudios e fotos sem organização." },
    { Icon: Users, title: "Clientes sem histórico organizado", desc: "Sem registro de sessões anteriores, estilos preferidos ou contato centralizado." },
    { Icon: Calendar, title: "Agenda espalhada", desc: "Horários em apps diferentes, confirmações por mensagem e sessões marcadas na cabeça." },
    { Icon: ImageIcon, title: "Portfólio sem controle comercial", desc: "Artes e referências em pastas soltas, sem conexão com clientes ou orçamentos." },
  ]
  return (
    <section className="relative overflow-hidden py-28 px-6" style={{ background: T.bgSec }}>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(79,197,212,0.35) 50%, transparent 100%)" }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[900px] -translate-x-1/2 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(79,197,212,0.06) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={ref} className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[1fr_minmax(0,400px)] md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: accent }}>
              <span className="h-px w-9" style={{ background: accent }} />
              O problema
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-[1.08]" style={{ ...fs(visible, 60), color: T.text }}>
              Seu trabalho é arte.
              <br />
              <span style={{ color: T.muted }}>A bagunça da gestão não precisa fazer parte.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed md:pb-2 md:text-lg" style={{ ...fs(visible, 140), color: T.muted }}>
            Muitos tatuadores ainda controlam pedidos pelo WhatsApp, agenda por aplicativos separados, referências em pastas soltas e pagamentos em anotações manuais. O InkDesk centraliza tudo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ background: T.border, borderColor: T.border }}>
          {problems.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="group relative flex min-h-[250px] flex-col p-7 transition-colors duration-300 cursor-default"
              style={{ ...fs(visible, 180 + i * 90), background: T.card }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#0E1D19" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.card }}
            >
              <span
                className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
              <div className="mb-12 flex items-start justify-between">
                <span
                  className="text-[38px] font-bold leading-none transition-colors duration-300 group-hover:text-[#4FC5D4]"
                  style={{ fontFamily: "'Syne', sans-serif", color: "rgba(240,237,228,0.13)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105"
                  style={{ background: "rgba(79,197,212,0.07)", borderColor: "rgba(79,197,212,0.14)" }}
                >
                  <Icon size={17} style={{ color: accent }} />
                </div>
              </div>
              <h3 className="mt-auto mb-2.5 text-[15px] font-semibold leading-snug" style={{ color: T.text }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductSection() {
  const { ref, visible } = useFadeIn()
  const [active, setActive] = useState(0)
  const features = [
    { Icon: FileText, title: "Orçamentos visuais", desc: "Acompanhe cada pedido por status, valor, estilo e cliente. Do primeiro contato ao sinal pago." },
    { Icon: Users, title: "Clientes organizados", desc: "Tenha histórico, referências, sessões e contatos em um só lugar. Nunca mais procure informação." },
    { Icon: Calendar, title: "Agenda inteligente", desc: "Veja sessões marcadas, retornos, sinais pagos e horários livres em uma visão clara." },
    { Icon: ImageIcon, title: "Portfólio comercial", desc: "Organize artes, estilos, fotos e ideias para apresentar melhor seu trabalho aos clientes." },
    { Icon: MessageSquare, title: "Mensagens e follow-up", desc: "Nunca mais esqueça de responder um pedido importante. Seu painel de comunicação centralizado." },
  ]
  const kanbanCols = [
    { label: "Novo", dot: T.teal, cards: ["Flor oriental", "Lobo geométrico"] },
    { label: "Respondido", dot: T.amber, cards: ["Dragão old school"] },
    { label: "Ag. sinal", dot: "#6b7e89", cards: ["Fênix aquarela"] },
    { label: "Fechado", dot: T.green, cards: ["Mandala P&B"] },
  ]
  const clientList = [
    { name: "Ana Ferreira", sessions: 4, tag: "Fineline" },
    { name: "Carlos Mendes", sessions: 2, tag: "Realismo" },
    { name: "Juliana Costa", sessions: 7, tag: "Old School" },
  ]
  return (
    <section className="py-28 px-6" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="mb-16 max-w-xl">
          <p className="text-sm font-medium mb-3" style={{ ...fs(visible), color: T.teal }}>Produto</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ ...fs(visible, 80), color: T.text }}>
            Tudo que o tatuador precisa para vender, organizar e acompanhar.
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-2" style={fs(visible, 160)}>
            {features.map(({ Icon, title, desc }, i) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200"
                style={{ background: active === i ? `${T.teal}08` : "transparent", borderColor: active === i ? `${T.teal}25` : "transparent" }}
                onClick={() => setActive(i)}
                onMouseEnter={(e) => { if (active !== i) (e.currentTarget as HTMLElement).style.background = "rgba(240,237,228,0.025)" }}
                onMouseLeave={(e) => { if (active !== i) (e.currentTarget as HTMLElement).style.background = "transparent" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: active === i ? `${T.teal}18` : `${T.teal}0a` }}>
                  <Icon size={16} style={{ color: T.teal }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: T.text }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border overflow-hidden sticky top-28" style={{ ...fs(visible, 240), background: T.card, borderColor: T.border, boxShadow: `0 0 80px rgba(0,0,0,0.6)` }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: T.border, background: T.bgSec }}>
              <span className="text-[12px] font-medium" style={{ color: T.muted }}>{features[active].title}</span>
              <div className="flex gap-1.5">
                {[T.teal, T.amber, T.green].map((c) => <div key={c} className="w-2 h-2 rounded-full opacity-50" style={{ background: c }} />)}
              </div>
            </div>
            <div className="p-5">
              {active === 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {kanbanCols.map(({ label, dot, cards }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                        <span className="text-[10px]" style={{ color: T.muted }}>{label}</span>
                      </div>
                      {cards.map((c) => <div key={c} className="p-2.5 rounded-xl border text-[10px]" style={{ background: T.bgSec, borderColor: T.border, color: "rgba(240,237,228,0.62)" }}>{c}</div>)}
                    </div>
                  ))}
                </div>
              )}
              {active === 1 && (
                <div className="flex flex-col gap-2">
                  {clientList.map(({ name, sessions, tag }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: T.bgSec, borderColor: T.border }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: `${T.teal}20`, color: T.teal }}>{name[0]}</div>
                      <div className="flex-1">
                        <div className="text-[11px] font-medium" style={{ color: T.text }}>{name}</div>
                        <div className="text-[10px]" style={{ color: T.muted }}>{sessions} sessões</div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: `${T.teal}14`, color: T.teal }}>{tag}</span>
                    </div>
                  ))}
                </div>
              )}
              {active === 2 && (
                <div className="flex flex-col gap-2">
                  {[{ client: "Ana Ferreira", time: "10:00", paid: true }, { client: "Carlos Mendes", time: "14:00", paid: false }, { client: "Juliana Costa", time: "17:30", paid: true }].map(({ client, time, paid }) => (
                    <div key={client} className="flex items-center gap-2 p-2.5 rounded-lg border"
                      style={{ background: paid ? `${T.green}10` : `${T.teal}08`, borderColor: paid ? `${T.green}20` : `${T.teal}18` }}>
                      <div className="w-1 h-6 rounded-full" style={{ background: paid ? T.green : T.teal }} />
                      <div>
                        <div className="text-[11px] font-medium" style={{ color: T.text }}>{client}</div>
                        <div className="text-[10px]" style={{ color: T.muted }}>{time}{paid ? " · Sinal pago ✓" : ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {active === 3 && (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square rounded-xl border" style={{ background: `linear-gradient(135deg, ${T.card} 0%, rgba(0,71,65,0.18) 100%)`, borderColor: T.border }} />)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Fineline", "Realismo", "Geométrico", "Old School", "Aquarela"].map((s) => <span key={s} className="text-[9px] px-2 py-0.5 rounded-full border" style={{ borderColor: T.border, color: T.muted }}>{s}</span>)}
                  </div>
                </div>
              )}
              {active === 4 && (
                <div className="flex flex-col gap-2">
                  {[{ from: "Ana Ferreira", preview: "Queria fazer uma flor no antebraço...", time: "10m", unread: true }, { from: "Carlos Mendes", preview: "Quando fica pronto o orçamento?", time: "1h", unread: true }, { from: "Juliana Costa", preview: "Confirmei o sinal!", time: "3h", unread: false }].map(({ from, preview, time, unread }) => (
                    <div key={from} className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ background: unread ? `${T.teal}06` : T.bgSec, borderColor: unread ? `${T.teal}20` : T.border }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: `${T.teal}20`, color: T.teal }}>{from[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium" style={{ color: T.text }}>{from}</span>
                          <span className="text-[9px]" style={{ color: T.muted }}>{time}</span>
                        </div>
                        <p className="text-[10px] truncate" style={{ color: T.muted }}>{preview}</p>
                      </div>
                      {unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: T.teal }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const { ref, visible } = useFadeIn()
  const steps = [
    { n: "01", Icon: MessageSquare, title: "Cliente envia uma ideia", desc: "Referências, estilo, tamanho e localização chegam pelo seu canal." },
    { n: "02", Icon: FileText, title: "Você cria o orçamento", desc: "Registra valor, estilo, tempo estimado e envia o retorno." },
    { n: "03", Icon: Layers, title: "Pedido entra no painel", desc: "Aparece no kanban com status e dados do cliente organizados." },
    { n: "04", Icon: CheckCircle2, title: "Cliente confirma o sinal", desc: "Você marca o pagamento e o pedido avança automaticamente." },
    { n: "05", Icon: Calendar, title: "Sessão entra na agenda", desc: "Data, horário e cliente confirmados na sua grade da semana." },
  ]
  return (
    <section className="py-28 px-6" style={{ background: T.bgSec }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <p className="text-sm font-medium mb-3" style={{ ...fs(visible), color: T.teal }}>Como funciona</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ ...fs(visible, 80), color: T.text }}>Do primeiro contato até a sessão fechada.</h2>
        </div>
        <div className="relative">
          <div className="absolute top-10 left-0 right-0 h-px hidden lg:block" style={{ background: `linear-gradient(90deg, transparent, ${T.teal}25, transparent)` }} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map(({ n, Icon, title, desc }, i) => (
              <div key={n} className="flex flex-col items-center text-center lg:items-start lg:text-left" style={fs(visible, 120 + i * 80)}>
                <div className="relative w-10 h-10 rounded-full border flex items-center justify-center mb-5 flex-shrink-0 z-10" style={{ background: T.card, borderColor: `${T.teal}30` }}>
                  <Icon size={16} style={{ color: T.teal }} />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: T.teal, color: T.bg }}>{i + 1}</span>
                </div>
                <div className="text-[11px] font-bold mb-1" style={{ color: T.teal, letterSpacing: "0.08em" }}>{n}</div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: T.text }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function InterfaceSection() {
  const { ref, visible } = useFadeIn()
  return (
    <section className="py-28 px-6" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <p className="text-sm font-medium mb-3" style={{ ...fs(visible), color: T.teal }}>Interface</p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto" style={{ ...fs(visible, 80), color: T.text }}>
            Uma interface feita para ser rápida, bonita e fácil de usar.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border overflow-hidden" style={{ ...fs(visible, 140), background: T.card, borderColor: T.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: T.border, background: T.bgSec }}>
              <span className="text-sm font-semibold" style={{ color: T.text }}>Orçamentos</span>
              <Filter size={13} style={{ color: T.muted }} />
            </div>
            <div className="p-4 flex flex-col gap-2">
              {[{ status: "Novo", client: "Beatriz Almada", style: "Fineline", value: "R$800", dot: T.teal }, { status: "Ag. sinal", client: "Pedro Ramos", style: "Realismo", value: "R$1.500", dot: T.amber }, { status: "Fechado", client: "Carla Neves", style: "Old School", value: "R$600", dot: T.green }].map(({ status, client, style, value, dot }) => (
                <div key={client} className="p-3.5 rounded-xl border" style={{ background: T.bgSec, borderColor: T.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} /><span className="text-[10px]" style={{ color: T.muted }}>{status}</span></div>
                    <span className="text-[11px] font-semibold" style={{ color: T.teal }}>{value}</span>
                  </div>
                  <div className="text-[12px] font-medium" style={{ color: T.text }}>{client}</div>
                  <div className="text-[10px]" style={{ color: T.muted }}>{style}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ ...fs(visible, 220), background: T.card, borderColor: T.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: T.border, background: T.bgSec }}>
              <span className="text-sm font-semibold" style={{ color: T.text }}>Agenda</span>
              <span className="text-[10px]" style={{ color: T.muted }}>Julho 2026</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-3">
                {["D","S","T","Q","Q","S","S"].map((d, i) => <div key={i} className="text-center text-[9px]" style={{ color: T.muted }}>{d}</div>)}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <div key={d} className="text-center text-[10px] w-full aspect-square flex items-center justify-center rounded-md"
                    style={{ background: [3,9,14,17,22].includes(d) ? `${T.teal}20` : "transparent", color: [3,9,14,17,22].includes(d) ? T.teal : T.muted, fontWeight: [3,9,14,17,22].includes(d) ? 600 : 400 }}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {[{ client: "Ana Ferreira", time: "10:00", paid: true }, { client: "Carlos Mendes", time: "14:00", paid: false }].map(({ client, time, paid }) => (
                  <div key={client} className="flex items-center gap-2 p-2.5 rounded-lg border" style={{ background: paid ? `${T.green}10` : `${T.teal}08`, borderColor: paid ? `${T.green}20` : `${T.teal}18` }}>
                    <div className="w-1 h-6 rounded-full" style={{ background: paid ? T.green : T.teal }} />
                    <div>
                      <div className="text-[11px] font-medium" style={{ color: T.text }}>{client}</div>
                      <div className="text-[10px]" style={{ color: T.muted }}>{time}{paid ? " · Sinal pago ✓" : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ ...fs(visible, 300), background: T.card, borderColor: T.border }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: T.border, background: T.bgSec }}>
              <span className="text-sm font-semibold" style={{ color: T.text }}>Cliente</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold" style={{ background: `${T.teal}20`, color: T.teal }}>J</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: T.text }}>Juliana Costa</div>
                  <div className="text-[11px]" style={{ color: T.muted }}>7 sessões · Desde 2023</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[{ label: "Estilo favorito", value: "Old School" }, { label: "Próxima sessão", value: "09/07 às 15:00" }, { label: "Valor total", value: "R$4.200" }].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-2.5 rounded-lg border" style={{ background: T.bgSec, borderColor: T.border }}>
                    <span className="text-[11px]" style={{ color: T.muted }}>{label}</span>
                    <span className="text-[11px] font-medium" style={{ color: T.text }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="text-[10px] mb-1.5 font-medium" style={{ color: T.muted }}>Referências</div>
                <div className="flex gap-1.5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-10 h-10 rounded-lg border" style={{ background: `linear-gradient(135deg, ${T.card} 0%, rgba(0,71,65,0.16) 100%)`, borderColor: T.border }} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ForWhomSection() {
  const { ref, visible } = useFadeIn()
  const personas = [
    { title: "Tatuador independente", desc: "Controle pedidos, agenda e clientes sem depender de planilhas, grupos de WhatsApp ou anotações avulsas.", accent: T.teal },
    { title: "Estúdio pequeno", desc: "Organize a operação sem precisar de sistemas complexos. Uma visão clara de tudo que está acontecendo.", accent: T.amber },
    { title: "Artista em crescimento", desc: "Tenha uma estrutura profissional para vender melhor, atender mais rápido e escalar com qualidade.", accent: T.green },
  ]
  return (
    <section className="py-28 px-6" style={{ background: T.bgSec }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ ...fs(visible), color: T.text }}>Feito para quem vive da própria arte.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personas.map(({ title, desc, accent }, i) => (
            <div key={title} className="rounded-2xl border p-7 flex flex-col gap-4 transition-all duration-300 cursor-default"
              style={{ ...fs(visible, 100 + i * 100), background: `linear-gradient(135deg, ${accent}10 0%, transparent 60%)`, borderColor: T.border }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}30`; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.border; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}>
              <div className="w-10 h-10 rounded-full" style={{ background: `radial-gradient(circle, ${accent}40 0%, ${accent}08 70%)`, boxShadow: `0 0 20px ${accent}20` }} />
              <div>
                <h3 className="text-base font-bold mb-2" style={{ color: T.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{desc}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-sm font-medium" style={{ color: accent }}>Saiba mais <ArrowRight size={14} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DifferentialsSection() {
  const { ref, visible } = useFadeIn()
  const diffs = [
    { Icon: Layers, title: "Painel limpo e direto", desc: "Sem menus escondidos. Tudo que você precisa na primeira tela." },
    { Icon: BarChart3, title: "Controle por status", desc: "Orçamentos, sessões e clientes sempre com situação clara." },
    { Icon: Users, title: "Histórico completo", desc: "Cada cliente com registro de sessões, referências e valores." },
    { Icon: Calendar, title: "Agenda integrada", desc: "Sessões conectadas a orçamentos. Sem duplicação de dados." },
    { Icon: ImageIcon, title: "Portfólio organizado", desc: "Suas artes, estilos e fotos em um portfólio dentro do sistema." },
    { Icon: Zap, title: "Pensado para tatuadores", desc: "Não é um sistema genérico adaptado. É feito para o seu negócio." },
  ]
  return (
    <section className="py-28 px-6" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto" style={{ ...fs(visible), color: T.text }}>Gestão com estética, velocidade e clareza.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diffs.map(({ Icon, title, desc }, i) => (
            <div key={title} className="p-6 rounded-2xl border transition-all duration-200 cursor-default"
              style={{ ...fs(visible, 80 + i * 60), background: T.card, borderColor: T.border }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${T.teal}28`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${T.teal}18` }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.border; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${T.teal}10` }}>
                <Icon size={16} style={{ color: T.teal }} />
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: T.text }}>{title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const { ref, visible } = useFadeIn()
  const items = ["Orçamentos ilimitados", "Cadastro de clientes", "Agenda de sessões", "Portfólio organizado", "Painel de visão geral", "Suporte inicial"]
  return (
    <section className="py-28 px-6" style={{ background: T.bgSec }}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto" style={{ ...fs(visible), color: T.text }}>Comece simples. Evolua conforme seu estúdio cresce.</h2>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl border p-8 relative overflow-hidden"
            style={{ ...fs(visible, 120), background: T.card, borderColor: `${T.teal}25`, boxShadow: `0 0 80px ${T.teal}08, 0 40px 80px rgba(0,0,0,0.6)` }}>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 blur-3xl opacity-20 pointer-events-none" style={{ background: T.teal }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: T.teal }}>InkDesk Starter</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold" style={{ color: T.text }}>R$49</span>
                    <span className="text-base" style={{ color: T.muted }}>/mês</span>
                  </div>
                </div>
                <span className="text-[10px] px-3 py-1.5 rounded-full border font-medium" style={{ background: `${T.amber}12`, borderColor: `${T.amber}25`, color: T.amber }}>Beta</span>
              </div>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: T.muted }}>Para tatuadores que querem sair da bagunça e controlar melhor seus pedidos.</p>
              <div className="flex flex-col gap-3 mb-8">
                {items.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={15} style={{ color: T.green, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: T.text }}>{item}</span>
                  </div>
                ))}
              </div>
              <a href="#" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200" style={{ background: T.teal, color: T.bg }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${T.teal}35` }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
                Entrar na lista de acesso <ArrowRight size={16} />
              </a>
              <p className="text-center text-[11px] mt-4" style={{ color: "rgba(155,173,184,0.45)" }}>Plano e recursos podem variar durante a fase beta.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const { ref, visible } = useFadeIn()
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: "O InkDesk é para tatuador autônomo?", a: "Sim. Ele foi pensado para tatuadores independentes e pequenos estúdios que querem organizar pedidos, clientes e agenda." },
    { q: "Preciso instalar alguma coisa?", a: "Não. O InkDesk funciona online, direto pelo navegador, sem necessidade de instalação." },
    { q: "Posso usar para controlar orçamentos do WhatsApp?", a: "Sim. A ideia é trazer os pedidos para um painel organizado, evitando que conversas importantes se percam." },
    { q: "Vai ter controle financeiro?", a: "A versão inicial foca em orçamentos, clientes e agenda. Recursos financeiros podem entrar nas próximas versões." },
    { q: "Posso cadastrar meu portfólio?", a: "Sim. O portfólio faz parte da organização do artista dentro do sistema, conectado a estilos, clientes e orçamentos." },
  ]
  return (
    <section className="py-28 px-6" style={{ background: T.bg }}>
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold" style={{ ...fs(visible), color: T.text }}>Perguntas frequentes</h2>
        </div>
        <div className="flex flex-col gap-2" style={fs(visible, 100)}>
          {faqs.map(({ q, a }, i) => (
            <div key={q} className="rounded-2xl border overflow-hidden transition-all duration-200"
              style={{ background: open === i ? `${T.teal}06` : T.card, borderColor: open === i ? `${T.teal}25` : T.border }}>
              <button className="flex items-center justify-between w-full px-6 py-5 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium" style={{ color: T.text }}>{q}</span>
                <ChevronDown size={16} style={{ color: T.muted, flexShrink: 0, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
              </button>
              <div style={{ maxHeight: open === i ? "200px" : "0px", overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: T.muted }}>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { ref, visible } = useFadeIn()
  return (
    <section className="py-28 px-6 relative overflow-hidden" style={{ background: T.bgSec }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${T.teal}0e 0%, transparent 70%)` }} />
      <div ref={ref} className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ ...fs(visible), color: T.text }}>
          Transforme sua rotina de tatuador em uma{" "}
          <span style={{ background: `linear-gradient(135deg, ${T.text}, ${T.teal})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            operação organizada.
          </span>
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ ...fs(visible, 100), color: T.muted }}>
          O InkDesk coloca seus pedidos, clientes, agenda e portfólio em um só lugar — com a estética que seu trabalho merece.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={fs(visible, 180)}>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 w-full sm:w-auto justify-center" style={{ background: T.teal, color: T.bg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${T.teal}40` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
            Começar agora <ArrowRight size={16} />
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-sm border transition-all duration-200 w-full sm:w-auto justify-center" style={{ borderColor: T.border, color: T.text, background: "rgba(240,237,228,0.035)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${T.teal}35`; (e.currentTarget as HTMLElement).style.background = `${T.teal}08` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.border; (e.currentTarget as HTMLElement).style.background = "rgba(240,237,228,0.035)" }}>
            Ver interface
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 py-12 border-t" style={{ background: T.bg, borderColor: T.border }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="font-bold text-xl mb-1" style={{ color: T.teal }}>InkDesk</div>
          <p className="text-sm" style={{ color: T.muted }}>Sua bancada digital.</p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {["Produto", "Recursos", "Preços", "FAQ", "Contato"].map((l) => (
            <a key={l} href="#" className="text-sm transition-colors duration-200" style={{ color: T.muted }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = T.text)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = T.muted)}>{l}</a>
          ))}
        </nav>
        <p className="text-[12px]" style={{ color: "rgba(155,173,184,0.4)" }}>© 2026 InkDesk. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: T.bg, minHeight: "100vh" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,71,65,0.45); border-radius: 3px; }
      `}</style>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <ProductSection />
        <WorkflowSection />
        <InterfaceSection />
        <ForWhomSection />
        <DifferentialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
