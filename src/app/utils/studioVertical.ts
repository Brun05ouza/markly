import { Gem, PenTool, Scissors, Sparkles, Layers, type LucideIcon } from "lucide-react"

export type StudioVertical = "tatuagem" | "barbearia" | "estetica" | "unhas" | "outro"

export type VerticalConfig = {
  id: StudioVertical
  label: string
  onboardingDescription: string
  icon: LucideIcon
  studioNamePlaceholder: string
  projectTitlePlaceholder: string
  styleFieldLabel: string
  styleOptions: string[]
  placementFieldLabel: string | null
  placementFieldPlaceholder: string
  detailsSectionLabel: string
  specialtiesQuestion: string
  specialtiesLabel: string
  financeExamplePlaceholder: string
  showAnamnesis: boolean
  anamnesisSidebarLabel: string
  anamnesisSectionLabel: string
  anamnesisSectionCopy: string
}

export const studioVerticals: VerticalConfig[] = [
  {
    id: "tatuagem",
    label: "Tatuagem",
    onboardingDescription: "Sessões, orçamentos por estilo e anamnese",
    icon: PenTool,
    studioNamePlaceholder: "Ex: Black Rose Tattoo",
    projectTitlePlaceholder: "Ex: Fine line costela",
    styleFieldLabel: "Estilo",
    styleOptions: ["Fine line", "Blackwork", "Realismo", "Old school", "Floral", "Geométrico", "Anime/geek", "Minimalista", "Autoral", "Oriental", "Lettering", "Outro"],
    placementFieldLabel: "Local do corpo",
    placementFieldPlaceholder: "Ex: Antebraço, costela, ombro...",
    detailsSectionLabel: "Detalhes da tattoo",
    specialtiesQuestion: "Quais estilos você mais trabalha?",
    specialtiesLabel: "Estilos principais",
    financeExamplePlaceholder: "Ex: Sinal tattoo fine line",
    showAnamnesis: true,
    anamnesisSidebarLabel: "Anamnese",
    anamnesisSectionLabel: "Ficha de anamnese",
    anamnesisSectionCopy: "Organize fichas, envios e pendências de anamnese dos clientes.",
  },
  {
    id: "barbearia",
    label: "Barbearia",
    onboardingDescription: "Cortes, barba e horários por profissional",
    icon: Scissors,
    studioNamePlaceholder: "Ex: Barbearia Vintage",
    projectTitlePlaceholder: "Ex: Corte + barba",
    styleFieldLabel: "Serviço",
    styleOptions: ["Corte", "Barba", "Corte + barba", "Sobrancelha", "Coloração", "Alisamento", "Infantil", "Outro"],
    placementFieldLabel: null,
    placementFieldPlaceholder: "",
    detailsSectionLabel: "Detalhes do serviço",
    specialtiesQuestion: "Quais serviços você mais oferece?",
    specialtiesLabel: "Serviços principais",
    financeExamplePlaceholder: "Ex: Sinal corte + barba",
    showAnamnesis: false,
    anamnesisSidebarLabel: "Anamnese",
    anamnesisSectionLabel: "Ficha de anamnese",
    anamnesisSectionCopy: "Organize fichas, envios e pendências de anamnese dos clientes.",
  },
  {
    id: "estetica",
    label: "Estética",
    onboardingDescription: "Procedimentos, áreas de tratamento e termos de consentimento",
    icon: Sparkles,
    studioNamePlaceholder: "Ex: Espaço Estética Aurora",
    projectTitlePlaceholder: "Ex: Limpeza de pele",
    styleFieldLabel: "Procedimento",
    styleOptions: ["Limpeza de pele", "Peeling", "Microagulhamento", "Massagem", "Design de sobrancelha", "Depilação", "Drenagem", "Outro"],
    placementFieldLabel: "Área tratada",
    placementFieldPlaceholder: "Ex: Rosto, costas, abdômen...",
    detailsSectionLabel: "Detalhes do procedimento",
    specialtiesQuestion: "Quais procedimentos você mais realiza?",
    specialtiesLabel: "Procedimentos principais",
    financeExamplePlaceholder: "Ex: Sinal limpeza de pele",
    showAnamnesis: true,
    anamnesisSidebarLabel: "Consentimento",
    anamnesisSectionLabel: "Termo de consentimento",
    anamnesisSectionCopy: "Organize termos, envios e pendências de consentimento dos clientes.",
  },
  {
    id: "unhas",
    label: "Unhas",
    onboardingDescription: "Alongamento, esmaltação e manutenção",
    icon: Gem,
    studioNamePlaceholder: "Ex: Nail Studio Bela",
    projectTitlePlaceholder: "Ex: Alongamento em gel",
    styleFieldLabel: "Serviço",
    styleOptions: ["Alongamento em gel", "Alongamento em fibra", "Esmaltação em gel", "Manutenção", "Nail art", "Spa dos pés", "Outro"],
    placementFieldLabel: null,
    placementFieldPlaceholder: "",
    detailsSectionLabel: "Detalhes do serviço",
    specialtiesQuestion: "Quais serviços de unha você mais realiza?",
    specialtiesLabel: "Serviços principais",
    financeExamplePlaceholder: "Ex: Sinal alongamento em gel",
    showAnamnesis: false,
    anamnesisSidebarLabel: "Anamnese",
    anamnesisSectionLabel: "Ficha de anamnese",
    anamnesisSectionCopy: "Organize fichas, envios e pendências de anamnese dos clientes.",
  },
  {
    id: "outro",
    label: "Outro",
    onboardingDescription: "Personalize os campos depois em Configurações",
    icon: Layers,
    studioNamePlaceholder: "Ex: Nome do seu studio",
    projectTitlePlaceholder: "Ex: Nome do serviço",
    styleFieldLabel: "Serviço",
    styleOptions: ["Serviço padrão", "Pacote", "Avulso", "Outro"],
    placementFieldLabel: null,
    placementFieldPlaceholder: "",
    detailsSectionLabel: "Detalhes do serviço",
    specialtiesQuestion: "Quais serviços você mais oferece?",
    specialtiesLabel: "Especialidades",
    financeExamplePlaceholder: "Ex: Sinal do serviço",
    showAnamnesis: false,
    anamnesisSidebarLabel: "Anamnese",
    anamnesisSectionLabel: "Ficha de anamnese",
    anamnesisSectionCopy: "Organize fichas, envios e pendências de anamnese dos clientes.",
  },
]

export function getVerticalConfig(vertical: string): VerticalConfig {
  return studioVerticals.find((item) => item.id === vertical) ?? studioVerticals[0]
}
