import { useState, useEffect, useRef, CSSProperties } from "react"
import { motion } from "motion/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import {
  LayoutDashboard, Users, Calendar, ImageIcon, MessageSquare, Settings,
  TrendingUp, Clock, CheckCircle2, Package,
  Zap, ArrowRight, Menu, X, FileText, Bell,
  Layers, Filter, BarChart3, Inbox, WalletCards, DollarSign, Search, Plus,
  ChevronDown, HeartHandshake,
} from "lucide-react"
import marklyIcon from "../assets/icon-markly.png"
import LaserFlow from "./components/LaserFlow/LaserFlow"
import CardSwap, { Card } from "./components/ui/CardSwap"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion"
import AuthPage from "./pages/AuthPage"
import DevDashboard from "./pages/DevDashboard"
import { T } from "./theme"

gsap.registerPlugin(SplitText)

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
      src={marklyIcon}
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
  const navItems = [
    { Icon: LayoutDashboard, label: "Visão geral", active: true, badge: null as string | null },
    { Icon: FileText, label: "Orçamentos", active: false, badge: "12" },
    { Icon: Users, label: "Clientes", active: false, badge: null },
    { Icon: Calendar, label: "Agenda", active: false, badge: "Hoje" },
    { Icon: ImageIcon, label: "Portfólio", active: false, badge: null },
    { Icon: MessageSquare, label: "Mensagens", active: false, badge: "3" },
    { Icon: DollarSign, label: "Financeiro", active: false, badge: null },
    { Icon: HeartHandshake, label: "Anamnese", active: false, badge: null },
  ] as const

  const stats = [
    { label: "Orçamentos abertos", value: "42", hint: "12 sem resposta", Icon: FileText },
    { label: "Sessões hoje", value: "3", hint: "Próxima às 10:00", Icon: Calendar },
    { label: "Sinais pendentes", value: "R$ 1.240", hint: "4 aguardando", Icon: WalletCards },
    { label: "Faturamento estimado", value: "R$ 8.450", hint: "mês atual", Icon: TrendingUp },
  ] as const

  const pipeline = [
    { label: "Novo", value: "R$ 2.400", count: "8" },
    { label: "Em análise", value: "R$ 5.800", count: "12" },
    { label: "Sinal pendente", value: "R$ 1.240", count: "4" },
    { label: "Agendado", value: "R$ 8.450", count: "18" },
  ]

  const attention = [
    { name: "Mariana Alves", description: "Orçamento enviado há 2 dias", badge: "Follow-up" },
    { name: "Lucas Rocha", description: "Sinal pendente", badge: "Pagamento" },
    { name: "Júlia Martins", description: "Sessão hoje às 10:00", badge: "Hoje" },
  ]

  const schedule = [
    { time: "10:00", title: "Sessão floral P&B", client: "Júlia Martins", status: "Sinal pago", alert: false },
    { time: "13:30", title: "Retoque fine line", client: "Marina Alves", status: "Confirmado", alert: false },
    { time: "16:00", title: "Consulta blackwork", client: "Rafael Nunes", status: "Anamnese pendente", alert: true },
  ]

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
          color="#D8D0BF"
          fogIntensity={0.4}
          wispIntensity={3}
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
          href="#/painel"
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
            style={{ borderColor: T.border, background: "#040907" }}
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
              app.markly.com.br
            </div>
            <Bell size={11} style={{ color: "rgba(240,237,228,0.22)" }} />
          </div>

          <div className="flex" style={{ height: "min(52vw, 580px)", minHeight: 400 }}>
            <div
              className="hidden w-[200px] flex-shrink-0 flex-col border-r p-3 sm:flex"
              style={{ background: "#040907", borderColor: T.border }}
            >
              <div className="mb-2 flex items-center gap-2 px-2 py-2 text-[13px] font-semibold" style={{ color: T.text, fontFamily: "'Syne', sans-serif" }}>
                <BrandMark size={22} />
                Markly
              </div>

              <div
                className="mb-3 flex items-center gap-2 rounded-[12px] border px-2 py-2"
                style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border }}
              >
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-[9px] border text-[11px] font-semibold"
                  style={{ background: "rgba(0,71,65,0.24)", borderColor: "rgba(240,237,228,0.14)", color: T.accent }}
                >
                  I
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold" style={{ color: T.text }}>Ink Tattoo</span>
                  <span className="block text-[9px]" style={{ color: T.faint }}>Studio ativo</span>
                </span>
                <ChevronDown size={12} style={{ color: T.faint }} />
              </div>

              <p className="mb-1 px-2 text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(240,237,228,0.35)" }}>
                Workspace
              </p>
              <div className="flex flex-col gap-0.5">
                {navItems.map(({ Icon, label, active, badge }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[11px]"
                    style={{
                      background: active ? "rgba(240,237,228,0.10)" : "transparent",
                      color: active ? T.text : "rgba(240,237,228,0.55)",
                    }}
                  >
                    <Icon size={13} />
                    <span className="flex-1 truncate">{label}</span>
                    {badge && (
                      <span className="text-[9px]" style={{ color: "rgba(240,237,228,0.45)" }}>{badge}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t pt-2" style={{ borderColor: T.border }}>
                <div className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[11px]" style={{ color: "rgba(240,237,228,0.35)" }}>
                  <Settings size={13} />
                  <span>Configurações</span>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: T.bg }}>
              <div
                className="flex h-11 shrink-0 items-center justify-between border-b px-4"
                style={{ background: "rgba(4,9,7,0.78)", borderColor: T.border }}
              >
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Painel interno</p>
                  <p className="truncate text-[12px] font-semibold" style={{ color: T.text }}>Olá, Bruno</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="hidden rounded-full border px-2 py-0.5 text-[9px] md:inline-flex" style={{ borderColor: T.border, color: T.muted }}>Owner</span>
                  <Bell size={12} style={{ color: T.muted }} />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden p-3 md:p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div
                      className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold"
                      style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}
                    >
                      <span className="h-1 w-1 rounded-full" style={{ background: T.accent }} />
                      Operação ativa
                    </div>
                    <h2 className="text-[18px] font-semibold leading-tight md:text-[22px]" style={{ color: T.text, fontFamily: "'Syne', sans-serif" }}>
                      Visão geral
                    </h2>
                    <p className="mt-0.5 text-[11px]" style={{ color: T.muted }}>Ink Tattoo · Hoje</p>
                    <p className="mt-0.5 hidden text-[10px] sm:block" style={{ color: T.faint }}>
                      3 sessões hoje · 12 orçamentos abertos · R$ 1.240 em sinais pendentes
                    </p>
                  </div>
                  <div className="hidden shrink-0 gap-1.5 sm:flex">
                    <span
                      className="inline-flex items-center gap-1 rounded-[10px] border px-2.5 py-1.5 text-[10px]"
                      style={{ borderColor: T.border, color: T.muted }}
                    >
                      <Search size={11} /> Buscar
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[10px] font-semibold"
                      style={{ background: T.text, color: T.bg }}
                    >
                      <Plus size={11} /> Novo
                    </span>
                  </div>
                </div>

                <div className="mb-2.5 grid grid-cols-2 gap-2 xl:grid-cols-4">
                  {stats.map(({ label, value, hint, Icon }, index) => (
                    <div
                      key={label}
                      className="rounded-[14px] border p-2.5"
                      style={{ background: T.card, borderColor: T.border }}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="truncate text-[9px]" style={{ color: T.muted }}>{label}</span>
                        <span
                          className="flex size-6 shrink-0 items-center justify-center rounded-[8px] border"
                          style={{ background: "rgba(240,237,228,0.04)", borderColor: T.border }}
                        >
                          <Icon size={11} style={{ color: index % 2 === 0 ? T.accent : "#8DCEC0" }} />
                        </span>
                      </div>
                      <div className="text-[15px] font-semibold tracking-tight" style={{ color: T.text }}>{value}</div>
                      <div className="mt-0.5 truncate text-[9px]" style={{ color: T.faint }}>{hint}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-2.5 rounded-[14px] border p-2.5" style={{ background: T.card, borderColor: T.border }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: T.text }}>Pipeline de orçamentos</span>
                    <span className="text-[9px]" style={{ color: T.faint }}>Valores estimados</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-4">
                    {pipeline.map((stage) => (
                      <div
                        key={stage.label}
                        className="rounded-[10px] border px-2 py-2"
                        style={{ background: T.bgSec, borderColor: T.border }}
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-1">
                          <span className="truncate text-[9px] font-semibold" style={{ color: T.text }}>{stage.label}</span>
                          <span
                            className="rounded-full border px-1.5 py-0.5 text-[8px]"
                            style={{ borderColor: T.border, color: T.faint }}
                          >
                            {stage.count}
                          </span>
                        </div>
                        <div className="text-[12px] font-semibold" style={{ color: T.text }}>{stage.value}</div>
                        <div className="text-[8px]" style={{ color: T.faint }}>{stage.count} oportunidades</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid min-h-0 gap-2.5 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="min-w-0 rounded-[14px] border p-2.5" style={{ background: T.card, borderColor: T.border }}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold" style={{ color: T.text }}>Precisa de atenção</span>
                      <span className="text-[9px]" style={{ color: T.faint }}>Prioridade de hoje</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {attention.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2 rounded-[10px] border px-2 py-1.5"
                          style={{ background: "rgba(6,17,15,0.76)", borderColor: T.border }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold" style={{ color: T.text }}>{item.name}</p>
                            <p className="truncate text-[9px]" style={{ color: T.faint }}>{item.description}</p>
                          </div>
                          <span
                            className="shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-semibold"
                            style={{ borderColor: T.border, color: T.muted }}
                          >
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 rounded-[14px] border p-2.5" style={{ background: T.card, borderColor: T.border }}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold" style={{ color: T.text }}>Agenda de hoje</span>
                      <span className="text-[9px]" style={{ color: T.faint }}>3 sessões</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {schedule.map((event) => (
                        <div
                          key={event.time}
                          className="flex items-center gap-2 rounded-[10px] border px-2 py-1.5"
                          style={{ background: T.bgSec, borderColor: T.border }}
                        >
                          <div
                            className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[8px] text-[9px] font-semibold"
                            style={{ background: "rgba(240,237,228,0.06)", color: T.accent }}
                          >
                            {event.time}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-semibold" style={{ color: T.text }}>{event.title}</p>
                            <p className="truncate text-[9px]" style={{ color: T.faint }}>{event.client}</p>
                          </div>
                          <span
                            className="hidden shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-semibold md:inline-flex"
                            style={{
                              background: event.alert ? "rgba(216,208,191,0.10)" : "rgba(47,127,104,0.12)",
                              borderColor: event.alert ? "rgba(216,208,191,0.28)" : "rgba(47,127,104,0.30)",
                              color: T.accent,
                            }}
                          >
                            {event.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
  const links = [
    { label: "Produto", href: "#produto" },
    { label: "Recursos", href: "#recursos" },
    { label: "Clientes", href: "#clientes" },
    { label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
    { label: "Contato", href: "#contato" },
  ]
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
            className="font-display text-[22px] font-bold"
            style={{ letterSpacing: "-0.04em" }}
          >
            Markly
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="group relative px-1 py-1.5 text-[13px] transition-colors duration-300"
              style={{ color: "rgba(240,237,228,0.58)" }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-[#D8D0BF]">{label}</span>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${T.accent}, transparent)` }}
              />
            </a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-5">
          <a href="#/login" className="text-[13px] transition-colors duration-200" style={{ color: "rgba(240,237,228,0.58)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = T.text)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,228,0.58)")}>Entrar</a>
          <a href="#/cadastro" className="text-[13px] font-semibold px-4 py-2 rounded-full transition-all duration-200" style={{ background: T.text, color: T.bg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px rgba(240,237,228,0.16)` }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
            Começar teste
          </a>
        </div>
        <button className="lg:hidden p-2" style={{ color: T.muted }} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t px-6 py-6 flex flex-col gap-4" style={{ background: "rgba(3,4,5,0.97)", borderColor: T.border }}>
          {links.map(({ label, href }) => <a key={label} href={href} className="text-sm py-1" style={{ color: T.muted }} onClick={() => setOpen(false)}>{label}</a>)}
          <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: T.border }}>
            <a href="#/login" className="text-sm text-center py-2" style={{ color: T.muted }} onClick={() => setOpen(false)}>Entrar</a>
            <a href="#/cadastro" className="text-sm font-semibold py-3 rounded-full text-center" style={{ background: T.text, color: T.bg }} onClick={() => setOpen(false)}>Começar teste</a>
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
    const trial = root.querySelector("[data-hero-trial]")
    if (!title || !sub) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([title, sub, trial].filter(Boolean), { opacity: 1 })
      return
    }

    const splitTitle = new SplitText(title, { type: "words,chars" })
    const splitSub = new SplitText(sub, { type: "lines" })
    // background-clip: text do pai quebra quando os chars ganham transform; aplica o gradiente char a char
    const gradChars = splitTitle.chars.filter((c) => (c as HTMLElement).closest("[data-grad]"))
    gsap.set(gradChars, {
      backgroundImage: "linear-gradient(92deg, #D8D0BF 0%, #F0EDE4 55%, #D8D0BF 100%)",
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
    ).from(
      trial,
      { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" },
      "-=0.35",
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
        className="text-[44px] font-semibold leading-tight tracking-tight opacity-0 md:text-[60px] lg:text-[72px]"
        style={{ color: T.text, fontFamily: "Poppins, sans-serif", perspective: 800 }}
      >
        Seu ofício no centro.{" "}
        <span
          data-grad
          style={{
            background: "linear-gradient(92deg, #D8D0BF 0%, #F0EDE4 55%, #D8D0BF 100%)",
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
        Orçamentos, agenda, clientes e portfólio em um único painel — para tatuagem, barbearia, estética, unhas e outros studios.
      </p>
      <p
        className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium opacity-0"
        data-hero-trial
        style={{ color: T.accent, borderColor: "rgba(240,237,228,0.18)", background: "rgba(0,71,65,0.22)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.accent }} />
        Teste grátis por 5 dias
      </p>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[112vh] flex-col pt-[68px] px-5 md:px-8 overflow-hidden" style={{ background: T.bg }}>
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
  const accent = T.accent
  const problems = [
    { Icon: Inbox, title: "Orçamentos perdidos no WhatsApp", desc: "Pedidos importantes somem entre conversas, áudios e fotos sem organização." },
    { Icon: Users, title: "Clientes sem histórico organizado", desc: "Sem registro de atendimentos anteriores, preferências ou contato centralizado." },
    { Icon: Calendar, title: "Agenda espalhada", desc: "Horários em apps diferentes, confirmações por mensagem e atendimentos marcados na cabeça." },
    { Icon: ImageIcon, title: "Portfólio sem controle comercial", desc: "Fotos e trabalhos em pastas soltas, sem conexão com clientes ou orçamentos." },
  ]
  return (
    <section className="relative overflow-hidden py-28 px-6" style={{ background: T.bgSec }}>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(240,237,228,0.16) 50%, transparent 100%)" }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[900px] -translate-x-1/2 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(0,71,65,0.22) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div ref={ref} className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[1fr_minmax(0,400px)] md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: accent }}>
              <span className="h-px w-9" style={{ background: accent }} />
              O problema
            </p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ ...fs(visible, 60), color: T.text }}>
              Seu trabalho é o atendimento.
              <br />
              <span style={{ color: T.muted }}>A bagunça da gestão não precisa fazer parte.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed md:pb-2 md:text-lg" style={{ ...fs(visible, 140), color: T.muted }}>
            Muitos profissionais ainda controlam pedidos pelo WhatsApp, agenda por aplicativos separados, fotos em pastas soltas e pagamentos em anotações manuais. O Markly centraliza tudo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ background: T.border, borderColor: T.border }}>
          {problems.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="group relative flex min-h-[250px] flex-col p-7 transition-colors duration-300 cursor-default"
              style={{ ...fs(visible, 180 + i * 90), background: T.card }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.cardElev }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.card }}
            >
              <span
                className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
              <div className="mb-12 flex items-start justify-between">
                <span
                  className="text-[38px] font-bold leading-none transition-colors duration-300 group-hover:text-[#D8D0BF]"
                  style={{ fontFamily: "'Syne', sans-serif", color: "rgba(240,237,228,0.13)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105"
                  style={{ background: "rgba(0,71,65,0.25)", borderColor: "rgba(240,237,228,0.12)" }}
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
  const featureRefs = useRef<Array<HTMLDivElement | null>>([])
  const features = [
    { Icon: FileText, title: "Orçamentos visuais", desc: "Cada pedido entra com serviço, detalhes, valor e status. Você acompanha do primeiro contato ao depósito pago.", metric: "18 pedidos ativos" },
    { Icon: Users, title: "Clientes organizados", desc: "Histórico, preferências, atendimentos e contatos ficam reunidos em uma ficha simples de consultar.", metric: "127 clientes salvos" },
    { Icon: Calendar, title: "Agenda inteligente", desc: "Atendimentos, retornos, encaixes e horários livres aparecem conectados ao cliente e ao orçamento.", metric: "9 atendimentos na semana" },
    { Icon: ImageIcon, title: "Portfólio comercial", desc: "Fotos, trabalhos e categorias viram um acervo vendável para responder melhor cada pedido.", metric: "42 trabalhos" },
    { Icon: MessageSquare, title: "Mensagens e follow-up", desc: "Veja quem precisa de resposta, quem confirmou o depósito e quem merece um lembrete para fechar.", metric: "6 conversas quentes" },
  ]
  const kanbanCols = [
    { label: "Novo", dot: T.text, cards: ["Corte + barba", "Limpeza de pele"] },
    { label: "Respondido", dot: T.amber, cards: ["Alongamento em gel"] },
    { label: "Ag. depósito", dot: T.muted, cards: ["Pacote mensal"] },
    { label: "Fechado", dot: T.green, cards: ["Manutenção"] },
  ]
  const clientList = [
    { name: "Mariana Alves", sessions: 4, tag: "Barbearia" },
    { name: "Lucas Rocha", sessions: 2, tag: "Estética" },
    { name: "Carla Vieira", sessions: 7, tag: "Unhas" },
  ]

  // Sincroniza o painel sticky com o item que cruza a faixa central da viewport.
  // Threshold 0 + banda estreita: dispara poucas vezes e os cards têm altura fixa,
  // então não há loop de layout nem custo perceptível no scroll.
  useEffect(() => {
    const items = featureRefs.current.filter(Boolean) as HTMLDivElement[]
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.featureIndex)
            if (!Number.isNaN(index)) setActive(index)
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const accent = T.accent

  return (
    <section id="produto" className="relative overflow-x-clip scroll-mt-[68px] px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bg }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(240,237,228,0.16) 50%, transparent 100%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-18%] top-24 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "rgba(0,71,65,0.24)" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,680px)_minmax(260px,360px)] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: accent }}>
              <span className="h-px w-9" style={{ background: accent }} />
              Produto
            </p>
            <h2 className="max-w-[680px] text-3xl font-semibold leading-tight md:text-5xl" style={{ ...fs(visible, 80), color: T.text }}>
              Um painel para vender melhor <span style={{ color: T.muted }}>sem perder o controle do estúdio.</span>
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-7 md:text-base lg:pb-1" style={{ ...fs(visible, 140), color: T.muted }}>
            Cada módulo conversa com o outro: pedido vira orçamento, orçamento vira agenda, agenda alimenta histórico e follow-up.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">
          <div className="flex flex-col gap-3 lg:py-6" style={fs(visible, 180)}>
            {features.map(({ Icon, title, desc, metric }, i) => (
              <div
                key={title}
                ref={(node) => { featureRefs.current[i] = node }}
                data-feature-index={i}
                className="group relative cursor-pointer overflow-hidden rounded-[14px] border p-4 transition-colors duration-300 md:p-5"
                style={{
                  background: active === i ? "rgba(0,71,65,0.16)" : "rgba(240,237,228,0.018)",
                  borderColor: active === i ? "rgba(240,237,228,0.22)" : "rgba(240,237,228,0.06)",
                }}
                onClick={() => setActive(i)}
                onMouseEnter={(e) => {
                  if (active !== i) {
                    const target = e.currentTarget as HTMLElement
                    target.style.background = "rgba(240,237,228,0.035)"
                    target.style.borderColor = "rgba(240,237,228,0.12)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== i) {
                    const target = e.currentTarget as HTMLElement
                    target.style.background = "rgba(240,237,228,0.018)"
                    target.style.borderColor = "rgba(240,237,228,0.06)"
                  }
                }}
              >
                <span
                  className="absolute left-0 top-0 h-full w-[3px] transition-all duration-300"
                  style={{ background: active === i ? `linear-gradient(180deg, ${accent}, transparent)` : "transparent" }}
                />
                <div className="grid grid-cols-[44px_1fr] gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-[12px] border transition-all duration-300"
                    style={{
                      background: active === i ? "rgba(0,71,65,0.32)" : "rgba(240,237,228,0.04)",
                      borderColor: active === i ? "rgba(240,237,228,0.24)" : "rgba(240,237,228,0.1)",
                    }}
                  >
                    <Icon size={17} style={{ color: active === i ? accent : T.text }} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="flex items-baseline gap-2.5 text-[15px] font-semibold leading-snug" style={{ color: T.text }}>
                        <span className="text-[10px] font-bold tracking-wide" style={{ fontFamily: "'Syne', sans-serif", color: active === i ? accent : "rgba(240,237,228,0.25)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {title}
                      </h3>
                      <span
                        className="rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors duration-300"
                        style={{
                          borderColor: active === i ? "rgba(240,237,228,0.2)" : "rgba(240,237,228,0.12)",
                          color: active === i ? accent : T.muted,
                          background: active === i ? "rgba(0,71,65,0.22)" : "transparent",
                        }}
                      >
                        {metric}
                      </span>
                    </div>
                    <p
                      className="max-w-[560px] text-sm leading-relaxed transition-opacity duration-300"
                      style={{ color: T.muted, opacity: active === i ? 1 : 0.72 }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-28 overflow-hidden rounded-[18px] border" style={{ ...fs(visible, 260), background: T.card, borderColor: "rgba(240,237,228,0.14)", boxShadow: `0 28px 90px rgba(0,0,0,0.5), 0 0 60px rgba(0,71,65,0.18), inset 0 1px 0 rgba(240,237,228,0.06)` }}>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: T.border, background: "rgba(2,6,5,0.68)" }}>
              <div className="flex min-w-0 items-center gap-3">
                <BrandMark size={24} />
                <div className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold" style={{ color: T.text }}>{features[active].title}</span>
                  <span className="block text-[10px]" style={{ color: T.muted }}>Markly workspace</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: active === i ? 16 : 6, background: active === i ? accent : "rgba(240,237,228,0.18)" }}
                    aria-label={`Ver ${features[i].title}`}
                  />
                ))}
              </div>
            </div>

            <div className="border-b px-5 py-4" style={{ borderColor: T.border, background: "rgba(240,237,228,0.025)" }}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Receita", "R$8.450"],
                  ["Resposta", "12 min"],
                  ["Fechados", "68%"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[10px]" style={{ color: T.muted }}>{label}</div>
                    <div className="mt-1 text-sm font-semibold" style={{ color: T.text }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-h-[260px] p-5"
            >
              {active === 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {kanbanCols.map(({ label, dot, cards }) => (
                    <div key={label} className="flex min-h-[180px] flex-col gap-2 rounded-[12px] border p-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                      <div className="mb-1 flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
                        <span className="text-[10px] font-medium" style={{ color: T.muted }}>{label}</span>
                      </div>
                      {cards.map((c) => (
                        <div key={c} className="rounded-[10px] border p-2 text-[10px] leading-4" style={{ background: "rgba(240,237,228,0.035)", borderColor: T.border, color: "rgba(240,237,228,0.68)" }}>
                          {c}
                          <div className="mt-1 text-[9px]" style={{ color: T.muted }}>Briefing completo</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {active === 1 && (
                <div className="flex flex-col gap-2">
                  {clientList.map(({ name, sessions, tag }) => (
                    <div key={name} className="flex items-center gap-3 rounded-[12px] border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: T.text, color: T.teal }}>{name[0]}</div>
                      <div className="flex-1">
                        <div className="text-[11px] font-medium" style={{ color: T.text }}>{name}</div>
                        <div className="text-[10px]" style={{ color: T.muted }}>{sessions} atendimentos</div>
                      </div>
                      <span className="rounded-full px-2 py-0.5 text-[9px]" style={{ background: "rgba(240,237,228,0.08)", color: T.text }}>{tag}</span>
                    </div>
                  ))}
                </div>
              )}
              {active === 2 && (
                <div className="flex flex-col gap-2">
                  {[{ client: "Mariana Alves", time: "10:00", paid: true }, { client: "Lucas Rocha", time: "14:00", paid: false }, { client: "Carla Vieira", time: "17:30", paid: true }].map(({ client, time, paid }) => (
                    <div key={client} className="flex items-center gap-3 rounded-[12px] border p-3"
                      style={{ background: paid ? `${T.green}10` : `${T.teal}08`, borderColor: paid ? `${T.green}20` : `${T.teal}18` }}>
                      <div className="h-10 w-1 rounded-full" style={{ background: paid ? T.green : T.text }} />
                      <div className="flex-1">
                        <div className="text-[11px] font-medium" style={{ color: T.text }}>{client}</div>
                        <div className="text-[10px]" style={{ color: T.muted }}>{time}{paid ? " · Depósito pago ✓" : ""}</div>
                      </div>
                      <span className="text-[10px]" style={{ color: paid ? T.text : T.muted }}>{paid ? "Confirmado" : "Pendente"}</span>
                    </div>
                  ))}
                </div>
              )}
              {active === 3 && (
                <div>
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square rounded-[12px] border" style={{ background: `linear-gradient(135deg, rgba(240,237,228,0.09) 0%, rgba(0,71,65,0.28) 100%)`, borderColor: T.border }} />)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Barbearia", "Estética", "Unhas", "Tatuagem", "Outros"].map((s) => <span key={s} className="rounded-full border px-2 py-0.5 text-[9px]" style={{ borderColor: T.border, color: T.muted }}>{s}</span>)}
                  </div>
                </div>
              )}
              {active === 4 && (
                <div className="flex flex-col gap-2">
                  {[{ from: "Mariana Alves", preview: "Queria agendar um horário esta semana...", time: "10m", unread: true }, { from: "Lucas Rocha", preview: "Quando fica pronto o orçamento?", time: "1h", unread: true }, { from: "Carla Vieira", preview: "Confirmei o depósito!", time: "3h", unread: false }].map(({ from, preview, time, unread }) => (
                    <div key={from} className="flex items-center gap-3 rounded-[12px] border p-3"
                      style={{ background: unread ? `${T.teal}06` : T.bgSec, borderColor: unread ? `${T.teal}20` : T.border }}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: unread ? T.text : "rgba(240,237,228,0.08)", color: unread ? T.teal : T.text }}>{from[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium" style={{ color: T.text }}>{from}</span>
                          <span className="text-[9px]" style={{ color: T.muted }}>{time}</span>
                        </div>
                        <p className="text-[10px] truncate" style={{ color: T.muted }}>{preview}</p>
                      </div>
                      {unread && <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: accent }} />}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const { ref, visible } = useFadeIn(0.3)
  const accent = T.accent
  const steps = [
    { n: "01", Icon: MessageSquare, title: "Cliente pede um atendimento", desc: "Detalhes do serviço e preferências chegam pelo seu canal." },
    { n: "02", Icon: FileText, title: "Você cria o orçamento", desc: "Registra valor, tipo de serviço, tempo estimado e envia o retorno." },
    { n: "03", Icon: Layers, title: "Pedido entra no painel", desc: "Aparece no kanban com status e dados do cliente organizados." },
    { n: "04", Icon: CheckCircle2, title: "Cliente confirma o depósito", desc: "Você marca o pagamento e o pedido avança automaticamente." },
    { n: "05", Icon: Calendar, title: "Atendimento entra na agenda", desc: "Data, horário e cliente confirmados na sua grade da semana." },
  ]
  // Cascata: cada passo "carrega" depois do anterior; a linha de progresso
  // percorre o trilho no mesmo ritmo para conectar os disparos.
  const stepDelay = (i: number) => 0.3 + i * 0.45

  return (
    <section className="relative overflow-x-clip px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bgSec }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(240,237,228,0.16) 50%, transparent 100%)" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-16 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: accent }}>
              <span className="h-px w-9" style={{ background: accent }} />
              Como funciona
            </p>
            <h2 className="max-w-[640px] text-3xl font-bold leading-tight md:text-5xl" style={{ ...fs(visible, 60), color: T.text }}>
              Do primeiro contato <span style={{ color: T.muted }}>até o atendimento fechado.</span>
            </h2>
          </div>
          <span
            className="hidden rounded-full border px-3.5 py-1.5 text-[11px] font-medium md:inline-flex"
            style={{ ...fs(visible, 140), borderColor: "rgba(240,237,228,0.2)", color: accent, background: "rgba(0,71,65,0.2)" }}
          >
            5 passos · sem planilha
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px lg:block" style={{ background: "rgba(240,237,228,0.08)" }} />
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px lg:block"
            style={{
              background: `linear-gradient(90deg, ${accent}00, ${accent})`,
              boxShadow: `0 0 10px rgba(216,208,191,0.28)`,
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 2.4s cubic-bezier(0.3, 0.6, 0.3, 1) 0.3s",
            }}
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {steps.map(({ n, Icon, title, desc }, i) => {
              const d = stepDelay(i)
              return (
                <div
                  key={n}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(22px)",
                    filter: visible ? "blur(0px)" : "blur(6px)",
                    transition: `opacity 0.6s ease ${d}s, transform 0.6s ease ${d}s, filter 0.6s ease ${d}s`,
                  }}
                >
                  <div
                    className="relative z-10 mb-6 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border"
                    style={{
                      background: T.card,
                      borderColor: visible ? "rgba(216,208,191,0.45)" : "rgba(240,237,228,0.1)",
                      boxShadow: visible ? "0 0 18px rgba(0,71,65,0.35)" : "none",
                      transition: `border-color 0.5s ease ${d + 0.15}s, box-shadow 0.5s ease ${d + 0.15}s`,
                    }}
                  >
                    <Icon size={16} style={{ color: accent }} />
                  </div>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-[11px] font-bold tracking-[0.08em]" style={{ fontFamily: "'Syne', sans-serif", color: accent }}>{n}</span>
                    <span
                      className="h-[3px] w-7 rounded-full"
                      style={{
                        background: visible ? accent : "rgba(240,237,228,0.1)",
                        opacity: 0.5,
                        transition: `background 0.4s ease ${d + 0.25}s`,
                      }}
                    />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold" style={{ color: T.text }}>{title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              )
            })}
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
              {[{ status: "Novo", client: "Beatriz Almada", style: "Corte + barba", value: "R$120", dot: T.teal }, { status: "Ag. depósito", client: "Pedro Ramos", style: "Limpeza de pele", value: "R$280", dot: T.amber }, { status: "Fechado", client: "Carla Neves", style: "Alongamento", value: "R$180", dot: T.green }].map(({ status, client, style, value, dot }) => (
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
                      <div className="text-[10px]" style={{ color: T.muted }}>{time}{paid ? " · Depósito pago ✓" : ""}</div>
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
                  <div className="text-[11px]" style={{ color: T.muted }}>7 atendimentos · Desde 2023</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[{ label: "Serviço favorito", value: "Corte + barba" }, { label: "Próximo atendimento", value: "09/07 às 15:00" }, { label: "Valor total", value: "R$4.200" }].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-2.5 rounded-lg border" style={{ background: T.bgSec, borderColor: T.border }}>
                    <span className="text-[11px]" style={{ color: T.muted }}>{label}</span>
                    <span className="text-[11px] font-medium" style={{ color: T.text }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <div className="text-[10px] mb-1.5 font-medium" style={{ color: T.muted }}>Anexos</div>
                <div className="flex gap-1.5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-10 h-10 rounded-lg border" style={{ background: `linear-gradient(135deg, ${T.card} 0%, rgba(0,71,65,0.16) 100%)`, borderColor: T.border }} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InterfaceShowcaseSection() {
  const { ref, visible } = useFadeIn()

  const navItems = [
    { Icon: LayoutDashboard, label: "Visão geral", active: true, badge: null as string | null },
    { Icon: FileText, label: "Orçamentos", active: false, badge: "12" },
    { Icon: Users, label: "Clientes", active: false, badge: null },
    { Icon: Calendar, label: "Agenda", active: false, badge: "Hoje" },
    { Icon: ImageIcon, label: "Portfólio", active: false, badge: null },
    { Icon: MessageSquare, label: "Mensagens", active: false, badge: "3" },
    { Icon: DollarSign, label: "Financeiro", active: false, badge: null },
  ]

  const stats = [
    { label: "Orçamentos abertos", value: "42", hint: "12 sem resposta", Icon: FileText },
    { label: "Sessões hoje", value: "3", hint: "Próxima às 10:00", Icon: Calendar },
    { label: "Sinais pendentes", value: "R$ 1.240", hint: "4 aguardando", Icon: WalletCards },
    { label: "Faturamento estimado", value: "R$ 8.450", hint: "mês atual", Icon: TrendingUp },
  ]

  const pipeline = [
    { label: "Novo", value: "R$ 2.400", count: "8" },
    { label: "Em análise", value: "R$ 5.800", count: "12" },
    { label: "Sinal pendente", value: "R$ 1.240", count: "4" },
    { label: "Agendado", value: "R$ 8.450", count: "18" },
  ]

  const attention = [
    { name: "Mariana Alves", description: "Orçamento enviado há 2 dias", badge: "Follow-up" },
    { name: "Lucas Rocha", description: "Sinal pendente", badge: "Pagamento" },
    { name: "Júlia Martins", description: "Sessão hoje às 10:00", badge: "Hoje" },
    { name: "Rafael Nunes", description: "Anamnese não preenchida", badge: "Anamnese" },
  ]

  const schedule = [
    { time: "10:00", title: "Sessão floral P&B", client: "Júlia Martins", status: "Sinal pago", alert: false },
    { time: "13:30", title: "Retoque fine line", client: "Marina Alves", status: "Confirmado", alert: false },
    { time: "16:00", title: "Consulta blackwork", client: "Rafael Nunes", status: "Anamnese pendente", alert: true },
  ]

  const pulse = [
    { label: "Ticket médio", value: "R$ 620", Icon: WalletCards },
    { label: "Tempo médio de resposta", value: "6h", Icon: Clock },
    { label: "Taxa de fechamento", value: "68%", Icon: TrendingUp },
  ]

  return (
    <section className="relative overflow-hidden px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bgSec }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${T.text}26, transparent)` }} />
      <div
        className="pointer-events-none absolute left-1/2 top-12 h-[520px] w-[920px] -translate-x-1/2 blur-3xl"
        style={{ background: "radial-gradient(ellipse, rgba(0,71,65,0.34) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,680px)_minmax(260px,360px)] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: T.text }}>
              <span className="h-px w-9" style={{ background: T.text }} />
              Interface
            </p>
            <h2 className="max-w-[680px] text-3xl font-semibold leading-tight md:text-5xl" style={{ ...fs(visible, 80), color: T.text }}>
              Uma tela limpa para decidir rápido e atender melhor.
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-7 md:text-base lg:pb-1" style={{ ...fs(visible, 140), color: T.muted }}>
            A Visão geral junta métricas, pipeline, prioridades e agenda do dia — o mesmo centro operacional do painel.
          </p>
        </div>

        <div
          className="overflow-hidden rounded-[24px] border"
          style={{
            ...fs(visible, 180),
            background: "linear-gradient(180deg, rgba(240,237,228,0.055), rgba(240,237,228,0.018))",
            borderColor: "rgba(240,237,228,0.12)",
            boxShadow: "0 34px 110px rgba(0,0,0,0.52), inset 0 1px 0 rgba(240,237,228,0.08)",
          }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3 md:px-5" style={{ borderColor: T.border, background: "rgba(4,9,7,0.86)" }}>
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark size={24} />
              <div className="min-w-0">
                <div className="text-[12px] font-semibold" style={{ color: T.text }}>Ink Tattoo</div>
                <div className="text-[10px]" style={{ color: T.muted }}>Operação ativa · Hoje</div>
              </div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[11px]" style={{ borderColor: T.border, color: T.muted }}>
                <Search size={12} /> Buscar
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[11px] font-semibold" style={{ background: T.text, color: T.bg }}>
                <Plus size={12} /> Novo
              </span>
            </div>
          </div>

          <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_300px]">
            <aside className="hidden border-r p-4 lg:flex lg:flex-col" style={{ borderColor: T.border, background: "#040907" }}>
              <div
                className="mb-4 flex items-center gap-2.5 rounded-[14px] border px-2.5 py-2.5"
                style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border }}
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-[10px] border text-[12px] font-semibold"
                  style={{ background: "rgba(0,71,65,0.24)", borderColor: "rgba(240,237,228,0.14)", color: T.accent }}
                >
                  I
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold" style={{ color: T.text }}>Ink Tattoo</span>
                  <span className="block text-[10px]" style={{ color: T.faint }}>Studio ativo</span>
                </span>
                <ChevronDown size={13} style={{ color: T.faint }} />
              </div>

              <div className="mb-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(240,237,228,0.38)" }}>Workspace</div>
              <div className="flex flex-col gap-1">
                {navItems.map(({ Icon, label, active, badge }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[12px]"
                    style={{ background: active ? "rgba(240,237,228,0.10)" : "transparent", color: active ? T.text : "rgba(240,237,228,0.58)" }}
                  >
                    <Icon size={14} />
                    <span className="flex-1 truncate">{label}</span>
                    {badge && <span className="text-[10px]" style={{ color: "rgba(240,237,228,0.45)" }}>{badge}</span>}
                  </div>
                ))}
              </div>

              <div className="mt-auto rounded-[14px] border p-3" style={{ borderColor: T.border, background: "rgba(0,71,65,0.16)" }}>
                <div className="mb-1 text-[10px]" style={{ color: T.accent }}>Agenda ocupada</div>
                <div className="text-xl font-semibold" style={{ color: T.text }}>92%</div>
                <div className="mt-2 text-[10px]" style={{ color: T.faint }}>semana atual</div>
              </div>
            </aside>

            <div className="border-r p-4 md:p-5" style={{ borderColor: T.border, background: T.bg }}>
              <div className="mb-4">
                <div
                  className="mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                  style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.accent }} />
                  Operação ativa
                </div>
                <h3 className="text-xl font-semibold" style={{ color: T.text, fontFamily: "'Syne', sans-serif" }}>Visão geral</h3>
                <p className="mt-1 text-[12px]" style={{ color: T.muted }}>Ink Tattoo · Hoje</p>
                <p className="mt-0.5 text-[11px]" style={{ color: T.faint }}>
                  3 sessões hoje · 12 orçamentos abertos · R$ 1.240 em sinais pendentes
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
                {stats.map(({ label, value, hint, Icon }, index) => (
                  <div key={label} className="rounded-[14px] border p-3" style={{ borderColor: T.border, background: T.card }}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px]" style={{ color: T.muted }}>{label}</span>
                      <Icon size={12} style={{ color: index % 2 === 0 ? T.accent : "#8DCEC0" }} />
                    </div>
                    <div className="text-lg font-semibold tracking-tight" style={{ color: T.text }}>{value}</div>
                    <div className="mt-0.5 truncate text-[10px]" style={{ color: T.faint }}>{hint}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-[16px] border p-3.5" style={{ borderColor: T.border, background: T.card }}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold" style={{ color: T.text }}>Pipeline de orçamentos</div>
                  <div className="text-[10px]" style={{ color: T.faint }}>Valores estimados</div>
                </div>
                <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                  {pipeline.map((stage) => (
                    <div key={stage.label} className="rounded-[12px] border px-2.5 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                      <div className="mb-2 flex items-center justify-between gap-1">
                        <span className="truncate text-[11px] font-semibold" style={{ color: T.text }}>{stage.label}</span>
                        <span className="rounded-full border px-1.5 py-0.5 text-[9px]" style={{ borderColor: T.border, color: T.faint }}>{stage.count}</span>
                      </div>
                      <div className="text-[14px] font-semibold" style={{ color: T.text }}>{stage.value}</div>
                      <div className="text-[9px]" style={{ color: T.faint }}>{stage.count} oportunidades</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[16px] border p-3.5" style={{ borderColor: T.border, background: T.card }}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold" style={{ color: T.text }}>Precisa de atenção</div>
                  <div className="text-[10px]" style={{ color: T.faint }}>Prioridade de hoje</div>
                </div>
                <div className="flex flex-col gap-2">
                  {attention.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 rounded-[12px] border px-3 py-2.5" style={{ background: "rgba(6,17,15,0.76)", borderColor: T.border }}>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-semibold" style={{ color: T.text }}>{item.name}</div>
                        <div className="truncate text-[10px]" style={{ color: T.faint }}>{item.description}</div>
                      </div>
                      <span className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 md:p-5" style={{ background: T.card }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ color: T.text }}>Agenda de hoje</div>
                  <div className="text-[10px]" style={{ color: T.muted }}>3 sessões</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {schedule.map((event) => (
                  <div key={event.time} className="flex items-center gap-3 rounded-[12px] border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
                    <div
                      className="flex h-10 w-12 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-semibold"
                      style={{ background: "rgba(240,237,228,0.06)", color: T.accent }}
                    >
                      {event.time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold" style={{ color: T.text }}>{event.title}</div>
                      <div className="truncate text-[10px]" style={{ color: T.faint }}>{event.client}</div>
                    </div>
                    <span
                      className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold"
                      style={{
                        background: event.alert ? "rgba(216,208,191,0.10)" : "rgba(47,127,104,0.12)",
                        borderColor: event.alert ? "rgba(216,208,191,0.28)" : "rgba(47,127,104,0.30)",
                        color: T.accent,
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-px border-t md:grid-cols-3" style={{ borderColor: T.border, background: T.border }}>
            {pulse.map(({ label, value, Icon }) => (
              <div key={`footer-${label}`} className="flex items-center justify-between p-4" style={{ background: "rgba(2,6,5,0.74)" }}>
                <div>
                  <div className="text-[10px]" style={{ color: T.muted }}>{label}</div>
                  <div className="mt-1 text-base font-semibold" style={{ color: T.text }}>{value}</div>
                </div>
                <Icon size={17} style={{ color: T.text }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ForWhomSection() {
  const { ref, visible } = useFadeIn()
  const personas = [
    { title: "Profissional independente", tag: "Solo", desc: "Pedidos, agenda e clientes sem depender de planilhas, grupos de WhatsApp ou anotações soltas.", fit: "Ideal para quem atende sozinho e quer responder mais rápido.", metric: "1 profissional", Icon: FileText },
    { title: "Estúdio pequeno", tag: "Equipe", desc: "Uma visão clara da operação, com orçamentos, atendimentos e clientes no mesmo fluxo.", fit: "Para estúdios que precisam organizar a rotina sem sistema pesado.", metric: "2-8 pessoas", Icon: Users },
    { title: "Negócio em crescimento", tag: "Escala", desc: "Estrutura profissional para vender melhor, acompanhar leads e manter qualidade no atendimento.", fit: "Para quem está aumentando demanda e quer parecer mais premium.", metric: "+ demanda", Icon: TrendingUp },
  ]
  return (
    <section id="clientes" className="relative overflow-hidden scroll-mt-[68px] px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bgSec }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${T.text}22, transparent)` }} />
      <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: "rgba(0,71,65,0.32)" }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-14 grid gap-8 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: T.text }}>
              <span className="h-px w-9" style={{ background: T.text }} />
              Para quem é
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl" style={{ ...fs(visible, 70), color: T.text }}>
              Feito para quem vive do próprio ofício.
            </h2>
          </div>
          <p className="max-w-[520px] text-sm leading-7 md:text-base" style={{ ...fs(visible, 130), color: T.muted }}>
            O Markly se adapta ao tamanho do seu estúdio: começa simples para o profissional solo e continua útil quando a demanda cresce.
          </p>
        </div>

        <div className="overflow-hidden rounded-[24px] border" style={{ ...fs(visible, 190), background: "rgba(240,237,228,0.025)", borderColor: "rgba(240,237,228,0.11)" }}>
          <div className="grid gap-px lg:grid-cols-3" style={{ background: T.border }}>
            {personas.map(({ title, tag, desc, fit, metric, Icon }, i) => (
              <div
                key={title}
                className="group min-h-[360px] p-6 transition-all duration-300 md:p-7"
                style={{ background: i === 1 ? "rgba(240,237,228,0.045)" : T.card }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(240,237,228,0.06)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i === 1 ? "rgba(240,237,228,0.045)" : T.card }}
              >
                <div className="mb-12 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border transition-transform duration-300 group-hover:scale-105" style={{ background: i === 1 ? T.text : "rgba(240,237,228,0.06)", borderColor: "rgba(240,237,228,0.12)" }}>
                    <Icon size={17} style={{ color: i === 1 ? T.teal : T.text }} />
                  </div>
                  <span className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ borderColor: "rgba(240,237,228,0.14)", color: T.muted }}>
                    {tag}
                  </span>
                </div>

                <div className="mb-8">
                  <div className="mb-3 text-[11px] font-semibold" style={{ color: T.muted }}>{metric}</div>
                  <h3 className="mb-3 text-xl font-semibold leading-tight" style={{ color: T.text }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>

                <div className="mt-auto rounded-[16px] border p-4" style={{ background: "rgba(2,6,5,0.42)", borderColor: T.border }}>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: T.muted }}>Melhor para</div>
                  <p className="text-[13px] leading-relaxed" style={{ color: T.text }}>{fit}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-px border-t md:grid-cols-3" style={{ background: T.border, borderColor: T.border }}>
            {[
              ["Menos dispersão", "Tudo parte do mesmo painel."],
              ["Mais previsibilidade", "Status claros para cada pedido."],
              ["Mais profissionalismo", "Atendimento com cara de produto premium."],
            ].map(([title, desc]) => (
              <div key={title} className="p-5" style={{ background: "rgba(2,6,5,0.72)" }}>
                <div className="text-sm font-semibold" style={{ color: T.text }}>{title}</div>
                <div className="mt-1 text-[12px]" style={{ color: T.muted }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DifferentialsSection() {
  const { ref, visible } = useFadeIn()
  const accent = T.accent
  const diffs = [
    { Icon: Layers, title: "Painel limpo e direto", desc: "Sem menus escondidos. Tudo que você precisa na primeira tela." },
    { Icon: BarChart3, title: "Controle por status", desc: "Orçamentos, atendimentos e clientes sempre com situação clara." },
    { Icon: Users, title: "Histórico completo", desc: "Cada cliente com registro de atendimentos, anexos e valores." },
    { Icon: Calendar, title: "Agenda integrada", desc: "Atendimentos conectados a orçamentos. Sem duplicação de dados." },
    { Icon: ImageIcon, title: "Portfólio organizado", desc: "Seus trabalhos, categorias e fotos em um portfólio dentro do sistema." },
    { Icon: Zap, title: "Feito para estúdios", desc: "Se adapta a tatuagem, barbearia, estética, unhas e outros serviços." },
  ]
  const stackCards = [
    {
      icon: <BarChart3 className="size-4" style={{ color: accent }} />,
      title: "Controle por status",
      description: "Cada pedido com situação clara",
      date: "Kanban de orçamentos",
    },
    {
      icon: <Users className="size-4" style={{ color: accent }} />,
      title: "Histórico completo",
      description: "Atendimentos, anexos e valores",
      date: "Ficha do cliente",
    },
    {
      icon: <Zap className="size-4" style={{ color: accent }} />,
      title: "Multi-studio",
      description: "Para diferentes tipos de negócio",
      date: "Direto ao ponto",
    },
  ]
  return (
    <section id="recursos" className="relative overflow-x-clip scroll-mt-[68px] px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bg }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(240,237,228,0.16) 50%, transparent 100%)" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-16">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: accent }}>
            <span className="h-px w-9" style={{ background: accent }} />
            Diferenciais
          </p>
          <h2 className="max-w-[620px] text-3xl font-bold leading-tight md:text-5xl" style={{ ...fs(visible, 60), color: T.text }}>
            Gestão com estética, <span style={{ color: T.muted }}>velocidade e clareza.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-2"
            style={{ ...fs(visible, 140), background: T.border, borderColor: T.border }}
          >
            {diffs.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="group relative flex flex-col gap-4 p-6 transition-colors duration-300 cursor-default"
                style={{ ...fs(visible, 160 + i * 70), background: T.card }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.cardElev }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.card }}
              >
                <span
                  className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] border transition-all duration-300 group-hover:scale-105 group-hover:border-[rgba(240,237,228,0.28)]"
                    style={{ background: "rgba(0,71,65,0.25)", borderColor: "rgba(240,237,228,0.12)" }}
                  >
                    <Icon size={16} style={{ color: accent }} />
                  </div>
                  <span
                    className="text-[11px] font-bold tracking-[0.08em] transition-colors duration-300 group-hover:text-[#D8D0BF]"
                    style={{ fontFamily: "'Syne', sans-serif", color: "rgba(240,237,228,0.18)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold" style={{ color: T.text }}>{title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center py-10 lg:py-0" style={fs(visible, 260)}>
            <div className="relative w-full max-w-xl lg:-translate-y-16">
              <CardSwap
                width={416}
                height={176}
                cardDistance={56}
                verticalDistance={44}
                delay={2600}
                pauseOnHover
                skewAmount={8}
              >
                {stackCards.map(({ icon, title, description, date }) => (
                  <Card key={title} customClass="markly-swap-card">
                    <div className="flex h-full flex-col justify-between px-5 py-4">
                      <div className="flex flex-col gap-2.5">
                        <span className="inline-flex w-fit items-center justify-center rounded-full border border-[rgba(240,237,228,0.22)] bg-[rgba(0,71,65,0.32)] p-2">
                          {icon}
                        </span>
                        <p className="text-lg font-semibold text-[#F0EDE4]">{title}</p>
                      </div>
                      <p className="whitespace-nowrap text-base font-medium text-[#F0EDE4]">{description}</p>
                      <p className="text-sm text-[rgba(240,237,228,0.55)]">{date}</p>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const { ref, visible } = useFadeIn()
  const items = ["Orçamentos ilimitados", "Cadastro de clientes", "Agenda de atendimentos", "Portfólio organizado", "Painel de visão geral", "Suporte inicial"]
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
                  <p className="text-sm font-medium mb-1" style={{ color: T.teal }}>Markly Starter</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold" style={{ color: T.text }}>R$49</span>
                    <span className="text-base" style={{ color: T.muted }}>/mês</span>
                  </div>
                </div>
                <span className="text-[10px] px-3 py-1.5 rounded-full border font-medium" style={{ background: `${T.amber}12`, borderColor: `${T.amber}25`, color: T.amber }}>Beta</span>
              </div>
              <p className="text-sm mb-8 leading-relaxed" style={{ color: T.muted }}>Para profissionais e estúdios que querem sair da bagunça e controlar melhor seus pedidos.</p>
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

function PricingShowcaseSection() {
  const { ref, visible } = useFadeIn()
  const features = [
    "Orçamentos ilimitados",
    "Cadastro de clientes",
    "Agenda de atendimentos",
    "Portfólio organizado",
    "Painel de visão geral",
    "Suporte inicial",
  ]
  const plans = [
    {
      name: "Mensal",
      eyebrow: "Comece agora",
      price: "R$49",
      period: "/mês",
      note: "Teste grátis por 5 dias. Depois, cobrança mensal — cancele quando quiser.",
      badge: "5 dias grátis",
      highlight: true,
      cta: "Iniciar teste de 5 dias",
    },
    {
      name: "Anual",
      eyebrow: "Melhor valor",
      price: "R$39",
      period: "/mês",
      note: "Cobrado anualmente. Desconto aproximado de 20% sobre o mensal.",
      badge: "Economize 20%",
      highlight: false,
      cta: "Assinar anual",
    },
  ]

  return (
    <section id="precos" className="relative overflow-hidden scroll-mt-[68px] px-5 py-28 md:px-8 lg:py-32" style={{ background: T.bgSec }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${T.text}24, transparent)` }} />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[560px] w-[760px] -translate-x-1/2 blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(0,71,65,0.34) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div ref={ref} className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,640px)_minmax(260px,360px)] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]" style={{ ...fs(visible), color: T.text }}>
              <span className="h-px w-9" style={{ background: T.text }} />
              Planos
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl" style={{ ...fs(visible, 80), color: T.text }}>
              Comece simples. Evolua conforme seu estúdio cresce.
            </h2>
          </div>
          <p className="max-w-[360px] text-sm leading-7 md:text-base lg:pb-1" style={{ ...fs(visible, 140), color: T.muted }}>
            Comece com <strong style={{ color: T.text, fontWeight: 600 }}>5 dias de teste grátis</strong>. Depois escolha o plano que faz sentido para o seu estúdio.
          </p>
        </div>

        <div
          className="mb-6 flex flex-col gap-3 rounded-[20px] border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ ...fs(visible, 160), background: "rgba(0,71,65,0.18)", borderColor: "rgba(240,237,228,0.16)" }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border text-lg font-bold" style={{ borderColor: "rgba(240,237,228,0.2)", color: T.accent, background: "rgba(0,71,65,0.35)" }}>5</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: T.text }}>Teste de 5 dias grátis</p>
              <p className="text-[13px]" style={{ color: T.muted }}>Acesso completo ao Markly. Sem compromisso no período de teste.</p>
            </div>
          </div>
          <a
            href="#"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{ background: T.text, color: T.teal }}
          >
            Iniciar teste <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <div className="grid h-full gap-5 md:grid-cols-2 md:items-stretch" style={fs(visible, 190)}>
            {plans.map(({ name, eyebrow, price, period, note, badge, highlight, cta }) => (
              <div
                key={name}
                className="relative flex h-full flex-col justify-center overflow-hidden rounded-[24px] border p-7"
                style={{
                  background: highlight ? "linear-gradient(180deg, rgba(240,237,228,0.1), rgba(240,237,228,0.035))" : T.card,
                  borderColor: highlight ? "rgba(240,237,228,0.28)" : T.border,
                  boxShadow: highlight ? "0 28px 90px rgba(0,0,0,0.46), inset 0 1px 0 rgba(240,237,228,0.12)" : "none",
                }}
              >
                {highlight && <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full blur-3xl" style={{ background: "rgba(240,237,228,0.14)" }} />}
                <div className="relative">
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: highlight ? T.text : T.muted }}>{eyebrow}</p>
                      <h3 className="text-xl font-semibold" style={{ color: T.text }}>Markly {name}</h3>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-[10px] font-semibold" style={{ background: highlight ? T.text : "transparent", borderColor: highlight ? T.text : T.border, color: highlight ? T.teal : T.muted }}>
                      {badge}
                    </span>
                  </div>

                  <div className="mb-5 flex items-end gap-2">
                    <span className="text-5xl font-semibold leading-tight md:text-6xl" style={{ color: T.text }}>{price}</span>
                    <span className="pb-1 text-sm" style={{ color: T.muted }}>{period}</span>
                  </div>
                  <p className="mb-8 min-h-[48px] text-sm leading-6" style={{ color: T.muted }}>{note}</p>

                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-2 rounded-[16px] py-3.5 text-sm font-semibold transition-all duration-200"
                    style={{ background: highlight ? T.text : "rgba(240,237,228,0.08)", color: highlight ? T.teal : T.text }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
                  >
                    {cta} <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border p-6" style={{ ...fs(visible, 260), background: "rgba(2,6,5,0.54)", borderColor: T.border }}>
            <div className="mb-5 flex items-center gap-4">
              <BrandMark size={44} />
              <div>
                <div className="text-sm font-semibold" style={{ color: T.text }}>Incluído nos dois planos</div>
                <div className="text-[11px]" style={{ color: T.muted }}>Base para organizar o estúdio</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={15} style={{ color: T.text, flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: T.text }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[16px] border p-4" style={{ background: "rgba(240,237,228,0.035)", borderColor: T.border }}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.muted }}>Observação</div>
              <p className="mt-2 text-[13px] leading-6" style={{ color: T.muted }}>
                O teste de 5 dias é gratuito. Após o período, os planos mensal e anual entram em vigor conforme a escolha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const { ref, visible } = useFadeIn()
  const faqs = [
    { q: "O Markly é para profissional autônomo?", a: "Sim. Ele foi pensado para profissionais independentes e pequenos estúdios — tatuagem, barbearia, estética, unhas e outros — que querem organizar pedidos, clientes e agenda." },
    { q: "Preciso instalar alguma coisa?", a: "Não. O Markly funciona online, direto pelo navegador, sem necessidade de instalação." },
    { q: "Posso usar para controlar orçamentos do WhatsApp?", a: "Sim. A ideia é trazer os pedidos para um painel organizado, evitando que conversas importantes se percam." },
    { q: "Vai ter controle financeiro?", a: "A versão inicial foca em orçamentos, clientes e agenda. Recursos financeiros podem entrar nas próximas versões." },
    { q: "Posso cadastrar meu portfólio?", a: "Sim. O portfólio faz parte da organização do seu estúdio, conectado a serviços, clientes e orçamentos." },
  ]
  return (
    <section id="faq" className="scroll-mt-[68px] py-28 px-6" style={{ background: T.bg }}>
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold" style={{ ...fs(visible), color: T.text }}>Perguntas frequentes</h2>
        </div>
        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-2"
          style={fs(visible, 100)}
        >
          {faqs.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              value={`faq-${i}`}
              className="rounded-md border overflow-hidden border-b-0 transition-colors duration-200 data-[state=open]:bg-[rgba(0,71,65,0.08)] data-[state=closed]:bg-[#081713] data-[state=open]:border-[rgba(240,237,228,0.16)] data-[state=closed]:border-[rgba(240,237,228,0.1)]"
            >
              <AccordionTrigger
                className="px-6 py-5 hover:no-underline [&>svg]:text-[rgba(240,237,228,0.55)]"
                style={{ color: T.text }}
              >
                {q}
              </AccordionTrigger>
              <AccordionContent
                keepRendered
                className="px-6 pb-5 text-sm leading-relaxed text-[rgba(240,237,228,0.68)]"
              >
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function CTASection() {
  const { ref, visible } = useFadeIn()

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-8 lg:py-32" style={{ background: T.bgSec }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${T.text}20, transparent)` }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(0,71,65,0.24) 0%, transparent 68%)" }} />

      <div ref={ref} className="relative z-10 mx-auto max-w-4xl text-center">
        <div
          className="rounded-[28px] border px-6 py-14 md:px-12 md:py-16"
          style={{
            ...fs(visible),
            background: "linear-gradient(180deg, rgba(240,237,228,0.055), rgba(240,237,228,0.018))",
            borderColor: "rgba(240,237,228,0.12)",
            boxShadow: "0 28px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(240,237,228,0.08)",
          }}
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border md:h-32 md:w-32" style={{ borderColor: T.border, background: "rgba(2,6,5,0.42)", boxShadow: "0 22px 70px rgba(0,0,0,0.32)" }}>
            <BrandMark size={96} />
          </div>
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em]" style={{ color: T.muted }}>Markly beta</p>
          <h2 className="mx-auto max-w-[760px] text-4xl font-semibold leading-tight md:text-6xl" style={{ color: T.text }}>
            Organize seu estúdio com a calma de quem tem tudo no lugar.
          </h2>
          <p className="mx-auto mt-6 max-w-[600px] text-base leading-7 md:text-lg" style={{ color: T.muted }}>
            Pedidos, clientes, agenda, portfólio e orçamentos em um painel digital feito para o seu estúdio.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#precos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-200 sm:w-auto"
              style={{ background: T.text, color: T.teal }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
            >
              Iniciar teste de 5 dias <ArrowRight size={16} />
            </a>
            <a
              href="#"
              className="inline-flex w-full items-center justify-center rounded-full border px-7 py-3.5 text-sm font-semibold transition-all duration-200 sm:w-auto"
              style={{ borderColor: T.border, color: T.text, background: "rgba(240,237,228,0.025)" }}
            >
              Ver interface
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const [supportOpen, setSupportOpen] = useState(false)
  const [supportMessage, setSupportMessage] = useState("")
  const supportEmail = "suportemarkly@gmail.com.br"
  const supportHref = `mailto:${supportEmail}?subject=${encodeURIComponent("Suporte Markly")}&body=${encodeURIComponent(supportMessage || "Olá, preciso de suporte com o Markly.")}`

  return (
    <>
      <footer id="contato" className="scroll-mt-[68px] border-t px-5 py-12 md:px-8" style={{ background: T.bg, borderColor: T.border }}>
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:items-start">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <BrandMark size={28} />
              <span className="text-xl font-semibold" style={{ color: T.text }}>Markly</span>
            </div>
            <p className="max-w-[280px] text-sm leading-6" style={{ color: T.muted }}>Seu painel digital para organizar pedidos, clientes e agenda.</p>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-semibold" style={{ color: T.text }}>Navegação</div>
            <nav className="flex flex-wrap gap-x-5 gap-y-3">
              {[
                { label: "Produto", href: "#produto" },
                { label: "Recursos", href: "#recursos" },
                { label: "Preços", href: "#precos" },
                { label: "FAQ", href: "#faq" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="text-sm transition-colors duration-200" style={{ color: T.muted }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = T.text)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = T.muted)}>{label}</a>
              ))}
            </nav>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-semibold" style={{ color: T.text }}>Suporte e créditos</div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: T.muted }}>
              <a href={`mailto:${supportEmail}`} className="transition-colors duration-200 hover:text-[#F0EDE4]">{supportEmail}</a>
              <a href="https://brunosouza.dev.br" target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-[#F0EDE4]">
                Desenvolvido por Bruno Souza
              </a>
              <button
                type="button"
                className="mt-2 inline-flex w-fit items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
                style={{ borderColor: T.border, color: T.text, background: "rgba(240,237,228,0.035)" }}
                onClick={() => setSupportOpen(true)}
              >
                Abrir SAC
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t pt-6 text-[12px] md:flex-row md:items-center md:justify-between" style={{ borderColor: T.border, color: "rgba(240,237,228,0.42)" }}>
          <span>© 2026 Markly. Todos os direitos reservados.</span>
          <a href="https://brunosouza.dev.br" target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-[#F0EDE4]">brunosouza.dev.br</a>
        </div>
      </footer>

      {supportOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-5" role="dialog" aria-modal="true" aria-label="SAC Markly">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
            onClick={() => setSupportOpen(false)}
            aria-label="Fechar SAC"
          />
          <div className="relative w-full max-w-lg rounded-[24px] border p-6" style={{ background: T.card, borderColor: "rgba(240,237,228,0.16)", boxShadow: "0 30px 100px rgba(0,0,0,0.65)" }}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <BrandMark size={22} />
                  <h3 className="text-lg font-semibold" style={{ color: T.text }}>SAC Markly</h3>
                </div>
                <p className="text-sm leading-6" style={{ color: T.muted }}>Descreva sua dúvida ou problema. O botão abre seu email com a mensagem pronta para envio.</p>
              </div>
              <button type="button" className="rounded-full p-2" style={{ color: T.muted }} onClick={() => setSupportOpen(false)} aria-label="Fechar SAC">
                <X size={18} />
              </button>
            </div>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-[16px] border p-4 text-sm outline-none"
              style={{ background: T.bgSec, borderColor: T.border, color: T.text }}
              placeholder="Escreva sua mensagem para o suporte..."
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[12px]" style={{ color: T.muted }}>{supportEmail}</span>
              <a
                href={supportHref}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: T.text, color: T.teal }}
                onClick={() => setSupportOpen(false)}
              >
                Enviar email <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const h = () => setHash(window.location.hash)
    window.addEventListener("hashchange", h)
    return () => window.removeEventListener("hashchange", h)
  }, [])
  return hash
}

export default function App() {
  const hash = useHashRoute()
  const authMode = hash.startsWith("#/cadastro") ? "cadastro" : hash.startsWith("#/login") ? "login" : null
  const isDevDashboard = hash.startsWith("#/painel")

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: T.bg, minHeight: "100vh" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,71,65,0.45); border-radius: 3px; }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80]"
        style={{ backgroundImage: NOISE_TEXTURE, opacity: 0.025, mixBlendMode: "overlay" }}
      />
      {isDevDashboard ? (
        <DevDashboard />
      ) : authMode ? (
        <AuthPage mode={authMode} />
      ) : (
        <>
          <Header />
          <main>
            <HeroSection />
            <ProblemSection />
            <ProductSection />
            <WorkflowSection />
            <InterfaceShowcaseSection />
            <ForWhomSection />
            <DifferentialsSection />
            <PricingShowcaseSection />
            <FAQSection />
            <CTASection />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
