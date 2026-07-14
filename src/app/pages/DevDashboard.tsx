import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react"
import { AnimatePresence, motion } from "motion/react"
import { toast, Toaster } from "sonner"
import { ptBR } from "date-fns/locale/pt-BR"
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  HeartHandshake,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
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
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Calendar as DatePickerCalendar } from "../components/ui/calendar"
import { clearDevSession, devIdentity, readDevSession } from "../devAccess"
import StudioSetupModal from "../components/onboarding/StudioSetupModal"
import LottieCheckbox from "../components/LottieCheckbox"
import { useStudioManager } from "../hooks/useStudioManager"
import { T } from "../theme"
import { defaultStudioProfile, type StudioProfile, type StudioRecord } from "../utils/studioStorage"
import { getVerticalConfig, studioVerticals, type VerticalConfig } from "../utils/studioVertical"
import { cn } from "../components/ui/utils"
import {
  formatLogoSizeLimit,
  getStudioBrandIcon,
  studioBrandIconOptions,
  studioLogoMaxBytes,
} from "../utils/studioBrand"

type SectionId = "overview" | "budgets" | "clients" | "calendar" | "portfolio" | "messages" | "finance" | "anamnesis" | "settings"

const VerticalConfigContext = createContext<VerticalConfig>(getVerticalConfig("tatuagem"))
function useVerticalConfig() {
  return useContext(VerticalConfigContext)
}
type StudioOperationalData = {
  budgetColumns: BudgetColumn[]
  clients: ClientItem[]
  portfolioItems: PortfolioItem[]
  financeTransactions: FinanceTransaction[]
  calendarEvents: CalendarEvent[]
}
type SidebarLayoutMode = "expanded" | "hover" | "collapsed"
type AppearanceMode = "dark" | "light"
type CardStyleMode = "rounded" | "square"
type FontSizeMode = "small" | "medium" | "large"
type UserProfile = {
  name: string
  role: string
  email: string
  phone: string
  whatsapp: string
  instagram: string
  avatarDataUrl: string
}
type DateFilterRange = {
  start: string
  end: string
}
type FinanceTransaction = {
  id: string
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
type BudgetStatus = "Novo" | "Em análise" | "Proposta enviada" | "Sinal pendente" | "Agendado" | "Fechado" | "Perdido"
type BudgetColumnId = "new" | "analysis" | "sent" | "deposit" | "scheduled" | "closed"
type BudgetItem = {
  id: string
  title: string
  client: string
  style: string
  bodyPlacement: string
  size: string
  sessions: string
  valueRange: string
  deposit: string | null
  source: string
  waitingTime: string
  nextAction: string
  status: BudgetStatus
  createdAt: string
  description: string
  internalNotes: string
  history: string[]
}
type BudgetColumn = {
  id: BudgetColumnId
  title: BudgetStatus
  description: string
  count: number
  items: BudgetItem[]
}
type BudgetFilterState = {
  status: string
  style: string
  source: string
  period: string
  valueRange: string
  flags: string[]
}
type NewBudgetDraft = {
  client: string
  title: string
  style: string
  bodyPlacement: string
  size: string
  description: string
  minValue: string
  maxValue: string
  depositValue: string
  source: string
  status: "Novo" | "Em análise" | "Proposta enviada"
  internalNotes: string
}
type ClientStatus = "Novo cliente" | "Orçamento aberto" | "Proposta enviada" | "Sinal pendente" | "Sessão marcada" | "Cliente recorrente" | "Inativo"
type ClientAnamnesisStatus = "Pendente" | "Preenchida" | "Não enviada"
type ClientFilterState = {
  status: string
  style: string
  source: string
  lastContact: string
  flags: string[]
}
type ClientBudget = {
  title: string
  value: string
  status: string
  action: string
}
type ClientSession = {
  title: string
  date: string
  status: string
}
type ClientItem = {
  id: string
  name: string
  primaryContact: string
  whatsapp: string
  instagram: string
  email: string
  source: string
  style: string
  bodyPlacement: string
  interest: string
  status: ClientStatus
  lastContact: string
  nextAction: string
  value: string
  numericValue: number
  anamnesis: ClientAnamnesisStatus
  contactPreference: string
  city: string
  acceptsReminders: boolean
  clientSince: string
  internalNotes: string
  budgets: ClientBudget[]
  sessions: ClientSession[]
  history: string[]
  flags: {
    openBudget: boolean
    scheduledSession: boolean
    pendingAnamnesis: boolean
    needsReturn: boolean
    recurring: boolean
  }
}
type NewClientDraft = {
  name: string
  whatsapp: string
  instagram: string
  email: string
  source: string
  style: string
  idea: string
  status: ClientStatus
  contactPreference: string
  internalNotes: string
  city: string
  acceptsReminders: boolean
}
type MessageStatus = "Nova" | "Aguardando resposta" | "Respondida" | "Resolvida"
type MessagePriority = "Alta" | "Média" | "Baixa"
type MessageChannel = "WhatsApp" | "Instagram" | "E-mail"
type MessageThread = {
  id: string
  client: string
  handle: string
  channel: MessageChannel
  subject: string
  preview: string
  time: string
  status: MessageStatus
  priority: MessagePriority
  unread: boolean
  linkedTo: string
  nextAction: string
  responseTime: string
  value: string
  tags: string[]
  suggestedReply: string
  conversation: {
    author: "client" | "studio"
    text: string
    time: string
  }[]
}
type PortfolioStatus = "Publicado" | "Em seleção" | "Tratando foto" | "Arquivado"
type PortfolioFilterState = {
  status: string
  style: string
  source: string
  visibility: string
  flags: string[]
}
type PortfolioItem = {
  id: string
  title: string
  client: string
  style: string
  bodyPlacement: string
  sessionDate: string
  status: PortfolioStatus
  source: string
  visibility: string
  featured: boolean
  coverTone: string
  accent: string
  description: string
  tags: string[]
  files: string[]
  usage: string
  notes: string
  metrics: {
    photos: number
    views: number
    saves: number
  }
  history: string[]
}
type NewPortfolioDraft = {
  title: string
  client: string
  style: string
  bodyPlacement: string
  sessionDate: string
  status: PortfolioStatus
  source: string
  visibility: string
  description: string
  tags: string
  usage: string
  notes: string
  featured: boolean
}

const SIDEBAR_LAYOUT_KEY = "markly_sidebar_layout_mode"
const SIDEBAR_HOVER_LEAVE_MS = 220
const APPEARANCE_MODE_KEY = "markly_appearance_mode"
const CARD_STYLE_KEY = "markly_card_style"
const FONT_SIZE_KEY = "markly_font_size"
const USER_PROFILE_KEY = "markly_user_profile"

const fontSizeZoomScale: Record<FontSizeMode, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
}

const defaultUserProfile: UserProfile = {
  name: devIdentity.name,
  role: devIdentity.role,
  email: devIdentity.email,
  phone: "",
  whatsapp: "",
  instagram: "",
  avatarDataUrl: "",
}

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

function readCardStyleMode(): CardStyleMode {
  if (typeof window === "undefined") return "rounded"
  return window.localStorage.getItem(CARD_STYLE_KEY) === "square" ? "square" : "rounded"
}

function persistCardStyleMode(mode: CardStyleMode) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CARD_STYLE_KEY, mode)
}

function readFontSizeMode(): FontSizeMode {
  if (typeof window === "undefined") return "medium"
  const raw = window.localStorage.getItem(FONT_SIZE_KEY)
  if (raw === "small" || raw === "medium" || raw === "large") return raw
  return "medium"
}

function persistFontSizeMode(mode: FontSizeMode) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(FONT_SIZE_KEY, mode)
}

function readUserProfile(): UserProfile {
  if (typeof window === "undefined") return defaultUserProfile
  const raw = window.localStorage.getItem(USER_PROFILE_KEY)
  if (!raw) return defaultUserProfile
  try {
    return { ...defaultUserProfile, ...JSON.parse(raw) }
  } catch {
    return defaultUserProfile
  }
}

function persistUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
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
  transactions: [
    { id: "txn-001", date: "02/07", description: "Sessão floral P&B", category: "Júlia Martins", method: "Pix", status: "Pago", amount: 680, type: "income" },
    { id: "txn-002", date: "02/07", description: "Sinal fine line", category: "Mariana Alves", method: "Pix", status: "Pago", amount: 200, type: "income" },
    { id: "txn-003", date: "01/07", description: "Compra de agulhas", category: "Material", method: "Cartão", status: "Pago", amount: 180, type: "expense" },
    { id: "txn-004", date: "01/07", description: "Sinal blackwork", category: "Rafael Nunes", method: "Dinheiro", status: "Pendente", amount: 300, type: "income" },
    { id: "txn-005", date: "30/06", description: "Tinta preta", category: "Material", method: "Pix", status: "Pago", amount: 120, type: "expense" },
    { id: "txn-006", date: formatTodayDate().slice(0, 5), description: "Restante sessão realismo", category: "Lucas Rocha", method: "Pix", status: "Pendente", amount: 420, type: "income" },
    { id: "txn-007", date: "02/07", description: "Restante da sessão fine line", category: "Mariana Alves", method: "Cartão", status: "Pendente", amount: 300, type: "income" },
  ] satisfies FinanceTransaction[],
}

const financeLaunchTypes = ["Entrada", "Saída", "Sinal recebido", "Pagamento de sessão", "Despesa do studio"]
const financeClients = ["Mariana Alves", "Lucas Rocha", "Júlia Martins", "Rafael Nunes", "Sem cliente"]
const financePaymentMethods = ["Pix", "Dinheiro", "Cartão", "Transferência", "Outro"]
const financeStatuses = ["Pago", "Pendente", "Cancelado"]

const budgetMock: {
  summary: {
    openBudgets: number
    unansweredBudgets: number
    pendingDepositsAmount: number
    pendingDepositsCount: number
    negotiationAmount: number
  }
  columns: BudgetColumn[]
} = {
  summary: {
    openBudgets: 42,
    unansweredBudgets: 12,
    pendingDepositsAmount: 1240,
    pendingDepositsCount: 4,
    negotiationAmount: 8450,
  },
  columns: [
    {
      id: "new",
      title: "Novo",
      description: "Pedidos recém-chegados",
      count: 8,
      items: [
        {
          id: "bgt-001",
          title: "Fine line costela",
          client: "Mariana Alves",
          style: "Fine line",
          bodyPlacement: "Costela",
          size: "12cm",
          sessions: "1 sessão",
          valueRange: "R$ 680 - R$ 850",
          deposit: null,
          source: "WhatsApp",
          waitingTime: "há 2 dias",
          nextAction: "Enviar follow-up",
          status: "Novo",
          createdAt: "06/07/2026",
          description: "Cliente quer uma tattoo fina na costela com referência floral.",
          internalNotes: "Pedir referência com melhor resolução e confirmar se prefere traço bem fino.",
          history: ["Pedido criado", "Cliente enviou referência no WhatsApp"],
        },
        {
          id: "bgt-002",
          title: "Dragão oriental",
          client: "Caio Lima",
          style: "Oriental",
          bodyPlacement: "Antebraço",
          size: "18cm",
          sessions: "1 a 2 sessões",
          valueRange: "R$ 1.200 - R$ 1.600",
          deposit: null,
          source: "Instagram",
          waitingTime: "hoje",
          nextAction: "Avaliar referência",
          status: "Novo",
          createdAt: "08/07/2026",
          description: "Projeto oriental com traços fortes e sombra.",
          internalNotes: "Cliente gosta de composição vertical e quer orçamento ainda esta semana.",
          history: ["Pedido criado", "Referência recebida pelo Instagram"],
        },
        {
          id: "bgt-003",
          title: "Lettering mão",
          client: "Bianca Torres",
          style: "Lettering",
          bodyPlacement: "Mão",
          size: "6cm",
          sessions: "1 sessão",
          valueRange: "R$ 350 - R$ 450",
          deposit: null,
          source: "WhatsApp",
          waitingTime: "há 1 dia",
          nextAction: "Responder cliente",
          status: "Novo",
          createdAt: "07/07/2026",
          description: "Lettering pequeno na lateral da mão.",
          internalNotes: "Confirmar palavra final antes de enviar proposta.",
          history: ["Pedido criado"],
        },
      ],
    },
    {
      id: "analysis",
      title: "Em análise",
      description: "Orçamento sendo avaliado",
      count: 5,
      items: [
        {
          id: "bgt-004",
          title: "Fechamento floral",
          client: "Júlia Martins",
          style: "Floral",
          bodyPlacement: "Braço",
          size: "Fechamento",
          sessions: "3 sessões",
          valueRange: "R$ 1.420",
          deposit: "R$ 300 sugerido",
          source: "Instagram",
          waitingTime: "há 3 dias",
          nextAction: "Montar proposta",
          status: "Em análise",
          createdAt: "05/07/2026",
          description: "Fechamento floral P&B com composição autoral.",
          internalNotes: "Separar proposta em etapas e explicar quantidade de sessões.",
          history: ["Pedido criado", "Cliente respondeu no Instagram"],
        },
        {
          id: "bgt-005",
          title: "Blackwork braço",
          client: "Rafael Nunes",
          style: "Blackwork",
          bodyPlacement: "Braço",
          size: "2 sessões",
          sessions: "2 sessões",
          valueRange: "R$ 1.800",
          deposit: "R$ 300 pendente",
          source: "Indicação",
          waitingTime: "há 4 dias",
          nextAction: "Confirmar sinal",
          status: "Em análise",
          createdAt: "04/07/2026",
          description: "Projeto grande de blackwork no braço.",
          internalNotes: "Orçamento de alto valor parado. Priorizar retorno e reforçar agenda limitada.",
          history: ["Pedido criado", "Proposta rascunhada"],
        },
      ],
    },
    {
      id: "sent",
      title: "Proposta enviada",
      description: "Proposta já enviada ao cliente",
      count: 7,
      items: [
        {
          id: "bgt-006",
          title: "Realismo ombro",
          client: "Lucas Rocha",
          style: "Realismo",
          bodyPlacement: "Ombro",
          size: "15cm",
          sessions: "1 sessão",
          valueRange: "R$ 1.500",
          deposit: "R$ 400",
          source: "WhatsApp",
          waitingTime: "há 2 dias",
          nextAction: "Enviar follow-up",
          status: "Proposta enviada",
          createdAt: "06/07/2026",
          description: "Realismo P&B no ombro com referência enviada pelo cliente.",
          internalNotes: "Cliente perguntou sobre parcelamento. Sinal pode ser Pix.",
          history: ["Pedido criado", "Proposta enviada"],
        },
      ],
    },
    {
      id: "deposit",
      title: "Sinal pendente",
      description: "Cliente ainda precisa pagar o sinal",
      count: 4,
      items: [
        {
          id: "bgt-007",
          title: "Mandala ombro",
          client: "Fernanda Dias",
          style: "Geométrico",
          bodyPlacement: "Ombro",
          size: "14cm",
          sessions: "1 sessão",
          valueRange: "R$ 900",
          deposit: "R$ 250 pendente",
          source: "Instagram",
          waitingTime: "vence hoje",
          nextAction: "Enviar lembrete",
          status: "Sinal pendente",
          createdAt: "06/07/2026",
          description: "Mandala geométrica no ombro.",
          internalNotes: "Mandar lembrete com prazo para segurar horário.",
          history: ["Pedido criado", "Proposta enviada", "Sinal solicitado"],
        },
      ],
    },
    {
      id: "scheduled",
      title: "Agendado",
      description: "Sinal pago e sessão marcada",
      count: 9,
      items: [
        {
          id: "bgt-008",
          title: "Flash autoral",
          client: "Marina Alves",
          style: "Autoral",
          bodyPlacement: "Panturrilha",
          size: "10cm",
          sessions: "1 sessão",
          valueRange: "R$ 390",
          deposit: "R$ 100 pago",
          source: "Flash day",
          waitingTime: "sessão amanhã",
          nextAction: "Ver agenda",
          status: "Agendado",
          createdAt: "03/07/2026",
          description: "Flash autoral escolhido pelo cliente.",
          internalNotes: "Confirmar chegada 15 minutos antes da sessão.",
          history: ["Pedido criado", "Proposta enviada", "Sinal pago", "Sessão agendada"],
        },
      ],
    },
    {
      id: "closed",
      title: "Fechado",
      description: "Venda confirmada ou trabalho concluído",
      count: 9,
      items: [
        {
          id: "bgt-009",
          title: "Old school águia",
          client: "Pedro Santos",
          style: "Old school",
          bodyPlacement: "Peito",
          size: "16cm",
          sessions: "1 sessão",
          valueRange: "R$ 1.100",
          deposit: "Pago",
          source: "WhatsApp",
          waitingTime: "finalizado",
          nextAction: "Ver cliente",
          status: "Fechado",
          createdAt: "28/06/2026",
          description: "Tattoo old school de águia no peito.",
          internalNotes: "Bom candidato para foto de portfólio.",
          history: ["Pedido criado", "Proposta enviada", "Sinal pago", "Sessão concluída"],
        },
      ],
    },
  ],
}

const budgetSources = ["Todos", "WhatsApp", "Instagram", "Indicação", "Presencial", "Site", "Flash day", "Outro"]
const budgetStatusOptions = ["Todos", "Novo", "Em análise", "Proposta enviada", "Sinal pendente", "Agendado", "Fechado", "Perdido"]
const budgetPeriods = ["Todos", "Hoje", "Essa semana", "Mais de 2 dias"]
const budgetValueRanges = ["Todos", "Até R$ 1.000", "Acima de R$ 1.000"]
const budgetClients = ["Mariana Alves", "Lucas Rocha", "Júlia Martins", "Rafael Nunes", "Novo cliente"]
const budgetInitialStatuses: NewBudgetDraft["status"][] = ["Novo", "Em análise", "Proposta enviada"]
const budgetFilterFlags = [
  { id: "unanswered", label: "Sem resposta" },
  { id: "pendingDeposit", label: "Com sinal pendente" },
  { id: "scheduled", label: "Agendados" },
  { id: "lost", label: "Perdidos" },
]

const initialBudgetFilters: BudgetFilterState = {
  status: "Todos",
  style: "Todos",
  source: "Todos",
  period: "Todos",
  valueRange: "Todos",
  flags: [],
}

const initialBudgetDraft: NewBudgetDraft = {
  client: "",
  title: "",
  style: "",
  bodyPlacement: "",
  size: "",
  description: "",
  minValue: "",
  maxValue: "",
  depositValue: "",
  source: "WhatsApp",
  status: "Novo",
  internalNotes: "",
}

const studioTypes = ["Trabalho sozinho(a)", "Tenho um studio pequeno", "Tenho um studio com equipe"]
const teamSizes = ["Só eu", "2 a 3 pessoas", "4 a 6 pessoas", "Mais de 6 pessoas"]
const contactChannels = ["WhatsApp", "Instagram", "Presencial", "Todos"]
const depositOptions = ["Sim, cobro sinal", "Não cobro sinal", "Depende do orçamento"]
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

const clientsMock: {
  summary: {
    activeClients: number
    newThisMonth: number
    withBudget: number
    unansweredBudgets: number
    withSession: number
    todaySessions: number
    withoutReturn: number
  }
  clients: ClientItem[]
} = {
  summary: {
    activeClients: 128,
    newThisMonth: 14,
    withBudget: 42,
    unansweredBudgets: 12,
    withSession: 16,
    todaySessions: 3,
    withoutReturn: 7,
  },
  clients: [
    {
      id: "cli-001",
      name: "Marina Alves",
      primaryContact: "WhatsApp · @marinaalves",
      whatsapp: "+55 21 99999-0184",
      instagram: "@marinaalves",
      email: "marina.alves@email.com",
      source: "WhatsApp",
      style: "Fine line",
      bodyPlacement: "Costela",
      interest: "Fine line · Costela",
      status: "Orçamento aberto",
      lastContact: "Hoje",
      nextAction: "Enviar follow-up",
      value: "R$ 680",
      numericValue: 680,
      anamnesis: "Pendente",
      contactPreference: "WhatsApp",
      city: "Rio de Janeiro",
      acceptsReminders: true,
      clientSince: "04/07/2026",
      internalNotes: "Gosta de traço delicado e pediu referências florais pequenas.",
      budgets: [{ title: "Fine line costela", value: "R$ 680", status: "Orçamento aberto", action: "Enviar follow-up" }],
      sessions: [],
      history: ["Cliente chegou pelo WhatsApp", "Referência recebida", "Orçamento aberto"],
      flags: { openBudget: true, scheduledSession: false, pendingAnamnesis: true, needsReturn: true, recurring: false },
    },
    {
      id: "cli-002",
      name: "Rafael Nunes",
      primaryContact: "Instagram · @rafaelnunes",
      whatsapp: "+55 21 98888-1402",
      instagram: "@rafaelnunes",
      email: "rafael.nunes@email.com",
      source: "Instagram",
      style: "Blackwork",
      bodyPlacement: "Braço",
      interest: "Blackwork · Braço",
      status: "Sinal pendente",
      lastContact: "Ontem",
      nextAction: "Confirmar pagamento",
      value: "R$ 1.800",
      numericValue: 1800,
      anamnesis: "Preenchida",
      contactPreference: "Instagram",
      city: "Niterói",
      acceptsReminders: true,
      clientSince: "28/06/2026",
      internalNotes: "Projeto de alto valor. Reforçar prazo para segurar horário.",
      budgets: [{ title: "Blackwork braço", value: "R$ 1.800", status: "Sinal pendente", action: "Confirmar pagamento" }],
      sessions: [],
      history: ["Pedido recebido no Instagram", "Proposta enviada", "Sinal solicitado"],
      flags: { openBudget: true, scheduledSession: false, pendingAnamnesis: false, needsReturn: false, recurring: false },
    },
    {
      id: "cli-003",
      name: "Júlia Martins",
      primaryContact: "WhatsApp · @juliamartins",
      whatsapp: "+55 21 97777-4310",
      instagram: "@juliamartins",
      email: "julia.martins@email.com",
      source: "WhatsApp",
      style: "Floral",
      bodyPlacement: "Braço",
      interest: "Floral · Braço",
      status: "Sessão marcada",
      lastContact: "2 dias",
      nextAction: "Ver agenda",
      value: "R$ 1.420",
      numericValue: 1420,
      anamnesis: "Preenchida",
      contactPreference: "WhatsApp",
      city: "Rio de Janeiro",
      acceptsReminders: true,
      clientSince: "18/06/2026",
      internalNotes: "Fechamento floral P&B em etapas. Confirmar chegada 15 min antes.",
      budgets: [{ title: "Floral braço", value: "R$ 1.420", status: "Fechado", action: "Ver orçamento" }],
      sessions: [{ title: "Sessão floral P&B", date: "Hoje às 10:00", status: "Confirmada" }],
      history: ["Orçamento aprovado", "Sinal pago", "Sessão marcada"],
      flags: { openBudget: false, scheduledSession: true, pendingAnamnesis: false, needsReturn: false, recurring: true },
    },
    {
      id: "cli-004",
      name: "Caio Lima",
      primaryContact: "Indicação · sem Instagram",
      whatsapp: "+55 21 96666-6200",
      instagram: "",
      email: "",
      source: "Indicação",
      style: "Autoral",
      bodyPlacement: "Flash",
      interest: "Flash autoral",
      status: "Novo cliente",
      lastContact: "5 dias",
      nextAction: "Responder cliente",
      value: "R$ 390",
      numericValue: 390,
      anamnesis: "Não enviada",
      contactPreference: "WhatsApp",
      city: "Rio de Janeiro",
      acceptsReminders: false,
      clientSince: "03/07/2026",
      internalNotes: "Chegou por indicação e ainda não recebeu anamnese.",
      budgets: [{ title: "Flash autoral", value: "R$ 390", status: "Novo cliente", action: "Responder cliente" }],
      sessions: [],
      history: ["Cliente cadastrado por indicação"],
      flags: { openBudget: true, scheduledSession: false, pendingAnamnesis: true, needsReturn: true, recurring: false },
    },
    {
      id: "cli-005",
      name: "Lucas Rocha",
      primaryContact: "WhatsApp · @lucasrocha",
      whatsapp: "+55 21 95555-9122",
      instagram: "@lucasrocha",
      email: "lucas.rocha@email.com",
      source: "WhatsApp",
      style: "Realismo",
      bodyPlacement: "Ombro",
      interest: "Realismo · Ombro",
      status: "Proposta enviada",
      lastContact: "3 dias",
      nextAction: "Enviar follow-up",
      value: "R$ 1.500",
      numericValue: 1500,
      anamnesis: "Pendente",
      contactPreference: "WhatsApp",
      city: "Rio de Janeiro",
      acceptsReminders: true,
      clientSince: "01/07/2026",
      internalNotes: "Perguntou sobre parcelamento. Reforçar sinal via Pix.",
      budgets: [{ title: "Realismo ombro", value: "R$ 1.500", status: "Proposta enviada", action: "Enviar follow-up" }],
      sessions: [],
      history: ["Pedido criado", "Proposta enviada", "Cliente pediu parcelamento"],
      flags: { openBudget: true, scheduledSession: false, pendingAnamnesis: true, needsReturn: true, recurring: false },
    },
  ],
}

const clientStatusOptions = ["Todos", "Novo cliente", "Orçamento aberto", "Proposta enviada", "Sinal pendente", "Sessão marcada", "Cliente recorrente", "Inativo"]
const clientSourceOptions = ["Todos", "WhatsApp", "Instagram", "Indicação", "Presencial", "Site", "Flash day", "Outro"]
const clientLastContactOptions = ["Todos", "Hoje", "Ontem", "2 dias", "3 dias ou mais"]
const clientContactPreferences = ["WhatsApp", "Instagram", "E-mail", "Ligação"]
const clientFilterFlags = [
  { id: "openBudget", label: "Com orçamento aberto" },
  { id: "scheduledSession", label: "Com sessão marcada" },
  { id: "pendingAnamnesis", label: "Com anamnese pendente" },
  { id: "needsReturn", label: "Clientes sem retorno" },
  { id: "recurring", label: "Clientes recorrentes" },
]

const initialClientFilters: ClientFilterState = {
  status: "Todos",
  style: "Todos",
  source: "Todos",
  lastContact: "Todos",
  flags: [],
}

const initialClientDraft: NewClientDraft = {
  name: "",
  whatsapp: "",
  instagram: "",
  email: "",
  source: "",
  style: "",
  idea: "",
  status: "Novo cliente",
  contactPreference: "WhatsApp",
  internalNotes: "",
  city: "",
  acceptsReminders: true,
}

const messagesMock: MessageThread[] = [
  {
    id: "msg-001",
    client: "Marina Alves",
    handle: "@marinaalves",
    channel: "WhatsApp",
    subject: "Referências para fine line",
    preview: "Mandei duas referências novas. Acha que fica melhor na costela ou no braço?",
    time: "09:42",
    status: "Nova",
    priority: "Alta",
    unread: true,
    linkedTo: "Orçamento fine line costela",
    nextAction: "Responder referência",
    responseTime: "12 min",
    value: "R$ 680",
    tags: ["Orçamento aberto", "Anamnese pendente"],
    suggestedReply: "Recebi as referências, Marina. Pela ideia delicada, a costela combina melhor. Posso te mandar uma composição até o fim do dia.",
    conversation: [
      { author: "client", text: "Oi! Mandei duas referências novas.", time: "09:38" },
      { author: "client", text: "Acha que fica melhor na costela ou no braço?", time: "09:42" },
    ],
  },
  {
    id: "msg-002",
    client: "Rafael Nunes",
    handle: "@rafaelnunes",
    channel: "Instagram",
    subject: "Sinal confirmado",
    preview: "Acabei de enviar o Pix do sinal. Pode confirmar para segurar o horário?",
    time: "10:15",
    status: "Aguardando resposta",
    priority: "Alta",
    unread: true,
    linkedTo: "Blackwork braço",
    nextAction: "Registrar pagamento",
    responseTime: "8 min",
    value: "R$ 1.800",
    tags: ["Sinal", "Pagamento"],
    suggestedReply: "Pagamento recebido, Rafael. Seu horário fica reservado e vou te mandar os detalhes da sessão por aqui.",
    conversation: [
      { author: "studio", text: "Rafael, o sinal segura o horário de quinta às 16h.", time: "09:58" },
      { author: "client", text: "Acabei de enviar o Pix do sinal. Pode confirmar?", time: "10:15" },
    ],
  },
  {
    id: "msg-003",
    client: "Júlia Martins",
    handle: "@juliamartins",
    channel: "WhatsApp",
    subject: "Ajuste no desenho",
    preview: "Consegue deixar a flor um pouco menor e manter o caule mais fino?",
    time: "Ontem",
    status: "Respondida",
    priority: "Média",
    unread: false,
    linkedTo: "Sessão floral P&B",
    nextAction: "Atualizar briefing",
    responseTime: "31 min",
    value: "R$ 1.420",
    tags: ["Sessão marcada", "Briefing"],
    suggestedReply: "Consigo sim. Vou reduzir a flor e deixar o caule mais fino para manter o visual leve.",
    conversation: [
      { author: "client", text: "Consegue deixar a flor um pouco menor?", time: "Ontem 17:10" },
      { author: "studio", text: "Consigo sim, vou ajustar antes da sessão.", time: "Ontem 17:41" },
    ],
  },
  {
    id: "msg-004",
    client: "Caio Lima",
    handle: "+55 21 96666-6200",
    channel: "WhatsApp",
    subject: "Flash autoral",
    preview: "Ainda tem aquele flash pequeno disponível? Queria ver preço e agenda.",
    time: "2 dias",
    status: "Resolvida",
    priority: "Baixa",
    unread: false,
    linkedTo: "Flash autoral",
    nextAction: "Criar orçamento",
    responseTime: "2h",
    value: "R$ 390",
    tags: ["Novo cliente", "Flash"],
    suggestedReply: "Tenho sim. Esse flash fica em R$ 390 e consigo te atender na próxima semana.",
    conversation: [
      { author: "client", text: "Ainda tem aquele flash pequeno disponível?", time: "2 dias" },
      { author: "studio", text: "Tenho sim. Vou te mandar agenda e valor.", time: "2 dias" },
    ],
  },
]

const portfolioMock: PortfolioItem[] = [
  {
    id: "pf-001",
    title: "Fine line costela",
    client: "Marina Alves",
    style: "Fine line",
    bodyPlacement: "Costela",
    sessionDate: "08/07/2026",
    status: "Publicado",
    source: "Sessão finalizada",
    visibility: "Público",
    featured: true,
    coverTone: "linear-gradient(145deg, color-mix(in srgb, var(--markly-accent) 24%, transparent), color-mix(in srgb, var(--markly-text) 8%, transparent))",
    accent: "#8DCEC0",
    description: "Traço fino na costela com composição floral minimalista.",
    tags: ["fine line", "floral", "costela", "delicado"],
    files: ["Foto tratada", "Close do traço", "Antes/depois"],
    usage: "Instagram, site e proposta comercial",
    notes: "Peça forte para atrair clientes de traço delicado.",
    metrics: { photos: 3, views: 842, saves: 54 },
    history: ["Foto importada da sessão", "Tratamento concluído", "Publicado no portfólio"],
  },
  {
    id: "pf-002",
    title: "Blackwork braço",
    client: "Rafael Nunes",
    style: "Blackwork",
    bodyPlacement: "Braço",
    sessionDate: "06/07/2026",
    status: "Tratando foto",
    source: "Sessão finalizada",
    visibility: "Interno",
    featured: false,
    coverTone: "linear-gradient(145deg, rgba(0,71,65,0.22), color-mix(in srgb, var(--markly-text) 7%, transparent))",
    accent: "#004741",
    description: "Projeto blackwork de alto contraste no braço.",
    tags: ["blackwork", "braço", "alto contraste"],
    files: ["Foto RAW", "Selecionada 01"],
    usage: "Aguardando tratamento para publicação",
    notes: "Precisa ajustar contraste antes de publicar.",
    metrics: { photos: 2, views: 0, saves: 0 },
    history: ["Foto adicionada", "Enviado para tratamento"],
  },
  {
    id: "pf-003",
    title: "Floral P&B",
    client: "Júlia Martins",
    style: "Floral",
    bodyPlacement: "Braço",
    sessionDate: "Hoje",
    status: "Em seleção",
    source: "Agenda",
    visibility: "Interno",
    featured: true,
    coverTone: "linear-gradient(145deg, rgba(47,127,104,0.22), color-mix(in srgb, var(--markly-accent) 12%, transparent))",
    accent: "#2F7F68",
    description: "Sessão floral P&B com composição para fechamento.",
    tags: ["floral", "p&b", "braço", "fechamento"],
    files: ["Prévia sessão", "Foto ambiente", "Detalhe do stencil"],
    usage: "Selecionar melhor foto após sessão",
    notes: "Boa candidata para destaque da semana.",
    metrics: { photos: 3, views: 0, saves: 0 },
    history: ["Sessão vinculada", "Fotos pendentes de seleção"],
  },
  {
    id: "pf-004",
    title: "Flash autoral",
    client: "Caio Lima",
    style: "Autoral",
    bodyPlacement: "Panturrilha",
    sessionDate: "03/07/2026",
    status: "Publicado",
    source: "Flash day",
    visibility: "Público",
    featured: false,
    coverTone: "linear-gradient(145deg, color-mix(in srgb, var(--markly-text) 12%, transparent), rgba(0,71,65,0.16))",
    accent: "#D8D0BF",
    description: "Flash autoral com leitura limpa para catálogo rápido.",
    tags: ["flash", "autoral", "panturrilha"],
    files: ["Foto tratada", "Corte vertical"],
    usage: "Catálogo de flash e Instagram",
    notes: "Manter como exemplo de flash autoral vendido.",
    metrics: { photos: 2, views: 612, saves: 31 },
    history: ["Foto selecionada", "Publicado em flash autoral"],
  },
  {
    id: "pf-005",
    title: "Realismo ombro",
    client: "Lucas Rocha",
    style: "Realismo",
    bodyPlacement: "Ombro",
    sessionDate: "01/07/2026",
    status: "Arquivado",
    source: "Sessão finalizada",
    visibility: "Interno",
    featured: false,
    coverTone: "linear-gradient(145deg, color-mix(in srgb, var(--markly-text) 9%, transparent), rgba(47,127,104,0.12))",
    accent: "#8DCEC0",
    description: "Estudo de realismo P&B no ombro.",
    tags: ["realismo", "ombro", "p&b"],
    files: ["Foto sessão"],
    usage: "Arquivo interno",
    notes: "Não publicar por enquanto; foto precisa de melhor iluminação.",
    metrics: { photos: 1, views: 0, saves: 0 },
    history: ["Foto adicionada", "Arquivado para revisão futura"],
  },
]

const portfolioStatusOptions = ["Todos", "Publicado", "Em seleção", "Tratando foto", "Arquivado"]
const portfolioSourceOptions = ["Todos", "Sessão finalizada", "Agenda", "Flash day", "Upload manual", "Cliente"]
const portfolioVisibilityOptions = ["Todos", "Público", "Interno"]
const portfolioUsageOptions = ["Instagram, site e proposta comercial", "Instagram", "Site", "Catálogo de flash", "Arquivo interno"]
const initialPortfolioFilters: PortfolioFilterState = {
  status: "Todos",
  style: "Todos",
  source: "Todos",
  visibility: "Todos",
  flags: [],
}
const initialPortfolioDraft: NewPortfolioDraft = {
  title: "",
  client: "",
  style: "",
  bodyPlacement: "",
  sessionDate: formatTodayDate(),
  status: "Em seleção",
  source: "Upload manual",
  visibility: "Interno",
  description: "",
  tags: "",
  usage: "Instagram",
  notes: "",
  featured: false,
}

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

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, month, index - firstWeekday + 1)
    return { date, inCurrentMonth: date.getMonth() === month }
  })
}

function groupCalendarEventsByDate(events: { date: string }[]) {
  const map: Record<string, typeof events> = {}
  events.forEach((event) => {
    if (!map[event.date]) map[event.date] = []
    map[event.date].push(event)
  })
  return map
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

function financeStatusTone(status: string) {
  if (status === "Pago") return T.green
  if (status === "Pendente") return T.amber
  return T.faint
}

function parseFinanceDateToDate(value: string): Date | null {
  const [day, month] = value.split("/").map(Number)
  if (!day || !month) return null
  const now = new Date()
  const date = new Date(now.getFullYear(), month - 1, day)
  if (date.getTime() > now.getTime() + 1000 * 60 * 60 * 24) date.setFullYear(now.getFullYear() - 1)
  return date
}

function matchesFinancePeriod(value: string, period: string) {
  if (period === "Todos os períodos") return true
  const date = parseFinanceDateToDate(value)
  if (!date) return true
  const now = new Date()
  if (period === "Este mês") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  const dayMs = 1000 * 60 * 60 * 24
  const daysAgo = Math.round((now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / dayMs)
  if (period === "Últimos 7 dias") return daysAgo >= 0 && daysAgo <= 7
  if (period === "Últimos 30 dias") return daysAgo >= 0 && daysAgo <= 30
  return true
}

function allBudgetItems(columns: BudgetColumn[]) {
  return columns.flatMap((column) => column.items)
}

function budgetColumnIdForStatus(status: BudgetStatus): BudgetColumnId {
  if (status === "Em análise") return "analysis"
  if (status === "Proposta enviada") return "sent"
  if (status === "Sinal pendente") return "deposit"
  if (status === "Agendado") return "scheduled"
  if (status === "Fechado" || status === "Perdido") return "closed"
  return "new"
}

function nextBudgetStatusForAction(action: string): BudgetStatus | null {
  switch (action) {
    case "Marcar como respondido":
      return "Em análise"
    case "Enviar proposta":
      return "Proposta enviada"
    case "Marcar sinal pago":
    case "Agendar sessão":
      return "Agendado"
    case "Mover para perdido":
      return "Perdido"
    default:
      return null
  }
}

function moveBudgetToStatus(columns: BudgetColumn[], budgetId: string, nextStatus: BudgetStatus): BudgetColumn[] {
  let movedItem: BudgetItem | null = null
  const withoutItem = columns.map((column) => {
    const items = column.items.filter((item) => {
      if (item.id !== budgetId) return true
      movedItem = { ...item, status: nextStatus }
      return false
    })
    return { ...column, items, count: items.length }
  })
  if (!movedItem) return columns
  const targetId = budgetColumnIdForStatus(nextStatus)
  return withoutItem.map((column) =>
    column.id === targetId
      ? { ...column, items: [movedItem as BudgetItem, ...column.items], count: column.items.length + 1 }
      : column,
  )
}

function estimateBudgetValue(item: BudgetItem) {
  const match = item.valueRange.replace(/\./g, "").match(/\d+/)
  return match ? Number(match[0]) : 0
}

function budgetHasPendingDeposit(item: BudgetItem) {
  return Boolean(item.deposit?.toLowerCase().includes("pendente"))
}

function budgetNeedsResponse(item: BudgetItem) {
  const action = item.nextAction.toLowerCase()
  return action.includes("follow-up") || action.includes("responder") || action.includes("lembrete")
}

function budgetMatchesFilters(item: BudgetItem, filters: BudgetFilterState) {
  if (filters.status !== "Todos" && item.status !== filters.status) return false
  if (filters.style !== "Todos" && item.style !== filters.style) return false
  if (filters.source !== "Todos" && item.source !== filters.source) return false
  if (filters.period === "Hoje" && !item.waitingTime.toLowerCase().includes("hoje")) return false
  if (filters.period === "Mais de 2 dias" && !/(2|3|4|5|6|7)/.test(item.waitingTime)) return false
  if (filters.valueRange === "Até R$ 1.000" && estimateBudgetValue(item) > 1000) return false
  if (filters.valueRange === "Acima de R$ 1.000" && estimateBudgetValue(item) <= 1000) return false
  if (filters.flags.includes("pendingDeposit") && !budgetHasPendingDeposit(item)) return false
  if (filters.flags.includes("unanswered") && !budgetNeedsResponse(item)) return false
  if (filters.flags.includes("scheduled") && item.status !== "Agendado") return false
  if (filters.flags.includes("lost") && item.status !== "Perdido") return false
  return true
}

function filterBudgetColumns(columns: BudgetColumn[], filters: BudgetFilterState) {
  return columns.map((column) => ({
    ...column,
    items: column.items.filter((item) => budgetMatchesFilters(item, filters)),
  }))
}

function budgetMatchesQuery(item: BudgetItem, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    item.title,
    item.client,
    item.style,
    item.status,
    item.valueRange,
    item.bodyPlacement,
    item.source,
  ].some((value) => value.toLowerCase().includes(normalized))
}

function formatDraftValueRange(draft: NewBudgetDraft) {
  const min = draft.minValue.trim()
  const max = draft.maxValue.trim()
  if (min && max && min !== max) return `${min} - ${max}`
  return min || max
}

function createBudgetFromDraft(draft: NewBudgetDraft): BudgetItem {
  const valueRange = formatDraftValueRange(draft)
  return {
    id: `bgt-${Date.now()}`,
    title: draft.title.trim(),
    client: draft.client,
    style: draft.style,
    bodyPlacement: draft.bodyPlacement.trim(),
    size: draft.size.trim() || "A definir",
    sessions: draft.size.toLowerCase().includes("sess") ? draft.size.trim() : "A definir",
    valueRange,
    deposit: draft.depositValue.trim() ? `${draft.depositValue.trim()} pendente` : null,
    source: draft.source,
    waitingTime: "agora",
    nextAction: draft.status === "Proposta enviada" ? "Acompanhar resposta" : draft.status === "Em análise" ? "Montar proposta" : "Responder cliente",
    status: draft.status,
    createdAt: formatTodayDate(),
    description: draft.description.trim(),
    internalNotes: draft.internalNotes.trim() || "Sem observações internas ainda.",
    history: ["Pedido criado"],
  }
}

function clientStatusStyle(status: ClientStatus) {
  if (status === "Sessão marcada" || status === "Cliente recorrente") {
    return {
      background: "rgba(47,127,104,0.14)",
      borderColor: "rgba(47,127,104,0.34)",
      color: T.accent,
    }
  }
  if (status === "Sinal pendente" || status === "Proposta enviada") {
    return {
      background: "color-mix(in srgb, var(--markly-accent) 10%, transparent)",
      borderColor: "color-mix(in srgb, var(--markly-accent) 30%, transparent)",
      color: T.text,
    }
  }
  if (status === "Inativo") {
    return {
      background: "color-mix(in srgb, var(--markly-text) 3.5%, transparent)",
      borderColor: T.border,
      color: T.faint,
    }
  }
  return {
    background: "rgba(0,71,65,0.16)",
    borderColor: "rgba(0,71,65,0.34)",
    color: T.accent,
  }
}

function clientAnamnesisStyle(status: ClientAnamnesisStatus) {
  if (status === "Preenchida") {
    return {
      background: "rgba(47,127,104,0.14)",
      borderColor: "rgba(47,127,104,0.34)",
      color: T.accent,
    }
  }
  if (status === "Pendente") {
    return {
      background: "color-mix(in srgb, var(--markly-accent) 10%, transparent)",
      borderColor: "color-mix(in srgb, var(--markly-accent) 30%, transparent)",
      color: T.text,
    }
  }
  return {
    background: "color-mix(in srgb, var(--markly-text) 3.5%, transparent)",
    borderColor: T.border,
    color: T.faint,
  }
}

function normalizeClientSearch(value: string) {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function clientLastContactDays(value: string) {
  if (value === "Hoje") return 0
  if (value === "Ontem") return 1
  const match = value.match(/\d+/)
  return match ? Number(match[0]) : 0
}

function clientMatchesFilters(client: ClientItem, filters: ClientFilterState) {
  if (filters.status !== "Todos") {
    if (filters.status === "Cliente recorrente" && !client.flags.recurring && client.status !== "Cliente recorrente") return false
    if (filters.status !== "Cliente recorrente" && client.status !== filters.status) return false
  }
  if (filters.style !== "Todos" && client.style !== filters.style && !client.interest.includes(filters.style)) return false
  if (filters.source !== "Todos" && client.source !== filters.source) return false
  if (filters.lastContact === "Hoje" && client.lastContact !== "Hoje") return false
  if (filters.lastContact === "Ontem" && client.lastContact !== "Ontem") return false
  if (filters.lastContact === "2 dias" && clientLastContactDays(client.lastContact) !== 2) return false
  if (filters.lastContact === "3 dias ou mais" && clientLastContactDays(client.lastContact) < 3) return false
  if (filters.flags.includes("openBudget") && !client.flags.openBudget) return false
  if (filters.flags.includes("scheduledSession") && !client.flags.scheduledSession) return false
  if (filters.flags.includes("pendingAnamnesis") && !client.flags.pendingAnamnesis) return false
  if (filters.flags.includes("needsReturn") && !client.flags.needsReturn) return false
  if (filters.flags.includes("recurring") && !client.flags.recurring) return false
  if (filters.flags.includes("unanswered3") && !client.flags.needsReturn) return false
  if (filters.flags.includes("pendingDeposit") && client.status !== "Sinal pendente") return false
  if (filters.flags.includes("sessionWeek") && !client.flags.scheduledSession) return false
  if (filters.flags.includes("highValue") && client.numericValue <= 1000) return false
  return true
}

function filterClients(clients: ClientItem[], filters: ClientFilterState) {
  return clients.filter((client) => clientMatchesFilters(client, filters))
}

function clientMatchesQuery(client: ClientItem, query: string) {
  const normalized = normalizeClientSearch(query.trim())
  if (!normalized) return true
  return [
    client.name,
    client.primaryContact,
    client.whatsapp,
    client.instagram,
    client.email,
    client.style,
    client.bodyPlacement,
    client.interest,
    client.status,
    client.value,
    client.source,
  ].some((value) => normalizeClientSearch(value).includes(normalized))
}

function clientSummaryFromList(clients: ClientItem[]) {
  const extraClients = Math.max(0, clients.length - clientsMock.clients.length)
  return {
    activeClients: clientsMock.summary.activeClients + extraClients,
    newThisMonth: clientsMock.summary.newThisMonth + extraClients,
    withBudget: clientsMock.summary.withBudget + clients.filter((client) => client.id.startsWith("cli-new") && client.flags.openBudget).length,
    unansweredBudgets: clientsMock.summary.unansweredBudgets,
    withSession: clientsMock.summary.withSession + clients.filter((client) => client.id.startsWith("cli-new") && client.flags.scheduledSession).length,
    todaySessions: clientsMock.summary.todaySessions,
    withoutReturn: clientsMock.summary.withoutReturn + clients.filter((client) => client.id.startsWith("cli-new") && client.flags.needsReturn).length,
  }
}

function createClientFromDraft(draft: NewClientDraft): ClientItem {
  const name = draft.name.trim()
  const instagram = draft.instagram.trim()
  const normalizedInstagram = instagram && !instagram.startsWith("@") ? `@${instagram}` : instagram
  const idea = draft.idea.trim() || "Ideia inicial a definir"
  const style = draft.style || "A definir"
  const hasOpenBudget = ["Novo cliente", "Orçamento aberto", "Proposta enviada", "Sinal pendente"].includes(draft.status)
  const pendingAnamnesis = draft.status !== "Sessão marcada"

  return {
    id: `cli-new-${Date.now()}`,
    name,
    primaryContact: `${draft.source} · ${normalizedInstagram || draft.whatsapp.trim() || "sem contato público"}`,
    whatsapp: draft.whatsapp.trim(),
    instagram: normalizedInstagram,
    email: draft.email.trim(),
    source: draft.source,
    style,
    bodyPlacement: "A definir",
    interest: idea.length > 32 ? `${style} · ${idea.slice(0, 29)}...` : `${style} · ${idea}`,
    status: draft.status,
    lastContact: "Hoje",
    nextAction: draft.status === "Sinal pendente" ? "Confirmar pagamento" : draft.status === "Sessão marcada" ? "Ver agenda" : "Responder cliente",
    value: "R$ 0",
    numericValue: 0,
    anamnesis: pendingAnamnesis ? "Não enviada" : "Pendente",
    contactPreference: draft.contactPreference,
    city: draft.city.trim() || "Não informado",
    acceptsReminders: draft.acceptsReminders,
    clientSince: formatTodayDate(),
    internalNotes: draft.internalNotes.trim() || "Sem observações internas ainda.",
    budgets: hasOpenBudget ? [{ title: idea, value: "A definir", status: draft.status, action: "Criar orçamento" }] : [],
    sessions: draft.status === "Sessão marcada" ? [{ title: idea, date: "A definir", status: "A confirmar" }] : [],
    history: ["Cliente cadastrado manualmente", draft.source ? `Origem: ${draft.source}` : "Origem não informada"],
    flags: {
      openBudget: hasOpenBudget,
      scheduledSession: draft.status === "Sessão marcada",
      pendingAnamnesis,
      needsReturn: true,
      recurring: draft.status === "Cliente recorrente",
    },
  }
}

function applyClientAction(client: ClientItem, action: string, anamnesisLabel = "Anamnese"): { client: ClientItem; message: string } {
  if (action === "Agendar sessão") {
    return {
      client: { ...client, status: "Sessão marcada", flags: { ...client.flags, scheduledSession: true } },
      message: `Sessão marcada para ${client.name}.`,
    }
  }
  if (action === "Enviar anamnese") {
    if (client.anamnesis !== "Não enviada") {
      return { client, message: `${anamnesisLabel} de ${client.name} já foi enviada.` }
    }
    return {
      client: { ...client, anamnesis: "Pendente", flags: { ...client.flags, pendingAnamnesis: true } },
      message: `${anamnesisLabel} enviada para ${client.name}.`,
    }
  }
  if (action === "Marcar anamnese preenchida") {
    if (client.anamnesis === "Preenchida") {
      return { client, message: `${anamnesisLabel} de ${client.name} já está preenchida.` }
    }
    return {
      client: { ...client, anamnesis: "Preenchida", flags: { ...client.flags, pendingAnamnesis: false } },
      message: `${anamnesisLabel} de ${client.name} marcada como preenchida.`,
    }
  }
  return { client, message: `"${action}" ainda não está disponível nesta versão.` }
}

function anamnesisActionLabel(action: string, anamnesisLabel: string) {
  if (action === "Enviar anamnese") return `Enviar ${anamnesisLabel.toLowerCase()}`
  return action
}

function portfolioStatusStyle(status: PortfolioStatus) {
  if (status === "Publicado") {
    return {
      background: "rgba(47,127,104,0.14)",
      borderColor: "rgba(47,127,104,0.34)",
      color: T.accent,
    }
  }
  if (status === "Tratando foto") {
    return {
      background: "color-mix(in srgb, var(--markly-accent) 12%, transparent)",
      borderColor: "color-mix(in srgb, var(--markly-accent) 30%, transparent)",
      color: T.text,
    }
  }
  if (status === "Arquivado") {
    return {
      background: "color-mix(in srgb, var(--markly-text) 3.5%, transparent)",
      borderColor: T.border,
      color: T.faint,
    }
  }
  return {
    background: "rgba(0,71,65,0.14)",
    borderColor: "rgba(0,71,65,0.32)",
    color: T.accent,
  }
}

function portfolioMatchesFilters(item: PortfolioItem, filters: PortfolioFilterState) {
  if (filters.status !== "Todos" && item.status !== filters.status) return false
  if (filters.style !== "Todos" && item.style !== filters.style) return false
  if (filters.source !== "Todos" && item.source !== filters.source) return false
  if (filters.visibility !== "Todos" && item.visibility !== filters.visibility) return false
  if (filters.flags.includes("featured") && !item.featured) return false
  if (filters.flags.includes("published") && item.status !== "Publicado") return false
  if (filters.flags.includes("needsEdit") && item.status !== "Tratando foto" && item.status !== "Em seleção") return false
  if (filters.flags.includes("hasMetrics") && item.metrics.views <= 0) return false
  return true
}

function filterPortfolioItems(items: PortfolioItem[], filters: PortfolioFilterState) {
  return items.filter((item) => portfolioMatchesFilters(item, filters))
}

function portfolioMatchesQuery(item: PortfolioItem, query: string) {
  const normalized = normalizeClientSearch(query.trim())
  if (!normalized) return true
  return [
    item.title,
    item.client,
    item.style,
    item.bodyPlacement,
    item.status,
    item.source,
    item.visibility,
    item.description,
    item.tags.join(" "),
  ].some((value) => normalizeClientSearch(value).includes(normalized))
}

function portfolioSummaryFromList(items: PortfolioItem[]) {
  return {
    total: items.length,
    published: items.filter((item) => item.status === "Publicado").length,
    inReview: items.filter((item) => item.status === "Em seleção" || item.status === "Tratando foto").length,
    featured: items.filter((item) => item.featured).length,
    photos: items.reduce((total, item) => total + item.metrics.photos, 0),
  }
}

function createPortfolioFromDraft(draft: NewPortfolioDraft): PortfolioItem {
  const title = draft.title.trim()
  const style = draft.style || "Autoral"
  const bodyPlacement = draft.bodyPlacement.trim() || "A definir"
  const tags = draft.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  return {
    id: `pf-new-${Date.now()}`,
    title,
    client: draft.client.trim() || "Sem cliente vinculado",
    style,
    bodyPlacement,
    sessionDate: draft.sessionDate.trim() || formatTodayDate(),
    status: draft.status,
    source: draft.source,
    visibility: draft.visibility,
    featured: draft.featured,
    coverTone: "linear-gradient(145deg, color-mix(in srgb, var(--markly-accent) 20%, transparent), color-mix(in srgb, var(--markly-text) 7%, transparent))",
    accent: "#8DCEC0",
    description: draft.description.trim() || "Trabalho salvo na biblioteca do studio.",
    tags: tags.length ? tags : [style.toLowerCase(), bodyPlacement.toLowerCase()],
    files: ["Foto principal mockada"],
    usage: draft.usage,
    notes: draft.notes.trim() || "Sem observações internas ainda.",
    metrics: { photos: 1, views: draft.status === "Publicado" ? 1 : 0, saves: 0 },
    history: ["Trabalho adicionado ao portfólio"],
  }
}

function applyPortfolioAction(item: PortfolioItem, action: string): { item: PortfolioItem; message: string } {
  if (action === "Publicar") {
    return {
      item: { ...item, status: "Publicado", visibility: "Público", history: ["Publicado no portfólio", ...item.history] },
      message: `"${item.title}" publicado.`,
    }
  }
  if (action === "Destacar") {
    return {
      item: { ...item, featured: !item.featured, history: [`${item.featured ? "Removido dos destaques" : "Marcado como destaque"}`, ...item.history] },
      message: item.featured ? `"${item.title}" saiu dos destaques.` : `"${item.title}" virou destaque.`,
    }
  }
  if (action === "Arquivar") {
    return {
      item: { ...item, status: "Arquivado", visibility: "Interno", featured: false, history: ["Arquivado", ...item.history] },
      message: `"${item.title}" arquivado.`,
    }
  }
  return { item, message: `"${action}" ainda é uma ação mockada.` }
}

function StatCard({ item, index }: { item: (typeof overviewMock.stats)[number]; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="rounded-[18px] border p-4 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
      style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[12px]" style={{ color: T.muted }}>{item.label}</span>
        <span className="flex size-8 items-center justify-center rounded-[10px] border" style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border }}>
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
  const [resolved, setResolved] = useState<string[]>([])
  const items = overviewMock.attentionItems.filter((item) => !resolved.includes(item.name))

  return (
    <Panel title="Precisa de atenção" action="Prioridade de hoje">
      {items.length === 0 ? (
        <p className="px-1 text-sm" style={{ color: T.faint }}>Tudo resolvido por aqui. Bom trabalho.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setResolved((current) => [...current, item.name])
                toast(`${item.action}: ${item.name}`)
              }}
              className="group flex flex-col gap-3 rounded-[14px] border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)] sm:flex-row sm:items-center"
              style={{ background: "rgba(6,17,15,0.76)", borderColor: T.border }}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.name}</span>
                <span className="text-[12px]" style={{ color: T.faint }}>{item.description}</span>
              </span>
              <span className="w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ background: "color-mix(in srgb, var(--markly-accent) 5%, transparent)", borderColor: T.border, color: T.muted }}>
                {item.badge}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold" style={{ color: T.accent }}>
                {item.action}
                <ChevronRight size={14} className="transition duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      )}
    </Panel>
  )
}

function scheduleStatusStyle(status: string) {
  if (status.toLowerCase().includes("pendente")) {
    return {
      background: "color-mix(in srgb, var(--markly-accent) 10%, transparent)",
      borderColor: "color-mix(in srgb, var(--markly-accent) 28%, transparent)",
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
            <div key={event.time} className="flex flex-col gap-3 rounded-[14px] border p-3 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)] sm:flex-row sm:items-center" style={{ background: T.bgSec, borderColor: T.border }}>
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-semibold" style={{ background: "color-mix(in srgb, var(--markly-text) 6%, transparent)", color: T.accent }}>
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

const weekdayLabels = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"]
const monthAbbrLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function MonthYearPicker({ viewDate, onSelect }: { viewDate: Date; onSelect: (date: Date) => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"year" | "month">("year")
  const [pickerYear, setPickerYear] = useState(viewDate.getFullYear())

  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(viewDate)
  const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
  const years = Array.from({ length: 12 }, (_, index) => viewDate.getFullYear() - 6 + index)

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setStep("year")
          setPickerYear(viewDate.getFullYear())
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-full border px-5 py-1.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
          style={{ borderColor: T.border, color: T.text, background: T.bgSec }}
        >
          {capitalizedMonthLabel}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-[280px] rounded-[16px] border p-3 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        {step === "year" ? (
          <div>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>
              Escolha o ano
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    setPickerYear(year)
                    setStep("month")
                  }}
                  className="rounded-[10px] border py-2 text-[13px] font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: year === viewDate.getFullYear() ? T.accent : T.border,
                    color: year === viewDate.getFullYear() ? T.accent : T.muted,
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setStep("year")}
              className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5"
              style={{ color: T.faint }}
            >
              <ChevronLeft size={12} /> {pickerYear}
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              {monthAbbrLabels.map((label, index) => {
                const isActive = pickerYear === viewDate.getFullYear() && index === viewDate.getMonth()
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      onSelect(new Date(pickerYear, index, 1))
                      setOpen(false)
                    }}
                    className="rounded-[10px] border py-2 text-[13px] font-semibold transition duration-200 hover:-translate-y-0.5"
                    style={{
                      borderColor: isActive ? T.accent : T.border,
                      color: isActive ? T.accent : T.muted,
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

type CalendarEvent = {
  id: string
  date: string
  time: string
  title: string
  client: string
  status: string
}

function buildCalendarMockEvents(): CalendarEvent[] {
  const today = new Date()
  let sequence = 0
  const at = (offsetDays: number, time: string, title: string, client: string, status: string) => {
    sequence += 1
    return {
      id: `evt-mock-${sequence}`,
      date: toDateValue(addDays(today, offsetDays)),
      time,
      title,
      client,
      status,
    }
  }

  return [
    at(0, "10:00", "Sessão floral P&B", "Júlia Martins", "Sinal pago"),
    at(0, "13:30", "Retoque fine line", "Marina Alves", "Confirmado"),
    at(0, "16:00", "Consulta blackwork", "Rafael Nunes", "Anamnese pendente"),
    at(-8, "16:30", "Sessão realismo ombro", "Lucas Rocha", "Confirmado"),
    at(-5, "14:00", "Flash autoral", "Pedro Santos", "Sinal pago"),
    at(-2, "09:00", "Fechamento floral", "Carla Vieira", "Confirmado"),
    at(2, "11:00", "Sessão old school", "Rafael Mendes", "Confirmado"),
    at(4, "15:30", "Consulta geométrico", "Fernanda Dias", "Anamnese pendente"),
    at(7, "10:30", "Retoque lettering", "Bianca Torres", "Sinal pago"),
    at(10, "09:30", "Consulta dragão oriental", "Caio Lima", "Anamnese pendente"),
  ]
}

function AddSessionPopover({ clients, onAdd }: { clients: ClientItem[]; onAdd: (clientName: string, time: string) => void }) {
  const [open, setOpen] = useState(false)
  const [clientName, setClientName] = useState("")
  const [time, setTime] = useState(timeOptions[0])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          setClientName("")
          setTime(timeOptions[0])
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          aria-label="Marcar cliente neste dia"
          className="flex size-5 items-center justify-center self-end rounded-full border transition duration-200 hover:-translate-y-0.5"
          style={{ borderColor: T.border, color: T.faint }}
        >
          <Plus size={11} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[240px] rounded-[14px] border p-3"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>
          Marcar cliente
        </p>
        <div className="grid gap-2">
          <Select value={clientName} onValueChange={setClientName}>
            <SelectTrigger className="h-9 rounded-[10px] border text-[12px]" style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}>
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border" style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="h-9 rounded-[10px] border text-[12px]" style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border" style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}>
              {timeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            disabled={!clientName}
            onClick={() => {
              onAdd(clientName, time)
              setOpen(false)
            }}
            className="mt-1 rounded-[10px] py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: T.text, color: T.bg }}
          >
            Marcar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CalendarView({
  clients,
  events,
  setEvents,
  onOpenClient,
}: {
  clients: ClientItem[]
  events: CalendarEvent[]
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>
  onOpenClient: (client: ClientItem) => void
}) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const eventsByDate = useMemo(() => groupCalendarEventsByDate(events), [events])
  const days = useMemo(() => buildCalendarDays(viewDate), [viewDate])
  const todayKey = toDateValue(new Date())

  const goToPrevMonth = () => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  const goToNextMonth = () => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))

  const updateEventStatus = (id: string, status: string, message: string) => {
    setEvents((current) => current.map((event) => (event.id === id ? { ...event, status } : event)))
    toast(message)
  }
  const handleConfirm = (event: CalendarEvent) => updateEventStatus(event.id, "Confirmado", `Sessão de ${event.client} confirmada.`)
  const handleRequestDeposit = (event: CalendarEvent) => updateEventStatus(event.id, "Sinal pendente", `Sinal solicitado para ${event.client}.`)
  const handleCancel = (event: CalendarEvent) => {
    setEvents((current) => current.filter((item) => item.id !== event.id))
    toast(`Sessão de ${event.client} cancelada.`)
  }
  const handleViewClient = (clientName: string) => {
    const match = clients.find((client) => client.name.toLowerCase() === clientName.toLowerCase())
    if (!match) {
      toast(`Cliente "${clientName}" não encontrado.`)
      return
    }
    onOpenClient(match)
  }
  const handleAddEvent = (dateKey: string, clientName: string, time: string) => {
    const client = clients.find((item) => item.name === clientName)
    setEvents((current) => [
      ...current,
      {
        id: `evt-${dateKey}-${time}-${Math.random().toString(36).slice(2, 8)}`,
        date: dateKey,
        time,
        title: client?.interest || "Sessão agendada",
        client: clientName,
        status: "Confirmado",
      },
    ])
    toast(`${clientName} marcado(a) para ${time}.`)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between border p-3" style={{ background: T.card, borderColor: T.border }}>
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Mês anterior"
          className="flex size-9 items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5"
          style={{ borderColor: T.border, color: T.muted }}
        >
          <ChevronLeft size={16} />
        </button>
        <MonthYearPicker viewDate={viewDate} onSelect={setViewDate} />
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Próximo mês"
          className="flex size-9 items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5"
          style={{ borderColor: T.border, color: T.muted }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-center text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: T.faint }}>
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(({ date, inCurrentMonth }) => {
          const dateKey = toDateValue(date)
          const dayEvents = eventsByDate[dateKey] ?? []
          const isToday = dateKey === todayKey
          return (
            <div
              key={dateKey}
              className="flex min-h-[112px] flex-col gap-1.5 rounded-[14px] border p-2.5 transition duration-200"
              style={{
                background: inCurrentMonth ? T.bgSec : "transparent",
                borderColor: isToday ? T.accent : T.border,
                opacity: inCurrentMonth ? 1 : 0.4,
              }}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[12px] font-semibold" style={{ color: isToday ? T.accent : T.text }}>
                  {date.getDate()}
                </span>
                {inCurrentMonth && <AddSessionPopover clients={clients} onAdd={(clientName, time) => handleAddEvent(dateKey, clientName, time)} />}
              </div>
              <div className="flex flex-col gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <DropdownMenu key={event.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="w-full truncate rounded-[8px] border px-1.5 py-1 text-left text-[10px] font-medium transition duration-200 hover:-translate-y-0.5"
                        style={scheduleStatusStyle(event.status)}
                      >
                        {event.time} · {event.title}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[220px] rounded-[14px] border p-1.5"
                      style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-[11px]" style={{ color: T.faint }}>
                        {event.client} · {event.status}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
                      <DropdownMenuItem className="cursor-pointer rounded-[10px] text-[12px]" onSelect={() => handleConfirm(event)}>
                        Confirmar sessão
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-[10px] text-[12px]" onSelect={() => handleRequestDeposit(event)}>
                        Solicitar sinal
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-[10px] text-[12px]" onSelect={() => handleViewClient(event.client)}>
                        Ver cliente
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
                      <DropdownMenuItem
                        className="cursor-pointer rounded-[10px] text-[12px]"
                        style={{ color: "#F6B6A8" }}
                        onSelect={() => handleCancel(event)}
                      >
                        Cancelar sessão
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[9px]" style={{ color: T.faint }}>
                    +{dayEvents.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PipelineSummary() {
  return (
    <Panel title="Pipeline de orçamentos" action="Valores estimados">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMock.pipeline.map((stage) => (
          <div
            key={stage.label}
            className="rounded-[14px] border p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
            style={{ background: T.bgSec, borderColor: T.border }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold" style={{ color: T.text }}>{stage.label}</p>
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={{ borderColor: T.border, color: T.faint, background: "color-mix(in srgb, var(--markly-text) 3%, transparent)" }}>
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
            <div key={metric.label} className="rounded-[14px] border p-4 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_18%,transparent)]" style={{ background: T.bgSec, borderColor: T.border }}>
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

function BudgetQueueRow({ item, onOpen }: { item: BudgetItem; onOpen: (item: BudgetItem) => void }) {
  const verticalConfig = useVerticalConfig()
  const cardMeta = [item.style, verticalConfig.placementFieldLabel ? item.bodyPlacement : null, item.size].filter(Boolean).join(" · ")
  const pendingDeposit = budgetHasPendingDeposit(item)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group w-full border-t px-4 py-4 text-left transition-[background-color,border-color] duration-200 first:border-t-0 hover:bg-[color-mix(in_srgb,var(--markly-accent)_5%,transparent)] focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--markly-accent)] md:px-5"
      style={{ borderColor: T.border }}
    >
      <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(120px,0.72fr)_minmax(110px,0.55fr)_minmax(150px,0.78fr)_20px] md:items-center md:gap-5">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</p>
            <span
              className="hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-flex"
              style={{
                borderColor: pendingDeposit ? "color-mix(in srgb, var(--markly-accent) 36%, transparent)" : T.border,
                color: pendingDeposit ? T.accent : T.muted,
                background: pendingDeposit ? "color-mix(in srgb, var(--markly-accent) 8%, transparent)" : "color-mix(in srgb, var(--markly-text) 3%, transparent)",
              }}
            >
              {item.status}
            </span>
          </div>
          <p className="mt-1 truncate text-[12px]" style={{ color: T.muted }}>{item.client}</p>
          <p className="mt-1 truncate text-[11px] md:hidden" style={{ color: T.faint }}>{cardMeta}</p>
        </div>

        <div className="hidden min-w-0 md:block">
          <p className="truncate text-[12px] font-medium" style={{ color: T.muted }}>{cardMeta}</p>
          <p className="mt-1 truncate text-[11px]" style={{ color: T.faint }}>{item.source}</p>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-2 md:block">
          <p className="text-[12px] font-semibold" style={{ color: T.text }}>{item.valueRange}</p>
          {item.deposit && <p className="mt-1 text-[10px]" style={{ color: pendingDeposit ? T.accent : T.faint }}>{item.deposit}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 md:block">
          <p className="truncate text-[12px] font-semibold" style={{ color: T.accent }}>{item.nextAction}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[10px]" style={{ color: T.faint }}>
            <Clock size={11} />
            {item.waitingTime}
          </p>
        </div>

        <ChevronRight size={17} className="hidden transition-transform duration-200 group-hover:translate-x-0.5 md:block" style={{ color: T.faint }} />
      </div>
    </button>
  )
}

function BudgetPriorities({ items, onOpen }: { items: BudgetItem[]; onOpen: (item: BudgetItem) => void }) {
  const priorityIds = ["bgt-001", "bgt-007", "bgt-005"]
  const priorities = priorityIds.map((id) => items.find((item) => item.id === id)).filter((item): item is BudgetItem => Boolean(item))

  return (
    <aside className="border lg:sticky lg:top-24 lg:self-start" style={{ background: T.card, borderColor: T.border }}>
      <div className="flex items-start justify-between gap-4 border-b px-4 py-4" style={{ borderColor: T.border }}>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: T.text }}>Prioridades de hoje</h3>
          <p className="mt-1 text-[11px]" style={{ color: T.faint }}>O que merece resposta primeiro.</p>
        </div>
        <span className="flex size-7 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: T.text, color: T.bg }}>
          {priorities.length}
        </span>
      </div>

      <div>
        {priorities.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item)}
            className="group w-full border-t px-4 py-4 text-left transition-colors duration-200 first:border-t-0 hover:bg-[color-mix(in_srgb,var(--markly-accent)_5%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--markly-accent)]"
            style={{ borderColor: T.border }}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold" style={{ borderColor: T.borderStrong, color: T.accent }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold" style={{ color: T.text }}>{item.client}</span>
                <span className="mt-0.5 block truncate text-[11px]" style={{ color: T.faint }}>{item.title}</span>
                <span className="mt-3 flex items-center justify-between gap-3">
                  <span className="truncate text-[11px] font-semibold" style={{ color: T.accent }}>{item.nextAction}</span>
                  <span className="shrink-0 text-[10px]" style={{ color: T.faint }}>{item.waitingTime}</span>
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t px-4 py-3" style={{ borderColor: T.border, background: "color-mix(in srgb, var(--markly-text) 2%, transparent)" }}>
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span style={{ color: T.faint }}>Sinais aguardando</span>
          <span className="font-semibold" style={{ color: T.text }}>{formatCurrency(budgetMock.summary.pendingDepositsAmount)}</span>
        </div>
      </div>
    </aside>
  )
}

function BudgetBoard({
  columns,
  filters,
  onOpenBudget,
  onNewBudget,
}: {
  columns: BudgetColumn[]
  filters: BudgetFilterState
  onOpenBudget: (item: BudgetItem) => void
  onNewBudget: () => void
}) {
  const filteredColumns = useMemo(() => filterBudgetColumns(columns, filters), [columns, filters])
  const [activeStage, setActiveStage] = useState<"all" | BudgetColumnId>("all")
  const allItems = useMemo(() => allBudgetItems(columns), [columns])
  const filteredItems = useMemo(() => allBudgetItems(filteredColumns), [filteredColumns])
  const activeColumn = activeStage === "all" ? null : filteredColumns.find((column) => column.id === activeStage)
  const activeItems = activeColumn?.items ?? filteredItems
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(initialBudgetFilters)
  const metrics = [
    { label: "Em aberto", value: String(budgetMock.summary.openBudgets), note: "12 aguardam resposta", icon: FileText },
    { label: "Em negociação", value: formatCurrency(budgetMock.summary.negotiationAmount), note: "pipeline atual", icon: TrendingUp },
    { label: "Sinais pendentes", value: formatCurrency(budgetMock.summary.pendingDepositsAmount), note: "4 pagamentos", icon: WalletCards },
    { label: "Tempo de resposta", value: "6h", note: "média do studio", icon: MessageSquare },
  ]
  const stageOptions = [
    { id: "all" as const, title: "Todos", count: filteredItems.length },
    ...filteredColumns.map((column) => ({ id: column.id, title: column.title, count: column.items.length })),
  ]

  if (allItems.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center border px-6 py-12 text-center" style={{ background: T.card, borderColor: T.border }}>
        <FileText size={26} style={{ color: T.accent }} />
        <h3 className="mt-4 text-lg font-semibold" style={{ color: T.text }}>Nenhum orçamento criado ainda.</h3>
        <p className="mt-2 max-w-[460px] text-sm leading-6" style={{ color: T.faint }}>
          Crie seu primeiro orçamento para acompanhar pedidos, sinais e fechamentos.
        </p>
        <button
          type="button"
          onClick={onNewBudget}
          className="mt-5 inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
          style={{ background: T.text, color: T.bg }}
        >
          <Plus size={15} />
          Novo orçamento
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-2 border xl:grid-cols-4" style={{ background: T.card, borderColor: T.border }}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className={cn(
                "min-w-0 px-4 py-4 md:px-5",
                index === 0 && "border-b border-r xl:border-b-0 xl:border-r-0",
                index === 1 && "border-b xl:border-b-0 xl:border-l",
                index === 2 && "border-r xl:border-l xl:border-r-0",
                index === 3 && "xl:border-l",
              )}
              style={{ borderColor: T.border }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[11px] font-medium" style={{ color: T.muted }}>{metric.label}</p>
                <Icon size={14} className="shrink-0" style={{ color: statIconColor(index) }} />
              </div>
              <p className="mt-3 text-xl font-semibold tracking-tight md:text-2xl" style={{ color: T.text }}>{metric.value}</p>
              <p className="mt-1 truncate text-[10px]" style={{ color: T.faint }}>{metric.note}</p>
            </div>
          )
        })}
      </section>

      <section className="border p-2" style={{ background: T.card, borderColor: T.border }}>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-7" role="tablist" aria-label="Etapas do pipeline">
          {stageOptions.map((stage) => {
            const active = activeStage === stage.id
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveStage(stage.id)}
                className="flex min-h-11 items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-left transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--markly-accent)]"
                style={{
                  background: active ? T.text : "transparent",
                  color: active ? T.bg : T.muted,
                }}
              >
                <span className="truncate text-[11px] font-semibold">{stage.title}</span>
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                  style={{ background: active ? "color-mix(in srgb, var(--markly-bg) 16%, transparent)" : "color-mix(in srgb, var(--markly-text) 5%, transparent)" }}
                >
                  {stage.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
        <section className="min-w-0 border" role="tabpanel" style={{ background: T.card, borderColor: T.border }}>
          <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-end sm:justify-between md:px-5" style={{ borderColor: T.border }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: T.text }}>{activeColumn?.title ?? "Fila de orçamentos"}</h3>
              <p className="mt-1 text-[11px]" style={{ color: T.faint }}>
                {activeColumn?.description ?? "Compare pedidos, valores e a próxima ação em uma única lista."}
              </p>
            </div>
            <span className="text-[11px]" style={{ color: T.faint }}>
              {hasFilters ? `${activeItems.length} resultado(s) nesta etapa` : `${activeItems.length} orçamento(s) nesta visão`}
            </span>
          </div>

          <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(120px,0.72fr)_minmax(110px,0.55fr)_minmax(150px,0.78fr)_20px] gap-5 border-b px-5 py-2.5 text-[10px] font-semibold md:grid" style={{ borderColor: T.border, color: T.faint, background: "color-mix(in srgb, var(--markly-text) 2%, transparent)" }}>
            <span>Projeto e cliente</span>
            <span>Detalhes</span>
            <span>Valor</span>
            <span>Próxima ação</span>
            <span />
          </div>

          {activeItems.length ? (
            <div>
              {activeItems.map((item) => <BudgetQueueRow key={item.id} item={item} onOpen={onOpenBudget} />)}
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
              <FileText size={22} style={{ color: T.accent }} />
              <h4 className="mt-3 text-sm font-semibold" style={{ color: T.text }}>Nenhum orçamento nesta etapa.</h4>
              <p className="mt-1 text-[12px]" style={{ color: T.faint }}>Altere a etapa ou limpe os filtros para ver outros pedidos.</p>
            </div>
          )}
        </section>

        <BudgetPriorities items={allItems} onOpen={onOpenBudget} />
      </div>
    </div>
  )
}

function BudgetDetailPanel({
  budget,
  onOpenChange,
  onAction,
}: {
  budget: BudgetItem | null
  onOpenChange: (open: boolean) => void
  onAction: (action: string) => void
}) {
  const verticalConfig = useVerticalConfig()

  if (!budget) return null

  const summaryRows = [
    ["Cliente", budget.client],
    ["Status", budget.status],
    ["Valor estimado", budget.valueRange],
    ["Sinal", budget.deposit ?? "Não definido"],
    ["Origem", budget.source],
    ["Criado em", budget.createdAt],
    ["Tempo na etapa", budget.waitingTime],
  ]
  const tattooRows = [
    [verticalConfig.styleFieldLabel, budget.style],
    ...(verticalConfig.placementFieldLabel ? [[verticalConfig.placementFieldLabel, budget.bodyPlacement]] : []),
    ["Tamanho aproximado", budget.size],
    ["Número de sessões", budget.sessions],
  ]

  return (
    <Sheet open={Boolean(budget)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l p-0 sm:max-w-[520px]"
        style={{ background: "rgba(5,14,12,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <SheetHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <span className="w-fit border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ borderColor: T.border, color: T.accent, background: "color-mix(in srgb, var(--markly-accent) 6%, transparent)" }}>
            {budget.status}
          </span>
          <SheetTitle className="font-display text-2xl" style={{ color: T.text }}>{budget.title}</SheetTitle>
          <SheetDescription style={{ color: T.muted }}>
            {budget.client} · {budget.status}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-5 px-6 py-5">
          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Resumo</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>{verticalConfig.detailsSectionLabel}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {tattooRows.map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 border px-3 py-3 text-sm leading-6" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: T.muted }}>
              {budget.description}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Referências</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Referência 01", "Referência 02"].map((label) => (
                <div key={label} className="flex h-28 flex-col items-center justify-center border text-center" style={{ background: "linear-gradient(145deg, color-mix(in srgb, var(--markly-accent) 8%, transparent), rgba(0,71,65,0.12))", borderColor: T.border }}>
                  <ImageIcon size={18} style={{ color: T.accent }} />
                  <span className="mt-2 text-[12px] font-semibold" style={{ color: T.muted }}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Observações internas</h3>
            <p className="border px-3 py-3 text-sm leading-6" style={{ background: T.bgSec, borderColor: T.border, color: T.muted }}>
              {budget.internalNotes}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Histórico</h3>
            <div className="grid gap-2">
              {budget.history.map((event, index) => (
                <div key={`${event}-${index}`} className="flex items-center gap-3 text-sm">
                  <span className="size-2 shrink-0" style={{ background: T.accent }} />
                  <span style={{ color: T.muted }}>{event}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Ações rápidas</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Enviar proposta", "Marcar como respondido", "Marcar sinal pago", "Agendar sessão", "Mover para perdido", "Editar orçamento"].map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onAction(action)}
                  className="rounded-[12px] border px-3 py-2.5 text-left text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: action === "Mover para perdido" ? "#F6B6A8" : T.text }}
                >
                  {action}
                </button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function BudgetFilterMenu({
  value,
  onChange,
}: {
  value: BudgetFilterState
  onChange: (value: BudgetFilterState) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<BudgetFilterState>(value)
  const activeCount = [value.status, value.style, value.source, value.period, value.valueRange].filter((item) => item !== "Todos").length + value.flags.length

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const toggleFlag = (flag: string) => {
    setDraft((current) => ({
      ...current,
      flags: current.flags.includes(flag) ? current.flags.filter((item) => item !== flag) : [...current.flags, flag],
    }))
  }

  const applyQuickFilter = (id: string) => {
    setDraft((current) => {
      if (id === "instagram") return { ...current, source: "Instagram" }
      if (id === "whatsapp") return { ...current, source: "WhatsApp" }
      if (id === "highValue") return { ...current, valueRange: "Acima de R$ 1.000" }
      if (id === "week") return { ...current, period: "Essa semana" }
      const flag = id === "pendingDeposit" ? "pendingDeposit" : "unanswered"
      return { ...current, flags: current.flags.includes(flag) ? current.flags : [...current.flags, flag] }
    })
  }

  const clear = () => {
    setDraft(initialBudgetFilters)
    onChange(initialBudgetFilters)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
          style={{ background: activeCount ? "color-mix(in srgb, var(--markly-accent) 9%, transparent)" : T.card, borderColor: activeCount ? "color-mix(in srgb, var(--markly-accent) 30%, transparent)" : T.border, color: activeCount ? T.text : T.muted }}
        >
          <Calendar size={15} />
          Filtro
          {activeCount > 0 && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: T.accent, color: T.bg }}>
              {activeCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[380px] rounded-[18px] border p-3 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-1 pb-2 pt-1">
          <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Filtrar orçamentos</span>
          <span className="mt-1 block text-[12px]" style={{ color: T.muted }}>Refine por status, estilo, origem e prioridade.</span>
        </DropdownMenuLabel>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <FinanceSelectField label="Status" value={draft.status} options={budgetStatusOptions} onChange={(status) => setDraft((current) => ({ ...current, status }))} />
            <FinanceSelectField label={verticalConfig.styleFieldLabel} value={draft.style} options={["Todos", ...verticalConfig.styleOptions]} onChange={(style) => setDraft((current) => ({ ...current, style }))} />
            <FinanceSelectField label="Origem" value={draft.source} options={budgetSources} onChange={(source) => setDraft((current) => ({ ...current, source }))} />
            <FinanceSelectField label="Período" value={draft.period} options={budgetPeriods} onChange={(period) => setDraft((current) => ({ ...current, period }))} />
            <FinanceSelectField label="Valor" value={draft.valueRange} options={budgetValueRanges} onChange={(valueRange) => setDraft((current) => ({ ...current, valueRange }))} />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Marcadores</p>
            <div className="flex flex-wrap gap-2">
              {budgetFilterFlags.map((flag) => {
                const active = draft.flags.includes(flag.id)
                return (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => toggleFlag(flag.id)}
                    aria-pressed={active}
                    className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition duration-200 hover:-translate-y-0.5"
                    style={{ background: active ? T.text : "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: active ? T.text : T.border, color: active ? T.bg : T.muted }}
                  >
                    {flag.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Filtros rápidos</p>
            <div className="flex flex-wrap gap-2">
              {[
                ["unanswered", "Sem resposta há mais de 2 dias"],
                ["pendingDeposit", "Com sinal pendente"],
                ["highValue", "Valor acima de R$ 1.000"],
                ["week", "Criados essa semana"],
                ["instagram", "Vindos do Instagram"],
                ["whatsapp", "Vindos do WhatsApp"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyQuickFilter(id)}
                  className="border px-2.5 py-1.5 text-[11px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: "color-mix(in srgb, var(--markly-text) 2%, transparent)", borderColor: T.border, color: T.muted }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2 bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        <div className="flex justify-end gap-2 px-1">
          <button type="button" onClick={clear} className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(draft)
              setOpen(false)
            }}
            className="rounded-[10px] px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
            style={{ background: T.text, color: T.bg }}
          >
            Aplicar filtros
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function BudgetSearchModal({
  open,
  budgets,
  onOpenChange,
  onOpenBudget,
}: {
  open: boolean
  budgets: BudgetItem[]
  onOpenChange: (open: boolean) => void
  onOpenBudget: (budget: BudgetItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [query, setQuery] = useState("")
  const results = useMemo(() => budgets.filter((item) => budgetMatchesQuery(item, query)), [budgets, query])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[22px] border p-0 sm:max-w-[620px]"
        style={{ background: T.card, borderColor: T.borderStrong, color: T.text }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar orçamentos</DialogTitle>
          <DialogDescription>Busca mockada da tela de orçamentos.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: T.border }}>
          <Search size={16} style={{ color: T.faint }} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar por cliente, ${verticalConfig.styleFieldLabel.toLowerCase()} ou orçamento...`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 35%, transparent)]"
            style={{ color: T.text }}
          />
        </div>
        <div className="max-h-[420px] min-h-[320px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center px-3 text-center text-sm" style={{ color: T.faint }}>
              Nenhum orçamento encontrado.
            </div>
          ) : (
            <div className="grid gap-1">
              {results.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onOpenBudget(item)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_6%,transparent)]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.02 }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</span>
                    <span className="mt-0.5 block truncate text-[12px]" style={{ color: T.faint }}>
                      {item.client} · {item.status} · {item.valueRange} · {item.source}
                    </span>
                  </span>
                  <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.accent }}>
                    Abrir
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewBudgetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_color-mix(in srgb, var(--markly-text) 16%, transparent)] active:translate-y-0"
      style={{ background: T.text, borderColor: "color-mix(in srgb, var(--markly-text) 26%, transparent)", color: T.bg }}
    >
      <Plus size={15} />
      Novo
    </button>
  )
}

function NewBudgetModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (budget: BudgetItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [draft, setDraft] = useState<NewBudgetDraft>(initialBudgetDraft)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) {
      setDraft(initialBudgetDraft)
      setError("")
    }
  }, [open])

  const update = (key: keyof NewBudgetDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const save = () => {
    const needsPlacement = Boolean(verticalConfig.placementFieldLabel)
    if (!draft.client || !draft.title.trim() || !draft.style || (needsPlacement && !draft.bodyPlacement.trim()) || !formatDraftValueRange(draft)) {
      const fields = ["cliente", "projeto", verticalConfig.styleFieldLabel.toLowerCase()]
      if (needsPlacement) fields.push(verticalConfig.placementFieldLabel!.toLowerCase())
      setError(`Preencha ${fields.join(", ")} e pelo menos um valor.`)
      return
    }
    const budget = createBudgetFromDraft(draft)
    onSave(budget)
    onOpenChange(false)
    toast(`Orçamento "${budget.title}" criado.`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[24px] border p-0 sm:max-w-[860px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[color-mix(in srgb, var(--markly-text) 58%, transparent)] [&>button:hover]:text-[color-mix(in_srgb,var(--markly-text)_90%,transparent)]"
        style={{ background: T.card, borderColor: T.borderStrong, color: T.text, boxShadow: "0 30px 100px rgba(0,0,0,0.62)" }}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="inline-flex w-fit items-center gap-2 border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
            Pipeline comercial
          </div>
          <DialogTitle className="font-display text-2xl" style={{ color: T.text }}>
            Novo orçamento
          </DialogTitle>
          <DialogDescription className="max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
            Cadastre um pedido mockado para acompanhar proposta, sinal e fechamento.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FinanceSelectField label="Cliente" value={draft.client || "Selecionar ou criar cliente"} options={["Selecionar ou criar cliente", ...budgetClients]} onChange={(value) => update("client", value === "Selecionar ou criar cliente" ? "" : value)} />
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Nome do projeto</span>
              <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder={verticalConfig.projectTitlePlaceholder} className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <FinanceSelectField label={verticalConfig.styleFieldLabel} value={draft.style || "Selecionar"} options={["Selecionar", ...verticalConfig.styleOptions]} onChange={(value) => update("style", value === "Selecionar" ? "" : value)} />
            {verticalConfig.placementFieldLabel && (
              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>{verticalConfig.placementFieldLabel}</span>
                <input value={draft.bodyPlacement} onChange={(event) => update("bodyPlacement", event.target.value)} placeholder={verticalConfig.placementFieldPlaceholder} className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
              </label>
            )}
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Tamanho aproximado</span>
              <input value={draft.size} onChange={(event) => update("size", event.target.value)} placeholder="Ex: 12cm, fechamento, 2 sessões..." className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <FinanceSelectField label="Origem do pedido" value={draft.source} options={budgetSources.filter((item) => item !== "Todos")} onChange={(value) => update("source", value)} />
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Valor mínimo</span>
              <input value={draft.minValue} onChange={(event) => update("minValue", event.target.value)} placeholder="R$ 0,00" className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Valor máximo</span>
              <input value={draft.maxValue} onChange={(event) => update("maxValue", event.target.value)} placeholder="R$ 0,00" className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Valor do sinal</span>
              <input value={draft.depositValue} onChange={(event) => update("depositValue", event.target.value)} placeholder="R$ 0,00" className="h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]" style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <FinanceSelectField label="Status inicial" value={draft.status} options={budgetInitialStatuses} onChange={(value) => update("status", value as NewBudgetDraft["status"])} />
          </div>

          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Descrição da ideia</span>
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Descreva a ideia do cliente, referências, observações e detalhes importantes."
              className="min-h-24 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
              style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
            />
          </label>

          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Observações internas</span>
            <textarea
              value={draft.internalNotes}
              onChange={(event) => update("internalNotes", event.target.value)}
              placeholder="Notas internas opcionais para o studio."
              className="min-h-20 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
              style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
            />
          </label>

          <div className="mt-4 border p-4" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: T.text }}>Referências/imagens</p>
                <p className="mt-1 text-[12px]" style={{ color: T.faint }}>Upload mockado para validar a experiência.</p>
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                <Upload size={14} />
                Adicionar referências
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-5 border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-end" style={{ borderColor: T.border, background: "rgba(2,8,6,0.58)" }}>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Cancelar
          </button>
          <button type="button" onClick={save} className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]" style={{ background: T.text, color: T.bg }}>
            Criar orçamento
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ClientBadge({ children, style }: { children: React.ReactNode; style: CSSProperties }) {
  return (
    <span className="inline-flex w-fit items-center border px-2.5 py-1 text-[10px] font-bold leading-none" style={style}>
      {children}
    </span>
  )
}

function ClientSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  index,
}: {
  title: string
  value: string
  description: string
  icon: typeof Users
  index: number
}) {
  return (
    <motion.div
      className="border p-4 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
      style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[12px]" style={{ color: T.muted }}>{title}</p>
        <span className="flex size-8 items-center justify-center border" style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: T.text }}>{value}</p>
      <p className="mt-1 text-[11px]" style={{ color: T.faint }}>{description}</p>
    </motion.div>
  )
}

function ClientsView({
  clients,
  filters,
  onOpenClient,
  onNewClient,
}: {
  clients: ClientItem[]
  filters: ClientFilterState
  onOpenClient: (client: ClientItem) => void
  onNewClient: () => void
}) {
  const verticalConfig = useVerticalConfig()
  const filteredClients = useMemo(() => filterClients(clients, filters), [clients, filters])
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(initialClientFilters)
  const summary = clientSummaryFromList(clients)
  const tableGridCols = verticalConfig.showAnamnesis
    ? "grid-cols-[1.15fr_1fr_0.9fr_0.7fr_1fr_0.65fr_0.72fr]"
    : "grid-cols-[1.2fr_1.05fr_0.95fr_0.75fr_1.05fr_0.7fr]"
  const summaryCards = [
    { title: "Clientes ativos", value: String(summary.activeClients), description: `${summary.newThisMonth} novos este mês`, icon: Users },
    { title: "Com orçamento", value: String(summary.withBudget), description: `${summary.unansweredBudgets} aguardando resposta`, icon: FileText },
    { title: "Com sessão marcada", value: String(summary.withSession), description: `${summary.todaySessions} sessões hoje`, icon: Calendar },
    { title: "Sem retorno", value: String(summary.withoutReturn), description: "follow-up recomendado", icon: MessageSquare },
  ]

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => <ClientSummaryCard key={card.title} {...card} index={index} />)}
      </div>

      <div className="border p-4" style={{ background: T.card, borderColor: T.border }}>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: T.text }}>Central de clientes</h3>
            <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
              Contatos, interesses, orçamentos e sessões{verticalConfig.showAnamnesis ? ` e ${verticalConfig.anamnesisSidebarLabel.toLowerCase()}` : ""} no mesmo lugar.
            </p>
          </div>
          <span className="text-[11px]" style={{ color: T.faint }}>
            {hasFilters ? `${filteredClients.length} resultado(s) com filtros` : `${clients.length} clientes em destaque`}
          </span>
        </div>

        {filteredClients.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center border px-6 py-12 text-center" style={{ background: "color-mix(in srgb, var(--markly-text) 1.8%, transparent)", borderColor: T.border }}>
            <Users size={26} style={{ color: T.accent }} />
            <h3 className="mt-4 text-lg font-semibold" style={{ color: T.text }}>Nenhum cliente cadastrado ainda.</h3>
            <p className="mt-2 max-w-[460px] text-sm leading-6" style={{ color: T.faint }}>
              Crie um cliente ou limpe os filtros para voltar a visualizar a base mockada do studio.
            </p>
            <button
              type="button"
              onClick={onNewClient}
              className="mt-5 inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
              style={{ background: T.text, color: T.bg }}
            >
              <Plus size={15} />
              Novo cliente
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden border lg:block" style={{ borderColor: T.border }}>
              <div className={cn("grid gap-3 border-b px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em]", tableGridCols)} style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: T.faint }}>
                <span>Cliente</span>
                <span>Interesse</span>
                <span>Status</span>
                <span>Último contato</span>
                <span>Próxima ação</span>
                <span className="text-right">Valor</span>
                {verticalConfig.showAnamnesis && <span>{verticalConfig.anamnesisSidebarLabel}</span>}
              </div>
              <div className="grid">
                {filteredClients.map((client, index) => (
                  <motion.button
                    key={client.id}
                    type="button"
                    onClick={() => onOpenClient(client)}
                    className={cn("group grid items-center gap-3 border-b px-4 py-3 text-left transition duration-200 last:border-b-0 hover:bg-[color-mix(in_srgb,var(--markly-text)_4.5%,transparent)]", tableGridCols)}
                    style={{ background: index % 2 === 0 ? "color-mix(in srgb, var(--markly-text) 1.2%, transparent)" : "rgba(2,8,6,0.24)", borderColor: T.border }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.025 }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
                      <span className="mt-0.5 block truncate text-[11px]" style={{ color: T.faint }}>{client.primaryContact}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-semibold" style={{ color: T.muted }}>{client.interest}</span>
                      <span className="mt-0.5 block truncate text-[11px]" style={{ color: T.faint }}>{client.source}</span>
                    </span>
                    <ClientBadge style={clientStatusStyle(client.status)}>{client.status}</ClientBadge>
                    <span className="text-[12px] font-semibold" style={{ color: T.muted }}>{client.lastContact}</span>
                    <span className="inline-flex min-w-0 items-center gap-1 text-[12px] font-semibold" style={{ color: T.accent }}>
                      <span className="truncate">{client.nextAction}</span>
                      <ChevronRight size={13} className="shrink-0 transition duration-200 group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-right text-sm font-semibold" style={{ color: T.text }}>{client.value}</span>
                    {verticalConfig.showAnamnesis && <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>{client.anamnesis}</ClientBadge>}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:hidden">
              {filteredClients.map((client, index) => (
                <motion.button
                  key={client.id}
                  type="button"
                  onClick={() => onOpenClient(client)}
                  className="group border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: T.bgSec, borderColor: T.border }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.025 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
                      <span className="mt-0.5 block truncate text-[12px]" style={{ color: T.faint }}>{client.primaryContact}</span>
                    </span>
                    <span className="text-sm font-semibold" style={{ color: T.text }}>{client.value}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ClientBadge style={clientStatusStyle(client.status)}>{client.status}</ClientBadge>
                    {verticalConfig.showAnamnesis && (
                      <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>{verticalConfig.anamnesisSidebarLabel}: {client.anamnesis}</ClientBadge>
                    )}
                  </div>
                  <div className="mt-3 grid gap-1 text-[12px]" style={{ color: T.muted }}>
                    <span>{client.interest}</span>
                    <span>Último contato: {client.lastContact}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: T.accent }}>
                    {client.nextAction}
                    <ChevronRight size={13} className="transition duration-200 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ClientFilterMenu({
  value,
  onChange,
}: {
  value: ClientFilterState
  onChange: (value: ClientFilterState) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ClientFilterState>(value)
  const activeCount = [value.status, value.style, value.source, value.lastContact].filter((item) => item !== "Todos").length + value.flags.length
  const visibleFilterFlags = clientFilterFlags.filter((flag) => flag.id !== "pendingAnamnesis" || verticalConfig.showAnamnesis)
  const quickFilters = [
    ["unanswered3", "Sem resposta há mais de 3 dias"],
    ["pendingDeposit", "Com sinal pendente"],
    ["sessionWeek", "Com sessão essa semana"],
    ...(verticalConfig.showAnamnesis ? [["pendingAnamnesis", `${verticalConfig.anamnesisSidebarLabel} pendente`]] : []),
    ["highValue", "Clientes de alto valor"],
    ["recurring", "Clientes recorrentes"],
  ]

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const toggleFlag = (flag: string) => {
    setDraft((current) => ({
      ...current,
      flags: current.flags.includes(flag) ? current.flags.filter((item) => item !== flag) : [...current.flags, flag],
    }))
  }

  const applyQuickFilter = (id: string) => {
    setDraft((current) => {
      if (id === "unanswered3") return { ...current, lastContact: "3 dias ou mais", flags: current.flags.includes("unanswered3") ? current.flags : [...current.flags, "unanswered3"] }
      if (id === "pendingDeposit") return { ...current, status: "Sinal pendente", flags: current.flags.includes("pendingDeposit") ? current.flags : [...current.flags, "pendingDeposit"] }
      if (id === "sessionWeek") return { ...current, flags: current.flags.includes("sessionWeek") ? current.flags : [...current.flags, "sessionWeek"] }
      if (id === "pendingAnamnesis") return { ...current, flags: current.flags.includes("pendingAnamnesis") ? current.flags : [...current.flags, "pendingAnamnesis"] }
      if (id === "highValue") return { ...current, flags: current.flags.includes("highValue") ? current.flags : [...current.flags, "highValue"] }
      return { ...current, status: "Cliente recorrente", flags: current.flags.includes("recurring") ? current.flags : [...current.flags, "recurring"] }
    })
  }

  const clear = () => {
    setDraft(initialClientFilters)
    onChange(initialClientFilters)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
          style={{ background: activeCount ? "color-mix(in srgb, var(--markly-accent) 9%, transparent)" : "rgba(2,8,6,0.34)", borderColor: activeCount ? "color-mix(in srgb, var(--markly-accent) 30%, transparent)" : T.border, color: activeCount ? T.text : T.muted }}
        >
          <Calendar size={15} />
          Filtro
          {activeCount > 0 && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: T.accent, color: T.bg }}>
              {activeCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[420px] rounded-[18px] border p-3 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-1 pb-2 pt-1">
          <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Filtrar clientes</span>
          <span className="mt-1 block text-[12px]" style={{ color: T.muted }}>Refine a base por status, interesse, origem e prioridade.</span>
        </DropdownMenuLabel>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <FinanceSelectField label="Status" value={draft.status} options={clientStatusOptions} onChange={(status) => setDraft((current) => ({ ...current, status }))} />
            <FinanceSelectField label={verticalConfig.styleFieldLabel} value={draft.style} options={["Todos", ...verticalConfig.styleOptions]} onChange={(style) => setDraft((current) => ({ ...current, style }))} />
            <FinanceSelectField label="Origem" value={draft.source} options={clientSourceOptions} onChange={(source) => setDraft((current) => ({ ...current, source }))} />
            <FinanceSelectField label="Último contato" value={draft.lastContact} options={clientLastContactOptions} onChange={(lastContact) => setDraft((current) => ({ ...current, lastContact }))} />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Marcadores</p>
            <div className="flex flex-wrap gap-2">
              {visibleFilterFlags.map((flag) => {
                const active = draft.flags.includes(flag.id)
                return (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => toggleFlag(flag.id)}
                    aria-pressed={active}
                    className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition duration-200 hover:-translate-y-0.5"
                    style={{ background: active ? T.text : "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: active ? T.text : T.border, color: active ? T.bg : T.muted }}
                  >
                    {flag.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Filtros rápidos</p>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => applyQuickFilter(id)}
                  className="border px-2.5 py-1.5 text-[11px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: "color-mix(in srgb, var(--markly-text) 2%, transparent)", borderColor: T.border, color: T.muted }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2 bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        <div className="flex justify-end gap-2 px-1">
          <button type="button" onClick={clear} className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(draft)
              setOpen(false)
            }}
            className="rounded-[10px] px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
            style={{ background: T.text, color: T.bg }}
          >
            Aplicar filtros
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ClientSearchModal({
  open,
  clients,
  onOpenChange,
  onOpenClient,
}: {
  open: boolean
  clients: ClientItem[]
  onOpenChange: (open: boolean) => void
  onOpenClient: (client: ClientItem) => void
}) {
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
    }, query.trim() ? 360 : 180)

    return () => window.clearTimeout(timer)
  }, [open, query])

  const results = useMemo(() => clients.filter((client) => clientMatchesQuery(client, resolvedQuery)), [clients, resolvedQuery])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[22px] border p-0 sm:max-w-[620px]"
        style={{ background: "rgba(6,17,15,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar clientes</DialogTitle>
          <DialogDescription>Busca mockada da central de clientes.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: T.border }}>
          <Search size={16} style={{ color: T.faint }} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente, estilo ou contato..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 35%, transparent)]"
            style={{ color: T.text }}
          />
        </div>
        <div className="max-h-[420px] min-h-[320px] overflow-y-auto p-2">
          <AnimatePresence mode="wait" initial={false}>
            {isSearching ? (
              <motion.div
                key="client-search-loading"
                className="grid gap-2 px-1 py-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
              >
                {[0, 1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    className="flex items-start gap-3 border px-3 py-3"
                    style={{ background: T.bgSec, borderColor: "color-mix(in srgb, var(--markly-text) 6%, transparent)" }}
                    animate={{ opacity: [0.42, 0.85, 0.42] }}
                    transition={{ duration: 1.05, repeat: Infinity, delay: item * 0.08 }}
                  >
                    <span className="h-5 w-20" style={{ background: "color-mix(in srgb, var(--markly-text) 10%, transparent)" }} />
                    <span className="min-w-0 flex-1">
                      <span className="block h-3 w-2/5" style={{ background: "color-mix(in srgb, var(--markly-text) 12%, transparent)" }} />
                      <span className="mt-2 block h-2.5 w-3/5" style={{ background: "color-mix(in srgb, var(--markly-text) 7%, transparent)" }} />
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : results.length === 0 ? (
              <motion.div
                key="client-search-empty"
                className="flex min-h-[300px] items-center justify-center px-3 text-center text-sm"
                style={{ color: T.faint }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
              >
                Nenhum cliente encontrado.
              </motion.div>
            ) : (
              <motion.div
                key="client-search-results"
                className="grid gap-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
              >
                {results.map((client, index) => (
                  <motion.button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      onOpenClient(client)
                      onOpenChange(false)
                    }}
                    className="flex w-full items-start gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_6%,transparent)]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, delay: index * 0.025 }}
                  >
                    <ClientBadge style={clientStatusStyle(client.status)}>{client.status}</ClientBadge>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
                      <span className="mt-0.5 block truncate text-[12px]" style={{ color: T.faint }}>
                        {client.interest} · {client.primaryContact} · {client.value}
                      </span>
                    </span>
                    <ChevronRight size={14} className="mt-1 shrink-0" style={{ color: T.faint }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewClientButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_color-mix(in srgb, var(--markly-text) 16%, transparent)] active:translate-y-0"
      style={{ background: T.text, borderColor: "color-mix(in srgb, var(--markly-text) 26%, transparent)", color: T.bg }}
    >
      <Plus size={15} />
      Novo
    </button>
  )
}

function NewClientModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (client: ClientItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [draft, setDraft] = useState<NewClientDraft>(initialClientDraft)
  const [error, setError] = useState("")
  const fieldClass = "h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
  const textAreaClass = "min-h-24 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"

  useEffect(() => {
    if (!open) {
      setDraft(initialClientDraft)
      setError("")
    }
  }, [open])

  const update = (key: keyof NewClientDraft, value: string | boolean) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const save = () => {
    if (!draft.name.trim() || (!draft.whatsapp.trim() && !draft.instagram.trim()) || !draft.source) {
      setError("Preencha nome, WhatsApp ou Instagram, e a origem do cliente.")
      return
    }
    const client = createClientFromDraft(draft)
    onSave(client)
    onOpenChange(false)
    toast(`Cliente "${client.name}" cadastrado.`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[24px] border p-0 sm:max-w-[860px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[color-mix(in srgb, var(--markly-text) 58%, transparent)] [&>button:hover]:text-[#F0EDE4]"
        style={{ background: "rgba(5,14,12,0.98)", borderColor: T.borderStrong, color: T.text, boxShadow: "0 30px 100px rgba(0,0,0,0.62)" }}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="inline-flex w-fit items-center gap-2 border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
            CRM do studio
          </div>
          <DialogTitle className="font-display text-2xl" style={{ color: T.text }}>
            Novo cliente
          </DialogTitle>
          <DialogDescription className="max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
            Cadastre contato, origem, interesse e primeiras observações sem sair da central.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Nome completo</span>
              <input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex: Bruno Souza" className={fieldClass} style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>WhatsApp/telefone</span>
              <input value={draft.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="+55 21 99999-0000" className={fieldClass} style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Instagram</span>
              <input value={draft.instagram} onChange={(event) => update("instagram", event.target.value)} placeholder="@cliente" className={fieldClass} style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>E-mail</span>
              <input value={draft.email} onChange={(event) => update("email", event.target.value)} placeholder="cliente@email.com" className={fieldClass} style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <FinanceSelectField label="Origem do cliente" value={draft.source || "Selecionar origem"} options={["Selecionar origem", ...clientSourceOptions.filter((item) => item !== "Todos")]} onChange={(value) => update("source", value === "Selecionar origem" ? "" : value)} />
            <FinanceSelectField label={`${verticalConfig.styleFieldLabel} de interesse`} value={draft.style || "Selecionar"} options={["Selecionar", ...verticalConfig.styleOptions]} onChange={(value) => update("style", value === "Selecionar" ? "" : value)} />
            <FinanceSelectField label="Status inicial" value={draft.status} options={clientStatusOptions.filter((item) => item !== "Todos")} onChange={(value) => update("status", value as ClientStatus)} />
            <FinanceSelectField label="Preferência de contato" value={draft.contactPreference} options={clientContactPreferences} onChange={(value) => update("contactPreference", value)} />
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Cidade</span>
              <input value={draft.city} onChange={(event) => update("city", event.target.value)} placeholder="Opcional" className={fieldClass} style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }} />
            </label>
            <button
              type="button"
              onClick={() => update("acceptsReminders", !draft.acceptsReminders)}
              className="flex h-11 items-center justify-between gap-3 rounded-[12px] border px-3.5 text-left text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
              style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
            >
              <span>Aceita lembretes</span>
              <span className="flex size-5 items-center justify-center border" style={{ background: draft.acceptsReminders ? T.accent : "transparent", borderColor: draft.acceptsReminders ? T.accent : T.border, color: draft.acceptsReminders ? T.bg : T.faint }}>
                {draft.acceptsReminders && <CheckCircle2 size={14} />}
              </span>
            </button>
          </div>

          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Interesse/ideia inicial</span>
            <textarea
              value={draft.idea}
              onChange={(event) => update("idea", event.target.value)}
              placeholder="Ex: Fine line na costela, referência floral, tamanho pequeno..."
              className={textAreaClass}
               style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
            />
          </label>

          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Observações internas</span>
            <textarea
              value={draft.internalNotes}
              onChange={(event) => update("internalNotes", event.target.value)}
              placeholder="Notas internas opcionais para o studio."
              className="min-h-20 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
               style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
            />
          </label>

          {error && (
            <div className="mt-5 border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-end" style={{ borderColor: T.border, background: "rgba(2,8,6,0.58)" }}>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Cancelar
          </button>
          <button type="button" onClick={save} className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]" style={{ background: T.text, color: T.bg }}>
            Salvar cliente
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ClientDetailPanel({
  client,
  onOpenChange,
  onAction,
}: {
  client: ClientItem | null
  onOpenChange: (open: boolean) => void
  onAction: (action: string) => void
}) {
  const verticalConfig = useVerticalConfig()

  if (!client) return null

  const summaryRows = [
    ["Status", client.status],
    ["Interesse", client.interest],
    ["Último contato", client.lastContact],
    ["Próxima ação", client.nextAction],
    ["Origem", client.source],
    ["Valor", client.value],
    ["Cliente desde", client.clientSince],
  ]
  const contactRows = [
    ["WhatsApp", client.whatsapp || "Não informado"],
    ["Instagram", client.instagram || "Não informado"],
    ["E-mail", client.email || "Não informado"],
    ["Preferência", client.contactPreference],
    ["Cidade", client.city],
    ["Lembretes", client.acceptsReminders ? "Ativos" : "Desativados"],
  ]
  const actions = [
    "Criar orçamento",
    "Agendar sessão",
    ...(verticalConfig.showAnamnesis ? ["Enviar anamnese"] : []),
    "Registrar pagamento",
    "Adicionar observação",
    "Editar cliente",
  ]

  return (
    <Sheet open={Boolean(client)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l p-0 sm:max-w-[560px]"
        style={{ background: "rgba(5,14,12,0.98)", borderColor: T.borderStrong, color: T.text }}
      >
        <SheetHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="flex flex-wrap items-center gap-2">
            <ClientBadge style={clientStatusStyle(client.status)}>{client.status}</ClientBadge>
            {verticalConfig.showAnamnesis && (
              <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>{verticalConfig.anamnesisSidebarLabel}: {client.anamnesis}</ClientBadge>
            )}
          </div>
          <SheetTitle className="font-display text-2xl" style={{ color: T.text }}>{client.name}</SheetTitle>
          <SheetDescription style={{ color: T.muted }}>
            {client.primaryContact}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-5 px-6 py-5">
          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Resumo</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Contatos</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {contactRows.map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 truncate text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Orçamentos</h3>
            <div className="grid gap-2">
              {client.budgets.length ? client.budgets.map((budget) => (
                <button
                  key={`${budget.title}-${budget.status}`}
                  type="button"
                  onClick={() => toast(`${budget.title}: ${budget.action}`)}
                  className="group flex items-center justify-between gap-3 border px-3 py-3 text-left transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: T.bgSec, borderColor: T.border }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{budget.title}</span>
                    <span className="mt-0.5 block text-[12px]" style={{ color: T.faint }}>{budget.status} · {budget.action}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold" style={{ color: T.accent }}>{budget.value}</span>
                </button>
              )) : (
                <div className="border px-3 py-5 text-center text-[12px]" style={{ background: "color-mix(in srgb, var(--markly-text) 1.8%, transparent)", borderColor: T.border, color: T.faint }}>
                  Nenhum orçamento vinculado ainda.
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Sessões</h3>
            <div className="grid gap-2">
              {client.sessions.length ? client.sessions.map((session) => (
                <div key={`${session.title}-${session.date}`} className="flex items-center justify-between gap-3 border px-3 py-3" style={{ background: T.bgSec, borderColor: T.border }}>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{session.title}</span>
                    <span className="mt-0.5 block text-[12px]" style={{ color: T.faint }}>{session.date}</span>
                  </span>
                  <ClientBadge style={clientStatusStyle("Sessão marcada")}>{session.status}</ClientBadge>
                </div>
              )) : (
                <div className="border px-3 py-5 text-center text-[12px]" style={{ background: "color-mix(in srgb, var(--markly-text) 1.8%, transparent)", borderColor: T.border, color: T.faint }}>
                  Nenhuma sessão marcada.
                </div>
              )}
            </div>
          </section>

          {verticalConfig.showAnamnesis && (
            <section>
              <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>{verticalConfig.anamnesisSectionLabel}</h3>
              <div className="flex flex-col gap-3 border p-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: T.bgSec, borderColor: T.border }}>
                <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>{client.anamnesis}</ClientBadge>
                <button
                  type="button"
                  onClick={() => onAction("Enviar anamnese")}
                  className="rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: T.border, color: T.text }}
                >
                  {anamnesisActionLabel("Enviar anamnese", verticalConfig.anamnesisSidebarLabel)}
                </button>
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Histórico</h3>
            <div className="grid gap-2">
              {client.history.map((event, index) => (
                <div key={`${event}-${index}`} className="flex items-center gap-3 text-sm">
                  <span className="size-2 shrink-0" style={{ background: T.accent }} />
                  <span style={{ color: T.muted }}>{event}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Notas internas</h3>
            <p className="border px-3 py-3 text-sm leading-6" style={{ background: T.bgSec, borderColor: T.border, color: T.muted }}>
              {client.internalNotes}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Ações rápidas</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onAction(action)}
                  className="rounded-[12px] border px-3 py-2.5 text-left text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: T.text }}
                >
                  {anamnesisActionLabel(action, verticalConfig.anamnesisSidebarLabel)}
                </button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function messageStatusStyle(status: MessageStatus): CSSProperties {
  if (status === "Nova") {
    return {
      background: "color-mix(in srgb, var(--markly-accent) 18%, transparent)",
      borderColor: "color-mix(in srgb, var(--markly-accent) 35%, transparent)",
      color: T.accent,
    }
  }
  if (status === "Aguardando resposta") {
    return {
      background: "rgba(214,178,97,0.14)",
      borderColor: "rgba(214,178,97,0.35)",
      color: "#D8BE7B",
    }
  }
  if (status === "Respondida") {
    return {
      background: "rgba(118,159,209,0.14)",
      borderColor: "rgba(118,159,209,0.34)",
      color: "#9EC0EA",
    }
  }
  return {
    background: "color-mix(in srgb, var(--markly-text) 6%, transparent)",
    borderColor: T.border,
    color: T.muted,
  }
}

function messagePriorityStyle(priority: MessagePriority): CSSProperties {
  if (priority === "Alta") {
    return {
      background: "rgba(221,112,92,0.14)",
      borderColor: "rgba(221,112,92,0.36)",
      color: "#F0A18F",
    }
  }
  if (priority === "Média") {
    return {
      background: "rgba(214,178,97,0.12)",
      borderColor: "rgba(214,178,97,0.32)",
      color: "#D8BE7B",
    }
  }
  return {
    background: "color-mix(in srgb, var(--markly-text) 5%, transparent)",
    borderColor: T.border,
    color: T.faint,
  }
}

function messageChannelStyle(channel: MessageChannel): CSSProperties {
  if (channel === "WhatsApp") {
    return {
      background: "rgba(62,188,128,0.12)",
      borderColor: "rgba(62,188,128,0.3)",
      color: "#86D7A7",
    }
  }
  if (channel === "Instagram") {
    return {
      background: "rgba(176,122,217,0.12)",
      borderColor: "rgba(176,122,217,0.3)",
      color: "#C9A6EA",
    }
  }
  return {
    background: "color-mix(in srgb, var(--markly-text) 5%, transparent)",
    borderColor: T.border,
    color: T.muted,
  }
}

function MessageSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  index,
}: {
  title: string
  value: string
  description: string
  icon: typeof MessageSquare
  index: number
}) {
  return (
    <motion.div
      className="border p-4"
      style={{ background: T.card, borderColor: T.border }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[12px]" style={{ color: T.muted }}>{title}</p>
        <span className="flex size-8 items-center justify-center border" style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: T.text }}>{value}</p>
      <p className="mt-1 text-[11px]" style={{ color: T.faint }}>{description}</p>
    </motion.div>
  )
}

function MessagesView() {
  const verticalConfig = useVerticalConfig()
  const [selectedId, setSelectedId] = useState(messagesMock[0]?.id ?? "")
  const [query, setQuery] = useState("")
  const [quickFilter, setQuickFilter] = useState("Todas")
  const visibleMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return messagesMock.filter((message) => {
      const matchesQuery = !normalizedQuery || [
        message.client,
        message.handle,
        message.channel,
        message.subject,
        message.preview,
        message.status,
        message.priority,
        message.linkedTo,
        message.value,
        ...message.tags,
      ].some((field) => field.toLowerCase().includes(normalizedQuery))

      const matchesFilter =
        quickFilter === "Todas" ||
        (quickFilter === "Não lidas" && message.unread) ||
        (quickFilter === "Prioridade alta" && message.priority === "Alta") ||
        (quickFilter === "Sinal" && message.tags.some((tag) => tag.toLowerCase().includes("sinal"))) ||
        (quickFilter === "Sessão" && message.tags.some((tag) => tag.toLowerCase().includes("sessão")))

      return matchesQuery && matchesFilter
    })
  }, [query, quickFilter])

  const selected = visibleMessages.find((message) => message.id === selectedId) ?? visibleMessages[0] ?? messagesMock[0]
  const unreadCount = messagesMock.filter((message) => message.unread).length
  const pendingCount = messagesMock.filter((message) => message.status === "Aguardando resposta" || message.status === "Nova").length
  const signalCount = messagesMock.filter((message) => message.tags.some((tag) => tag.toLowerCase().includes("sinal"))).length
  const summaryCards = [
    { title: "Novas mensagens", value: String(unreadCount), description: `${pendingCount} aguardando sua ação`, icon: MessageSquare },
    { title: "Tempo médio", value: "18 min", description: "primeira resposta hoje", icon: Clock },
    { title: "Sinais citados", value: String(signalCount), description: "prontos para financeiro", icon: DollarSign },
    { title: "Conversas resolvidas", value: "9", description: "últimas 24 horas", icon: CheckCircle2 },
  ]
  const quickFilters = ["Todas", "Não lidas", "Prioridade alta", "Sinal", "Sessão"]

  const runMessageAction = (action: string, message = selected) => {
    toast(`${action}: ${message.client}`)
    console.log("[Markly mock] ação de mensagem", { action, message })
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => <MessageSummaryCard key={card.title} {...card} index={index} />)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="border" style={{ background: T.card, borderColor: T.border }}>
          <div className="border-b p-4" style={{ borderColor: T.border }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: T.text }}>Inbox do studio</h3>
                <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
                  Mensagens de orçamento, sinal e sessão em uma fila única.
                </p>
              </div>
              <ClientBadge style={messageStatusStyle("Nova")}>{unreadCount} novas</ClientBadge>
            </div>

            <label className="mt-4 flex h-10 items-center gap-2 border px-3" style={{ background: T.bgSec, borderColor: T.border }}>
              <Search size={15} style={{ color: T.faint }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cliente, canal ou assunto..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[color-mix(in srgb,var(--markly-text)_42%,transparent)]"
                style={{ color: T.text }}
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const active = quickFilter === filter
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setQuickFilter(filter)}
                    className="rounded-[999px] border px-3 py-1.5 text-[11px] font-semibold transition duration-200 hover:-translate-y-0.5"
                    style={{
                      background: active ? T.text : "transparent",
                      borderColor: active ? T.text : T.border,
                      color: active ? T.bg : T.muted,
                    }}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid max-h-[620px] overflow-y-auto">
            {visibleMessages.length ? visibleMessages.map((message, index) => {
              const active = selected.id === message.id
              return (
                <motion.button
                  key={message.id}
                  type="button"
                  onClick={() => setSelectedId(message.id)}
                  className="group border-b p-4 text-left transition duration-200 last:border-b-0 hover:bg-[color-mix(in srgb,var(--markly-text)_4%,transparent)]"
                  style={{
                    background: active ? "color-mix(in srgb, var(--markly-accent) 9%, transparent)" : index % 2 === 0 ? "color-mix(in srgb, var(--markly-text) 1.2%, transparent)" : "transparent",
                    borderColor: T.border,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.025 }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center border text-[12px] font-bold"
                      style={{ background: message.unread ? T.text : T.bgSec, borderColor: T.border, color: message.unread ? T.bg : T.muted }}
                    >
                      {message.client.split(" ").map((item) => item[0]).slice(0, 2).join("")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-semibold" style={{ color: T.text }}>{message.client}</span>
                        <span className="shrink-0 text-[11px]" style={{ color: T.faint }}>{message.time}</span>
                      </span>
                      <span className="mt-1 block truncate text-[12px] font-semibold" style={{ color: T.muted }}>{message.subject}</span>
                      <span className="mt-1 line-clamp-2 text-[12px] leading-5" style={{ color: T.faint }}>{message.preview}</span>
                      <span className="mt-3 flex flex-wrap gap-2">
                        <ClientBadge style={messageChannelStyle(message.channel)}>{message.channel}</ClientBadge>
                        <ClientBadge style={messageStatusStyle(message.status)}>{message.status}</ClientBadge>
                        {message.priority === "Alta" && <ClientBadge style={messagePriorityStyle(message.priority)}>Alta</ClientBadge>}
                      </span>
                    </span>
                  </div>
                </motion.button>
              )
            }) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center">
                <MessageSquare size={28} style={{ color: T.accent }} />
                <h3 className="mt-4 text-base font-semibold" style={{ color: T.text }}>Nenhuma mensagem encontrada.</h3>
                <p className="mt-2 max-w-[360px] text-sm leading-6" style={{ color: T.faint }}>
                  Ajuste a busca ou volte para todas as conversas do studio.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setQuickFilter("Todas")
                  }}
                  className="mt-5 rounded-[12px] border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: T.border, color: T.text }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="min-w-0 border" style={{ background: T.card, borderColor: T.border }}>
          <div className="border-b p-5" style={{ borderColor: T.border }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <ClientBadge style={messageStatusStyle(selected.status)}>{selected.status}</ClientBadge>
                  <ClientBadge style={messagePriorityStyle(selected.priority)}>Prioridade {selected.priority}</ClientBadge>
                  <ClientBadge style={messageChannelStyle(selected.channel)}>{selected.channel}</ClientBadge>
                </div>
                <h3 className="truncate font-display text-2xl font-semibold" style={{ color: T.text }}>{selected.client}</h3>
                <p className="mt-1 text-sm" style={{ color: T.muted }}>{selected.handle}</p>
              </div>
              <button
                type="button"
                onClick={() => runMessageAction("Marcar como resolvida")}
                className="inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
                style={{ background: T.text, color: T.bg }}
              >
                <CheckCircle2 size={15} />
                Resolver
              </button>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {[
                ["Assunto", selected.subject],
                ["Vínculo", selected.linkedTo],
                ["Valor", selected.value],
                ["Resposta", selected.responseTime],
              ].map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 truncate text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 p-5">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold" style={{ color: T.text }}>Conversa</h4>
                <span className="text-[11px]" style={{ color: T.faint }}>{selected.nextAction}</span>
              </div>
              <div className="grid gap-3">
                {selected.conversation.map((item, index) => {
                  const fromStudio = item.author === "studio"
                  return (
                    <motion.div
                      key={`${item.time}-${index}`}
                      className={cn("max-w-[82%] border px-4 py-3", fromStudio ? "ml-auto" : "mr-auto")}
                      style={{
                        background: fromStudio ? "color-mix(in srgb, var(--markly-accent) 11%, transparent)" : T.bgSec,
                        borderColor: fromStudio ? "color-mix(in srgb, var(--markly-accent) 28%, transparent)" : T.border,
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                    >
                      <p className="text-sm leading-6" style={{ color: T.text }}>{item.text}</p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>{item.time}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="border p-4" style={{ background: "color-mix(in srgb, var(--markly-accent) 6%, transparent)", borderColor: "color-mix(in srgb, var(--markly-accent) 24%, transparent)" }}>
              <div className="mb-2 flex items-center gap-2">
                <Bell size={15} style={{ color: T.accent }} />
                <p className="text-sm font-semibold" style={{ color: T.text }}>Resposta sugerida</p>
              </div>
              <p className="text-sm leading-6" style={{ color: T.muted }}>{selected.suggestedReply}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runMessageAction("Usar resposta sugerida")}
                  className="rounded-[12px] px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
                  style={{ background: T.text, color: T.bg }}
                >
                  Usar resposta
                </button>
                <button
                  type="button"
                  onClick={() => runMessageAction("Copiar resposta")}
                  className="rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: T.border, color: T.text }}
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <textarea
                placeholder="Escreva uma resposta mockada..."
                className="min-h-28 resize-none border bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb,var(--markly-text)_42%,transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_35%,transparent)]"
                style={{ background: T.bgSec, borderColor: T.border, color: T.text }}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <ClientBadge key={tag} style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border, color: T.faint }}>
                      {tag}
                    </ClientBadge>
                  ))}
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {["Criar orçamento", ...(verticalConfig.showAnamnesis ? ["Enviar anamnese"] : []), "Registrar pagamento"].map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => runMessageAction(action)}
                      className="rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                      style={{ borderColor: T.border, color: T.text }}
                    >
                      {anamnesisActionLabel(action, verticalConfig.anamnesisSidebarLabel)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function PortfolioCover({ item, compact = false }: { item: PortfolioItem; compact?: boolean }) {
  return (
    <div
      className={cn("relative overflow-hidden border", compact ? "h-32" : "aspect-[4/3] min-h-48")}
      style={{ background: item.coverTone, borderColor: T.border }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--markly-text) 20%, transparent), transparent 24%), radial-gradient(circle at 82% 80%, rgba(0,71,65,0.22), transparent 28%)",
        }}
      />
      <div className="absolute inset-4 border" style={{ borderColor: "color-mix(in srgb, var(--markly-text) 12%, transparent)" }} />
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center border" style={{ background: "color-mix(in srgb, var(--markly-bg) 52%, transparent)", borderColor: T.border, color: T.text }}>
          <ImageIcon size={17} />
        </span>
        {item.featured && (
          <span className="border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ background: T.text, borderColor: T.text, color: T.bg }}>
            Destaque
          </span>
        )}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: T.faint }}>{item.style}</p>
        <p className="mt-1 truncate font-display text-xl font-semibold" style={{ color: T.text }}>{item.title}</p>
      </div>
    </div>
  )
}

function PortfolioSummaryCard({
  title,
  value,
  description,
  icon: Icon,
  index,
}: {
  title: string
  value: string
  description: string
  icon: typeof ImageIcon
  index: number
}) {
  return (
    <motion.div
      className="border p-4 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
      style={{ background: T.card, borderColor: T.border, boxShadow: "0 18px 40px rgba(0,0,0,0.14)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.03 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[12px]" style={{ color: T.muted }}>{title}</p>
        <span className="flex size-8 items-center justify-center border" style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight" style={{ color: T.text }}>{value}</p>
      <p className="mt-1 text-[11px]" style={{ color: T.faint }}>{description}</p>
    </motion.div>
  )
}

function PortfolioView({
  items,
  filters,
  onOpenItem,
  onNewItem,
}: {
  items: PortfolioItem[]
  filters: PortfolioFilterState
  onOpenItem: (item: PortfolioItem) => void
  onNewItem: () => void
}) {
  const verticalConfig = useVerticalConfig()
  const filteredItems = useMemo(() => filterPortfolioItems(items, filters), [items, filters])
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(initialPortfolioFilters)
  const summary = portfolioSummaryFromList(items)
  const summaryCards = [
    { title: "Trabalhos salvos", value: String(summary.total), description: `${summary.photos} fotos profissionais`, icon: ImageIcon },
    { title: "Publicados", value: String(summary.published), description: "visíveis no portfólio", icon: CheckCircle2 },
    { title: "Em curadoria", value: String(summary.inReview), description: "seleção ou tratamento", icon: Clock },
    { title: "Destaques", value: String(summary.featured), description: "peças para vitrine", icon: TrendingUp },
  ]

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => <PortfolioSummaryCard key={card.title} {...card} index={index} />)}
      </div>

      <div className="border p-4" style={{ background: T.card, borderColor: T.border }}>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: T.text }}>Biblioteca profissional</h3>
            <p className="mt-1 text-[12px] leading-5" style={{ color: T.faint }}>
              Fotos finais, bastidores e peças selecionadas para proposta, Instagram e site.
            </p>
          </div>
          <span className="text-[11px]" style={{ color: T.faint }}>
            {hasFilters ? `${filteredItems.length} resultado(s) com filtros` : `${items.length} trabalhos organizados`}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center border px-6 py-12 text-center" style={{ background: "color-mix(in srgb, var(--markly-text) 1.8%, transparent)", borderColor: T.border }}>
            <ImageIcon size={28} style={{ color: T.accent }} />
            <h3 className="mt-4 text-lg font-semibold" style={{ color: T.text }}>Nenhum trabalho no portfólio ainda.</h3>
            <p className="mt-2 max-w-[480px] text-sm leading-6" style={{ color: T.faint }}>
              Salve fotos profissionais das sessões para montar uma vitrine forte do studio.
            </p>
            <button
              type="button"
              onClick={onNewItem}
              className="mt-5 inline-flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
              style={{ background: T.text, color: T.bg }}
            >
              <Plus size={15} />
              Novo trabalho
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onOpenItem(item)}
                className="group overflow-hidden border text-left transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_24%,transparent)] hover:shadow-[0_20px_44px_rgba(0,0,0,0.16)]"
                style={{ background: T.bgSec, borderColor: T.border }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.025 }}
              >
                <PortfolioCover item={item} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</span>
                      <span className="mt-0.5 block truncate text-[12px]" style={{ color: T.faint }}>
                        {[item.client, verticalConfig.placementFieldLabel ? item.bodyPlacement : null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <ClientBadge style={portfolioStatusStyle(item.status)}>{item.status}</ClientBadge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[12px] leading-5" style={{ color: T.muted }}>{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="border px-2 py-1 text-[10px] font-semibold" style={{ background: "color-mix(in srgb, var(--markly-text) 2%, transparent)", borderColor: T.border, color: T.faint }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: T.border, color: T.faint }}>
                    <span>{item.metrics.photos} fotos</span>
                    <span>{item.visibility}</span>
                    <span>{item.metrics.views} views</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PortfolioFilterMenu({
  value,
  onChange,
}: {
  value: PortfolioFilterState
  onChange: (value: PortfolioFilterState) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<PortfolioFilterState>(value)
  const activeCount = [value.status, value.style, value.source, value.visibility].filter((item) => item !== "Todos").length + value.flags.length

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const toggleFlag = (flag: string) => {
    setDraft((current) => ({
      ...current,
      flags: current.flags.includes(flag) ? current.flags.filter((item) => item !== flag) : [...current.flags, flag],
    }))
  }

  const clear = () => {
    setDraft(initialPortfolioFilters)
    onChange(initialPortfolioFilters)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
          style={{ background: activeCount ? "color-mix(in srgb, var(--markly-accent) 9%, transparent)" : "color-mix(in srgb, var(--markly-bg-sec) 34%, transparent)", borderColor: activeCount ? "color-mix(in srgb, var(--markly-accent) 30%, transparent)" : T.border, color: activeCount ? T.text : T.muted }}
        >
          <ImageIcon size={15} />
          Filtro
          {activeCount > 0 && (
            <span className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: T.accent, color: T.bg }}>
              {activeCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[420px] rounded-[18px] border p-3 shadow-2xl backdrop-blur-xl"
        style={{ background: "color-mix(in srgb, var(--markly-bg-sec) 98%, black)", borderColor: T.borderStrong, color: T.text }}
      >
        <DropdownMenuLabel className="px-1 pb-2 pt-1">
          <span className="block text-[11px] uppercase tracking-[0.16em]" style={{ color: T.faint }}>Filtrar portfólio</span>
          <span className="mt-1 block text-[12px]" style={{ color: T.muted }}>Organize por status, estilo, origem e visibilidade.</span>
        </DropdownMenuLabel>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <FinanceSelectField label="Status" value={draft.status} options={portfolioStatusOptions} onChange={(status) => setDraft((current) => ({ ...current, status }))} />
            <FinanceSelectField label={verticalConfig.styleFieldLabel} value={draft.style} options={["Todos", ...verticalConfig.styleOptions]} onChange={(style) => setDraft((current) => ({ ...current, style }))} />
            <FinanceSelectField label="Origem" value={draft.source} options={portfolioSourceOptions} onChange={(source) => setDraft((current) => ({ ...current, source }))} />
            <FinanceSelectField label="Visibilidade" value={draft.visibility} options={portfolioVisibilityOptions} onChange={(visibility) => setDraft((current) => ({ ...current, visibility }))} />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Marcadores</p>
            <div className="flex flex-wrap gap-2">
              {[
                ["featured", "Destaques"],
                ["published", "Publicados"],
                ["needsEdit", "Aguardando curadoria"],
                ["hasMetrics", "Com métricas"],
              ].map(([id, label]) => {
                const active = draft.flags.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleFlag(id)}
                    className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition duration-200 hover:-translate-y-0.5"
                    style={{ background: active ? T.text : "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: active ? T.text : T.border, color: active ? T.bg : T.muted }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2 bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        <div className="flex justify-end gap-2 px-1">
          <button type="button" onClick={clear} className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Limpar
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(draft)
              setOpen(false)
            }}
            className="rounded-[10px] px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]"
            style={{ background: T.text, color: T.bg }}
          >
            Aplicar filtros
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PortfolioSearchModal({
  open,
  items,
  onOpenChange,
  onOpenItem,
}: {
  open: boolean
  items: PortfolioItem[]
  onOpenChange: (open: boolean) => void
  onOpenItem: (item: PortfolioItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [query, setQuery] = useState("")
  const results = useMemo(() => items.filter((item) => portfolioMatchesQuery(item, query)), [items, query])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-[22px] border p-0 sm:max-w-[640px]"
        style={{ background: "color-mix(in srgb, var(--markly-bg-sec) 98%, black)", borderColor: T.borderStrong, color: T.text }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buscar trabalhos do portfólio</DialogTitle>
          <DialogDescription>Busca mockada da biblioteca profissional.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: T.border }}>
          <Search size={16} style={{ color: T.faint }} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar trabalho, cliente, ${verticalConfig.styleFieldLabel.toLowerCase()} ou tag...`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 35%, transparent)]"
            style={{ color: T.text }}
          />
        </div>
        <div className="max-h-[420px] min-h-[320px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center px-3 text-center text-sm" style={{ color: T.faint }}>
              Nenhum trabalho encontrado.
            </div>
          ) : (
            <div className="grid gap-1">
              {results.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onOpenItem(item)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_6%,transparent)]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.025 }}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center border" style={{ background: item.coverTone, borderColor: T.border, color: T.text }}>
                    <ImageIcon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{item.title}</span>
                    <span className="mt-0.5 block truncate text-[12px]" style={{ color: T.faint }}>
                      {item.client} · {item.style} · {item.status} · {item.tags.join(", ")}
                    </span>
                  </span>
                  <ChevronRight size={14} className="shrink-0" style={{ color: T.faint }} />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function NewPortfolioButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_rgba(240,237,228,0.16)] active:translate-y-0"
      style={{ background: T.text, borderColor: "color-mix(in srgb, var(--markly-text) 26%, transparent)", color: T.bg }}
    >
      <Plus size={15} />
      Novo
    </button>
  )
}

function NewPortfolioModal({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: PortfolioItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const [draft, setDraft] = useState<NewPortfolioDraft>(initialPortfolioDraft)
  const [error, setError] = useState("")
  const fieldClass = "h-11 border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"

  useEffect(() => {
    if (!open) {
      setDraft(initialPortfolioDraft)
      setError("")
    }
  }, [open])

  const update = (key: keyof NewPortfolioDraft, value: string | boolean) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const save = () => {
    const needsPlacement = Boolean(verticalConfig.placementFieldLabel)
    if (!draft.title.trim() || !draft.style || (needsPlacement && !draft.bodyPlacement.trim())) {
      const fields = ["nome do trabalho", verticalConfig.styleFieldLabel.toLowerCase()]
      if (needsPlacement) fields.push(verticalConfig.placementFieldLabel!.toLowerCase())
      setError(`Preencha ${fields.join(", ")}.`)
      return
    }
    const item = createPortfolioFromDraft(draft)
    onSave(item)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[24px] border p-0 sm:max-w-[860px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[color-mix(in srgb, var(--markly-text) 58%, transparent)] [&>button:hover]:text-[var(--markly-text)]"
        style={{ background: "color-mix(in srgb, var(--markly-bg-sec) 98%, black)", borderColor: T.borderStrong, color: T.text, boxShadow: "0 30px 100px rgba(0,0,0,0.62)" }}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="inline-flex w-fit items-center gap-2 border px-3 py-1 text-[11px] font-semibold" style={{ background: "rgba(0,71,65,0.18)", borderColor: T.border, color: T.accent }}>
            Biblioteca profissional
          </div>
          <DialogTitle className="font-display text-2xl" style={{ color: T.text }}>
            Novo trabalho
          </DialogTitle>
          <DialogDescription className="max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
            Salve uma peça profissional com contexto, tags e uso planejado para o portfólio.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className="border p-4" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border }}>
              <PortfolioCover item={createPortfolioFromDraft({ ...draft, title: draft.title || "Prévia do trabalho", style: draft.style || verticalConfig.styleOptions[0], bodyPlacement: draft.bodyPlacement || "A definir" })} compact />
              <button
                type="button"
                onClick={() => toast("Upload mockado: aqui entrariam fotos profissionais do trabalho.")}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[12px] border px-3 py-2.5 text-[12px] font-semibold"
                style={{ borderColor: T.border, color: T.text }}
              >
                <Upload size={14} />
                Adicionar fotos
              </button>
              <p className="mt-2 text-[11px] leading-5" style={{ color: T.faint }}>
                Mock local: sem upload real por enquanto, mas já preparado como biblioteca de fotos.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Nome do trabalho</span>
                <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder={verticalConfig.projectTitlePlaceholder} className={fieldClass} style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }} />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Cliente</span>
                <input value={draft.client} onChange={(event) => update("client", event.target.value)} placeholder="Opcional" className={fieldClass} style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }} />
              </label>
              <FinanceSelectField label={verticalConfig.styleFieldLabel} value={draft.style || "Selecionar"} options={["Selecionar", ...verticalConfig.styleOptions]} onChange={(value) => update("style", value === "Selecionar" ? "" : value)} />
              {verticalConfig.placementFieldLabel && (
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>{verticalConfig.placementFieldLabel}</span>
                  <input value={draft.bodyPlacement} onChange={(event) => update("bodyPlacement", event.target.value)} placeholder={verticalConfig.placementFieldPlaceholder} className={fieldClass} style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }} />
                </label>
              )}
              <label className="grid gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Data/sessão</span>
                <input value={draft.sessionDate} onChange={(event) => update("sessionDate", event.target.value)} placeholder="08/07/2026" className={fieldClass} style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }} />
              </label>
              <FinanceSelectField label="Status" value={draft.status} options={portfolioStatusOptions.filter((item) => item !== "Todos")} onChange={(value) => update("status", value as PortfolioStatus)} />
              <FinanceSelectField label="Origem" value={draft.source} options={portfolioSourceOptions.filter((item) => item !== "Todos")} onChange={(value) => update("source", value)} />
              <FinanceSelectField label="Visibilidade" value={draft.visibility} options={portfolioVisibilityOptions.filter((item) => item !== "Todos")} onChange={(value) => update("visibility", value)} />
              <FinanceSelectField label="Uso" value={draft.usage} options={portfolioUsageOptions} onChange={(value) => update("usage", value)} />
            </div>
          </div>

          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Descrição</span>
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Descreva o trabalho, estilo, intenção e diferencial visual."
              className="min-h-24 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
              style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }}
            />
          </label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Tags</span>
              <input value={draft.tags} onChange={(event) => update("tags", event.target.value)} placeholder="fine line, floral, costela" className={fieldClass} style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }} />
            </label>
            <button
              type="button"
              onClick={() => update("featured", !draft.featured)}
              className="flex h-11 items-center justify-between gap-3 rounded-[12px] border px-3.5 text-left text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
              style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }}
            >
              <span>Marcar como destaque</span>
              <span className="flex size-5 items-center justify-center border" style={{ background: draft.featured ? T.accent : "transparent", borderColor: draft.featured ? T.accent : T.border, color: draft.featured ? T.bg : T.faint }}>
                {draft.featured && <CheckCircle2 size={14} />}
              </span>
            </button>
          </div>
          <label className="mt-4 grid gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Notas internas</span>
            <textarea
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="O que esse trabalho representa para o studio? Onde vale usar?"
              className="min-h-20 resize-none border bg-transparent px-3.5 py-3 text-sm outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
              style={{ background: "color-mix(in srgb, var(--markly-bg) 62%, transparent)", borderColor: T.border, color: T.text }}
            />
          </label>

          {error && (
            <div className="mt-5 border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-end" style={{ borderColor: T.border, background: "color-mix(in srgb, var(--markly-bg) 58%, transparent)" }}>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]" style={{ borderColor: T.border, color: T.muted }}>
            Cancelar
          </button>
          <button type="button" onClick={save} className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF]" style={{ background: T.text, color: T.bg }}>
            Salvar trabalho
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PortfolioDetailPanel({
  item,
  onOpenChange,
  onAction,
}: {
  item: PortfolioItem | null
  onOpenChange: (open: boolean) => void
  onAction: (action: string) => void
}) {
  const verticalConfig = useVerticalConfig()

  if (!item) return null

  const summaryRows = [
    ["Cliente", item.client],
    [verticalConfig.styleFieldLabel, item.style],
    ...(verticalConfig.placementFieldLabel ? [[verticalConfig.placementFieldLabel, item.bodyPlacement]] : []),
    ["Sessão", item.sessionDate],
    ["Origem", item.source],
    ["Uso", item.usage],
    ["Visibilidade", item.visibility],
  ]
  const actions = ["Publicar", "Destacar", "Arquivar", "Baixar fotos", "Editar trabalho"]

  return (
    <Sheet open={Boolean(item)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l p-0 sm:max-w-[580px]"
        style={{ background: "color-mix(in srgb, var(--markly-bg-sec) 98%, black)", borderColor: T.borderStrong, color: T.text }}
      >
        <SheetHeader className="border-b px-6 py-5 pr-14" style={{ borderColor: T.border }}>
          <div className="flex flex-wrap items-center gap-2">
            <ClientBadge style={portfolioStatusStyle(item.status)}>{item.status}</ClientBadge>
            {item.featured && <ClientBadge style={{ background: T.text, borderColor: T.text, color: T.bg }}>Destaque</ClientBadge>}
          </div>
          <SheetTitle className="font-display text-2xl" style={{ color: T.text }}>{item.title}</SheetTitle>
          <SheetDescription style={{ color: T.muted }}>
            {[item.client, item.style, verticalConfig.placementFieldLabel ? item.bodyPlacement : null].filter(Boolean).join(" · ")}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-5 px-6 py-5">
          <PortfolioCover item={item} />

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Resumo</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 truncate text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Fotos salvas</h3>
            <div className="grid gap-2">
              {item.files.map((file, index) => (
                <div key={`${file}-${index}`} className="flex items-center justify-between gap-3 border px-3 py-3" style={{ background: T.bgSec, borderColor: T.border }}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: T.text }}>
                    <ImageIcon size={15} style={{ color: T.accent }} />
                    {file}
                  </span>
                  <span className="text-[11px]" style={{ color: T.faint }}>mock</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Descrição</h3>
            <p className="border px-3 py-3 text-sm leading-6" style={{ background: T.bgSec, borderColor: T.border, color: T.muted }}>
              {item.description}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Tags e métricas</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="border px-2.5 py-1.5 text-[11px] font-semibold" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: T.muted }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                ["Fotos", item.metrics.photos],
                ["Views", item.metrics.views],
                ["Saves", item.metrics.saves],
              ].map(([label, value]) => (
                <div key={label} className="border px-3 py-2.5" style={{ background: T.bgSec, borderColor: T.border }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: T.faint }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: T.text }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Notas internas</h3>
            <p className="border px-3 py-3 text-sm leading-6" style={{ background: T.bgSec, borderColor: T.border, color: T.muted }}>
              {item.notes}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Histórico</h3>
            <div className="grid gap-2">
              {item.history.map((event, index) => (
                <div key={`${event}-${index}`} className="flex items-center gap-3 text-sm">
                  <span className="size-2 shrink-0" style={{ background: T.accent }} />
                  <span style={{ color: T.muted }}>{event}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold" style={{ color: T.text }}>Ações rápidas</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onAction(action)}
                  className="rounded-[12px] border px-3 py-2.5 text-left text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: action === "Arquivar" ? "#F6B6A8" : T.text }}
                >
                  {action}
                </button>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
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

const cardStyleOptions: { id: CardStyleMode; label: string; radius: number }[] = [
  { id: "rounded", label: "Arredondado", radius: 14 },
  { id: "square", label: "Quadrado", radius: 0 },
]

const fontSizeOptions: { id: FontSizeMode; label: string; sample: number }[] = [
  { id: "small", label: "Pequena", sample: 12 },
  { id: "medium", label: "Média", sample: 15 },
  { id: "large", label: "Grande", sample: 18 },
]

function AppearanceSettingsCard({
  cardStyle,
  onCardStyleChange,
  fontSize,
  onFontSizeChange,
}: {
  cardStyle: CardStyleMode
  onCardStyleChange: (mode: CardStyleMode) => void
  fontSize: FontSizeMode
  onFontSizeChange: (mode: FontSizeMode) => void
}) {
  return (
    <Panel title="Aparência" action="Ajustes visuais">
      <div className="grid gap-5">
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Bordas dos cards</p>
          <div className="grid grid-cols-2 gap-2.5">
            {cardStyleOptions.map((option) => {
              const active = cardStyle === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCardStyleChange(option.id)}
                  className="flex items-center gap-2.5 border px-3 py-2.5 text-left text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{
                    borderRadius: 12,
                    borderColor: active ? T.accent : T.border,
                    color: active ? T.accent : T.muted,
                    background: active ? "color-mix(in srgb, var(--markly-accent) 10%, transparent)" : "transparent",
                  }}
                >
                  <span
                    className="size-6 shrink-0 border-2"
                    style={{ borderRadius: option.radius, borderColor: active ? T.accent : T.faint }}
                  />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Tamanho da fonte</p>
          <div className="grid grid-cols-3 gap-2.5">
            {fontSizeOptions.map((option) => {
              const active = fontSize === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFontSizeChange(option.id)}
                  className="flex flex-col items-center gap-1.5 rounded-[12px] border px-3 py-2.5 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? T.accent : T.border,
                    color: active ? T.accent : T.muted,
                    background: active ? "color-mix(in srgb, var(--markly-accent) 10%, transparent)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: option.sample }}>Aa</span>
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function ProfileAvatarInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?"
}

function ProfileSettingsCard({
  profile,
  onSave,
}: {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
}) {
  const [draft, setDraft] = useState<UserProfile>(profile)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  const update = (key: keyof UserProfile, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const handleAvatarPick = () => fileInputRef.current?.click()

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (!acceptedLogoTypes.includes(file.type)) {
      setError("Envie uma imagem PNG, JPG ou WEBP.")
      return
    }
    if (file.size > studioLogoMaxBytes) {
      setError(`Use uma foto leve, com no máximo ${formatLogoSizeLimit()}.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") update("avatarDataUrl", reader.result)
    }
    reader.readAsDataURL(file)
  }

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(profile)

  const handleSave = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      setError("Preencha ao menos nome e e-mail para salvar o perfil.")
      return
    }
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim() })
  }

  return (
    <Panel title="Meu perfil" action="Informações pessoais">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleAvatarPick}
          className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border"
          style={{ borderColor: T.border, background: T.bgSec }}
          aria-label="Alterar foto de perfil"
        >
          {draft.avatarDataUrl ? (
            <img src={draft.avatarDataUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-lg font-bold" style={{ color: T.accent }}>{ProfileAvatarInitial(draft.name)}</span>
          )}
        </button>
        <div className="min-w-0">
          <button
            type="button"
            onClick={handleAvatarPick}
            className="inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
            style={{ borderColor: T.border, color: T.text }}
          >
            <Upload size={13} />
            Alterar foto
          </button>
          <p className="mt-1.5 text-[11px]" style={{ color: T.faint }}>PNG, JPG ou WEBP até {formatLogoSizeLimit()}</p>
        </div>
        <input ref={fileInputRef} type="file" accept={acceptedLogoTypes.join(",")} className="sr-only" onChange={handleAvatarChange} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Nome</span>
          <input
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
            className="h-11 rounded-[12px] border bg-transparent px-3.5 text-sm font-semibold outline-none"
            style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>E-mail</span>
          <input
            type="email"
            value={draft.email}
            onChange={(event) => update("email", event.target.value)}
            className="h-11 rounded-[12px] border bg-transparent px-3.5 text-sm font-semibold outline-none"
            style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Telefone</span>
          <input
            value={draft.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="(11) 90000-0000"
            className="h-11 rounded-[12px] border bg-transparent px-3.5 text-sm font-semibold outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 38%, transparent)]"
            style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>WhatsApp</span>
          <input
            value={draft.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
            placeholder="(11) 90000-0000"
            className="h-11 rounded-[12px] border bg-transparent px-3.5 text-sm font-semibold outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 38%, transparent)]"
            style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
          />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Instagram</span>
          <input
            value={draft.instagram}
            onChange={(event) => update("instagram", event.target.value)}
            placeholder="@seu.estudio"
            className="h-11 rounded-[12px] border bg-transparent px-3.5 text-sm font-semibold outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 38%, transparent)]"
            style={{ background: "rgba(2,8,6,0.52)", borderColor: T.border, color: T.text }}
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 rounded-[14px] border px-4 py-3 text-sm font-semibold" style={{ background: "rgba(163,80,64,0.12)", borderColor: "rgba(245,141,122,0.28)", color: "#F6B6A8" }}>
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!hasChanges}
          onClick={handleSave}
          className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: T.text, color: T.bg }}
        >
          Salvar alterações
        </button>
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
          className="h-11 rounded-[13px] border px-3.5 text-left text-[13px] font-semibold shadow-none data-[placeholder]:text-[color-mix(in_srgb,var(--markly-text)_42%,transparent)]"
          style={{
            background: "rgba(2,8,6,0.62)",
            borderColor: value ? "color-mix(in srgb, var(--markly-text) 18%, transparent)" : T.border,
            color: value ? T.text : T.faint,
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="z-[160] rounded-[14px] border bg-[#06110f] p-1 text-[#F0EDE4] shadow-[0_24px_70px_rgba(0,0,0,0.58)]"
          style={{ borderColor: "color-mix(in srgb, var(--markly-text) 14%, transparent)" }}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-[10px] px-3 py-2.5 text-[13px] text-[color-mix(in srgb, var(--markly-text) 76%, transparent)] focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
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
        borderColor: disabled ? "color-mix(in srgb, var(--markly-text) 7%, transparent)" : "color-mix(in srgb, var(--markly-text) 13%, transparent)",
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
          style={{ borderColor: "color-mix(in srgb, var(--markly-text) 14%, transparent)" }}
        >
          {timeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-[color-mix(in srgb, var(--markly-text) 78%, transparent)] focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
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
      aria-pressed={active}
      className="rounded-full border px-3.5 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
      style={{
        background: active ? T.text : "rgba(2,8,6,0.46)",
        borderColor: active ? T.text : T.border,
        color: active ? T.bg : T.muted,
        boxShadow: active ? "0 10px 24px color-mix(in srgb, var(--markly-accent) 10%, transparent)" : "none",
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
  const verticalConfig = useMemo(() => getVerticalConfig(draft.vertical), [draft.vertical])

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
        className="grid max-h-[88vh] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden rounded-[24px] border p-0 sm:max-w-[860px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[color-mix(in srgb, var(--markly-text) 58%, transparent)] [&>button:hover]:text-[#F0EDE4]"
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

        <div className="min-h-0 overflow-y-auto px-6 py-5">
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
                    background: active ? "linear-gradient(135deg, color-mix(in srgb, var(--markly-accent) 12%, transparent), rgba(0,71,65,0.16))" : "rgba(2,8,6,0.42)",
                    borderColor: active ? "color-mix(in srgb, var(--markly-accent) 24%, transparent)" : T.border,
                    color: active ? T.text : T.muted,
                  }}
                >
                  <span className="mb-2 flex size-6 items-center justify-center rounded-full border text-[10px] font-semibold" style={{ borderColor: active ? "color-mix(in srgb, var(--markly-accent) 28%, transparent)" : T.border, color: active ? T.accent : T.faint }}>
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
                      className="group relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-accent)_34%,transparent)]"
                      style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.borderStrong, color: T.accent }}
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
                    <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
                    <div className="grid grid-cols-5 gap-1.5 p-1">
                      {studioBrandIconOptions.map((option) => {
                        const Icon = option.icon
                        const active = draft.studioIcon === option.id
                        return (
                          <DropdownMenuItem
                            key={option.id}
                            title={option.label}
                            onSelect={() => update("studioIcon", option.id)}
                            className="flex size-11 cursor-pointer items-center justify-center rounded-[13px] p-0 focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
                            style={{
                              background: active ? "color-mix(in srgb, var(--markly-accent) 12%, transparent)" : "color-mix(in srgb, var(--markly-text) 2.5%, transparent)",
                              color: active ? T.accent : T.faint,
                              boxShadow: active ? "inset 0 0 0 1px color-mix(in srgb, var(--markly-accent) 28%, transparent)" : "inset 0 0 0 1px color-mix(in srgb, var(--markly-text) 8%, transparent)",
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
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
                  style={{ borderColor: T.border, color: T.text, background: "color-mix(in srgb, var(--markly-text) 3.5%, transparent)" }}
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
                  style={{ borderColor: T.border, color: T.muted, background: "color-mix(in srgb, var(--markly-text) 2%, transparent)" }}
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
                  placeholder={verticalConfig.studioNamePlaceholder}
                  className="h-11 w-full rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
                  style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ManageSelectField
                  label="Segmento do studio"
                  value={verticalConfig.label}
                  options={studioVerticals.map((item) => item.label)}
                  placeholder="Escolha o segmento"
                  onChange={(value) => {
                    const next = studioVerticals.find((item) => item.label === value)
                    if (next) update("vertical", next.id)
                  }}
                />
                <ManageSelectField label="Tipo de studio" value={draft.studioType} options={studioTypes} placeholder="Escolha o tipo" onChange={(value) => update("studioType", value)} />
                <ManageSelectField label="Equipe" value={draft.teamSize} options={teamSizes} placeholder="Tamanho da equipe" onChange={(value) => update("teamSize", value)} />
                <ManageSelectField label="Canal principal" value={draft.mainContactChannel} options={contactChannels} placeholder="Canal de atendimento" onChange={(value) => update("mainContactChannel", value)} />
                <ManageSelectField label="Sinal/reserva" value={draft.usesDeposit} options={depositOptions} placeholder="Como trabalha com sinal" onChange={(value) => update("usesDeposit", value)} />
              </div>
            </section>
          </div>

          <div className={cn("grid gap-5", activeManageSection === "hours" || activeManageSection === "styles" ? "lg:grid-cols-1" : "hidden")}>
            <section className={cn("rounded-[18px] border p-4", activeManageSection !== "hours" && "hidden")} style={{ background: "rgba(2,8,6,0.46)", borderColor: T.border }}>
              <div className="flex items-start gap-3 rounded-[14px] border p-3" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border }}>
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
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: T.faint }}>{verticalConfig.specialtiesLabel}</p>
                  <p className="mt-1 text-sm" style={{ color: T.muted }}>Selecione as opções que aparecem como base do studio.</p>
                </div>
                <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.faint }}>
                  {draft.mainStyles.length || 0} ativos
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {verticalConfig.styleOptions.map((style) => (
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
              style={{ borderColor: T.borderStrong, color: T.text, background: "color-mix(in srgb, var(--markly-text) 4%, transparent)" }}
            >
              Próxima seção
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
              style={{ borderColor: T.border, color: T.muted }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-[12px] px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
              style={{ background: T.text, color: T.bg, boxShadow: "0 12px 32px color-mix(in srgb, var(--markly-accent) 12%, transparent)" }}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StudioSwitcher({
  profile,
  studios,
  activeStudioId,
  onManage,
  onSwitchStudio,
  onAddStudio,
}: {
  profile: StudioProfile
  studios: StudioRecord[]
  activeStudioId: string
  onManage: () => void
  onSwitchStudio: (id: string) => void
  onAddStudio: () => void
}) {
  const studioName = studioValue(profile.studioName, overviewMock.studioProfile.fallbackName)
  const BrandIcon = getStudioBrandIcon(profile.studioIcon)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="grid h-[52px] w-full grid-cols-[2.75rem_minmax(0,1fr)_1rem] items-center rounded-[16px] border border-[color-mix(in srgb, var(--markly-text) 12%, transparent)] bg-[color-mix(in srgb, var(--markly-text) 3%, transparent)] py-1.5 pr-3 text-left shadow-[inset_0_1px_0_color-mix(in srgb, var(--markly-text) 4.5%, transparent)] transition duration-300 hover:border-[color-mix(in_srgb,var(--markly-accent)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--markly-text)_4.5%,transparent)] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:grid-cols-[2.75rem_0fr_0fr] group-data-[collapsible=icon]:rounded-[14px] group-data-[collapsible=icon]:border-[color-mix(in_srgb,var(--markly-text)_12%,transparent)] group-data-[collapsible=icon]:bg-[color-mix(in_srgb,var(--markly-text)_3.5%,transparent)] group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-[inset_0_1px_0_color-mix(in srgb, var(--markly-text) 5%, transparent)]"
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
        {studios.length > 1 && (
          <>
            <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
            <DropdownMenuLabel className="px-3 pb-1 pt-2 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: T.faint }}>
              Trocar de studio
            </DropdownMenuLabel>
            {studios.map((item) => {
              const ItemIcon = getStudioBrandIcon(item.profile.studioIcon)
              const isActive = item.id === activeStudioId
              return (
                <DropdownMenuItem
                  key={item.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[12px] px-3 py-2 text-[13px] transition-colors duration-100 hover:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] hover:text-[#F0EDE4] focus:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] focus:text-[#F0EDE4]"
                  style={{ color: isActive ? T.accent : "color-mix(in srgb, var(--markly-text) 78%, transparent)" }}
                  onSelect={() => onSwitchStudio(item.id)}
                >
                  <ItemIcon size={14} strokeWidth={1.85} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{studioValue(item.profile.studioName, "Studio sem nome")}</span>
                  {isActive && <CheckCircle2 size={13} className="shrink-0" />}
                </DropdownMenuItem>
              )
            })}
          </>
        )}
        <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        <DropdownMenuItem
          className="cursor-pointer rounded-[12px] px-3 py-2 text-[13px] text-[color-mix(in srgb, var(--markly-text) 78%, transparent)] transition-colors duration-100 hover:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] hover:text-[#F0EDE4] focus:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] focus:text-[#F0EDE4]"
          onSelect={onManage}
        >
          Gerenciar studio
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-[12px] px-3 py-2 text-[13px] text-[color-mix(in srgb, var(--markly-text) 78%, transparent)] transition-colors duration-100 hover:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] hover:text-[#F0EDE4] focus:bg-[color-mix(in_srgb,var(--markly-text)_14%,transparent)] focus:text-[#F0EDE4]"
          onSelect={onAddStudio}
        >
          Adicionar novo studio
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
            className="mx-auto flex size-11 items-center justify-center rounded-[15px] border transition duration-200 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--markly-text)_7%,transparent)]"
            style={{ background: "rgba(6,17,15,0.82)", borderColor: T.borderStrong, color: T.accent, boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--markly-text) 6%, transparent)" }}
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
          <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
          {sidebarLayoutModes.map((item) => {
            const Icon = item.icon
            const isActive = mode === item.id
            return (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer gap-2.5 rounded-[10px] px-2.5 py-2 focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
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
      style={{ background: "rgba(6,17,15,0.72)", borderColor: T.borderStrong, boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--markly-text) 6%, transparent)" }}
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
              "relative flex h-8 flex-1 items-center justify-center rounded-[12px] transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_4%,transparent)]",
              index > 0 && "before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-px before:bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]",
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
  const verticalConfig = getVerticalConfig(profile.vertical)
  return (
    <Panel title="Studio" action={setupCompleted ? "Studio configurado" : "Setup pendente"}>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Nome", studioValue(profile.studioName, "Studio sem nome")],
          ["Horário", studioHours(profile)],
          ["Canal principal", studioValue(profile.mainContactChannel)],
          ["Equipe", studioValue(profile.teamSize)],
          [verticalConfig.specialtiesLabel, profile.mainStyles.length ? profile.mainStyles.join(", ") : verticalConfig.styleOptions.slice(0, 3).join(", ")],
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
        style={{ background: "color-mix(in srgb, var(--markly-text) 2%, transparent)", borderColor: T.border, color: T.muted }}
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
              className="rounded-[10px] text-[12px] font-semibold focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
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
        "inline-flex items-center justify-center gap-2 rounded-[12px] border text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_color-mix(in srgb, var(--markly-text) 16%, transparent)] active:translate-y-0",
        compact ? "px-3 py-2" : "px-4 py-2.5",
      )}
      style={{ background: T.text, borderColor: "color-mix(in srgb, var(--markly-text) 26%, transparent)", color: T.bg }}
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
      className="border p-4 transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
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
        <span className="flex size-8 shrink-0 items-center justify-center border" style={{ background: "color-mix(in srgb, var(--markly-text) 4%, transparent)", borderColor: T.border }}>
          <Icon size={15} style={{ color: statIconColor(index) }} />
        </span>
      </div>
      <p className="text-[11px]" style={{ color: T.faint }}>{description}</p>
    </motion.div>
  )
}

function FinancePendingPayments({
  transactions,
  onMarkPaid,
}: {
  transactions: FinanceTransaction[]
  onMarkPaid: (transaction: FinanceTransaction) => void
}) {
  const payments = transactions.filter((transaction) => transaction.status === "Pendente")

  return (
    <Panel title="Pagamentos pendentes" action="Lançamentos com status pendente">
      {payments.length === 0 ? (
        <p className="px-1 text-sm" style={{ color: T.faint }}>Nenhum pagamento pendente por aqui.</p>
      ) : (
        <div className="grid gap-2">
          {payments.map((transaction) => (
            <button
              key={transaction.id}
              type="button"
              onClick={() => onMarkPaid(transaction)}
              className="flex flex-col gap-3 border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--markly-text)_3.5%,transparent)] sm:flex-row sm:items-center sm:justify-between"
              style={{ background: T.bgSec, borderColor: T.border }}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold" style={{ color: T.text }}>{transaction.category}</span>
                <span className="mt-1 block text-[12px]" style={{ color: T.faint }}>{transaction.description}</span>
              </span>
              <span className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.accent }}>
                  {transaction.status}
                </span>
                <span className="border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.faint }}>
                  {transaction.date}
                </span>
                <span className="min-w-[82px] text-right text-sm font-semibold" style={{ color: T.text }}>
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-[10px] border px-3 py-2 text-[12px] font-semibold" style={{ borderColor: T.border, color: T.muted }}>
                  Marcar como pago
                  <ChevronRight size={13} />
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </Panel>
  )
}

function FinanceStatusSummary({ transactions }: { transactions: FinanceTransaction[] }) {
  const statusTotals = useMemo(() => {
    const totals: Record<string, number> = { Pago: 0, Pendente: 0, Cancelado: 0 }
    transactions.forEach((transaction) => {
      totals[transaction.status] = (totals[transaction.status] ?? 0) + transaction.amount
    })
    return totals
  }, [transactions])

  return (
    <Panel title="Resumo por status" action="Valores atuais">
      <div className="grid gap-2">
        {Object.entries(statusTotals).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border px-3 py-3" style={{ background: T.bgSec, borderColor: T.border }}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2 shrink-0 rounded-full" style={{ background: financeStatusTone(label) }} />
              <span className="truncate text-[13px] font-semibold" style={{ color: T.muted }}>{label}</span>
            </span>
            <span className="text-sm font-semibold" style={{ color: T.text }}>{formatCurrency(value)}</span>
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
        <div className="grid grid-cols-[0.55fr_1.35fr_1fr_0.75fr_0.75fr_0.85fr] gap-3 border-b px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: T.border, color: T.faint }}>
          <span>Data</span>
          <span>Descrição</span>
          <span>Cliente/Categoria</span>
          <span>Método</span>
          <span>Status</span>
          <span className="text-right">Valor</span>
        </div>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
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
          <div key={`${transaction.id}-mobile`} className="border p-3" style={{ background: T.bgSec, borderColor: T.border }}>
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

function FinancePaymentMethods({ transactions }: { transactions: FinanceTransaction[] }) {
  const methods = useMemo(() => {
    const totals = new Map<string, number>()
    transactions.forEach((transaction) => {
      totals.set(transaction.method, (totals.get(transaction.method) ?? 0) + transaction.amount)
    })
    return Array.from(totals.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])
  const maxMethodValue = Math.max(1, ...methods.map((method) => method.value))

  return (
    <Panel title="Métodos de pagamento" action="Distribuição">
      {methods.length === 0 ? (
        <p className="px-1 text-sm" style={{ color: T.faint }}>Nenhum lançamento registrado ainda.</p>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <div key={method.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold" style={{ color: T.text }}>{method.label}</span>
                <span style={{ color: T.muted }}>{formatCurrency(method.value)}</span>
              </div>
              <div className="h-2 border" style={{ background: "color-mix(in srgb, var(--markly-text) 3.5%, transparent)", borderColor: T.border }}>
                <div className="h-full" style={{ width: `${(method.value / maxMethodValue) * 100}%`, background: "linear-gradient(90deg, color-mix(in srgb, var(--markly-accent) 85%, transparent), rgba(141,206,192,0.56))" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

function FinanceIndicators({ transactions }: { transactions: FinanceTransaction[] }) {
  const paid = transactions.filter((transaction) => transaction.status === "Pago")
  const paidIncome = paid.filter((transaction) => transaction.type === "income")
  const averageTicket = paidIncome.length ? paidIncome.reduce((sum, t) => sum + t.amount, 0) / paidIncome.length : 0
  const largest = transactions.reduce<FinanceTransaction | null>((max, t) => (!max || t.amount > max.amount ? t : max), null)
  const completionRate = transactions.length ? Math.round((paid.length / transactions.length) * 100) : 0

  const indicators = [
    { label: "Ticket médio", value: formatCurrency(Math.round(averageTicket)), description: "lançamentos pagos" },
    { label: "Maior lançamento", value: largest ? formatCurrency(largest.amount) : "R$ 0", description: largest?.description ?? "sem lançamentos" },
    { label: "Lançamentos pagos", value: String(paid.length), description: `de ${transactions.length} no total` },
    { label: "Taxa de conclusão", value: `${completionRate}%`, description: "lançamentos com status pago" },
  ]

  return (
    <Panel title="Indicadores do studio" action="Calculado a partir do ledger">
      <div className="grid gap-3 sm:grid-cols-2">
        {indicators.map((indicator) => (
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
  onMarkPaid,
}: {
  transactions: FinanceTransaction[]
  onNewLaunch: () => void
  onMarkPaid: (transaction: FinanceTransaction) => void
}) {
  const [period, setPeriod] = useState("Todos os períodos")
  const [status, setStatus] = useState("Todos")
  const [method, setMethod] = useState("Todos")
  const filteredTransactions = transactions.filter((transaction) => {
    const periodMatch = matchesFinancePeriod(transaction.date, period)
    const statusMatch = status === "Todos" || transaction.status === status
    const methodMatch = method === "Todos" || transaction.method === method
    return periodMatch && statusMatch && methodMatch
  })

  const paidIncome = transactions.filter((transaction) => transaction.type === "income" && transaction.status === "Pago")
  const deposits = paidIncome.filter((transaction) => /sinal/i.test(transaction.description))
  const pending = transactions.filter((transaction) => transaction.status === "Pendente")
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense")
  const monthlyRevenue = paidIncome.reduce((sum, t) => sum + t.amount, 0)
  const receivedDeposits = deposits.reduce((sum, t) => sum + t.amount, 0)
  const pendingAmount = pending.reduce((sum, t) => sum + t.amount, 0)
  const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

  const metrics = [
    { title: "Faturamento do mês", value: formatCurrency(monthlyRevenue), description: `${paidIncome.length} lançamento(s) pago(s)`, icon: TrendingUp },
    { title: "Sinais recebidos", value: formatCurrency(receivedDeposits), description: `${deposits.length} confirmação(ões)`, icon: WalletCards },
    { title: "Valores pendentes", value: formatCurrency(pendingAmount), description: `${pending.length} aguardando pagamento`, icon: Clock },
    { title: "Despesas", value: formatCurrency(expenses), description: `${expenseTransactions.length} lançamento(s)`, icon: FileText },
  ]

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 border p-4 lg:flex-row lg:items-end lg:justify-between" style={{ background: T.card, borderColor: T.border }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: T.text }}>Filtros financeiros</p>
          <p className="mt-1 text-[12px]" style={{ color: T.faint }}>Acompanhe entradas, sinais, pagamentos e despesas do seu studio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FinanceSelectField label="Período" value={period} options={["Todos os períodos", "Este mês", "Últimos 7 dias", "Últimos 30 dias"]} onChange={setPeriod} />
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
        <FinancePendingPayments transactions={transactions} onMarkPaid={onMarkPaid} />
        <FinanceStatusSummary transactions={transactions} />
      </div>

      <FinanceFlow transactions={filteredTransactions} onNewLaunch={onNewLaunch} />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <FinancePaymentMethods transactions={transactions} />
        <FinanceIndicators transactions={transactions} />
      </div>
    </div>
  )
}

function AnamnesisView({
  clients,
  onAction,
  onOpenClient,
}: {
  clients: ClientItem[]
  onAction: (client: ClientItem, action: string) => void
  onOpenClient: (client: ClientItem) => void
}) {
  const verticalConfig = useVerticalConfig()
  const notSent = clients.filter((client) => client.anamnesis === "Não enviada")
  const pending = clients.filter((client) => client.anamnesis === "Pendente")
  const filled = clients.filter((client) => client.anamnesis === "Preenchida")
  const needsAttention = [...notSent, ...pending]

  const stats = [
    { label: "Não enviadas", value: notSent.length, hint: "aguardando primeiro envio" },
    { label: "Pendentes", value: pending.length, hint: "aguardando preenchimento" },
    { label: "Preenchidas", value: filled.length, hint: "prontas para a sessão" },
  ]

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border p-4" style={{ background: T.bgSec, borderColor: T.border }}>
            <p className="text-[12px]" style={{ color: T.faint }}>{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold" style={{ color: T.text }}>{stat.value}</p>
            <p className="mt-1 text-[11px]" style={{ color: T.muted }}>{stat.hint}</p>
          </div>
        ))}
      </div>

      <Panel title="Precisa de atenção" action={`${needsAttention.length} cliente(s)`}>
        {needsAttention.length === 0 ? (
          <p className="px-1 text-sm" style={{ color: T.faint }}>Tudo em dia por aqui.</p>
        ) : (
          <div className="grid gap-2">
            {needsAttention.map((client) => (
              <div
                key={client.id}
                className="flex flex-col gap-3 border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: T.bgSec, borderColor: T.border }}
              >
                <button type="button" onClick={() => onOpenClient(client)} className="min-w-0 text-left transition duration-200 hover:-translate-y-0.5">
                  <span className="block text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
                  <span className="mt-1 block text-[12px]" style={{ color: T.faint }}>{client.interest}</span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>{client.anamnesis}</ClientBadge>
                  {client.anamnesis === "Não enviada" ? (
                    <button
                      type="button"
                      onClick={() => onAction(client, "Enviar anamnese")}
                      className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                      style={{ borderColor: T.border, color: T.text }}
                    >
                      {anamnesisActionLabel("Enviar anamnese", verticalConfig.anamnesisSidebarLabel)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAction(client, "Marcar anamnese preenchida")}
                      className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:-translate-y-0.5"
                      style={{ borderColor: T.border, color: T.text }}
                    >
                      Marcar como preenchida
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Preenchidas" action={`${filled.length} cliente(s) prontos`}>
        {filled.length === 0 ? (
          <p className="px-1 text-sm" style={{ color: T.faint }}>Nenhum registro preenchido ainda.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {filled.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => onOpenClient(client)}
                className="flex items-center justify-between gap-3 border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5"
                style={{ background: T.bgSec, borderColor: T.border }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold" style={{ color: T.text }}>{client.name}</span>
                  <span className="mt-1 block text-[12px]" style={{ color: T.faint }}>{client.interest}</span>
                </span>
                <ClientBadge style={clientAnamnesisStyle(client.anamnesis)}>Preenchida</ClientBadge>
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

function SectionContent({
  section,
  studioProfile,
  setupCompleted,
  onManageStudio,
  financeTransactions,
  onNewFinanceLaunch,
  onMarkFinancePaid,
  budgetColumns,
  budgetFilters,
  onOpenBudget,
  onNewBudget,
  clients,
  clientFilters,
  onOpenClient,
  onNewClient,
  onAnamnesisAction,
  portfolioItems,
  portfolioFilters,
  onOpenPortfolioItem,
  onNewPortfolioItem,
  cardStyle,
  onCardStyleChange,
  fontSize,
  onFontSizeChange,
  userProfile,
  onSaveUserProfile,
  calendarEvents,
  onCalendarEventsChange,
}: {
  section: SectionId
  studioProfile: StudioProfile
  setupCompleted: boolean
  onManageStudio: () => void
  financeTransactions: FinanceTransaction[]
  onNewFinanceLaunch: () => void
  onMarkFinancePaid: (transaction: FinanceTransaction) => void
  budgetColumns: BudgetColumn[]
  budgetFilters: BudgetFilterState
  onOpenBudget: (item: BudgetItem) => void
  onNewBudget: () => void
  clients: ClientItem[]
  clientFilters: ClientFilterState
  onOpenClient: (client: ClientItem) => void
  onNewClient: () => void
  onAnamnesisAction: (client: ClientItem, action: string) => void
  portfolioItems: PortfolioItem[]
  portfolioFilters: PortfolioFilterState
  onOpenPortfolioItem: (item: PortfolioItem) => void
  onNewPortfolioItem: () => void
  cardStyle: CardStyleMode
  onCardStyleChange: (mode: CardStyleMode) => void
  fontSize: FontSizeMode
  onFontSizeChange: (mode: FontSizeMode) => void
  userProfile: UserProfile
  onSaveUserProfile: (profile: UserProfile) => void
  calendarEvents: CalendarEvent[]
  onCalendarEventsChange: Dispatch<SetStateAction<CalendarEvent[]>>
}) {
  if (section === "budgets") return <BudgetBoard columns={budgetColumns} filters={budgetFilters} onOpenBudget={onOpenBudget} onNewBudget={onNewBudget} />
  if (section === "clients") return <ClientsView clients={clients} filters={clientFilters} onOpenClient={onOpenClient} onNewClient={onNewClient} />
  if (section === "calendar") return <CalendarView clients={clients} events={calendarEvents} setEvents={onCalendarEventsChange} onOpenClient={onOpenClient} />
  if (section === "portfolio") return <PortfolioView items={portfolioItems} filters={portfolioFilters} onOpenItem={onOpenPortfolioItem} onNewItem={onNewPortfolioItem} />
  if (section === "finance") return <FinanceView transactions={financeTransactions} onNewLaunch={onNewFinanceLaunch} onMarkPaid={onMarkFinancePaid} />
  if (section === "anamnesis") return <AnamnesisView clients={clients} onAction={onAnamnesisAction} onOpenClient={onOpenClient} />
  if (section === "messages") return <MessagesView />
  if (section === "settings") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          <ProfileSettingsCard profile={userProfile} onSave={onSaveUserProfile} />
          <StudioSummary profile={studioProfile} setupCompleted={setupCompleted} onManage={onManageStudio} />
        </div>
        <div className="grid gap-5">
          <AppearanceSettingsCard cardStyle={cardStyle} onCardStyleChange={onCardStyleChange} fontSize={fontSize} onFontSizeChange={onFontSizeChange} />
          <AccessView />
        </div>
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
  const verticalConfig = useVerticalConfig()
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
    if (!/^\d{1,2}\/\d{1,2}$/.test(draft.date.trim())) {
      setError("Use o formato DD/MM para a data, por exemplo 08/07.")
      return
    }

    const transaction: FinanceTransaction = {
      id: `txn-${Date.now()}`,
      date: draft.date.trim(),
      description: draft.description.trim(),
      category: draft.client,
      method: draft.method,
      status: draft.status,
      amount,
      type: isExpenseLaunch(draft.type) ? "expense" : "income",
    }

    onSave(transaction)
    onOpenChange(false)
    toast(`Lançamento "${transaction.description}" registrado.`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[24px] border p-0 sm:max-w-[720px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:text-[color-mix(in srgb, var(--markly-text) 58%, transparent)] [&>button:hover]:text-[#F0EDE4]"
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

        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FinanceSelectField label="Tipo" value={draft.type} options={financeLaunchTypes} onChange={(value) => update("type", value)} />
            <FinanceSelectField label="Status" value={draft.status} options={financeStatuses} onChange={(value) => update("status", value)} />
            <label className="grid gap-1.5 md:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Descrição</span>
              <input
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder={verticalConfig.financeExamplePlaceholder}
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
                style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Valor</span>
              <input
                value={draft.amount}
                onChange={(event) => update("amount", event.target.value)}
                placeholder="R$ 0,00"
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
                style={{ background: "rgba(2,8,6,0.62)", borderColor: T.border, color: T.text }}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Data</span>
              <input
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
                placeholder="08/07"
                className="h-11 rounded-[13px] border bg-transparent px-3.5 text-sm font-semibold outline-none transition placeholder:text-[color-mix(in srgb, var(--markly-text) 34%, transparent)] focus:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)]"
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
            className="rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
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
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in srgb, var(--markly-text) 35%, transparent)]"
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
                    style={{ background: "color-mix(in srgb, var(--markly-text) 2.5%, transparent)", borderColor: "color-mix(in srgb, var(--markly-text) 6%, transparent)" }}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: [0.38, 0.78, 0.38] }}
                    transition={{ duration: 1.15, repeat: Infinity, delay: item * 0.08 }}
                  >
                    <span className="mt-0.5 h-5 w-16 rounded-full" style={{ background: "color-mix(in srgb, var(--markly-text) 9%, transparent)" }} />
                    <span className="min-w-0 flex-1">
                      <span className="block h-3 w-2/5 rounded-full" style={{ background: "color-mix(in srgb, var(--markly-text) 12%, transparent)" }} />
                      <span className="mt-2 block h-2.5 w-3/5 rounded-full" style={{ background: "color-mix(in srgb, var(--markly-text) 7%, transparent)" }} />
                    </span>
                    <span className="mt-1 size-3 rounded-full" style={{ background: "color-mix(in srgb, var(--markly-text) 8%, transparent)" }} />
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
                      onOpenChange(false)
                      toast(`Abrindo "${item.title}".`)
                    }}
                    className="flex w-full items-start gap-3 rounded-[14px] px-3 py-3 text-left transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_6%,transparent)]"
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
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)] hover:text-[#F0EDE4] active:translate-y-0"
          style={{
            background: hasFilter ? "color-mix(in srgb, var(--markly-accent) 9%, transparent)" : "rgba(2,8,6,0.34)",
            borderColor: hasFilter ? "color-mix(in srgb, var(--markly-accent) 30%, transparent)" : T.border,
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
                className="group flex h-12 w-full items-center justify-between rounded-[12px] border px-3 text-left transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-accent)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--markly-text)_4%,transparent)]"
                style={{
                  background: active ? "color-mix(in srgb, var(--markly-accent) 8%, transparent)" : "rgba(2,8,6,0.64)",
                  borderColor: active ? "color-mix(in srgb, var(--markly-accent) 34%, transparent)" : T.border,
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
            background: "linear-gradient(180deg, color-mix(in srgb, var(--markly-accent) 4.5%, transparent), rgba(2,8,6,0.72))",
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
                "flex size-8 items-center justify-center rounded-[10px] border border-[color-mix(in srgb, var(--markly-text) 12%, transparent)] bg-[rgba(2,8,6,0.56)] p-0 text-[#D8D0BF] opacity-100 transition hover:border-[color-mix(in_srgb,var(--markly-accent)_32%,transparent)] hover:bg-[color-mix(in_srgb,var(--markly-accent)_8%,transparent)]",
              nav_button_previous: "static",
              nav_button_next: "static",
              table: "w-full border-collapse",
              head_row: "grid grid-cols-7 gap-1",
              head_cell: "flex h-7 items-center justify-center text-[10px] font-semibold uppercase text-[color-mix(in srgb, var(--markly-text) 42%, transparent)]",
              row: "mt-1 grid grid-cols-7 gap-1",
              cell: "p-0 text-center",
              day: "flex size-8 items-center justify-center rounded-[10px] border border-transparent bg-transparent p-0 text-[12px] font-semibold text-[color-mix(in srgb, var(--markly-text) 72%, transparent)] transition hover:border-[color-mix(in_srgb,var(--markly-accent)_24%,transparent)] hover:bg-[color-mix(in_srgb,var(--markly-accent)_8%,transparent)] hover:text-[#F0EDE4]",
              day_selected:
                "border-[color-mix(in srgb, var(--markly-accent) 55%, transparent)] bg-[#F0EDE4] text-[#020806] hover:bg-[#F0EDE4] hover:text-[#020806] focus:bg-[#F0EDE4] focus:text-[#020806]",
              day_today: "border-[color-mix(in srgb, var(--markly-accent) 26%, transparent)] text-[#D8D0BF]",
              day_outside: "text-[color-mix(in srgb, var(--markly-text) 24%, transparent)]",
              day_disabled: "text-[color-mix(in srgb, var(--markly-text) 18%, transparent)]",
            }}
          />
        </div>
        <DropdownMenuSeparator className="my-2 bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        <div className="flex justify-end gap-2 px-1">
          <button
            type="button"
            onClick={clear}
            className="rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)]"
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

const createActionSectionMap: Record<string, SectionId> = {
  "Nova sessão": "calendar",
  "Novo item no portfólio": "portfolio",
  "Nova anamnese": "anamnesis",
  "Novo follow-up": "budgets",
}

function CreateMenu({
  onCreateBudget,
  onCreateClient,
  onNavigate,
}: {
  onCreateBudget: () => void
  onCreateClient: () => void
  onNavigate: (section: SectionId, label: string) => void
}) {
  const verticalConfig = useVerticalConfig()
  const createActions = overviewMock.createActions.filter((action) => action.label !== "Nova anamnese" || verticalConfig.showAnamnesis)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_14px_34px_color-mix(in srgb, var(--markly-text) 16%, transparent)] active:translate-y-0"
          style={{ background: T.text, borderColor: "color-mix(in srgb, var(--markly-text) 26%, transparent)", color: T.bg }}
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
        <DropdownMenuSeparator className="bg-[color-mix(in srgb, var(--markly-text) 10%, transparent)]" />
        {createActions.map((action) => {
          const displayLabel = action.label === "Nova anamnese" ? `Nova ${verticalConfig.anamnesisSidebarLabel.toLowerCase()}` : action.label
          return (
            <DropdownMenuItem
              key={action.label}
              className="cursor-pointer rounded-[12px] px-3 py-2.5 focus:bg-[color-mix(in_srgb,var(--markly-text)_8%,transparent)] focus:text-[#F0EDE4]"
              onSelect={() => {
                if (action.label === "Novo orçamento") return onCreateBudget()
                if (action.label === "Novo cliente") return onCreateClient()
                onNavigate(createActionSectionMap[action.label] ?? "overview", displayLabel)
              }}
            >
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold" style={{ color: T.text }}>{displayLabel}</span>
                <span className="block text-[11px] leading-5" style={{ color: T.faint }}>{action.description}</span>
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function getSectionTitle(section: SectionId, anamnesisLabel = "Anamnese") {
  if (section === "anamnesis") return anamnesisLabel
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
  const [budgetColumns, setBudgetColumns] = useState<BudgetColumn[]>(budgetMock.columns)
  const [budgetFilters, setBudgetFilters] = useState<BudgetFilterState>(initialBudgetFilters)
  const [budgetSearchOpen, setBudgetSearchOpen] = useState(false)
  const [budgetCreateOpen, setBudgetCreateOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null)
  const [clientsData, setClientsData] = useState<ClientItem[]>(clientsMock.clients)
  const [clientFilters, setClientFilters] = useState<ClientFilterState>(initialClientFilters)
  const [clientSearchOpen, setClientSearchOpen] = useState(false)
  const [clientCreateOpen, setClientCreateOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(portfolioMock)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => buildCalendarMockEvents())
  const [portfolioFilters, setPortfolioFilters] = useState<PortfolioFilterState>(initialPortfolioFilters)
  const [portfolioSearchOpen, setPortfolioSearchOpen] = useState(false)
  const [portfolioCreateOpen, setPortfolioCreateOpen] = useState(false)
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null)
  const [sidebarMode, setSidebarMode] = useState<SidebarLayoutMode>(() => readSidebarLayoutMode())
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>(() => readAppearanceMode())
  const [cardStyle, setCardStyle] = useState<CardStyleMode>(() => readCardStyleMode())
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => readFontSizeMode())
  const [userProfile, setUserProfile] = useState<UserProfile>(() => readUserProfile())
  const [railHover, setRailHover] = useState(false)
  const {
    studios,
    activeStudioId,
    studioProfile,
    studioSetupCompleted,
    createStudio,
    updateActiveStudioProfile,
    switchStudio,
  } = useStudioManager()
  const [addStudioModalOpen, setAddStudioModalOpen] = useState(false)
  const studioDataCacheRef = useRef<Record<string, StudioOperationalData>>({})

  const seedFreshStudioData = (): StudioOperationalData => ({
    budgetColumns: budgetMock.columns,
    clients: clientsMock.clients,
    portfolioItems: portfolioMock,
    financeTransactions: financeMock.transactions,
    calendarEvents: buildCalendarMockEvents(),
  })

  const applyStudioData = (data: StudioOperationalData) => {
    setBudgetColumns(data.budgetColumns)
    setClientsData(data.clients)
    setPortfolioItems(data.portfolioItems)
    setFinanceTransactions(data.financeTransactions)
    setCalendarEvents(data.calendarEvents)
  }

  const resetSectionSelection = () => {
    setSelectedBudget(null)
    setSelectedClient(null)
    setSelectedPortfolioItem(null)
    setActiveSection("overview")
  }

  const handleSwitchStudio = (id: string) => {
    if (id === activeStudioId) return
    if (activeStudioId) {
      studioDataCacheRef.current[activeStudioId] = {
        budgetColumns,
        clients: clientsData,
        portfolioItems,
        financeTransactions,
        calendarEvents,
      }
    }
    applyStudioData(studioDataCacheRef.current[id] ?? seedFreshStudioData())
    switchStudio(id)
    resetSectionSelection()
    const target = studios.find((item) => item.id === id)
    toast(`Studio "${studioValue(target?.profile.studioName ?? "", "sem nome")}" ativado.`)
  }

  const handleCreateStudio = (profile: StudioProfile) => {
    if (activeStudioId) {
      studioDataCacheRef.current[activeStudioId] = {
        budgetColumns,
        clients: clientsData,
        portfolioItems,
        financeTransactions,
        calendarEvents,
      }
    }
    const newId = createStudio(profile)
    const freshData = seedFreshStudioData()
    studioDataCacheRef.current[newId] = freshData
    applyStudioData(freshData)
    resetSectionSelection()
    setAddStudioModalOpen(false)
    toast(`Studio "${studioValue(profile.studioName, "sem nome")}" criado e ativado.`)
  }
  const verticalConfig = useMemo(() => getVerticalConfig(studioProfile.vertical), [studioProfile.vertical])
  const visibleSections = useMemo(
    () =>
      sections
        .filter((item) => item.id !== "anamnesis" || verticalConfig.showAnamnesis)
        .map((item) => (item.id === "anamnesis" ? { ...item, label: verticalConfig.anamnesisSidebarLabel } : item)),
    [verticalConfig],
  )

  useEffect(() => {
    if (activeSection === "anamnesis" && !verticalConfig.showAnamnesis) {
      setActiveSection("overview")
    }
  }, [activeSection, verticalConfig.showAnamnesis])

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

  const handleCardStyleChange = (mode: CardStyleMode) => {
    setCardStyle(mode)
    persistCardStyleMode(mode)
    toast(mode === "rounded" ? "Cards arredondados ativados." : "Cards quadrados ativados.")
  }

  const handleFontSizeChange = (mode: FontSizeMode) => {
    setFontSize(mode)
    persistFontSizeMode(mode)
    toast(`Tamanho de fonte: ${mode === "small" ? "pequena" : mode === "large" ? "grande" : "média"}.`)
  }

  const handleSaveUserProfile = (next: UserProfile) => {
    setUserProfile(next)
    persistUserProfile(next)
    toast("Perfil atualizado.")
  }

  const sidebarVars = useMemo(
    () => ({
      "--sidebar": appearanceMode === "light" ? "#FFFFFF" : "#020806",
      "--sidebar-foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--sidebar-border": appearanceMode === "light" ? "rgba(16,35,27,0.12)" : "color-mix(in srgb, var(--markly-text) 10%, transparent)",
      "--sidebar-accent": appearanceMode === "light" ? "rgba(13,92,83,0.07)" : "color-mix(in srgb, var(--markly-accent) 8%, transparent)",
      "--sidebar-accent-foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--background": appearanceMode === "light" ? "#FBFEFB" : T.bg,
      "--foreground": appearanceMode === "light" ? "#17231E" : T.text,
      "--border": appearanceMode === "light" ? "rgba(16,35,27,0.12)" : "color-mix(in srgb, var(--markly-text) 10%, transparent)",
    }) as CSSProperties,
    [appearanceMode],
  )

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.marklyTheme = appearanceMode
    root.classList.toggle("dark", appearanceMode === "dark")

    return () => {
      delete root.dataset.marklyTheme
      root.classList.remove("dark")
    }
  }, [appearanceMode])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (activeSection === "budgets") {
          setBudgetSearchOpen(true)
          return
        }
        if (activeSection === "clients") {
          setClientSearchOpen(true)
          return
        }
        if (activeSection === "portfolio") {
          setPortfolioSearchOpen(true)
          return
        }
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeSection])

  const logout = () => {
    clearDevSession()
    window.location.hash = "#/login"
  }

  const activeStudioName = studioValue(studioProfile.studioName, overviewMock.studioProfile.fallbackName)
  const activeChannel = studioValue(studioProfile.mainContactChannel, overviewMock.studioProfile.fallbackChannel)
  const todayDateLabel = useMemo(() => formatTodayDate(), [])
  const isOverview = activeSection === "overview"
  const isBudgets = activeSection === "budgets"
  const isClients = activeSection === "clients"
  const isPortfolio = activeSection === "portfolio"
  const isFinance = activeSection === "finance"
  const isCalendar = activeSection === "calendar"
  const isSettings = activeSection === "settings"
  const budgetItems = useMemo(() => allBudgetItems(budgetColumns), [budgetColumns])
  const addBudget = (budget: BudgetItem) => {
    const columnId = budgetColumnIdForStatus(budget.status)
    setBudgetColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, count: column.count + 1, items: [budget, ...column.items] }
          : column,
      ),
    )
    setSelectedBudget(budget)
  }
  const addClient = (client: ClientItem) => {
    setClientsData((current) => [client, ...current])
    setSelectedClient(client)
  }
  const addPortfolioItem = (item: PortfolioItem) => {
    setPortfolioItems((current) => [item, ...current])
    setSelectedPortfolioItem(item)
    toast(`Trabalho "${item.title}" salvo no portfólio.`)
  }
  const handleBudgetAction = (action: string) => {
    if (!selectedBudget) return
    const nextStatus = nextBudgetStatusForAction(action)
    if (!nextStatus) {
      toast(`"${action}" ainda não está disponível nesta versão.`)
      return
    }
    const { id, title } = selectedBudget
    setBudgetColumns((current) => moveBudgetToStatus(current, id, nextStatus))
    setSelectedBudget(null)
    toast(`${title}: movido para "${nextStatus}".`)
  }
  const handleClientAction = (action: string) => {
    if (!selectedClient) return
    if (action === "Criar orçamento") {
      const name = selectedClient.name
      setSelectedClient(null)
      setActiveSection("budgets")
      setBudgetCreateOpen(true)
      toast(`Criando orçamento para ${name}.`)
      return
    }
    if (action === "Registrar pagamento") {
      toast(`Pagamento registrado (simulado) para ${selectedClient.name}.`)
      return
    }
    const { client, message } = applyClientAction(selectedClient, action, verticalConfig.anamnesisSidebarLabel)
    setClientsData((current) => current.map((item) => (item.id === client.id ? client : item)))
    setSelectedClient(client)
    toast(message)
  }
  const handlePortfolioAction = (action: string) => {
    if (!selectedPortfolioItem) return
    if (action === "Baixar fotos" || action === "Editar trabalho") {
      toast(`"${action}" ainda é mockado nesta versão.`)
      return
    }
    const { item, message } = applyPortfolioAction(selectedPortfolioItem, action)
    setPortfolioItems((current) => current.map((portfolioItem) => (portfolioItem.id === item.id ? item : portfolioItem)))
    setSelectedPortfolioItem(item)
    toast(message)
  }
  const handleMarkFinancePaid = (transaction: FinanceTransaction) => {
    setFinanceTransactions((current) => current.map((item) => (item.id === transaction.id ? { ...item, status: "Pago" } : item)))
    toast(`Pagamento de ${transaction.category} marcado como recebido.`)
  }
  const handleAnamnesisAction = (client: ClientItem, action: string) => {
    const { client: updated, message } = applyClientAction(client, action, verticalConfig.anamnesisSidebarLabel)
    setClientsData((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    if (selectedClient?.id === updated.id) setSelectedClient(updated)
    toast(message)
  }
  const handleCreateNavigate = (section: SectionId, label: string) => {
    setActiveSection(section)
    toast(`"${label}" ainda não tem criação direta — veja a seção correspondente.`)
  }
  const headerBadge = isOverview
    ? "Operação ativa"
    : isBudgets || isClients || isPortfolio
      ? "Studio configurado"
    : studioSetupCompleted
      ? "Studio configurado"
      : "Tudo liberado para desenvolvimento"
  const headerSubtitle = isOverview
    ? `${activeStudioName} · ${todayDateLabel}`
    : isBudgets
      ? `${activeStudioName} · acompanhe seus pedidos do primeiro contato até a sessão fechada.`
    : isClients
      ? "Organize contatos, histórico, orçamentos e sessões do seu studio."
    : isPortfolio
      ? "Salve trabalhos profissionais, organize fotos finais e escolha o que entra na vitrine."
    : studioSetupCompleted
      ? `Horário: ${studioHours(studioProfile)} · Canal principal: ${activeChannel} · Equipe: ${studioValue(studioProfile.teamSize)}`
      : "Tela mockada para validar a experiência principal do SaaS."
  const overviewSummary = `${overviewMock.summary.todaySessions} sessões hoje · ${overviewMock.summary.unansweredBudgets} orçamentos abertos · ${formatCurrency(overviewMock.summary.pendingDepositsAmount)} em sinais pendentes`

  return (
    <VerticalConfigContext.Provider value={verticalConfig}>
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
        className={cn(
          "top-16 h-[calc(100svh-4rem)] border-r border-[color-mix(in srgb, var(--markly-text) 10%, transparent)] [&_[data-sidebar=sidebar]]:relative [&_[data-sidebar=sidebar]]:overflow-hidden",
          appearanceMode === "light"
            ? "[&_[data-sidebar=sidebar]]:shadow-[8px_0_24px_rgba(23,35,30,0.08)]"
            : "[&_[data-sidebar=sidebar]]:shadow-[18px_0_70px_rgba(0,0,0,0.34)]",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 18% 4%, color-mix(in srgb, var(--markly-accent) 10%, transparent), transparent 28%), radial-gradient(circle at 78% 34%, rgba(0,71,65,0.28), transparent 34%), linear-gradient(180deg, rgba(6,17,15,0.98), rgba(2,8,6,0.98) 56%, rgba(3,11,9,0.98))",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-px"
          style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--markly-accent) 20%, transparent), transparent)" }}
        />

        <SidebarHeader className="relative z-10 px-2 pb-3 pt-4">
          <StudioSwitcher
            profile={studioProfile}
            studios={studios}
            activeStudioId={activeStudioId}
            onManage={() => setStudioManageOpen(true)}
            onSwitchStudio={handleSwitchStudio}
            onAddStudio={() => setAddStudioModalOpen(true)}
          />
        </SidebarHeader>

        <SidebarContent className="relative z-10 px-2 pb-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {visibleSections.map(({ id, label, icon: Icon, badge }) => {
                  const isActive = activeSection === id
                  return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      onClick={() => setActiveSection(id)}
                      className="relative flex! h-11 items-center gap-0! rounded-[15px] py-0! pl-0! pr-8! text-[color-mix(in srgb, var(--markly-text) 64%, transparent)] transition-[background-color,color,box-shadow,transform] duration-300 hover:bg-[color-mix(in_srgb,var(--markly-text)_5.5%,transparent)] hover:text-[#F0EDE4] data-[active=true]:bg-transparent data-[active=true]:text-[#F0EDE4] group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-11! group-data-[collapsible=icon]:w-11! group-data-[collapsible=icon]:pr-0!"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="markly-sidebar-active"
                          className="absolute inset-y-0 left-0 right-0 rounded-[15px] group-data-[collapsible=icon]:right-auto group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11"
                          style={{
                            background: "linear-gradient(90deg, color-mix(in srgb, var(--markly-accent) 12%, transparent), rgba(0,71,65,0.18), rgba(0,71,65,0.08))",
                            boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--markly-text) 8%, transparent), 0 10px 28px rgba(0,0,0,0.16)",
                          }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <span
                        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-200"
                        style={{ color: isActive ? T.accent : appearanceMode === "light" ? "rgba(23,35,30,0.58)" : "color-mix(in srgb, var(--markly-text) 58%, transparent)" }}
                      >
                        <Icon size={19} strokeWidth={1.85} />
                      </span>
                      <span className="relative z-10 flex h-11 min-w-0 max-w-[150px] items-center overflow-hidden whitespace-nowrap text-[13px] font-semibold leading-none transition-[max-width,opacity,transform] duration-200 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:opacity-0">
                        {label}
                      </span>
                    </SidebarMenuButton>
                    {badge && (
                      <SidebarMenuBadge
                        className="right-3 top-1/2! h-5 min-w-[1.65rem] -translate-y-1/2 rounded-full border px-2 text-center text-[10px] font-bold shadow-[0_8px_18px_color-mix(in srgb, var(--markly-accent) 12%, transparent)]"
                        style={{ background: T.accent, borderColor: "color-mix(in srgb, var(--markly-text) 32%, transparent)", color: T.bg }}
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

      <SidebarInset className="min-h-screen min-w-0 bg-[var(--markly-bg)] pt-16 text-[var(--markly-text)]">
        <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-7" style={{ background: "color-mix(in srgb, var(--markly-bg-sec) 88%, transparent)", borderColor: T.border }}>
          <div className="flex min-w-0 items-center gap-4">
            <a href="#/painel" className="flex shrink-0 items-center gap-2.5 rounded-[14px] px-1 py-1.5 transition duration-200 hover:bg-[color-mix(in_srgb,var(--markly-text)_3.5%,transparent)]" aria-label="Markly">
              <img src={marklyIcon} alt="" className="size-9 object-contain" style={{ filter: "drop-shadow(0 0 16px color-mix(in srgb, var(--markly-accent) 8%, transparent))" }} aria-hidden="true" />
              <span className="font-display text-xl font-semibold leading-none" style={{ color: T.text }}>
                Markly
              </span>
            </a>
            <div className="hidden h-8 w-px shrink-0 md:block" style={{ background: "color-mix(in srgb, var(--markly-text) 10%, transparent)" }} />
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
                background: appearanceMode === "light" ? "rgba(23,35,30,0.08)" : "rgba(240,237,228,0.10)",
                borderColor: appearanceMode === "light" ? "rgba(23,35,30,0.22)" : "rgba(240,237,228,0.22)",
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

        <main
          className={cn(
            "markly-dashboard-main min-h-[calc(100vh-64px)] min-w-0 p-4 md:p-7",
            cardStyle === "square" ? "markly-square-surfaces" : "markly-round-surfaces",
          )}
          style={{ zoom: fontSizeZoomScale[fontSize] }}
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <motion.div
                className="markly-status-chip relative mb-3 inline-flex items-center gap-2 overflow-hidden border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{
                  background: "linear-gradient(90deg, color-mix(in srgb, var(--markly-accent) 18%, transparent), rgba(0,71,65,0.18), color-mix(in srgb, var(--markly-accent) 6%, transparent))",
                  borderColor: "color-mix(in srgb, var(--markly-accent) 32%, transparent)",
                  color: T.text,
                  boxShadow: "0 14px 34px rgba(0,71,65,0.18), inset 0 1px 0 color-mix(in srgb, var(--markly-text) 12%, transparent)",
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
                {isFinance ? "Controle financeiro" : activeSection === "anamnesis" ? `${verticalConfig.anamnesisSidebarLabel} · dados de exemplo` : headerBadge}
              </motion.div>
              <h2
                className="font-display text-[1.5rem] font-semibold md:text-[2.25rem]"
                style={{ color: T.text }}
              >
                {getSectionTitle(activeSection, verticalConfig.anamnesisSidebarLabel)}
              </h2>
              <p className="mt-1 max-w-[620px] text-sm leading-6" style={{ color: T.muted }}>
                {isFinance ? "Acompanhe sinais, pagamentos e faturamento do seu studio." : activeSection === "anamnesis" ? verticalConfig.anamnesisSectionCopy : headerSubtitle}
              </p>
              {isOverview && (
                <p className="mt-1 max-w-[720px] text-[13px] leading-6" style={{ color: T.faint }}>
                  {overviewSummary}
                </p>
              )}
            </div>
            {!isSettings && (
              <div className="flex flex-wrap gap-2">
                {isBudgets ? (
                  <BudgetFilterMenu value={budgetFilters} onChange={setBudgetFilters} />
                ) : isClients ? (
                  <ClientFilterMenu value={clientFilters} onChange={setClientFilters} />
                ) : isPortfolio ? (
                  <PortfolioFilterMenu value={portfolioFilters} onChange={setPortfolioFilters} />
                ) : (
                  !isFinance && !isCalendar && <DateFilterMenu value={dateFilter} onChange={setDateFilter} />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (isBudgets) {
                      setBudgetSearchOpen(true)
                      return
                    }
                    if (isClients) {
                      setClientSearchOpen(true)
                      return
                    }
                    if (isPortfolio) {
                      setPortfolioSearchOpen(true)
                      return
                    }
                    setSearchOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm transition duration-200 hover:border-[color-mix(in_srgb,var(--markly-text)_22%,transparent)] hover:text-[#F0EDE4]"
                  style={{ borderColor: T.border, color: T.muted }}
                >
                  <Search size={15} /> Buscar
                  <span className="ml-1 hidden rounded-md border px-1.5 py-0.5 text-[10px] font-semibold md:inline-flex" style={{ borderColor: T.border, color: T.faint }}>
                    Ctrl K
                  </span>
                </button>
                {isBudgets ? (
                  <NewBudgetButton onClick={() => setBudgetCreateOpen(true)} />
                ) : isClients ? (
                  <NewClientButton onClick={() => setClientCreateOpen(true)} />
                ) : isPortfolio ? (
                  <NewPortfolioButton onClick={() => setPortfolioCreateOpen(true)} />
                ) : isFinance ? (
                  <FinanceLaunchButton onClick={() => setFinanceLaunchOpen(true)} />
                ) : (
                  <CreateMenu
                    onCreateBudget={() => setBudgetCreateOpen(true)}
                    onCreateClient={() => setClientCreateOpen(true)}
                    onNavigate={handleCreateNavigate}
                  />
                )}
              </div>
            )}
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
                onMarkFinancePaid={handleMarkFinancePaid}
                budgetColumns={budgetColumns}
                budgetFilters={budgetFilters}
                onOpenBudget={setSelectedBudget}
                onNewBudget={() => setBudgetCreateOpen(true)}
                clients={clientsData}
                clientFilters={clientFilters}
                onOpenClient={setSelectedClient}
                onNewClient={() => setClientCreateOpen(true)}
                onAnamnesisAction={handleAnamnesisAction}
                portfolioItems={portfolioItems}
                portfolioFilters={portfolioFilters}
                onOpenPortfolioItem={setSelectedPortfolioItem}
                onNewPortfolioItem={() => setPortfolioCreateOpen(true)}
                cardStyle={cardStyle}
                onCardStyleChange={handleCardStyleChange}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                userProfile={userProfile}
                onSaveUserProfile={handleSaveUserProfile}
                calendarEvents={calendarEvents}
                onCalendarEventsChange={setCalendarEvents}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>

      <StudioSetupModal
        open={!studioSetupCompleted || addStudioModalOpen}
        theme={appearanceMode}
        initialProfile={addStudioModalOpen ? defaultStudioProfile : studioProfile}
        onComplete={handleCreateStudio}
        onCancel={addStudioModalOpen ? () => setAddStudioModalOpen(false) : undefined}
      />

      <StudioManageModal
        open={studioManageOpen}
        profile={studioProfile}
        onOpenChange={setStudioManageOpen}
        onSave={updateActiveStudioProfile}
      />

      <FinanceLaunchModal
        open={financeLaunchOpen}
        onOpenChange={setFinanceLaunchOpen}
        onSave={(transaction) => setFinanceTransactions((current) => [transaction, ...current])}
      />

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <BudgetSearchModal
        open={budgetSearchOpen}
        budgets={budgetItems}
        onOpenChange={setBudgetSearchOpen}
        onOpenBudget={setSelectedBudget}
      />
      <ClientSearchModal
        open={clientSearchOpen}
        clients={clientsData}
        onOpenChange={setClientSearchOpen}
        onOpenClient={setSelectedClient}
      />
      <PortfolioSearchModal
        open={portfolioSearchOpen}
        items={portfolioItems}
        onOpenChange={setPortfolioSearchOpen}
        onOpenItem={setSelectedPortfolioItem}
      />
      <NewBudgetModal
        open={budgetCreateOpen}
        onOpenChange={setBudgetCreateOpen}
        onSave={addBudget}
      />
      <NewClientModal
        open={clientCreateOpen}
        onOpenChange={setClientCreateOpen}
        onSave={addClient}
      />
      <NewPortfolioModal
        open={portfolioCreateOpen}
        onOpenChange={setPortfolioCreateOpen}
        onSave={addPortfolioItem}
      />
      <BudgetDetailPanel budget={selectedBudget} onOpenChange={(open) => !open && setSelectedBudget(null)} onAction={handleBudgetAction} />
      <ClientDetailPanel client={selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)} onAction={handleClientAction} />
      <PortfolioDetailPanel item={selectedPortfolioItem} onOpenChange={(open) => !open && setSelectedPortfolioItem(null)} onAction={handlePortfolioAction} />
      <Toaster
        position="bottom-right"
        theme={appearanceMode}
        toastOptions={{
          style: { background: T.card, color: T.text, border: `1px solid ${T.border}` },
        }}
      />
    </SidebarProvider>
    </VerticalConfigContext.Provider>
  )
}
