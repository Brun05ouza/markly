import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Sparkles, Upload, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import LottieCheckbox from "../LottieCheckbox"
import { T } from "../../theme"
import { type StudioProfile } from "../../utils/studioStorage"
import { getVerticalConfig, studioVerticals, type VerticalConfig } from "../../utils/studioVertical"
import {
  formatLogoSizeLimit,
  getStudioBrandIcon,
  studioBrandIconOptions,
  studioLogoMaxBytes,
} from "../../utils/studioBrand"

type StudioSetupModalProps = {
  open: boolean
  theme: "light" | "dark"
  initialProfile: StudioProfile
  onComplete: (profile: StudioProfile) => void
  onCancel?: () => void
}

const studioTypes = ["Trabalho sozinho(a)", "Tenho um studio pequeno", "Tenho um studio com equipe"]
const teamSizes = ["Só eu", "2 a 3 pessoas", "4 a 6 pessoas", "Mais de 6 pessoas"]
const contactChannels = ["WhatsApp", "Instagram", "Presencial", "Todos"]
const depositOptions = ["Sim, cobro sinal", "Não cobro sinal", "Depende do orçamento"]
const totalSteps = 6
const timeOptions = Array.from({ length: 31 }, (_, index) => {
  const totalMinutes = 7 * 60 + index * 30
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0")
  const minutes = (totalMinutes % 60).toString().padStart(2, "0")
  return `${hours}:${minutes}`
})

const acceptedLogoTypes = ["image/png", "image/jpeg", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"]

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold" style={{ color: T.text }}>{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="markly-setup-select-trigger min-h-[50px] rounded-[14px] border px-4 py-3 text-left text-[13px] font-semibold shadow-none transition-[background-color,border-color,color] duration-200 data-[placeholder]:text-[var(--markly-faint)]"
          style={{
            background: "color-mix(in srgb, var(--markly-bg-sec) 88%, var(--markly-bg))",
            borderColor: value ? T.borderStrong : T.border,
            color: value ? T.text : T.faint,
            boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--markly-text) 5%, transparent)",
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="markly-setup-select-content z-[140] rounded-[14px] border p-1 shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
          style={{ background: T.card, borderColor: T.borderStrong, color: T.text }}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="markly-setup-select-item rounded-[10px] px-3 py-2.5 text-[13px] text-[var(--markly-muted)] focus:bg-[color-mix(in_srgb,var(--markly-accent)_10%,transparent)] focus:text-[var(--markly-text)]"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function TimeField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div
      className="markly-setup-time-field rounded-[14px] border p-3 transition-all duration-200"
      data-disabled={disabled ? "true" : "false"}
      style={{
        background: disabled ? "rgba(2,8,6,0.28)" : "rgba(2,8,6,0.54)",
        borderColor: disabled ? "rgba(240,237,228,0.07)" : "rgba(240,237,228,0.12)",
        boxShadow: "inset 0 1px 0 rgba(240,237,228,0.04)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>
        {label}
      </span>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className="markly-setup-time-trigger h-auto rounded-[10px] border-0 bg-transparent p-0 text-left text-[20px] font-semibold shadow-none ring-0 focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed [&>svg]:opacity-50"
          style={{ color: T.text }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="z-[150] max-h-[240px] rounded-[14px] border bg-[#081713] p-1 text-[#F0EDE4] shadow-[0_24px_80px_rgba(0,0,0,0.58)]"
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

function Chip({
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
      className="flex min-h-11 w-full items-center justify-center rounded-full border px-3 py-2 text-center text-[12px] font-semibold leading-tight transition-all duration-200"
      style={{
        background: active ? T.text : "rgba(2,8,6,0.42)",
        borderColor: active ? T.text : T.border,
        color: active ? T.bg : T.muted,
      }}
    >
      {label}
    </button>
  )
}

function VerticalOptionCard({
  config,
  active,
  onClick,
}: {
  config: VerticalConfig
  active: boolean
  onClick: () => void
}) {
  const Icon = config.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-start gap-3 rounded-[16px] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: active ? "rgba(216,208,191,0.08)" : "rgba(2,8,6,0.36)",
        borderColor: active ? "rgba(216,208,191,0.32)" : T.border,
      }}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border"
        style={{
          background: active ? "rgba(216,208,191,0.12)" : "rgba(2,8,6,0.42)",
          borderColor: active ? "rgba(216,208,191,0.30)" : T.border,
          color: active ? T.accent : T.muted,
        }}
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold" style={{ color: T.text }}>{config.label}</span>
        <span className="mt-1 block text-[11px] leading-4" style={{ color: T.faint }}>{config.onboardingDescription}</span>
      </span>
    </button>
  )
}

export default function StudioSetupModal({ open, theme, initialProfile, onComplete, onCancel }: StudioSetupModalProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<StudioProfile>(initialProfile)
  const [error, setError] = useState("")

  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step])
  const verticalConfig = useMemo(() => getVerticalConfig(profile.vertical), [profile.vertical])

  useEffect(() => {
    if (open) {
      setStep(0)
      setProfile(initialProfile)
      setError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

    body.style.overflow = "hidden"
    html.style.overflow = "hidden"
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.width = "100%"

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const update = <Key extends keyof StudioProfile>(key: Key, value: StudioProfile[Key]) => {
    setProfile((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const toggleStyle = (style: string) => {
    setProfile((current) => {
      const selected = current.mainStyles.includes(style)
      return {
        ...current,
        mainStyles: selected ? current.mainStyles.filter((item) => item !== style) : [...current.mainStyles, style],
      }
    })
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
    reader.onload = () => {
      update("studioLogoDataUrl", String(reader.result || ""))
    }
    reader.onerror = () => setError("Não foi possível carregar essa logo.")
    reader.readAsDataURL(file)
  }

  const validateStep = () => {
    if (step === 2 && (!profile.studioName.trim() || !profile.studioType || !profile.teamSize)) {
      setError("Preencha o nome, tipo e tamanho do studio para continuar.")
      return false
    }

    if (step === 3 && (!profile.mainContactChannel || !profile.usesDeposit)) {
      setError("Escolha o canal de atendimento e como você trabalha com sinal.")
      return false
    }

    return true
  }

  const next = () => {
    if (!validateStep()) return
    setError("")
    if (step < totalSteps - 1) {
      setStep((current) => current + 1)
      return
    }
    onComplete(profile)
  }

  const back = () => {
    setError("")
    setStep((current) => Math.max(0, current - 1))
  }

  const primaryLabel = step === 0 ? "Configurar meu studio" : step === totalSteps - 1 ? "Entrar no dashboard" : "Continuar"

  return (
    <div
      className="markly-setup-root fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
      data-markly-theme={theme}
      role="dialog"
      aria-modal="true"
      aria-label="Studio Setup"
    >
      <div className="absolute inset-0 bg-black/72 backdrop-blur-xl" />

      <motion.div
        className="relative flex max-h-[calc(100vh-48px)] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] border"
        style={{
          background: T.card,
          borderColor: "rgba(240,237,228,0.12)",
          boxShadow: "0 34px 120px rgba(0,0,0,0.62), inset 0 1px 0 rgba(240,237,228,0.06)",
        }}
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="border-b px-5 py-4 sm:px-7" style={{ borderColor: T.border }}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: T.faint }}>Studio Setup</p>
              <p className="text-[13px] font-semibold" style={{ color: T.text }}>{step + 1} de {totalSteps}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold" style={{ borderColor: T.border, color: T.accent, background: "rgba(0,71,65,0.18)" }}>
                <Clock size={13} /> Leva menos de 1 minuto
              </div>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  aria-label="Cancelar"
                  className="flex size-8 items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: T.border, color: T.muted }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(240,237,228,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: T.text }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.24 }}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] border" style={{ background: "rgba(240,237,228,0.06)", borderColor: T.border }}>
                    <Sparkles size={24} style={{ color: T.accent }} />
                  </div>
                  <h2 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: T.text, letterSpacing: "-0.04em" }}>
                    Bem-vindo ao Markly.
                  </h2>
                  <p className="mx-auto mt-4 max-w-[560px] text-sm leading-7 sm:text-[15px]" style={{ color: T.muted }}>
                    Seu SaaS para organizar orçamentos, clientes, agenda e sessões do seu estúdio em um só lugar.
                    Antes de começar, precisamos configurar algumas informações rápidas para deixar sua experiência mais personalizada.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold" style={{ color: T.text }}>Qual é o segmento do seu studio?</h2>
                  <p className="mt-2 text-sm" style={{ color: T.muted }}>
                    Isso ajusta os campos e termos usados no seu painel. Você pode mudar depois em Configurações.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {studioVerticals.map((item) => (
                      <VerticalOptionCard
                        key={item.id}
                        config={item}
                        active={profile.vertical === item.id}
                        onClick={() => update("vertical", item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold" style={{ color: T.text }}>Vamos conhecer seu studio.</h2>
                  <div className="mt-6 grid gap-5">
                    <label>
                      <span className="mb-2 block text-[12px] font-semibold" style={{ color: T.text }}>Qual é o nome do seu studio?</span>
                      <input
                        value={profile.studioName}
                        onChange={(event) => update("studioName", event.target.value)}
                        placeholder={verticalConfig.studioNamePlaceholder}
                        className="w-full rounded-[12px] border px-4 py-3 text-sm outline-none"
                        style={{ background: "rgba(2,8,6,0.58)", borderColor: T.border, color: T.text }}
                      />
                    </label>

                    <div className="rounded-[18px] border p-4" style={{ background: "rgba(240,237,228,0.03)", borderColor: T.border }}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: T.text }}>Identidade do studio</p>
                          <p className="mt-0.5 text-[11px]" style={{ color: T.faint }}>Escolha um ícone ou suba uma logo leve.</p>
                        </div>
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border" style={{ background: "rgba(2,8,6,0.42)", borderColor: T.borderStrong }}>
                          {profile.studioLogoDataUrl ? (
                            <img src={profile.studioLogoDataUrl} alt="" className="size-full object-cover" aria-hidden="true" />
                          ) : (
                            (() => {
                              const BrandIcon = getStudioBrandIcon(profile.studioIcon)
                              return <BrandIcon size={21} strokeWidth={1.8} style={{ color: T.accent }} />
                            })()
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Ícone Lucide</p>
                          <div className="grid grid-cols-7 gap-2">
                            {studioBrandIconOptions.map((item) => {
                              const Icon = item.icon
                              const active = profile.studioIcon === item.id && !profile.studioLogoDataUrl
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  title={item.label}
                                  onClick={() => update("studioIcon", item.id)}
                                  className="flex aspect-square items-center justify-center rounded-[12px] border transition duration-200 hover:border-[rgba(216,208,191,0.28)]"
                                  style={{
                                    background: active ? "rgba(216,208,191,0.11)" : "rgba(2,8,6,0.36)",
                                    borderColor: active ? "rgba(216,208,191,0.30)" : T.border,
                                    color: active ? T.accent : T.muted,
                                  }}
                                >
                                  <Icon size={17} strokeWidth={1.8} />
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.faint }}>Logo opcional</p>
                          <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-[12px] border px-3 text-[12px] font-semibold transition duration-200 hover:border-[rgba(216,208,191,0.28)]" style={{ background: "rgba(2,8,6,0.36)", borderColor: T.border, color: T.muted }}>
                            <Upload size={15} />
                            Subir logo
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.ico,image/png,image/jpeg,image/webp,image/x-icon"
                              className="sr-only"
                              onChange={(event) => handleLogoUpload(event.target.files?.[0])}
                            />
                          </label>
                          <p className="mt-2 text-[10.5px] leading-4" style={{ color: T.faint }}>
                            PNG, JPG, WEBP ou ICO até {formatLogoSizeLimit()}.
                          </p>
                          {profile.studioLogoDataUrl && (
                            <button
                              type="button"
                              onClick={() => update("studioLogoDataUrl", "")}
                              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold"
                              style={{ color: T.accent }}
                            >
                              <X size={13} /> Remover logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField
                        label="Como você trabalha hoje?"
                        placeholder="Selecione o formato"
                        value={profile.studioType}
                        options={studioTypes}
                        onChange={(value) => update("studioType", value)}
                      />

                      <SelectField
                        label="Quantas pessoas trabalham no studio?"
                        placeholder="Selecione o tamanho"
                        value={profile.teamSize}
                        options={teamSizes}
                        onChange={(value) => update("teamSize", value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold" style={{ color: T.text }}>Como seu studio funciona?</h2>
                  <div className="mt-6 grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField
                        label="Como você costuma atender seus clientes?"
                        placeholder="Escolha um canal"
                        value={profile.mainContactChannel}
                        options={contactChannels}
                        onChange={(value) => update("mainContactChannel", value)}
                      />

                      <SelectField
                        label="Você trabalha com sinal/reserva?"
                        placeholder="Escolha uma opção"
                        value={profile.usesDeposit}
                        options={depositOptions}
                        onChange={(value) => update("usesDeposit", value)}
                      />
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[12px] font-semibold" style={{ color: T.text }}>Horário padrão de atendimento</p>
                          <p className="mt-0.5 text-[11px]" style={{ color: T.faint }}>Usado para montar sua agenda inicial.</p>
                        </div>
                        <div className="hidden rounded-full border px-3 py-1.5 text-[11px] font-semibold sm:inline-flex" style={{ borderColor: T.border, color: T.accent, background: "rgba(0,71,65,0.16)" }}>
                          {profile.flexibleHours ? "Flexível" : `${profile.businessHoursStart} - ${profile.businessHoursEnd}`}
                        </div>
                      </div>
                      <div className="rounded-[18px] border p-3" style={{ background: "rgba(240,237,228,0.035)", borderColor: "rgba(240,237,228,0.12)" }}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <TimeField
                            label="Início"
                            value={profile.businessHoursStart}
                            onChange={(value) => update("businessHoursStart", value)}
                            disabled={profile.flexibleHours}
                          />
                          <TimeField
                            label="Fim"
                            value={profile.businessHoursEnd}
                            onChange={(value) => update("businessHoursEnd", value)}
                            disabled={profile.flexibleHours}
                          />
                        </div>
                        <div className="markly-setup-flexible-row mt-3 flex items-center gap-2.5 rounded-[14px] border px-3 py-2.5" style={{ background: "rgba(2,8,6,0.36)", borderColor: T.border }}>
                          <LottieCheckbox className="markly-setup-checkbox" checked={profile.flexibleHours} onChange={(checked) => update("flexibleHours", checked)} />
                          <button
                            type="button"
                            onClick={() => update("flexibleHours", !profile.flexibleHours)}
                            className="text-left text-[12px] font-semibold leading-5"
                            style={{ color: profile.flexibleHours ? T.text : T.muted }}
                          >
                            Meu horário é flexível
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold" style={{ color: T.text }}>{verticalConfig.specialtiesQuestion}</h2>
                  <p className="mt-2 text-sm" style={{ color: T.muted }}>Selecione quantos quiser. Você pode ajustar isso depois.</p>
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {verticalConfig.styleOptions.map((item) => (
                      <Chip key={item} label={item} active={profile.mainStyles.includes(item)} onClick={() => toggleStyle(item)} />
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] border" style={{ background: "rgba(240,237,228,0.06)", borderColor: T.border }}>
                    <CheckCircle2 size={26} style={{ color: T.accent }} />
                  </div>
                  <h2 className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: T.text, letterSpacing: "-0.04em" }}>
                    Seu studio está pronto.
                  </h2>
                  <p className="mx-auto mt-4 max-w-[520px] text-sm leading-7 sm:text-[15px]" style={{ color: T.muted }}>
                    Agora o Markly vai adaptar sua visão geral com base no funcionamento do seu studio.
                    Você poderá alterar essas informações depois em Configurações.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                className="mt-5 rounded-[12px] border px-4 py-3 text-[12px] font-semibold"
                style={{ background: "rgba(232,160,160,0.08)", borderColor: "rgba(232,160,160,0.20)", color: "#F0B7B7" }}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-3 border-t px-5 py-4 sm:px-7" style={{ borderColor: T.border }}>
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold disabled:pointer-events-none disabled:opacity-0"
            style={{ borderColor: T.border, color: T.muted, background: "rgba(240,237,228,0.02)" }}
          >
            <ArrowLeft size={15} /> Voltar
          </button>

          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold"
            style={{ background: T.text, color: T.bg }}
          >
            {primaryLabel} <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
