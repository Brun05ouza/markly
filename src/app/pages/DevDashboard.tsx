import { useMemo, useState, type CSSProperties } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react"
import marklyIcon from "../../assets/icon-markly.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "../components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { clearDevSession, readDevSession } from "../devAccess"
import StudioSetupModal from "../components/onboarding/StudioSetupModal"
import { useStudioSetup } from "../hooks/useStudioSetup"
import { T } from "../theme"
import { type StudioProfile } from "../utils/studioStorage"

type SectionId = "overview" | "budgets" | "clients" | "calendar" | "portfolio" | "messages" | "settings"

const sections = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "budgets", label: "Orçamentos", icon: FileText, badge: "12" },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "calendar", label: "Agenda", icon: Calendar, badge: "Hoje" },
  { id: "portfolio", label: "Portfólio", icon: ImageIcon },
  { id: "messages", label: "Mensagens", icon: MessageSquare, badge: "3" },
  { id: "settings", label: "Configurações", icon: Settings },
] as const

const overviewMock = {
  studioProfile: {
    fallbackName: "Meu Studio",
    fallbackChannel: "WhatsApp",
  },
  stats: [
    { label: "Orçamentos abertos", value: "42", hint: "12 sem resposta", icon: FileText },
    { label: "Sessões hoje", value: "3", hint: "Próxima às 10:00", icon: Calendar },
    { label: "Sinais pendentes", value: "R$ 1.240", hint: "4 aguardando pagamento", icon: WalletCards },
    { label: "Faturamento estimado", value: "R$ 8.450", hint: "mês atual", icon: TrendingUp },
  ],
  attentionItems: [
    { name: "Mariana Alves", description: "Orçamento enviado há 2 dias", status: "Follow-up", action: "Enviar follow-up" },
    { name: "Lucas Rocha", description: "Sinal pendente", status: "Pagamento", action: "Confirmar pagamento" },
    { name: "Júlia Martins", description: "Sessão hoje às 10:00", status: "Hoje", action: "Ver ficha" },
    { name: "Rafael Nunes", description: "Anamnese não preenchida", status: "Pendente", action: "Enviar formulário" },
  ],
  todaySchedule: [
    { time: "10:00", title: "Sessão floral P&B", client: "Júlia Martins", status: "Sinal pago" },
    { time: "13:30", title: "Retoque fine line", client: "Marina Alves", status: "Confirmado" },
    { time: "16:00", title: "Consulta blackwork", client: "Rafael Nunes", status: "Anamnese pendente" },
  ],
  pipeline: [
    { label: "Novo", count: "8", value: "R$ 2.400" },
    { label: "Em análise", count: "12", value: "R$ 5.800" },
    { label: "Sinal pendente", count: "4", value: "R$ 1.240" },
    { label: "Agendado", count: "18", value: "R$ 8.450" },
  ],
  studioPulse: [
    { label: "Ticket médio", value: "R$ 620", icon: WalletCards },
    { label: "Tempo médio de resposta", value: "6h", icon: Clock },
    { label: "Agenda ocupada", value: "92%", icon: Calendar },
    { label: "Taxa de fechamento", value: "68%", icon: TrendingUp },
  ],
}

const boardColumns = [
  { title: "Novos", total: "8", items: ["Fine line costela", "Dragão oriental", "Lettering mão"] },
  { title: "Em orçamento", total: "5", items: ["Fechamento floral", "Blackwork braço"] },
  { title: "Sinal pago", total: "3", items: ["Flash autoral", "Mandala ombro"] },
  { title: "Fechados", total: "9", items: ["Old school águia", "Micro realismo"] },
]

const clients = [
  { name: "Marina Alves", style: "Fine line", last: "Hoje", value: "R$ 680" },
  { name: "Rafael Nunes", style: "Blackwork", last: "Ontem", value: "R$ 1.800" },
  { name: "Júlia Martins", style: "Floral", last: "2 dias", value: "R$ 1.420" },
  { name: "Caio Lima", style: "Flash", last: "5 dias", value: "R$ 390" },
]

const portfolio = [
  { title: "Fine line", count: "38 artes", tone: "rgba(216,208,191,0.12)" },
  { title: "Blackwork", count: "22 artes", tone: "rgba(0,71,65,0.34)" },
  { title: "Floral", count: "31 artes", tone: "rgba(47,127,104,0.22)" },
  { title: "Flash autoral", count: "44 artes", tone: "rgba(240,237,228,0.08)" },
]

function studioValue(value: string, fallback = "Não informado") {
  return value.trim() || fallback
}

function studioHours(profile: StudioProfile) {
  if (profile.flexibleHours) return "Flexível"
  return `${profile.businessHoursStart || "09:00"} - ${profile.businessHoursEnd || "18:00"}`
}

function statIconColor(index: number) {
  return index % 2 === 0 ? T.accent : "#8DCEC0"
}

function StatCard({ item, index }: { item: (typeof overviewMock.stats)[number]; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="rounded-[18px] border p-4"
      style={{ background: T.card, borderColor: T.border }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[12px]" style={{ color: T.muted }}>{item.label}</span>
        <Icon size={16} style={{ color: statIconColor(index) }} />
      </div>
      <div className="text-2xl font-semibold" style={{ color: T.text }}>{item.value}</div>
      <div className="mt-1 text-[11px]" style={{ color: T.faint }}>{item.hint}</div>
    </motion.div>
  )
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[20px] border p-5" style={{ background: T.card, borderColor: T.border }}>
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-semibold" style={{ color: T.text }}>{title}</h3>
        {action && <span className="shrink-0 text-[11px]" style={{ color: T.faint }}>{action}</span>}
      </div>
      {children}
    </div>
  )
}

function AttentionList() {
  return (
    <Panel title="Precisa de atenção" action="Prioridade de hoje">
      <div className="grid gap-2">
        {overviewMock.attentionItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="grid grid-cols-1 items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(240,237,228,0.22)] sm:grid-cols-[1fr_auto] xl:grid-cols-[1fr_92px_160px]"
            style={{ background: "rgba(6,17,15,0.76)", borderColor: T.border }}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.name}</span>
              <span className="text-[12px]" style={{ color: T.faint }}>{item.description}</span>
            </span>
            <span className="w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(216,208,191,0.05)", borderColor: T.border, color: T.muted }}>
              {item.status}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold sm:justify-end" style={{ color: T.accent }}>
              {item.action}
              <ChevronRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

function TodaySchedule() {
  return (
    <Panel title="Agenda de hoje" action="3 sessões">
      <div className="flex flex-col gap-3">
        {overviewMock.todaySchedule.map((event) => (
          <div key={event.time} className="flex flex-col gap-3 rounded-[14px] border p-3 transition duration-200 hover:border-[rgba(240,237,228,0.22)] sm:flex-row sm:items-center" style={{ background: T.bgSec, borderColor: T.border }}>
            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-semibold" style={{ background: "rgba(240,237,228,0.06)", color: T.accent }}>
              {event.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: T.text }}>{event.title}</p>
              <p className="text-[12px]" style={{ color: T.faint }}>{event.client}</p>
            </div>
            <span className="w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(47,127,104,0.12)", borderColor: "rgba(47,127,104,0.30)", color: T.accent }}>
              {event.status}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function PipelineSummary() {
  return (
    <Panel title="Pipeline de orçamentos" action="Valores estimados">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {overviewMock.pipeline.map((stage) => (
          <div key={stage.label} className="rounded-[14px] border p-4" style={{ background: T.bgSec, borderColor: T.border }}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold" style={{ color: T.text }}>{stage.label}</p>
              <span className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: T.border, color: T.faint }}>
                {stage.count}
              </span>
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ color: T.text }}>{stage.value}</p>
            <p className="mt-1 text-[11px]" style={{ color: T.faint }}>{stage.count} oportunidades</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function StudioPulse() {
  return (
    <Panel title="Pulso do studio" action="Análise rápida">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {overviewMock.studioPulse.map((metric, index) => {
          const MetricIcon = metric.icon
          return (
            <div key={metric.label} className="rounded-[14px] border p-4" style={{ background: T.bgSec, borderColor: T.border }}>
              <MetricIcon size={17} style={{ color: statIconColor(index) }} />
              <p className="mt-5 text-xl font-semibold" style={{ color: T.text }}>{metric.value}</p>
              <p className="text-[12px]" style={{ color: T.faint }}>{metric.label}</p>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function BudgetBoard() {
  return (
    <div className="grid gap-3 xl:grid-cols-4">
      {boardColumns.map((column) => (
        <Panel key={column.title} title={column.title} action={column.total}>
          <div className="flex flex-col gap-2">
            {column.items.map((item) => (
              <div key={item} className="rounded-[14px] border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: T.text }}>{item}</p>
                  <MoreHorizontal size={15} style={{ color: T.faint }} />
                </div>
                <p className="text-[11px]" style={{ color: T.faint }}>Cliente mockado · responder hoje</p>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  )
}

function ClientsView() {
  return (
    <Panel title="Clientes" action="Base dev">
      <div className="grid gap-2">
        {clients.map((client) => (
          <div key={client.name} className="grid gap-2 rounded-[14px] border px-4 py-3 md:grid-cols-[1fr_140px_100px_90px]" style={{ background: T.bgSec, borderColor: T.border }}>
            <span className="text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
            <span className="text-[12px]" style={{ color: T.muted }}>{client.style}</span>
            <span className="text-[12px]" style={{ color: T.faint }}>{client.last}</span>
            <span className="text-sm font-semibold md:text-right" style={{ color: T.text }}>{client.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function PortfolioView() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {portfolio.map((item) => (
        <div key={item.title} className="min-h-44 rounded-[20px] border p-5" style={{ background: `linear-gradient(145deg, ${item.tone}, rgba(8,23,19,0.88))`, borderColor: T.border }}>
          <ImageIcon size={20} style={{ color: T.accent }} />
          <h3 className="mt-12 text-lg font-semibold" style={{ color: T.text }}>{item.title}</h3>
          <p className="text-[12px]" style={{ color: T.faint }}>{item.count}</p>
        </div>
      ))}
    </div>
  )
}

function AccessView() {
  return (
    <Panel title="Acesso do projeto" action="Sem bloqueios reais">
      <div className="grid gap-3 md:grid-cols-2">
        {["Clientes", "Orçamentos", "Agenda", "Portfólio", "Mensagens", "Configurações"].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-[12px] border px-3 py-2.5" style={{ borderColor: T.border, background: T.bgSec }}>
            <span className="text-sm" style={{ color: T.text }}>{item}</span>
            <CheckCircle2 size={16} style={{ color: T.accent }} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function StudioSwitcher({ profile }: { profile: StudioProfile }) {
  const studioName = studioValue(profile.studioName, overviewMock.studioProfile.fallbackName)
  const initial = studioName.trim().charAt(0).toUpperCase() || "M"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="mt-3 flex w-full items-center gap-3 rounded-[16px] border p-2.5 text-left transition duration-200 hover:bg-[rgba(240,237,228,0.06)] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
          style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border }}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] border text-sm font-semibold" style={{ background: "rgba(0,71,65,0.24)", borderColor: T.borderStrong, color: T.accent }}>
            {initial}
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{studioName}</span>
            <span className="block truncate text-[11px]" style={{ color: T.faint }}>Studio ativo</span>
          </span>
          <ChevronDown size={15} className="shrink-0 group-data-[collapsible=icon]:hidden" style={{ color: T.faint }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-64 rounded-[16px] border p-2 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Studio ativo</span>
          <span className="mt-1 block truncate text-sm font-semibold" style={{ color: T.text }}>{studioName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgba(240,237,228,0.10)]" />
        <DropdownMenuItem className="rounded-[12px] px-3 py-2 text-[13px] text-[rgba(240,237,228,0.78)] focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]">
          Gerenciar studio
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="rounded-[12px] px-3 py-2 text-[13px]">
          <span className="flex-1">Adicionar novo studio</span>
          <span className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: T.border, color: T.faint }}>Em breve</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StudioSummary({
  profile,
  setupCompleted,
  onReset,
}: {
  profile: StudioProfile
  setupCompleted: boolean
  onReset: () => void
}) {
  return (
    <Panel title="Studio" action={setupCompleted ? "Studio configurado" : "Setup pendente"}>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Nome", studioValue(profile.studioName, "Studio sem nome")],
          ["Horário", studioHours(profile)],
          ["Canal principal", studioValue(profile.mainContactChannel)],
          ["Equipe", studioValue(profile.teamSize)],
          ["Estilos principais", profile.mainStyles.length ? profile.mainStyles.join(", ") : "Opcional"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[12px] border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
            <p className="text-[11px]" style={{ color: T.faint }}>{label}</p>
            <p className="mt-1 truncate text-sm font-semibold" style={{ color: T.text }}>{value}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-[12px] border px-4 py-2.5 text-sm font-semibold"
        style={{ background: "rgba(240,237,228,0.02)", borderColor: T.border, color: T.muted }}
      >
        Editar studio
      </button>
    </Panel>
  )
}

function SectionContent({
  section,
  studioProfile,
  setupCompleted,
  onResetSetup,
}: {
  section: SectionId
  studioProfile: StudioProfile
  setupCompleted: boolean
  onResetSetup: () => void
}) {
  if (section === "budgets") return <BudgetBoard />
  if (section === "clients") return <ClientsView />
  if (section === "calendar") return <TodaySchedule />
  if (section === "portfolio") return <PortfolioView />
  if (section === "messages") {
    return (
      <Panel title="Mensagens" action="3 novas">
        <div className="grid gap-3">
          {["Marina enviou referência", "Rafael confirmou sinal", "Júlia pediu ajuste no desenho"].map((message) => (
            <div key={message} className="flex items-center justify-between rounded-[14px] border px-4 py-3" style={{ background: T.bgSec, borderColor: T.border }}>
              <span className="text-sm" style={{ color: T.text }}>{message}</span>
              <ChevronRight size={16} style={{ color: T.faint }} />
            </div>
          ))}
        </div>
      </Panel>
    )
  }
  if (section === "settings") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudioSummary profile={studioProfile} setupCompleted={setupCompleted} onReset={onResetSetup} />
        <AccessView />
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {overviewMock.stats.map((item, index) => <StatCard key={item.label} item={item} index={index} />)}
      </div>

      <div className="mt-5">
        <PipelineSummary />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AttentionList />
        <TodaySchedule />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <StudioSummary profile={studioProfile} setupCompleted={setupCompleted} onReset={onResetSetup} />
        <StudioPulse />
      </div>
    </>
  )
}

function getSectionTitle(section: SectionId) {
  return sections.find((item) => item.id === section)?.label ?? "Visão geral"
}

export default function DevDashboard() {
  const profile = readDevSession()
  const [activeSection, setActiveSection] = useState<SectionId>("overview")
  const {
    studioProfile,
    studioSetupCompleted,
    completeStudioSetup,
    reopenStudioSetup,
  } = useStudioSetup()

  const sidebarVars = useMemo(
    () => ({
      "--sidebar": "#040907",
      "--sidebar-foreground": T.text,
      "--sidebar-border": "rgba(240,237,228,0.10)",
      "--sidebar-accent": "rgba(240,237,228,0.08)",
      "--sidebar-accent-foreground": T.text,
      "--background": T.bg,
      "--foreground": T.text,
      "--border": "rgba(240,237,228,0.10)",
    }) as CSSProperties,
    [],
  )

  const logout = () => {
    clearDevSession()
    window.location.hash = "#/login"
  }

  const activeStudioName = studioValue(studioProfile.studioName, overviewMock.studioProfile.fallbackName)
  const activeChannel = studioValue(studioProfile.mainContactChannel, overviewMock.studioProfile.fallbackChannel)
  const isOverview = activeSection === "overview"
  const headerBadge = isOverview
    ? "Operação ativa"
    : studioSetupCompleted
      ? "Studio configurado"
      : "Tudo liberado para desenvolvimento"
  const headerSubtitle = isOverview
    ? `${activeStudioName} · Hoje`
    : studioSetupCompleted
      ? `Horário: ${studioHours(studioProfile)} · Canal principal: ${activeChannel} · Equipe: ${studioValue(studioProfile.teamSize)}`
      : "Tela mockada para validar a experiência principal do SaaS."

  return (
    <SidebarProvider style={sidebarVars} defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-[rgba(240,237,228,0.10)]">
        <SidebarHeader className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" className="h-12 rounded-[14px] hover:bg-[rgba(240,237,228,0.06)]">
                <a href="#/painel">
                  <img src={marklyIcon} alt="" className="size-8 object-contain" aria-hidden="true" />
                  <span className="text-lg font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>Markly</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <StudioSwitcher profile={studioProfile} />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.16em] text-[rgba(240,237,228,0.42)]">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sections.map(({ id, label, icon: Icon, badge }) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      isActive={activeSection === id}
                      tooltip={label}
                      onClick={() => setActiveSection(id)}
                      className="h-10 rounded-[12px] text-[rgba(240,237,228,0.68)] hover:bg-[rgba(240,237,228,0.06)] hover:text-[#F0EDE4] data-[active=true]:bg-[rgba(240,237,228,0.10)] data-[active=true]:text-[#F0EDE4]"
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {badge && (
                      <SidebarMenuBadge className="text-[10px] text-[rgba(240,237,228,0.58)]">
                        {badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarSeparator className="mb-2 bg-[rgba(240,237,228,0.10)]" />
          <div className="rounded-[16px] border p-3 group-data-[collapsible=icon]:hidden" style={{ background: "rgba(0,71,65,0.16)", borderColor: T.border }}>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold" style={{ color: T.accent }}>
              <ShieldCheck size={15} /> Dev liberado
            </div>
            <p className="text-[11px] leading-5" style={{ color: T.faint }}>
              Ambiente mockado. Sem banco, sem bloqueios reais.
            </p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-screen min-w-0 overflow-x-hidden bg-[#020806] text-[#F0EDE4]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-7" style={{ background: "rgba(4,9,7,0.78)", borderColor: T.border }}>
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="text-[rgba(240,237,228,0.72)] hover:bg-[rgba(240,237,228,0.08)] hover:text-[#F0EDE4]" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: T.faint }}>Painel interno</p>
              <h1 className="truncate text-base font-semibold md:text-lg" style={{ color: T.text }}>Olá, {profile.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border px-3 py-2 text-[12px] font-semibold md:inline-flex" style={{ borderColor: T.border, color: T.muted }}>
              {profile.role}
            </span>
            <button className="rounded-full border p-2" style={{ borderColor: T.border, color: T.muted }} aria-label="Notificações">
              <Bell size={16} />
            </button>
            <button onClick={logout} className="rounded-full border p-2" style={{ borderColor: T.border, color: T.muted }} aria-label="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-64px)] min-w-0 overflow-x-hidden p-4 md:p-7">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.accent }} />
                {headerBadge}
              </div>
              <h2 className="text-2xl font-semibold md:text-4xl" style={{ color: T.text, fontFamily: "'Syne', sans-serif" }}>
                {getSectionTitle(activeSection)}
              </h2>
              <p className="mt-1 max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
                {headerSubtitle}
              </p>
              {isOverview && (
                <p className="mt-1 max-w-[720px] text-[13px] leading-6" style={{ color: T.faint }}>
                  3 sessões hoje · 12 orçamentos abertos · Canal principal: {activeChannel}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm" style={{ borderColor: T.border, color: T.muted }}>
                <Search size={15} /> Buscar
              </button>
              <button className="inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold" style={{ background: T.text, color: T.bg }}>
                <Plus size={15} /> Novo
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <SectionContent
                section={activeSection}
                studioProfile={studioProfile}
                setupCompleted={studioSetupCompleted}
                onResetSetup={reopenStudioSetup}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>

      <StudioSetupModal
        open={!studioSetupCompleted}
        initialProfile={studioProfile}
        onComplete={completeStudioSetup}
      />
    </SidebarProvider>
  )
}
