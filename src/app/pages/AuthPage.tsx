import { useEffect, useMemo, useState, FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import marklyIcon from "../../assets/icon-markly.png"
import DarkVeil from "../components/DarkVeil/DarkVeil"
import LottieCheckbox from "../components/LottieCheckbox"
import { startDevSession, validateDevAccess } from "../devAccess"
import { T } from "../theme"

type AuthMode = "login" | "cadastro"

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.16 7.16 0 0 1 4.9 12c0-.8.14-1.57.37-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  )
}

function Brand() {
  return (
    <a href="#" className="mx-auto mb-5 flex w-fit items-center gap-3" style={{ color: T.text }}>
      <span
        className="flex h-12 w-12 items-center justify-center rounded-[14px] border"
        style={{
          background: "rgba(240,237,228,0.06)",
          borderColor: "rgba(240,237,228,0.12)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
        }}
      >
        <img src={marklyIcon} alt="" className="h-8 w-8 object-contain" aria-hidden="true" />
      </span>
      <span className="font-display text-[26px] font-bold" style={{ letterSpacing: "-0.04em" }}>
        Markly
      </span>
    </a>
  )
}

function Field({
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
}: {
  label: string
  type: string
  placeholder: string
  icon: typeof Mail
  value: string
  onChange: (value: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow] = useState(false)
  const isPassword = type === "password"

  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-[12px] font-semibold" style={{ color: T.text }}>
        {label}
      </span>
      <div
        className="flex items-center gap-2.5 rounded-[12px] border px-3.5 py-2.5 transition-all duration-200"
        style={{
          background: "rgba(2,8,6,0.58)",
          borderColor: focused ? "rgba(216,208,191,0.38)" : "rgba(240,237,228,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(216,208,191,0.08)" : "none",
        }}
      >
        <Icon size={15} style={{ color: focused ? T.accent : T.faint }} />
        <input
          type={isPassword && show ? "text" : type}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent text-[13px] outline-none placeholder:text-[rgba(240,237,228,0.34)]"
          style={{ color: T.text }}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShow(!show)}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center"
            style={{ color: T.faint }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={show ? "open" : "closed"}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.12 }}
                className="flex"
              >
                {show ? <Eye size={15} /> : <EyeOff size={15} />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </div>
    </label>
  )
}

function ModeSwitch({ mode }: { mode: AuthMode }) {
  const items = [
    { key: "login", label: "Entrar", href: "#/login" },
    { key: "cadastro", label: "Criar conta", href: "#/cadastro" },
  ] as const

  return (
    <div className="grid grid-cols-2 rounded-[14px] border p-1" style={{ background: "rgba(2,8,6,0.42)", borderColor: T.border }}>
      {items.map((item) => {
        const active = mode === item.key
        return (
          <a
            key={item.key}
            href={item.href}
            className="relative flex h-9 items-center justify-center rounded-[10px] text-[12.5px] font-semibold transition-colors duration-200"
            style={{ color: active ? T.bg : T.faint }}
          >
            {active && (
              <motion.span
                layoutId="auth-mode-pill"
                className="absolute inset-0 rounded-[10px]"
                style={{ background: T.text }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </a>
        )
      })}
    </div>
  )
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "cadastro"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    window.scrollTo(0, 0)
    setSent(false)
    setError("")
  }, [mode])

  const copy = useMemo(() => {
    if (isSignup) {
      return {
        title: "Crie sua conta",
        subtitle: "Comece seu teste gratuito e organize seu estúdio em um só lugar.",
      }
    }

    return {
      title: "Acesso interno",
      subtitle: "Entre para abrir o painel mockado do Markly.",
    }
  }, [isSignup])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isSignup) {
      if (!(await validateDevAccess(email, password))) {
        setError("Credenciais inválidas.")
        return
      }

      setError("")
      setSent(true)
      startDevSession()
      window.setTimeout(() => {
        window.location.hash = "#/painel"
      }, 180)
      return
    }

    if (isSignup) {
      if (!agreed) return
      if (password !== confirm) {
        setError("As senhas não coincidem.")
        return
      }
    }

    setError("")
    setSent(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8" style={{ background: T.bg, fontFamily: "Poppins, sans-serif" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <DarkVeil
          hueShift={175}
          noiseIntensity={0.02}
          speed={1.05}
          warpAmount={0.22}
          resolutionScale={1}
        />
        {/* Força o véu para o teal do projeto e elimina faixas avermelhadas do shader */}
        <div className="absolute inset-0" style={{ background: "#004741", mixBlendMode: "color", opacity: 0.92 }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(2,8,6,0.58) 70%, rgba(2,8,6,0.92) 100%), linear-gradient(180deg, rgba(0,71,65,0.28), transparent 45%, rgba(2,8,6,0.62) 100%)",
          }}
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[440px] flex-col justify-center">
        <Brand />

        <motion.div
          className="w-full rounded-[22px] border p-5"
          style={{
            background: "rgba(8,23,19,0.72)",
            borderColor: "rgba(240,237,228,0.12)",
            boxShadow: "0 28px 80px rgba(0,0,0,0.38), inset 0 1px 0 rgba(240,237,228,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ModeSwitch mode={mode} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-5 mt-5 text-center">
                <h1 className="font-display text-[28px] font-semibold" style={{ color: T.text, letterSpacing: "-0.035em" }}>
                  {copy.title}
                </h1>
                <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-6" style={{ color: T.muted }}>
                  {copy.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {isSignup && <Field label="Nome" type="text" placeholder="Seu nome" icon={User} value={name} onChange={setName} />}
                <Field label="Email" type="email" placeholder="voce@email.com" icon={Mail} value={email} onChange={setEmail} />
                {isSignup ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Senha" type="password" placeholder="Senha" icon={Lock} value={password} onChange={setPassword} />
                    <Field label="Confirmar" type="password" placeholder="Repita" icon={Lock} value={confirm} onChange={setConfirm} />
                  </div>
                ) : (
                  <Field label="Senha" type="password" placeholder="Digite sua senha" icon={Lock} value={password} onChange={setPassword} />
                )}

                <AnimatePresence initial={false}>
                  {error && (
                    <motion.p
                      className="rounded-[10px] border px-3 py-2 text-[11.5px] font-medium"
                      style={{ background: "rgba(232,160,160,0.08)", borderColor: "rgba(232,160,160,0.2)", color: "#F0B7B7" }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {isSignup ? (
                  <div className="flex items-center gap-2.5 pt-1 text-left">
                    <LottieCheckbox checked={agreed} onChange={setAgreed} />
                    <button type="button" onClick={() => setAgreed(!agreed)} className="min-w-0 text-left text-[11.5px] leading-5">
                      <span style={{ color: T.faint }}>
                        Eu concordo com os{" "}
                        <span className="font-semibold underline-offset-2 hover:underline" style={{ color: T.accent }}>
                          Termos e a Política de Privacidade
                        </span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-1 text-right">
                    <a href="#/login" className="text-[11.5px] font-semibold transition-colors duration-200 hover:text-[#F0EDE4]" style={{ color: T.faint }}>
                      Esqueceu a senha?
                    </a>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-[13.5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSignup && !agreed}
                  style={{ background: T.text, color: T.bg }}
                  whileHover={isSignup && !agreed ? undefined : { y: -1 }}
                  whileTap={isSignup && !agreed ? undefined : { scale: 0.99 }}
                >
                  {sent ? (isSignup ? "Conta criada!" : "Bem-vindo!") : isSignup ? "Criar conta" : "Entrar"}
                  {!sent && <ArrowRight size={15} />}
                </motion.button>

                <div className="my-1 flex items-center gap-3">
                  <span className="h-px flex-1" style={{ background: "rgba(240,237,228,0.12)" }} />
                  <span className="text-[11px]" style={{ color: T.faint }}>
                    Ou {isSignup ? "cadastre-se" : "entre"} com
                  </span>
                  <span className="h-px flex-1" style={{ background: "rgba(240,237,228,0.12)" }} />
                </div>

                <motion.button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-[12px] border py-3 text-[13px] font-semibold"
                  style={{
                    background: "rgba(240,237,228,0.04)",
                    borderColor: "rgba(240,237,228,0.14)",
                    color: T.text,
                  }}
                  whileHover={{ y: -1, backgroundColor: "rgba(240,237,228,0.07)" }}
                  whileTap={{ scale: 0.99 }}
                >
                  <GoogleIcon />
                  {isSignup ? "Cadastrar com Google" : "Entrar com Google"}
                </motion.button>
              </form>

              <p className="mt-5 text-center text-[12px]" style={{ color: T.faint }}>
                {isSignup ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
                <a href={isSignup ? "#/login" : "#/cadastro"} className="font-semibold transition-colors duration-200 hover:underline" style={{ color: T.accent }}>
                  {isSignup ? "Entrar" : "Criar conta"}
                </a>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <p className="mt-4 text-center text-[11px]" style={{ color: "rgba(240,237,228,0.3)" }}>
          © 2026 Markly.
        </p>
      </section>
    </main>
  )
}
