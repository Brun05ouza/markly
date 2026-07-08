import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ptBR } from "date-fns/locale/pt-BR"
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  HeartHandshake,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Moon,
  PanelLeftClose,
  PanelLeftDashed,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Upload,
  Users,
  WalletCards,
  X,
} from "lucide-react"
import marklyIcon from "../../assets/icon-markly.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "../components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Calendar as DatePickerCalendar } from "../components/ui/calendar"
import { clearDevSession, readDevSession } from "../devAccess"
import StudioSetupModal from "../components/onboarding/StudioSetupModal"
import LottieCheckbox from "../components/LottieCheckbox"
import { useStudioSetup } from "../hooks/useStudioSetup"
import { T } from "../theme"
import { type StudioProfile } from "../utils/studioStorage"
import { cn } from "../components/ui/utils"
import {
  formatLogoSizeLimit,
  getStudioBrandIcon,
  studioBrandIconOptions,
  studioLogoMaxBytes,
} from "../utils/studioBrand"

type SectionId = "overview" | "budgets" | "clients" | "calendar" | "portfolio" | "messages" | "finance" | "anamnesis" | "settings"
type SidebarLayoutMode = "expanded" | "hover" | "collapsed"
type AppearanceMode = "dark" | "light"
type DateFilterRange = {
  start: string
  end: string
}
type FinanceTransaction = {
  date: string
  description: string
  category: string
  method: string
  status: string
  amount: number
  type: "income" | "expense"
}
type FinanceLaunchDraft = {
  type: string
  description: string
  amount: string
  client: string
  method: string
  status: string
  date: string
}

const SIDEBAR_LAYOUT_KEY = "markly_sidebar_layout_mode"
const SIDEBAR_HOVER_LEAVE_MS = 220
const APPEARANCE_MODE_KEY = "markly_appearance_mode"

const sidebarLayoutModes: {
  id: SidebarLayoutMode
  label: string
  title: string
  icon: typeof PanelLeftClose
}[] = [
  {
    id: "expanded",
    label: "Expandida",
    title: "Sidebar sempre aberta",
    icon: PanelLeftClose,
  },
  {
    id: "hover",
    label: "Hover",
    title: "Expande ao passar o mouse",
    icon: PanelLeftDashed,
  },
  {
    id: "collapsed",
    label: "Comprimida",
    title: "Sidebar sempre com ícones",
    icon: PanelLeftOpen,
  },
]

function readSidebarLayoutMode(): SidebarLayoutMode {
  if (typeof window === "undefined") return "expanded"
  const raw = window.localStorage.getItem(SIDEBAR_LAYOUT_KEY)
  if (raw === "expanded" || raw === "hover" || raw === "collapsed") return raw
  return "expanded"
}

function persistSidebarLayoutMode(mode: SidebarLayoutMode) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(SIDEBAR_LAYOUT_KEY, mode)
}

function readAppearanceMode(): AppearanceMode {
  if (typeof window === "undefined") return "dark"
  return window.localStorage.getItem(APPEARANCE_MODE_KEY) === "light" ? "light" : "dark"
}

function persistAppearanceMode(mode: AppearanceMode) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(APPEARANCE_MODE_KEY, mode)
}

const sections = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "budgets", label: "Orçamentos", icon: FileText, badge: "12" },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "calendar", label: "Agenda", icon: Calendar, badge: "Hoje" },
  { id: "portfolio", label: "Portfólio", icon: ImageIcon },
  { id: "messages", label: "Mensagens", icon: MessageSquare, badge: "3" },
  { id: "finance", label: "Financeiro", icon: DollarSign },
  { id: "anamnesis", label: "Anamnese", icon: HeartHandshake },
  { id: "settings", label: "Configurações", icon: Settings },
] as const

const overviewMock = {
  studioProfile: {
    fallbackName: "Meu Studio",
    fallbackChannel: "WhatsApp",
  },
  summary: {
    todaySessions: 3,
    unansweredBudgets: 12,
    pendingDepositsAmount: 1240,
  },
  stats: [
    { label: "Orçamentos abertos", value: "42", hint: "12 sem resposta", icon: FileText },
    { label: "Sessões hoje", value: "3", hint: "Próxima às 10:00", icon: Calendar },
    { label: "Sinais pendentes", value: "R$ 1.240", hint: "4 aguardando pagamento", icon: WalletCards },
    { label: "Faturamento estimado", value: "R$ 8.450", hint: "mês atual", icon: TrendingUp },
  ],
  attentionItems: [
    { name: "Mariana Alves", description: "Orçamento enviado há 2 dias", badge: "Follow-up", action: "Enviar follow-up" },
    { name: "Lucas Rocha", description: "Sinal pendente", badge: "Pagamento", action: "Confirmar pagamento" },
    { name: "Júlia Martins", description: "Sessão hoje às 10:00", badge: "Hoje", action: "Ver ficha" },
    { name: "Rafael Nunes", description: "Anamnese não preenchida", badge: "Anamnese", action: "Enviar formulário" },
  ],
  todaySchedule: [
    { time: "10:00", title: "Sessão floral P&B", client: "Júlia Martins", status: "Sinal pago" },
    { time: "13:30", title: "Retoque fine line", client: "Marina Alves", status: "Confirmado" },
    { time: "16:00", title: "Consulta blackwork", client: "Rafael Nunes", status: "Anamnese pendente" },
  ],
  pipeline: [
    { label: "Novo", count: 8, value: "R$ 2.400" },
    { label: "Em análise", count: 12, value: "R$ 5.800" },
    { label: "Sinal pendente", count: 4, value: "R$ 1.240" },
    { label: "Agendado", count: 18, value: "R$ 8.450" },
  ],
  studioPulse: [
    { label: "Ticket médio", value: "R$ 620", description: "últimos 30 dias", icon: WalletCards },
    { label: "Tempo médio de resposta", value: "6h", description: "média estimada", icon: Clock },
    { label: "Agenda ocupada", value: "92%", description: "semana atual", icon: Calendar },
    { label: "Taxa de fechamento", value: "68%", description: "orçamentos convertidos", icon: TrendingUp },
  ],
  searchItems: [
    { title: "Mariana Alves", type: "Cliente", description: "Última sessão há 12 dias" },
    { title: "Fine line antebraço", type: "Orçamento", description: "R$ 680 · Novo" },
    { title: "Sessão floral P&B", type: "Agenda", description: "Hoje às 10:00" },
    { title: "Blackwork braço", type: "Orçamento", description: "R$ 1.800 · Agendado" },
    { title: "Anamnese Rafael Nunes", type: "Anamnese", description: "Pendente" },
  ],
  createActions: [
    { label: "Novo orçamento", description: "Criar pedido com valor, cliente e status" },
    { label: "Novo cliente", description: "Cadastrar contato e histórico" },
    { label: "Nova sessão", description: "Agendar horário no studio" },
    { label: "Novo item no portfólio", description: "Adicionar referência ou trabalho" },
    { label: "Nova anamnese", description: "Enviar ou criar ficha" },
    { label: "Novo follow-up", description: "Criar lembrete de retorno" },
  ],
}

const financeMock = {
  summary: {
    monthlyRevenue: 8450,
    receivedDeposits: 2780,
    pendingAmount: 1240,
    expenses: 680,
  },
  pendingPayments: [
    {
      client: "Lucas Rocha",
      service: "Realismo · Ombro",
      amount: 420,
      status: "Sinal pendente",
      dueDate: "Hoje",
      action: "Marcar como pago",
    },
    {
      client: "Mariana Alves",
      service: "Fine line · Antebraço",
      amount: 300,
      status: "Restante da sessão",
      dueDate: "02/07",
      action: "Confirmar pagamento",
    },
    {
      client: "Rafael Nunes",
      service: "Blackwork · Braço",
      amount: 520,
      status: "Aguardando sinal",
      dueDate: "03/07",
      action: "Enviar lembrete",
    },
  ],
  statusSummary: [
    { label: "Pago", value: 6530, tone: "#8DCEC0" },
    { label: "Pendente", value: 1240, tone: T.accent },
    { label: "Aguardando sinal", value: 680, tone: "#A9B9B2" },
    { label: "Cancelado", value: 0, tone: "rgba(240,237,228,0.34)" },
  ],
  transactions: [
    { date: "02/07", description: "Sessão floral P&B", category: "Júlia Martins", method: "Pix", status: "Pago", amount: 680, type: "income" },
    { date: "02/07", description: "Sinal fine line", category: "Mariana Alves", method: "Pix", status: "Pago", amount: 200, type: "income" },
    { date: "01/07", description: "Compra de agulhas", category: "Material", method: "Cartão", status: "Pago", amount: 180, type: "expense" },
    { date: "01/07", description: "Sinal blackwork", category: "Rafael Nunes", method: "Dinheiro", status: "Pendente", amount: 300, type: "income" },
    { date: "30/06", description: "Tinta preta", category: "Material", method: "Pix", status: "Pago", amount: 120, type: "expense" },
  ] satisfies FinanceTransaction[],
  paymentMethods: [
    { label: "Pix", value: 5420 },
    { label: "Dinheiro", value: 1200 },
    { label: "Cartão", value: 1830 },
  ],
  indicators: [
    { label: "Ticket médio", value: "R$ 620", description: "últimos 30 dias" },
    { label: "Maior orçamento", value: "R$ 1.800", description: "Blackwork braço" },
    { label: "Sessões pagas", value: "14", description: "no mês atual" },
    { label: "Taxa de sinal", value: "72%", description: "orçamentos confirmados" },
  ],
}

const financeLaunchTypes = ["Entrada", "Saída", "Sinal recebido", "Pagamento de sessão", "Despesa do studio"]
const financeClients = ["Mariana Alves", "Lucas Rocha", "Júlia Martins", "Rafael Nunes", "Sem cliente"]
const financePaymentMethods = ["Pix", "Dinheiro", "Cartão", "Transferência", "Outro"]
const financeStatuses = ["Pago", "Pendente", "Cancelado"]

const boardColumns = [
  { title: "Novos", total: "8", items: ["Fine line costela", "Dragão oriental", "Lettering mão"] },
  { title: "Em orçamento", total: "5", items: ["Fechamento floral", "Blackwork braço"] },
  { title: "Sinal pago", total: "3", items: ["Flash autoral", "Mandala ombro"] },
  { title: "Fechados", total: "9", items: ["Old school águia", "Micro realismo"] },
]

const studioTypes = ["Sou tatuador independente", "Tenho um studio pequeno", "Tenho um studio com equipe"]
const teamSizes = ["Só eu", "2 a 3 pessoas", "4 a 6 pessoas", "Mais de 6 pessoas"]
const contactChannels = ["WhatsApp", "Instagram", "Presencial", "Todos"]
const depositOptions = ["Sim, cobro sinal", "Não cobro sinal", "Depende do orçamento"]
const styleOptions = ["Fine line", "Blackwork", "Realismo", "Old school", "Floral", "Geométrico", "Anime/geek", "Minimalista", "Autoral", "Outro"]
const timeOptions = Array.from({ length: 31 }, (_, index) => {
  const totalMinutes = 7 * 60 + index * 30
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0")
  const minutes = (totalMinutes % 60).toString().padStart(2, "0")
  return `${hours}:${minutes}`
})
const acceptedLogoTypes = ["image/png", "image/jpeg", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"]
type StudioManageSectionId = "identity" | "details" | "hours" | "styles"
const studioManageSections: { id: StudioManageSectionId; label: string; description: string }[] = [
  { id: "identity", label: "Identidade", description: "Logo e icone" },
  { id: "details", label: "Nome e status", description: "Dados do studio" },
  { id: "hours", label: "Horario", description: "Agenda inicial" },
  { id: "styles", label: "Estilos", description: "Especialidades" },
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

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function formatTodayDate() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
}

function parseDateValue(value: string) {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDateFilterLabel(value: string) {
  const date = parseDateValue(value)
  if (!date) return "Selecione uma data"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatFinanceAmount(transaction: FinanceTransaction) {
  return `${transaction.type === "expense" ? "- " : "+ "}${formatCurrency(transaction.amount)}`
}

function parseFinanceAmount(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? Math.abs(parsed) : 0
}

function isExpenseLaunch(type: string) {
  return type === "Saída" || type === "Despesa do studio"
}

function StatCard({ item, index }: { item: (typeof overviewMock.stats)[number]; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="rounded-[18px] border p-4 transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
      style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[12px]" style={{ color: T.muted }}>{item.label}</span>
        <span className="flex size-8 items-center justify-center rounded-[10px] border" style={{ background: "rgba(240,237,228,0.04)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <div className="text-2xl font-semibold tracking-tight" style={{ color: T.text }}>{item.value}</div>
      <div className="mt-1 text-[11px]" style={{ color: T.faint }}>{item.hint}</div>
    </motion.div>
  )
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-[20px] border p-5" style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.16)" }}>
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-semibold leading-snug" style={{ color: T.text }}>{title}</h3>
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
            onClick={() => console.log(`[Markly] Ação: ${item.action} · ${item.name}`)}
            className="group flex flex-col gap-3 rounded-[14px] border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(240,237,228,0.22)] sm:flex-row sm:items-center"
            style={{ background: "rgba(6,17,15,0.76)", borderColor: T.border }}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.name}</span>
              <span className="text-[12px]" style={{ color: T.faint }}>{item.description}</span>
            </span>
            <span className="w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ background: "rgba(216,208,191,0.05)", borderColor: T.border, color: T.muted }}>
              {item.badge}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold" style={{ color: T.accent }}>
              {item.action}
              <ChevronRight size={14} className="transition duration-200 group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

function scheduleStatusStyle(status: string) {
  if (status.toLowerCase().includes("pendente")) {
    return {
      background: "rgba(216,208,191,0.10)",
      borderColor: "rgba(216,208,191,0.28)",
      color: T.accent,
    }
  }
  return {
    background: "rgba(47,127,104,0.12)",
    borderColor: "rgba(47,127,104,0.30)",
    color: T.accent,
  }
}

function TodaySchedule() {
  return (
    <Panel title="Agenda de hoje" action={`${overviewMock.todaySchedule.length} sessões`}>
      <div className="flex flex-col gap-3">
        {overviewMock.todaySchedule.map((event) => {
          const statusStyle = scheduleStatusStyle(event.status)
          return (
            <div key={event.time} className="flex flex-col gap-3 rounded-[14px] border p-3 transition duration-200 hover:border-[rgba(240,237,228,0.22)] sm:flex-row sm:items-center" style={{ background: T.bgSec, borderColor: T.border }}>
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-semibold" style={{ background: "rgba(240,237,228,0.06)", color: T.accent }}>
                {event.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" style={{ color: T.text }}>{event.title}</p>
                <p className="text-[12px]" style={{ color: T.faint }}>{event.client}</p>
              </div>
              <span className="w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={statusStyle}>
                {event.status}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function PipelineSummary() {
  return (
    <Panel title="Pipeline de orçamentos" action="Valores estimados">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMock.pipeline.map((stage) => (
          <div
            key={stage.label}
            className="rounded-[14px] border p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(240,237,228,0.22)]"
            style={{ background: T.bgSec, borderColor: T.border }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold" style={{ color: T.text }}>{stage.label}</p>
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: T.border, color: T.faint, background: "rgba(240,237,228,0.03)" }}>
                {stage.count}
              </span>
            </div>
            <p className="mt-4 text-lg font-semibold tracking-tight" style={{ color: T.text }}>{stage.value}</p>
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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMock.studioPulse.map((metric, index) => {
          const MetricIcon = metric.icon
          return (
            <div key={metric.label} className="rounded-[14px] border p-4 transition duration-200 hover:border-[rgba(240,237,228,0.18)]" style={{ background: T.bgSec, borderColor: T.border }}>
              <MetricIcon size={16} style={{ color: statIconColor(index) }} />
              <p className="mt-4 text-xl font-semibold tracking-tight" style={{ color: T.text }}>{metric.value}</p>
              <p className="mt-1 text-[12px] font-medium" style={{ color: T.muted }}>{metric.label}</p>
              <p className="mt-0.5 text-[11px]" style={{ color: T.faint }}>{metric.description}</p>
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

function ManageSelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold" style={{ color: T.text }}>{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="h-11 rounded-[13px] border px-3.5 text-left text-[13px] font-semibold shadow-none data-[placeholder]:text-[rgba(240,237,228,0.42)]"
          style={{
            background: "rgba(2,8,6,0.62)",
            borderColor: value ? "rgba(240,237,228,0.18)" : T.border,
            color: value ? T.text : T.faint,
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="z-[160] rounded-[14px] border bg-[#06110f] p-1 text-[#F0EDE4] shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
          style={{ borderColor: "rgba(240,237,228,0.14)" }}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-[10px] px-3 py-2.5 text-[13px] text-[rgba(240,237,228,0.76)] focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ManageTimeField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  return (
    <div
      className="rounded-[14px] border p-3 transition duration-200"
      style={{
        background: disabled ? "rgba(2,8,6,0.28)" : "rgba(2,8,6,0.62)",
        borderColor: disabled ? "rgba(240,237,228,0.07)" : "rgba(240,237,228,0.13)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.faint }}>{label}</p>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className="h-auto rounded-none border-0 bg-transparent p-0 text-left text-[18px] font-semibold shadow-none ring-0 focus:ring-0 focus-visible:ring-0 [&>svg]:opacity-45"
          style={{ color: T.text }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="z-[160] max-h-[240px] rounded-[14px] border bg-[#06110f] p-1 text-[#F0EDE4] shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
          style={{ borderColor: "rgba(240,237,228,0.14)" }}
        >
          {timeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-[rgba(240,237,228,0.78)] focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ManageStyleChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3.5 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
      style={{
        background: active ? T.text : "rgba(2,8,6,0.46)",
        borderColor: active ? T.text : T.border,
        color: active ? T.bg : T.muted,
        boxShadow: active ? "0 10px 24px rgba(216,208,191,0.10)" : "none",
      }}
    >
      {label}
    </button>
  )
}

function StudioManageModal({
  open,
  profile,
  onOpenChange,
  onSave,
}: {
  open: boolean
  profile: StudioProfile
  onOpenChange: (open: boolean) => void
  onSave: (profile: StudioProfile) => void
}) {
  const [draft, setDraft] = useState<StudioProfile>(profile)
  const [error, setError] = useState("")
  const [activeManageSection, setActiveManageSection] = useState<StudioManageSectionId>("identity")
  const BrandIcon = getStudioBrandIcon(draft.studioIcon)
  const selectedBrandOption = studioBrandIconOptions.find((option) => option.id === draft.studioIcon) ?? studioBrandIconOptions[0]
  const activeManageIndex = studioManageSections.findIndex((section) => section.id === activeManageSection)
  const activeManagePosition = activeManageIndex >= 0 ? activeManageIndex : 0

  useEffect(() => {
    if (!open) return
    setDraft(profile)
    setError("")
    setActiveManageSection("identity")
  }, [open, profile])

  const update = <Key extends keyof StudioProfile>(key: Key, value: StudioProfile[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const toggleStyle = (style: string) => {
    setDraft((current) => {
      const active = current.mainStyles.includes(style)
      return {
        ...current,
        mainStyles: active ? current.mainStyles.filter((item) => item !== style) : [...current.mainStyles, style],
      }
    })
    setError("")
  }

  const handleLogoUpload = (file?: File) => {
    if (!file) return

    if (!acceptedLogoTypes.includes(file.type)) {
      setError("Use uma logo em PNG, JPG, WEBP ou ICO.")
      return
    }

    if (file.size > studioLogoMaxBytes) {
      setError(`Use uma logo leve, com no máximo ${formatLogoSizeLimit()}.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => update("studioLogoDataUrl", String(reader.result || ""))
    reader.onerror = () => setError("Não foi possível carregar essa logo.")
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!draft.studioName.trim()) {
      setError("Defina o nome do studio antes de salvar.")
      return
    }

    if (!draft.studioType || !draft.teamSize) {
      setError("Escolha o tipo do studio e o tamanho da equipe.")
      return
    }

    onSave({ ...draft, studioName: draft.studioName.trim() })
    onOpenChange(false)
  }

  const moveManageSection = (offset: number) => {
    const nextIndex = Math.min(Math.max(activeManagePosition + offset, 0), studioManageSections.length - 1)
    setActiveManageSection(studioManageSections[nextIndex].id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[88vh] gap-0 overflow-hidden rounded-[24px] border p-0 sm:max-w-[860px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[rgba(240,237,228,0.58)] [&>button:hover]:text-[#F0EDE4]"
        style={{ background: "rgba(5,14,12,0.98)", borderColor: T.borderStrong, color: T.text, boxShadow: "0 30px 100px rgba(0,0,0,0.62)" }}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
            Studio ativo
          </div>
          <DialogTitle className="font-display text-2xl" style={{ color: T.text }}>
            Gerenciar studio
          </DialogTitle>
          <DialogDescription className="max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
            Atualize nome, identidade visual, atendimento e preferências do studio sem voltar para o setup inicial.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(88vh-154px)] overflow-y-auto px-6 py-5">
          <div className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {studioManageSections.map((section, index) => {
              const active = activeManageSection === section.id
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveManageSection(section.id)}
                  className={cn(
                    "rounded-[15px] border p-3 text-left transition duration-200 hover:-translate-y-0.5",
                    active && "shadow-[0_14px_34px_rgba(0,0,0,0.20)]",
                  )}
                  style={{
                    background: active ? "linear-gradient(135deg, rgba(216,208,191,0.12), rgba(0,71,65,0.16))" : "rgba(2,8,6,0.42)",
                    borderColor: active ? "rgba(216,208,191,0.24)" : T.border,
                    color: active ? T.text : T.muted,
                  }}
                >
                  <span className="mb-2 flex size-6 items-center justify-center rounded-full border text-[10px] font-semibold" style={{ borderColor: active ? "rgba(216,208,191,0.28)" : T.border, color: active ? T.accent : T.faint }}>
                    {index + 1}
                  </span>
                  <span className="block text-[13px] font-semibold">{section.label}</span>
                  <span className="mt-0.5 block text-[11px]" style={{ color: active ? T.muted : T.faint }}>{section.description}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeManageSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
          <div className={cn("grid gap-5", activeManageSection === "identity" || activeManageSection === "details" ? "lg:grid-cols-1" : "hidden")}>
            <section className={cn("rounded-[18px] border p-4", activeManageSection !== "identity" && "hidden")} style={{ background: "rgba(2,8,6,0.46)", borderColor: T.border }}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.faint }}>Identidade</p>
              <div className="mt-4 flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(216,208,191,0.34)]"
                      style={{ background: "rgba(240,237,228,0.04)", borderColor: T.borderStrong, color: T.accent }}
                      aria-label="Selecionar ícone do studio"
                    >
                      {draft.studioLogoDataUrl ? (
                        <img src={draft.studioLogoDataUrl} alt="" className="size-full object-cover" aria-hidden="true" />
                      ) : (
                        <BrandIcon size={34} strokeWidth={1.75} />
                      )}
                      <span className="absolute inset-x-2 bottom-2 rounded-full border px-2 py-0.5 text-[9px] font-semibold opacity-0 backdrop-blur transition duration-200 group-hover:opacity-100" style={{ background: "rgba(2,8,6,0.72)", borderColor: T.border, color: T.text }}>
                        Trocar
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    side="right"
                    sideOffset={12}
                    className="z-[170] w-[286px] rounded-[18px] border p-2 shadow-2xl backdrop-blur-xl"
                    style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
                  >
                    <DropdownMenuLabel className="px-2.5 py-2">
                      <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Ícone do studio</span>
                      <span className="mt-1 block text-[12px]" style={{ color: T.muted }}>Atual: {selectedBrandOption.label}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[rgba(240,237,228,0.10)]" />
                    <div className="grid grid-cols-5 gap-1.5 p-1">
                      {studioBrandIconOptions.map((option) => {
                        const Icon = option.icon
                        const active = draft.studioIcon === option.id
                        return (
                          <DropdownMenuItem
                            key={option.id}
                            title={option.label}
                            onSelect={() => update("studioIcon", option.id)}
                            className="flex size-11 cursor-pointer items-center justify-center rounded-[13px] p-0 focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
                            style={{
                              background: active ? "rgba(216,208,191,0.12)" : "rgba(240,237,228,0.025)",
                              color: active ? T.accent : T.faint,
                              boxShadow: active ? "inset 0 0 0 1px rgba(216,208,191,0.28)" : "inset 0 0 0 1px rgba(240,237,228,0.08)",
                            }}
                          >
                            <Icon size={18} strokeWidth={1.85} />
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold" style={{ color: T.text }}>
                    {studioValue(draft.studioName, "Studio sem nome")}
                  </p>
                  <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
                    Clique no avatar para trocar o ícone. Logo opcional até {formatLogoSizeLimit()}.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <label
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
                  style={{ borderColor: T.border, color: T.text, background: "rgba(240,237,228,0.035)" }}
                >
                  <Upload size={14} />
                  Enviar logo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                    className="sr-only"
                    onChange={(event) => {
                      handleLogoUpload(event.currentTarget.files?.[0])
                      event.currentTarget.value = ""
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={!draft.studioLogoDataUrl}
                  onClick={() => update("studioLogoDataUrl", "")}
                  className="inline-flex items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45"
                  style={{ borderColor: T.border, color: T.muted, background: "rgba(240,237,228,0.02)" }}
                >
                  <X size={14} />
                  Remover
                </button>
              </div>
            </section>

            <section className={cn("grid gap-4 rounded-[18px] border p-4", activeManageSection !== "details" && "hidden")} style={{ background: "rgba(2,8,6,0.46)", borderColor: T.border }}>
              <div>
                <label htmlFor="studio-name" className="mb-2 block text-[12px] font-semibold" style={{ color: T.text }}>
                  Nome do studio
                </label>
                <input
                  id="studio-name"
                  value={draft.studioName}
                  onChange={(event) => update("studioName", event.target.value)}
                  placeholder="Ink Tatoo"
                  className="h-11 w-full rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[rgba(240,237,228,0.34)] focus:border-[rgba(216,208,191,0.30)]"
                  style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ManageSelectField label="Tipo de studio" value={draft.studioType} options={studioTypes} placeholder="Escolha o tipo" onChange={(value) => update("studioType", value)} />
                <ManageSelectField label="Equipe" value={draft.teamSize} options={teamSizes} placeholder="Tamanho da equipe" onChange={(value) => update("teamSize", value)} />
                <ManageSelectField label="Canal principal" value={draft.mainContactChannel} options={contactChannels} placeholder="Canal de atendimento" onChange={(value) => update("mainContactChannel", value)} />
                <ManageSelectField label="Sinal/reserva" value={draft.usesDeposit} options={depositOptions} placeholder="Como trabalha com sinal" onChange={(value) => update("usesDeposit", value)} />
              </div>
            </section>
          </div>

          <div className={cn("grid gap-5", activeManageSection === "hours" || activeManageSection === "styles" ? "lg:grid-cols-1" : "hidden")}>
            <section className={cn("rounded-[18px] border p-4", activeManageSection !== "hours" && "hidden")} style={{ background: "rgba(2,8,6,0.46)", borderColor: T.border }}>
              <div className="flex items-start gap-3 rounded-[14px] border p-3" style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border }}>
                <LottieCheckbox checked={draft.flexibleHours} onChange={(checked) => update("flexibleHours", checked)} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: T.text }}>Meu horário é flexível</p>
                  <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
                    Use isso quando a agenda muda por demanda e não existe um expediente fixo.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ManageTimeField label="Início" value={draft.businessHoursStart} disabled={draft.flexibleHours} onChange={(value) => update("businessHoursStart", value)} />
                <ManageTimeField label="Fim" value={draft.businessHoursEnd} disabled={draft.flexibleHours} onChange={(value) => update("businessHoursEnd", value)} />
              </div>
            </section>

            <section className={cn("rounded-[18px] border p-4", activeManageSection !== "styles" && "hidden")} style={{ background: "rgba(2,8,6,0.46)", borderColor: T.border }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.faint }}>Estilos principais</p>
                  <p className="mt-1 text-sm" style={{ color: T.muted }}>Selecione os estilos que aparecem como base do studio.</p>
                </div>
                <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.faint }}>
                  {draft.mainStyles.length || 0} ativos
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {styleOptions.map((style) => (
                  <ManageStyleChip
                    key={style}
                    label={style}
                    active={draft.mainStyles.includes(style)}
                    onClick={() => toggleStyle(style)}
                  />
                ))}
              </div>
            </section>
          </div>
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-5 rounded-[14px] border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: T.border, background: "rgba(2,8,6,0.58)" }}>
          <p className="text-[12px]" style={{ color: T.faint }}>
            Seção {activeManagePosition + 1} de {studioManageSections.length} · {studioManageSections[activeManagePosition].label}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={activeManagePosition === 0}
              onClick={() => moveManageSection(-1)}
              className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45"
              style={{ borderColor: T.border, color: T.muted }}
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={activeManagePosition === studioManageSections.length - 1}
              onClick={() => moveManageSection(1)}
              className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-45"
              style={{ borderColor: T.borderStrong, color: T.text, background: "rgba(240,237,228,0.04)" }}
            >
              Próxima seção
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
              style={{ borderColor: T.border, color: T.muted }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
              style={{ background: T.text, color: T.bg, boxShadow: "0 12px 32px rgba(216,208,191,0.12)" }}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StudioSwitcher({ profile, onManage }: { profile: StudioProfile; onManage: () => void }) {
  const studioName = studioValue(profile.studioName, overviewMock.studioProfile.fallbackName)
  const BrandIcon = getStudioBrandIcon(profile.studioIcon)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="grid h-[52px] w-full grid-cols-[2.75rem_minmax(0,1fr)_1rem] items-center rounded-[16px] border border-[rgba(240,237,228,0.12)] bg-[rgba(240,237,228,0.03)] py-1.5 pr-3 text-left shadow-[inset_0_1px_0_rgba(240,237,228,0.045)] transition duration-300 hover:border-[rgba(216,208,191,0.22)] hover:bg-[rgba(240,237,228,0.045)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:grid-cols-[2.75rem_0fr_0fr] group-data-[collapsible=icon]:rounded-[14px] group-data-[collapsible=icon]:border-[rgba(240,237,228,0.12)] group-data-[collapsible=icon]:bg-[rgba(240,237,228,0.035)] group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-[inset_0_1px_0_rgba(240,237,228,0.05)]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center justify-self-center overflow-hidden rounded-[9px] group-data-[collapsible=icon]:size-11" style={{ color: T.accent }}>
            {profile.studioLogoDataUrl ? (
              <img src={profile.studioLogoDataUrl} alt="" className="size-8 rounded-[8px] object-cover group-data-[collapsible=icon]:size-7" aria-hidden="true" />
            ) : (
              <BrandIcon size={19} strokeWidth={1.85} />
            )}
          </span>
          <span className="min-w-0 overflow-hidden transition-[opacity,transform] duration-200 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:opacity-0">
            <span className="block truncate text-[13px] font-semibold leading-5" style={{ color: T.text }}>{studioName}</span>
            <span className="inline-flex items-center gap-1.5 truncate text-[10.5px] leading-4" style={{ color: T.faint }}>
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: T.accent }} />
              Studio ativo
            </span>
          </span>
          <ChevronDown size={15} className="shrink-0 transition-[opacity,transform] duration-200 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:opacity-0" style={{ color: T.faint }} />
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
        <DropdownMenuItem
          className="cursor-pointer rounded-[12px] px-3 py-2 text-[13px] text-[rgba(240,237,228,0.78)] focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
          onSelect={onManage}
        >
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

function SidebarModeSwitcher({
  mode,
  onChange,
}: {
  mode: SidebarLayoutMode
  onChange: (mode: SidebarLayoutMode) => void
}) {
  const { state } = useSidebar()
  const isRail = state === "collapsed"
  const activeMode = sidebarLayoutModes.find((item) => item.id === mode) ?? sidebarLayoutModes[0]
  const ActiveIcon = activeMode.icon

  if (isRail) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={activeMode.title}
            aria-label={`Modo da sidebar: ${activeMode.label}`}
            className="mx-auto flex size-11 items-center justify-center rounded-[15px] border transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(240,237,228,0.07)]"
            style={{ background: "rgba(6,17,15,0.82)", borderColor: T.borderStrong, color: T.accent, boxShadow: "inset 0 1px 0 rgba(240,237,228,0.06)" }}
          >
            <ActiveIcon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">{activeMode.label}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="end"
          sideOffset={12}
          className="min-w-[180px] rounded-[14px] border p-1.5 shadow-2xl backdrop-blur-xl"
          style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
        >
          <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>
            Modo da sidebar
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[rgba(240,237,228,0.10)]" />
          {sidebarLayoutModes.map((item) => {
            const Icon = item.icon
            const isActive = mode === item.id
            return (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer gap-2.5 rounded-[10px] px-2.5 py-2 focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
                onSelect={() => onChange(item.id)}
              >
                <Icon size={15} style={{ color: isActive ? T.accent : T.faint }} />
                <span className="flex-1 text-[13px]" style={{ color: isActive ? T.text : T.muted }}>{item.label}</span>
                {isActive && (
                  <span className="rounded-full border px-1.5 py-0.5 text-[9px] font-semibold" style={{ borderColor: T.border, color: T.accent }}>
                    Ativo
                  </span>
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div
      role="group"
      aria-label="Modo da sidebar"
      className="flex w-full items-center gap-1 rounded-[18px] border p-1 transition-all duration-200"
      style={{ background: "rgba(6,17,15,0.72)", borderColor: T.borderStrong, boxShadow: "inset 0 1px 0 rgba(240,237,228,0.06)" }}
    >
      {sidebarLayoutModes.map((item, index) => {
        const Icon = item.icon
        const isActive = mode === item.id
        return (
          <button
            key={item.id}
            type="button"
            title={item.title}
            aria-pressed={isActive}
            aria-label={item.label}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative flex h-8 flex-1 items-center justify-center rounded-[12px] transition duration-200 hover:bg-[rgba(240,237,228,0.04)]",
              index > 0 && "before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-px before:bg-[rgba(240,237,228,0.10)]",
            )}
            style={{
              background: isActive ? "rgba(0,71,65,0.42)" : "transparent",
              color: isActive ? T.accent : T.faint,
            }}
          >
            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
            <span className="sr-only">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SidebarHoverBridge({
  mode,
  onHoverChange,
}: {
  mode: SidebarLayoutMode
  onHoverChange: (hovered: boolean) => void
}) {
  const leaveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (mode !== "hover") {
      onHoverChange(false)
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current)
        leaveTimer.current = null
      }
    }
  }, [mode, onHoverChange])

  useEffect(() => {
    if (mode !== "hover") return

    const root = document.querySelector<HTMLElement>('[data-slot="sidebar"]')
    const gap = root?.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')
    const container = root?.querySelector<HTMLElement>('[data-slot="sidebar-container"]')
    if (!root || !gap || !container) return

    // Keep the main layout on the icon rail; expand overlays content.
    gap.style.width = "var(--sidebar-width-icon)"
    container.style.zIndex = "40"
    container.style.boxShadow = "18px 0 40px rgba(0,0,0,0.28)"

    const clearLeave = () => {
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current)
        leaveTimer.current = null
      }
    }

    const onEnter = () => {
      clearLeave()
      onHoverChange(true)
    }

    const onLeave = () => {
      clearLeave()
      leaveTimer.current = window.setTimeout(() => onHoverChange(false), SIDEBAR_HOVER_LEAVE_MS)
    }

    container.addEventListener("mouseenter", onEnter)
    container.addEventListener("mouseleave", onLeave)
    return () => {
      clearLeave()
      gap.style.width = ""
      container.style.zIndex = ""
      container.style.boxShadow = ""
      container.removeEventListener("mouseenter", onEnter)
      container.removeEventListener("mouseleave", onLeave)
    }
  }, [mode, onHoverChange])

  return null
}

function StudioSummary({
  profile,
  setupCompleted,
  onManage,
}: {
  profile: StudioProfile
  setupCompleted: boolean
  onManage: () => void
}) {
  return (
    <Panel title="Studio" action={setupCompleted ? "Studio configurado" : "Setup pendente"}>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Nome", studioValue(profile.studioName, "Studio sem nome")],
          ["Horário", studioHours(profile)],
          ["Canal principal", studioValue(profile.mainContactChannel)],
          ["Equipe", studioValue(profile.teamSize)],
          ["Estilos principais", profile.mainStyles.length ? profile.mainStyles.join(", ") : "Fine line, Blackwork, Floral"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[12px] border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
            <p className="text-[11px]" style={{ color: T.faint }}>{label}</p>
            <p className="mt-1 truncate text-sm font-semibold" style={{ color: T.text }}>{value}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onManage}
        className="mt-4 rounded-[12px] border px-4 py-2.5 text-sm font-semibold"
        style={{ background: "rgba(240,237,228,0.02)", borderColor: T.border, color: T.muted }}
      >
        Gerenciar studio
      </button>
    </Panel>
  )
}

function FinanceSelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid min-w-[150px] gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="h-10 rounded-[12px] border px-3 text-[12px] font-semibold shadow-none focus:ring-0"
          style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="z-[160] rounded-[14px] border p-1 shadow-2xl"
          style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-[10px] text-[12px] font-semibold focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function FinanceLaunchButton({ onClick, compact = false }: { onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[12px] border text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_rgba(240,237,228,0.16)] active:translate-y-0",
        compact ? "px-3 py-2" : "px-4 py-2.5",
      )}
      style={{ background: T.text, borderColor: "rgba(240,237,228,0.26)", color: T.bg }}
    >
      <Plus size={15} />
      Novo lançamento
    </button>
  )
}

function FinanceMetricCard({
  title,
  value,
  description,
  icon: Icon,
  index,
}: {
  title: string
  value: string
  description: string
  icon: typeof TrendingUp
  index: number
}) {
  return (
    <motion.div
      className="border p-4 transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
      style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.035 }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px]" style={{ color: T.muted }}>{title}</p>
          <p className="mt-4 text-2xl font-semibold tracking-tight" style={{ color: T.text }}>{value}</p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center border" style={{ background: "rgba(240,237,228,0.04)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <p className="text-[11px]" style={{ color: T.faint }}>{description}</p>
    </motion.div>
  )
}

function FinancePendingPayments() {
  return (
    <Panel title="Pagamentos pendentes" action="Clientes com sinal ou valor restante em aberto">
      <div className="grid gap-2">
        {financeMock.pendingPayments.map((payment) => (
          <button
            key={`${payment.client}-${payment.service}`}
            type="button"
            onClick={() => console.log("[Markly] Financeiro pendente", payment)}
            className="flex flex-col gap-3 border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(240,237,228,0.22)] hover:bg-[rgba(240,237,228,0.035)] sm:flex-row sm:items-center sm:justify-between"
            style={{ background: T.bgSec, borderColor: T.border }}
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold" style={{ color: T.text }}>{payment.client}</span>
              <span className="mt-1 block text-[12px]" style={{ color: T.faint }}>{payment.service}</span>
            </span>
            <span className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.accent }}>
                {payment.status}
              </span>
              <span className="border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.faint }}>
                {payment.dueDate}
              </span>
              <span className="min-w-[82px] text-right text-sm font-semibold" style={{ color: T.text }}>
                {formatCurrency(payment.amount)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-[10px] border px-3 py-2 text-[12px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                {payment.action}
                <ChevronRight size={13} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

function FinanceStatusSummary() {
  return (
    <Panel title="Resumo por status" action="Valores atuais">
      <div className="grid gap-2">
        {financeMock.statusSummary.map((status) => (
          <div key={status.label} className="flex items-center justify-between border px-3 py-3" style={{ background: T.bgSec, borderColor: T.border }}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2 shrink-0 rounded-full" style={{ background: status.tone }} />
              <span className="truncate text-[13px] font-semibold" style={{ color: T.muted }}>{status.label}</span>
            </span>
            <span className="text-sm font-semibold" style={{ color: T.text }}>{formatCurrency(status.value)}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FinanceFlow({
  transactions,
  onNewLaunch,
}: {
  transactions: FinanceTransaction[]
  onNewLaunch: () => void
}) {
  if (transactions.length === 0) {
    return (
      <Panel title="Fluxo financeiro" action="Entradas e saídas recentes">
        <div className="flex min-h-[240px] flex-col items-center justify-center border px-6 py-10 text-center" style={{ background: T.bgSec, borderColor: T.border }}>
          <p className="text-base font-semibold" style={{ color: T.text }}>Nenhum lançamento ainda.</p>
          <p className="mt-2 max-w-[440px] text-sm leading-6" style={{ color: T.faint }}>
            Registre sinais, pagamentos e despesas para acompanhar o financeiro do seu studio.
          </p>
          <div className="mt-5">
            <FinanceLaunchButton onClick={onNewLaunch} compact />
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <Panel title="Fluxo financeiro" action="Entradas e saídas recentes">
      <div className="hidden overflow-hidden border md:block" style={{ borderColor: T.border }}>
        <div className="grid grid-cols-[0.55fr_1.35fr_1fr_0.75fr_0.75fr_0.85fr] gap-3 border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border, color: T.faint }}>
          <span>Data</span>
          <span>Descrição</span>
          <span>Cliente/Categoria</span>
          <span>Método</span>
          <span>Status</span>
          <span className="text-right">Valor</span>
        </div>
        {transactions.map((transaction) => (
          <div
            key={`${transaction.date}-${transaction.description}-${transaction.amount}-${transaction.category}`}
            className="grid grid-cols-[0.55fr_1.35fr_1fr_0.75fr_0.75fr_0.85fr] items-center gap-3 border-b px-4 py-3 last:border-b-0"
            style={{ borderColor: T.border, color: T.muted }}
          >
            <span className="text-[12px] font-semibold">{transaction.date}</span>
            <span className="min-w-0 truncate text-sm font-semibold" style={{ color: T.text }}>{transaction.description}</span>
            <span className="min-w-0 truncate text-[12px]">{transaction.category}</span>
            <span className="text-[12px]">{transaction.method}</span>
            <span className="w-fit border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: T.border, color: transaction.status === "Pago" ? T.accent : T.muted }}>
              {transaction.status}
            </span>
            <span className="text-right text-sm font-semibold" style={{ color: transaction.type === "expense" ? T.muted : T.accent }}>
              {formatFinanceAmount(transaction)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-2 md:hidden">
        {transactions.map((transaction) => (
          <div key={`${transaction.date}-${transaction.description}-${transaction.amount}-mobile`} className="border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: T.text }}>{transaction.description}</p>
                <p className="mt-1 text-[12px]" style={{ color: T.faint }}>{transaction.date} · {transaction.category}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold" style={{ color: transaction.type === "expense" ? T.muted : T.accent }}>
                {formatFinanceAmount(transaction)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>{transaction.method}</span>
              <span className="border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: T.border, color: transaction.status === "Pago" ? T.accent : T.muted }}>{transaction.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FinancePaymentMethods() {
  const maxMethodValue = Math.max(...financeMock.paymentMethods.map((method) => method.value))

  return (
    <Panel title="Métodos de pagamento" action="Distribuição">
      <div className="grid gap-4">
        {financeMock.paymentMethods.map((method) => (
          <div key={method.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold" style={{ color: T.text }}>{method.label}</span>
              <span style={{ color: T.muted }}>{formatCurrency(method.value)}</span>
            </div>
            <div className="h-2 border" style={{ background: "rgba(240,237,228,0.035)", borderColor: T.border }}>
              <div className="h-full" style={{ width: `${(method.value / maxMethodValue) * 100}%`, background: "linear-gradient(90deg, rgba(216,208,191,0.85), rgba(141,206,192,0.56))" }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FinanceIndicators() {
  return (
    <Panel title="Indicadores do studio" action="Mês atual">
      <div className="grid gap-3 sm:grid-cols-2">
        {financeMock.indicators.map((indicator) => (
          <div key={indicator.label} className="border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
            <p className="text-[12px]" style={{ color: T.faint }}>{indicator.label}</p>
            <p className="mt-2 text-xl font-semibold" style={{ color: T.text }}>{indicator.value}</p>
            <p className="mt-1 text-[11px]" style={{ color: T.muted }}>{indicator.description}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FinanceView({
  transactions,
  onNewLaunch,
}: {
  transactions: FinanceTransaction[]
  onNewLaunch: () => void
}) {
  const [period, setPeriod] = useState("Este mês")
  const [status, setStatus] = useState("Todos")
  const [method, setMethod] = useState("Todos")
  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch = status === "Todos" || transaction.status === status
    const methodMatch = method === "Todos" || transaction.method === method
    return statusMatch && methodMatch
  })
  const metrics = [
    { title: "Faturamento do mês", value: formatCurrency(financeMock.summary.monthlyRevenue), description: "18 sessões agendadas", icon: TrendingUp },
    { title: "Sinais recebidos", value: formatCurrency(financeMock.summary.receivedDeposits), description: "9 confirmações", icon: WalletCards },
    { title: "Valores pendentes", value: formatCurrency(financeMock.summary.pendingAmount), description: "4 aguardando pagamento", icon: Clock },
    { title: "Despesas", value: formatCurrency(financeMock.summary.expenses), description: "materiais e studio", icon: FileText },
  ]

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 border p-4 lg:flex-row lg:items-end lg:justify-between" style={{ background: T.card, borderColor: T.border }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: T.text }}>Filtros financeiros</p>
          <p className="mt-1 text-[12px]" style={{ color: T.faint }}>Use para validar os estados locais antes da integração real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FinanceSelectField label="Período" value={period} options={["Este mês", "Últimos 7 dias", "Últimos 30 dias"]} onChange={setPeriod} />
          <FinanceSelectField label="Status" value={status} options={["Todos", "Pago", "Pendente", "Cancelado"]} onChange={setStatus} />
          <FinanceSelectField label="Método" value={method} options={["Todos", "Pix", "Dinheiro", "Cartão", "Transferência", "Outro"]} onChange={setMethod} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <FinanceMetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <FinancePendingPayments />
        <FinanceStatusSummary />
      </div>

      <FinanceFlow transactions={filteredTransactions} onNewLaunch={onNewLaunch} />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <FinancePaymentMethods />
        <FinanceIndicators />
      </div>
    </div>
  )
}

function AnamnesisView() {
  return (
    <Panel title="Anamnese" action="Mock inicial">
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Pendentes", "4", "aguardando preenchimento"],
          ["Enviadas hoje", "7", "links por WhatsApp"],
          ["Concluídas", "18", "mês atual"],
        ].map(([label, value, hint]) => (
          <div key={label} className="border p-4" style={{ background: T.bgSec, borderColor: T.border }}>
            <p className="text-[12px]" style={{ color: T.faint }}>{label}</p>
            <p className="mt-3 text-2xl font-semibold" style={{ color: T.text }}>{value}</p>
            <p className="mt-1 text-[11px]" style={{ color: T.muted }}>{hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 border px-4 py-3" style={{ background: "rgba(240,237,228,0.025)", borderColor: T.border }}>
        <p className="text-sm font-semibold" style={{ color: T.text }}>Próximo passo</p>
        <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
          A tela de Anamnese fica preparada para receber formulário, envio de link e status por cliente.
        </p>
      </div>
    </Panel>
  )
}

function SectionContent({
  section,
  studioProfile,
  setupCompleted,
  onManageStudio,
  financeTransactions,
  onNewFinanceLaunch,
}: {
  section: SectionId
  studioProfile: StudioProfile
  setupCompleted: boolean
  onManageStudio: () => void
  financeTransactions: FinanceTransaction[]
  onNewFinanceLaunch: () => void
}) {
  if (section === "budgets") return <BudgetBoard />
  if (section === "clients") return <ClientsView />
  if (section === "calendar") return <TodaySchedule />
  if (section === "portfolio") return <PortfolioView />
  if (section === "finance") return <FinanceView transactions={financeTransactions} onNewLaunch={onNewFinanceLaunch} />
  if (section === "anamnesis") return <AnamnesisView />
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
        <StudioSummary profile={studioProfile} setupCompleted={setupCompleted} onManage={onManageStudio} />
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

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <AttentionList />
        <TodaySchedule />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <StudioPulse />
        <StudioSummary profile={studioProfile} setupCompleted={setupCompleted} onManage={onManageStudio} />
      </div>
    </>
  )
}

function FinanceLaunchModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (transaction: FinanceTransaction) => void
}) {
  const [draft, setDraft] = useState<FinanceLaunchDraft>({
    type: "Entrada",
    description: "",
    amount: "",
    client: "Sem cliente",
    method: "Pix",
    status: "Pago",
    date: formatTodayDate().slice(0, 5),
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) {
      setError("")
      setDraft({
        type: "Entrada",
        description: "",
        amount: "",
        client: "Sem cliente",
        method: "Pix",
        status: "Pago",
        date: formatTodayDate().slice(0, 5),
      })
    }
  }, [open])

  const update = (key: keyof FinanceLaunchDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const save = () => {
    const amount = parseFinanceAmount(draft.amount)
    if (!draft.description.trim() || !draft.date.trim() || amount <= 0) {
      setError("Preencha descrição, valor e data para salvar o lançamento.")
      return
    }

    const transaction: FinanceTransaction = {
      date: draft.date.trim(),
      description: draft.description.trim(),
      category: draft.client,
      method: draft.method,
      status: draft.status,
      amount,
      type: isExpenseLaunch(draft.type) ? "expense" : "income",
    }

    console.log("[Markly] Novo lançamento financeiro", { ...draft, transaction })
    onSave(transaction)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-hidden rounded-[24px] border p-0 sm:max-w-[720px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[rgba(240,237,228,0.58)] [&>button:hover]:text-[#F0EDE4]"
        style={{ background: "rgba(5,14,12,0.98)", borderColor: T.borderStrong, color: T.text, boxShadow: "0 30px 100px rgba(0,0,0,0.62)" }}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
            Controle financeiro
          </div>
          <DialogTitle className="font-display text-2xl" style={{ color: T.text }}>
            Novo lançamento
          </DialogTitle>
          <DialogDescription className="max-w-[560px] text-sm leading-6" style={{ color: T.muted }}>
            Registre uma entrada, sinal, pagamento de sessão ou despesa do studio.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FinanceSelectField label="Tipo" value={draft.type} options={financeLaunchTypes} onChange={(value) => update("type", value)} />
            <FinanceSelectField label="Status" value={draft.status} options={financeStatuses} onChange={(value) => update("status", value)} />
            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Descrição</span>
              <input
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Ex: Sinal tattoo fine line"
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[rgba(240,237,228,0.34)] focus:border-[rgba(216,208,191,0.30)]"
                style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Valor</span>
              <input
                value={draft.amount}
                onChange={(event) => update("amount", event.target.value)}
                placeholder="R$ 0,00"
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[rgba(240,237,228,0.34)] focus:border-[rgba(216,208,191,0.30)]"
                style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Data</span>
              <input
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
                placeholder="08/07"
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[rgba(240,237,228,0.34)] focus:border-[rgba(216,208,191,0.30)]"
                style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
              />
            </label>
            <FinanceSelectField label="Cliente" value={draft.client} options={financeClients} onChange={(value) => update("client", value)} />
            <FinanceSelectField label="Método de pagamento" value={draft.method} options={financePaymentMethods} onChange={(value) => update("method", value)} />
          </div>

          {error && (
            <div className="mt-5 rounded-[14px] border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-end" style={{ borderColor: T.border, background: "rgba(2,8,6,0.58)" }}>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
            style={{ borderColor: T.border, color: T.muted }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
            style={{ background: T.text, color: T.bg }}
          >
            Salvar lançamento
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("")
  const [resolvedQuery, setResolvedQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResolvedQuery("")
      setIsSearching(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setIsSearching(true)
    const timer = window.setTimeout(() => {
      setResolvedQuery(query)
      setIsSearching(false)
    }, query.trim() ? 420 : 220)

    return () => window.clearTimeout(timer)
  }, [open, query])

  const results = useMemo(() => {
    const normalized = resolvedQuery.trim().toLowerCase()
    if (!normalized) return overviewMock.searchItems
    return overviewMock.searchItems.filter((item) =>
      [item.title, item.type, item.description].some((value) => value.toLowerCase().includes(normalized)),
    )
  }, [resolvedQuery])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[22px] border p-0 sm:max-w-[560px]"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar no Markly</DialogTitle>
          <DialogDescription>Busca global mockada</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: T.border }}>
          <Search size={16} style={{ color: T.faint }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar no Markly..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[rgba(240,237,228,0.35)]"
            style={{ color: T.text }}
          />
        </div>
        <div className="max-h-[360px] min-h-[320px] overflow-y-auto p-2">
          <AnimatePresence mode="wait" initial={false}>
            {isSearching ? (
              <motion.div
                key="search-loading"
                className="grid gap-2 px-1 py-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: T.faint }}>
                    Buscando dados
                  </span>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="size-1.5 rounded-full"
                        style={{ background: T.accent }}
                        animate={{ opacity: [0.25, 1, 0.25], scale: [0.82, 1, 0.82] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
                      />
                    ))}
                  </span>
                </div>
                {[0, 1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    className="flex items-start gap-3 rounded-[14px] border px-3 py-3"
                    style={{ background: "rgba(240,237,228,0.025)", borderColor: "rgba(240,237,228,0.06)" }}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: [0.38, 0.78, 0.38] }}
                    transition={{ duration: 1.15, repeat: Infinity, delay: item * 0.08 }}
                  >
                    <span className="mt-0.5 h-5 w-16 rounded-full" style={{ background: "rgba(240,237,228,0.09)" }} />
                    <span className="min-w-0 flex-1">
                      <span className="block h-3 w-2/5 rounded-full" style={{ background: "rgba(240,237,228,0.12)" }} />
                      <span className="mt-2 block h-2.5 w-3/5 rounded-full" style={{ background: "rgba(240,237,228,0.07)" }} />
                    </span>
                    <span className="mt-1 size-3 rounded-full" style={{ background: "rgba(240,237,228,0.08)" }} />
                  </motion.div>
                ))}
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="search-empty"
                className="flex min-h-[288px] items-center justify-center px-3 text-center text-sm"
                style={{ color: T.faint }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                Nenhum resultado para "{resolvedQuery}"
              </motion.div>
            ) : (
              <motion.div
                key="search-results"
                className="grid gap-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {results.map((item, index) => (
                  <motion.button
                    key={`${item.type}-${item.title}`}
                    type="button"
                    onClick={() => {
                      console.log(`[Markly] Busca: ${item.type} · ${item.title}`)
                      onOpenChange(false)
                    }}
                    className="flex w-full items-start gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[rgba(240,237,228,0.06)]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.03 }}
                  >
                    <span className="mt-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                      {item.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</span>
                      <span className="block truncate text-[12px]" style={{ color: T.faint }}>{item.description}</span>
                    </span>
                    <ChevronRight size={14} className="mt-1 shrink-0" style={{ color: T.faint }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm" style={{ color: T.faint }}>
              Nenhum resultado para “{query}”
            </p>
          ) : (
            results.map((item) => (
              <button
                key={`${item.type}-${item.title}`}
                type="button"
                onClick={() => {
                  console.log(`[Markly] Busca: ${item.type} · ${item.title}`)
                  onOpenChange(false)
                }}
                className="flex w-full items-start gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[rgba(240,237,228,0.06)]"
              >
                <span className="mt-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                  {item.type}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</span>
                  <span className="block truncate text-[12px]" style={{ color: T.faint }}>{item.description}</span>
                </span>
                <ChevronRight size={14} className="mt-1 shrink-0" style={{ color: T.faint }} />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DateFilterMenu({
  value,
  onChange,
}: {
  value: DateFilterRange
  onChange: (value: DateFilterRange) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateFilterRange>(value)
  const [activeField, setActiveField] = useState<keyof DateFilterRange>("start")
  const hasFilter = Boolean(value.start || value.end)
  const selectedDate = parseDateValue(draft[activeField])

  useEffect(() => {
    if (open) {
      setDraft(value)
      setActiveField(value.start && !value.end ? "end" : "start")
    }
  }, [open, value])

  const updateDraftDate = (date?: Date) => {
    if (!date) return
    setDraft((current) => ({ ...current, [activeField]: toDateValue(date) }))
  }

  const clear = () => {
    const next = { start: "", end: "" }
    setDraft(next)
    onChange(next)
    setOpen(false)
  }

  const apply = () => {
    onChange(draft)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(240,237,228,0.22)] hover:text-[#F0EDE4] active:translate-y-0"
          style={{
            background: hasFilter ? "rgba(216,208,191,0.09)" : "rgba(2,8,6,0.34)",
            borderColor: hasFilter ? "rgba(216,208,191,0.30)" : T.border,
            color: hasFilter ? T.text : T.muted,
          }}
        >
          <Calendar size={15} />
          Filtro
          {hasFilter && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: T.accent, color: T.bg }}>
              ativo
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="markly-date-filter-menu w-[356px] rounded-[18px] border p-3 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-1 pb-2 pt-1">
          <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Filtrar por data</span>
          <span className="mt-1 block text-[12px]" style={{ color: T.muted }}>Use uma data inicial e uma final.</span>
        </DropdownMenuLabel>
        <div className="grid gap-2 px-1 py-2">
          {(["start", "end"] as const).map((field) => {
            const active = activeField === field
            const filled = Boolean(draft[field])
            return (
              <button
                key={field}
                type="button"
                onClick={() => setActiveField(field)}
                className="group flex h-12 w-full items-center justify-between rounded-[12px] border px-3 text-left transition duration-200 hover:border-[rgba(216,208,191,0.30)] hover:bg-[rgba(240,237,228,0.04)]"
                style={{
                  background: active ? "rgba(216,208,191,0.08)" : "rgba(2,8,6,0.64)",
                  borderColor: active ? "rgba(216,208,191,0.34)" : T.border,
                  color: filled ? T.text : T.faint,
                }}
              >
                <span className="min-w-0">
                  <span
                    className="block text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: active ? T.accent : T.faint }}
                  >
                    {field === "start" ? "Início" : "Fim"}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] font-semibold">
                    {formatDateFilterLabel(draft[field])}
                  </span>
                </span>
                <Calendar size={15} className="shrink-0" style={{ color: active ? T.accent : T.faint }} />
              </button>
            )
          })}
        </div>
        <div
          className="markly-date-calendar-panel mx-1 mt-1 rounded-[14px] border p-2"
          style={{
            background: "linear-gradient(180deg, rgba(216,208,191,0.045), rgba(2,8,6,0.72))",
            borderColor: T.border,
          }}
        >
          <DatePickerCalendar
            mode="single"
            selected={selectedDate}
            onSelect={updateDraftDate}
            locale={ptBR}
            className="p-0"
            classNames={{
              months: "flex flex-col",
              month: "flex flex-col gap-3",
              caption: "relative flex h-9 items-center justify-center",
              caption_label: "text-[13px] font-semibold capitalize text-[#F0EDE4]",
              nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
              nav_button:
                "flex size-8 items-center justify-center rounded-[10px] border border-[rgba(240,237,228,0.12)] bg-[rgba(2,8,6,0.56)] p-0 text-[#D8D0BF] opacity-100 transition hover:border-[rgba(216,208,191,0.32)] hover:bg-[rgba(216,208,191,0.08)]",
              nav_button_previous: "static",
              nav_button_next: "static",
              table: "w-full border-collapse",
              head_row: "grid grid-cols-7 gap-1",
              head_cell: "flex h-7 items-center justify-center text-[10px] font-semibold uppercase text-[rgba(240,237,228,0.42)]",
              row: "mt-1 grid grid-cols-7 gap-1",
              cell: "p-0 text-center",
              day: "flex size-8 items-center justify-center rounded-[10px] border border-transparent bg-transparent p-0 text-[12px] font-semibold text-[rgba(240,237,228,0.72)] transition hover:border-[rgba(216,208,191,0.24)] hover:bg-[rgba(216,208,191,0.08)] hover:text-[#F0EDE4]",
              day_selected:
                "border-[rgba(216,208,191,0.55)] bg-[#F0EDE4] text-[#020806] hover:bg-[#F0EDE4] hover:text-[#020806] focus:bg-[#F0EDE4] focus:text-[#020806]",
              day_today: "border-[rgba(216,208,191,0.26)] text-[#D8D0BF]",
              day_outside: "text-[rgba(240,237,228,0.24)]",
              day_disabled: "text-[rgba(240,237,228,0.18)]",
            }}
          />
        </div>
        <div className="hidden">
          <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold" style={{ color: T.faint }}>Início</span>
            <input
              type="date"
              value={draft.start}
              onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
              className="h-10 rounded-[10px] border bg-transparent px-3 text-[13px] font-semibold outline-none transition focus:border-[rgba(216,208,191,0.32)]"
              style={{ background: "rgba(2,8,6,0.64)", borderColor: T.border, color: T.text }}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold" style={{ color: T.faint }}>Fim</span>
            <input
              type="date"
              value={draft.end}
              onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
              className="h-10 rounded-[10px] border bg-transparent px-3 text-[13px] font-semibold outline-none transition focus:border-[rgba(216,208,191,0.32)]"
              style={{ background: "rgba(2,8,6,0.64)", borderColor: T.border, color: T.text }}
            />
          </label>
        </div>
        <DropdownMenuSeparator className="my-2 bg-[rgba(240,237,228,0.10)]" />
        <div className="flex justify-end gap-2 px-1">
          <button
            type="button"
            onClick={clear}
            className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[rgba(240,237,228,0.22)]"
            style={{ borderColor: T.border, color: T.muted }}
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={apply}
            className="rounded-[10px] px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
            style={{ background: T.text, color: T.bg }}
          >
            Aplicar
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_rgba(240,237,228,0.16)] active:translate-y-0"
          style={{ background: T.text, borderColor: "rgba(240,237,228,0.26)", color: T.bg }}
        >
          <Plus size={15} /> Novo
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[320px] rounded-[18px] border p-2 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-3 py-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>
          Criação rápida
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgba(240,237,228,0.10)]" />
        {overviewMock.createActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className="cursor-pointer rounded-[12px] px-3 py-2.5 focus:bg-[rgba(240,237,228,0.08)] focus:text-[#F0EDE4]"
            onSelect={() => console.log(`[Markly] Novo: ${action.label}`)}
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold" style={{ color: T.text }}>{action.label}</span>
              <span className="block text-[11px] leading-5" style={{ color: T.faint }}>{action.description}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getSectionTitle(section: SectionId) {
  return sections.find((item) => item.id === section)?.label ?? "Visão geral"
}

export default function DevDashboard() {
  const profile = readDevSession()
  const [activeSection, setActiveSection] = useState<SectionId>("overview")
  const [searchOpen, setSearchOpen] = useState(false)
  const [studioManageOpen, setStudioManageOpen] = useState(false)
  const [financeLaunchOpen, setFinanceLaunchOpen] = useState(false)
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(financeMock.transactions)
  const [dateFilter, setDateFilter] = useState<DateFilterRange>({ start: "", end: "" })
  const [sidebarMode, setSidebarMode] = useState<SidebarLayoutMode>(() => readSidebarLayoutMode())
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>(() => readAppearanceMode())
  const [railHover, setRailHover] = useState(false)
  const {
    studioProfile,
    studioSetupCompleted,
    completeStudioSetup,
  } = useStudioSetup()

  const sidebarOpen = sidebarMode === "expanded" || (sidebarMode === "hover" && railHover)

  const setSidebarLayoutMode = (mode: SidebarLayoutMode) => {
    setSidebarMode(mode)
    persistSidebarLayoutMode(mode)
    setRailHover(false)
  }

  const toggleAppearanceMode = () => {
    const nextMode: AppearanceMode = appearanceMode === "dark" ? "light" : "dark"
    setAppearanceMode(nextMode)
    persistAppearanceMode(nextMode)
  }

  const sidebarVars = useMemo(
    () => ({
      "--sidebar": appearanceMode === "light" ? "#F5F0E6" : "#020806",
      "--sidebar-foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--sidebar-border": appearanceMode === "light" ? "rgba(23,35,30,0.14)" : "rgba(240,237,228,0.10)",
      "--sidebar-accent": appearanceMode === "light" ? "rgba(0,71,65,0.08)" : "rgba(216,208,191,0.08)",
      "--sidebar-accent-foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--background": appearanceMode === "light" ? "#F5F0E6" : T.bg,
      "--foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--border": appearanceMode === "light" ? "rgba(23,35,30,0.14)" : "rgba(240,237,228,0.10)",
    }) as CSSProperties,
    [appearanceMode],
  )

  useEffect(() => {
    document.documentElement.dataset.marklyTheme = appearanceMode
    document.documentElement.classList.toggle("dark", appearanceMode === "dark")
  }, [appearanceMode])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const logout = () => {
    clearDevSession()
    window.location.hash = "#/login"
  }

  const activeStudioName = studioValue(studioProfile.studioName, overviewMock.studioProfile.fallbackName)
  const activeChannel = studioValue(studioProfile.mainContactChannel, overviewMock.studioProfile.fallbackChannel)
  const todayDateLabel = useMemo(() => formatTodayDate(), [])
  const isOverview = activeSection === "overview"
  const isFinance = activeSection === "finance"
  const headerBadge = isOverview
    ? "Operação ativa"
    : studioSetupCompleted
      ? "Studio configurado"
      : "Tudo liberado para desenvolvimento"
  const headerSubtitle = isOverview
    ? `${activeStudioName} · ${todayDateLabel}`
    : studioSetupCompleted
      ? `Horário: ${studioHours(studioProfile)} · Canal principal: ${activeChannel} · Equipe: ${studioValue(studioProfile.teamSize)}`
      : "Tela mockada para validar a experiência principal do SaaS."
  const overviewSummary = `${overviewMock.summary.todaySessions} sessões hoje · ${overviewMock.summary.unansweredBudgets} orçamentos abertos · ${formatCurrency(overviewMock.summary.pendingDepositsAmount)} em sinais pendentes`

  return (
    <SidebarProvider
      style={sidebarVars}
      data-markly-theme={appearanceMode}
      className="markly-dashboard-shell"
      open={sidebarOpen}
      onOpenChange={(nextOpen) => {
        if (sidebarMode === "hover") {
          setRailHover(nextOpen)
          return
        }
        setSidebarLayoutMode(nextOpen ? "expanded" : "collapsed")
      }}
    >
      <SidebarHoverBridge mode={sidebarMode} onHoverChange={setRailHover} />
      <Sidebar
        collapsible="icon"
        className="top-16 h-[calc(100svh-4rem)] border-r border-[rgba(240,237,228,0.10)] [&_[data-sidebar=sidebar]]:relative [&_[data-sidebar=sidebar]]:overflow-hidden [&_[data-sidebar=sidebar]]:shadow-[18px_0_70px_rgba(0,0,0,0.34)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 18% 4%, rgba(216,208,191,0.10), transparent 28%), radial-gradient(circle at 78% 34%, rgba(0,71,65,0.28), transparent 34%), linear-gradient(180deg, rgba(6,17,15,0.98), rgba(2,8,6,0.98) 56%, rgba(3,11,9,0.98))",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-px"
          style={{ background: "linear-gradient(180deg, transparent, rgba(216,208,191,0.20), transparent)" }}
        />

        <SidebarHeader className="relative z-10 px-2 pb-3 pt-4">
          <StudioSwitcher profile={studioProfile} onManage={() => setStudioManageOpen(true)} />
        </SidebarHeader>

        <SidebarContent className="relative z-10 px-2 pb-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {sections.map(({ id, label, icon: Icon, badge }) => {
                  const isActive = activeSection === id
                  return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      onClick={() => setActiveSection(id)}
                      className="relative flex! h-11 items-center gap-0! rounded-[15px] py-0! pl-0! pr-8! text-[rgba(240,237,228,0.64)] transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-[rgba(240,237,228,0.055)] hover:text-[#F0EDE4] data-[active=true]:bg-transparent data-[active=true]:text-[#F0EDE4] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11! group-data-[collapsible=icon]:w-11! group-data-[collapsible=icon]:pr-0!"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="markly-sidebar-active"
                          className="absolute inset-y-0 left-0 right-0 rounded-[15px] group-data-[collapsible=icon]:right-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11"
                          style={{
                            background: "linear-gradient(90deg, rgba(216,208,191,0.12), rgba(0,71,65,0.18), rgba(0,71,65,0.08))",
                            boxShadow: "inset 0 1px 0 rgba(240,237,228,0.08), 0 10px 28px rgba(0,0,0,0.16)",
                          }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <span
                        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-200"
                        style={{ color: isActive ? T.accent : appearanceMode === "light" ? "rgba(23,35,30,0.58)" : "rgba(240,237,228,0.58)" }}
                      >
                        <Icon size={19} strokeWidth={1.85} />
                      </span>
                      <span className="relative z-10 flex h-11 min-w-0 max-w-[150px] items-center overflow-hidden whitespace-nowrap text-[13px] font-semibold leading-none transition-[max-width,opacity,transform] duration-200 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:opacity-0">
                        {label}
                      </span>
                    </SidebarMenuButton>
                    {badge && (
                      <SidebarMenuBadge
                        className="right-3 top-1/2! h-5 min-w-[1.65rem] -translate-y-1/2 rounded-full border px-2 text-center text-[10px] font-bold shadow-[0_8px_18px_rgba(216,208,191,0.12)]"
                        style={{ background: T.accent, borderColor: "rgba(240,237,228,0.32)", color: T.bg }}
                      >
                        {badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )})}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="relative z-10 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
          <SidebarModeSwitcher mode={sidebarMode} onChange={setSidebarLayoutMode} />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-screen min-w-0 bg-[#020806] pt-16 text-[#F0EDE4]">
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-7" style={{ background: "rgba(4,9,7,0.88)", borderColor: T.border }}>
          <div className="flex min-w-0 items-center gap-4">
            <a href="#/painel" className="flex shrink-0 items-center gap-2.5 rounded-[14px] px-1 py-1.5 transition duration-200 hover:bg-[rgba(240,237,228,0.035)]" aria-label="Markly">
              <img src={marklyIcon} alt="" className="size-9 object-contain" style={{ filter: "drop-shadow(0 0 16px rgba(216,208,191,0.08))" }} aria-hidden="true" />
              <span className="font-display text-xl font-semibold leading-none" style={{ color: T.text }}>
                Markly
              </span>
            </a>
            <div className="hidden h-8 w-px shrink-0 md:block" style={{ background: "rgba(240,237,228,0.10)" }} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: T.faint }}>Painel interno</p>
              <h1 className="truncate text-base font-semibold leading-snug md:text-lg" style={{ color: T.text }}>Olá, {profile.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleAppearanceMode}
              className="markly-theme-toggle group relative hidden h-10 w-[82px] items-center rounded-full border p-1 transition duration-200 hover:-translate-y-0.5 md:inline-flex"
              style={{
                background: appearanceMode === "light" ? "rgba(23,35,30,0.08)" : "rgba(240,237,228,0.035)",
                borderColor: appearanceMode === "light" ? "rgba(23,35,30,0.16)" : T.border,
                color: appearanceMode === "light" ? "#17231E" : T.muted,
              }}
              aria-label={appearanceMode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              title={appearanceMode === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              <motion.span
                className="markly-theme-toggle-thumb absolute top-1 flex size-8 items-center justify-center rounded-full"
                animate={{ x: appearanceMode === "light" ? 40 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                style={{
                  background: appearanceMode === "light" ? "#17231E" : T.text,
                  color: appearanceMode === "light" ? "#F5F0E6" : T.bg,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.16)",
                }}
              >
                {appearanceMode === "light" ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
              <span className="relative z-10 flex size-8 items-center justify-center">
                <Moon size={14} />
              </span>
              <span className="relative z-10 ml-auto flex size-8 items-center justify-center">
                <Sun size={14} />
              </span>
            </button>
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

        <main className="markly-square-surfaces min-h-[calc(100vh-64px)] min-w-0 p-4 md:p-7">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <motion.div
                className="markly-status-chip relative mb-3 inline-flex items-center gap-2 overflow-hidden border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{
                  background: "linear-gradient(90deg, rgba(216,208,191,0.18), rgba(0,71,65,0.18), rgba(216,208,191,0.06))",
                  borderColor: "rgba(216,208,191,0.32)",
                  color: T.text,
                  boxShadow: "0 14px 34px rgba(0,71,65,0.18), inset 0 1px 0 rgba(240,237,228,0.12)",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: T.accent }}
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="relative ml-1 flex size-2 items-center justify-center" aria-hidden>
                  <motion.span
                    className="absolute inset-0"
                    style={{ background: T.accent }}
                    animate={{ opacity: [0.24, 0.72, 0.24], scale: [1, 1.65, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <span className="relative size-1.5" style={{ background: T.accent }} />
                </span>
                {isFinance ? "Controle financeiro" : activeSection === "anamnesis" ? "Anamnese mockada" : headerBadge}
              </motion.div>
              <h2
                className="font-display text-[1.5rem] font-semibold md:text-[2.25rem]"
                style={{ color: T.text }}
              >
                {getSectionTitle(activeSection)}
              </h2>
              <p className="mt-1 max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
                {isFinance ? "Acompanhe sinais, pagamentos e faturamento do seu studio." : activeSection === "anamnesis" ? "Organize fichas, envios e pendências de anamnese dos clientes." : headerSubtitle}
              </p>
              {isOverview && (
                <p className="mt-1 max-w-[720px] text-[13px] leading-6" style={{ color: T.faint }}>
                  {overviewSummary}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {!isFinance && <DateFilterMenu value={dateFilter} onChange={setDateFilter} />}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm transition duration-200 hover:border-[rgba(240,237,228,0.22)] hover:text-[#F0EDE4]"
                style={{ borderColor: T.border, color: T.muted }}
              >
                <Search size={15} /> Buscar
                <span className="ml-1 hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold md:inline-flex" style={{ borderColor: T.border, color: T.faint }}>
                  Ctrl K
                </span>
              </button>
              {isFinance ? <FinanceLaunchButton onClick={() => setFinanceLaunchOpen(true)} /> : <CreateMenu />}
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
                onManageStudio={() => setStudioManageOpen(true)}
                financeTransactions={financeTransactions}
                onNewFinanceLaunch={() => setFinanceLaunchOpen(true)}
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

      <StudioManageModal
        open={studioManageOpen}
        profile={studioProfile}
        onOpenChange={setStudioManageOpen}
        onSave={completeStudioSetup}
      />

      <FinanceLaunchModal
        open={financeLaunchOpen}
        onOpenChange={setFinanceLaunchOpen}
        onSave={(transaction) => setFinanceTransactions((current) => [transaction, ...current])}
      />

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  )
}
