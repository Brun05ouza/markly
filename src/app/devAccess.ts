const sessionKey = "markly.dev.session"
const accessDigest = "dd7925ee5f9083bea16a54bf6add0cb2de94a1fde10786e5a5317c092fbf2109"

export const devIdentity = {
  name: "Bruno Souza",
  role: "CEO",
  email: ["suporte", "markly", "@gmail.com.br"].join(""),
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const hash = await window.crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export async function validateDevAccess(email: string, password: string) {
  return email.trim().toLowerCase() === devIdentity.email && (await sha256(password)) === accessDigest
}

export function startDevSession() {
  window.sessionStorage.setItem(
    sessionKey,
    JSON.stringify({
      name: devIdentity.name,
      role: devIdentity.role,
      email: devIdentity.email,
      startedAt: Date.now(),
    }),
  )
}

export function readDevSession() {
  const raw = window.sessionStorage.getItem(sessionKey)
  if (!raw) return devIdentity

  try {
    return { ...devIdentity, ...JSON.parse(raw) }
  } catch {
    return devIdentity
  }
}

export function clearDevSession() {
  window.sessionStorage.removeItem(sessionKey)
}
