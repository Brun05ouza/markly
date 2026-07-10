import { type StudioVertical } from "./studioVertical"

export type StudioProfile = {
  vertical: StudioVertical
  studioName: string
  studioType: string
  teamSize: string
  mainContactChannel: string
  usesDeposit: string
  businessHoursStart: string
  businessHoursEnd: string
  flexibleHours: boolean
  mainStyles: string[]
  studioIcon: string
  studioLogoDataUrl: string
}

export type StudioRecord = {
  id: string
  profile: StudioProfile
}

export const defaultStudioProfile: StudioProfile = {
  vertical: "tatuagem",
  studioName: "",
  studioType: "",
  teamSize: "",
  mainContactChannel: "",
  usesDeposit: "",
  businessHoursStart: "09:00",
  businessHoursEnd: "18:00",
  flexibleHours: false,
  mainStyles: [],
  studioIcon: "sparkles",
  studioLogoDataUrl: "",
}

const studiosKey = "markly_studios"
const activeStudioKey = "markly_active_studio_id"
// legacy single-studio keys, read once for migration only
const legacyCompletedKey = "markly_studio_setup_completed"
const legacyProfileKey = "markly_studio_profile"

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

function normalizeProfile(raw: unknown): StudioProfile {
  const parsed = (raw ?? {}) as Partial<StudioProfile>
  return {
    ...defaultStudioProfile,
    ...parsed,
    mainStyles: Array.isArray(parsed.mainStyles) ? parsed.mainStyles : [],
  }
}

export function generateStudioId() {
  return `studio-${Math.random().toString(36).slice(2, 10)}`
}

function migrateLegacyStudio(): StudioRecord[] {
  if (!canUseStorage()) return []
  const legacyCompleted = window.localStorage.getItem(legacyCompletedKey) === "true"
  if (!legacyCompleted) return []

  const legacyRaw = window.localStorage.getItem(legacyProfileKey)
  if (!legacyRaw) return []

  try {
    const profile = normalizeProfile(JSON.parse(legacyRaw))
    return [{ id: generateStudioId(), profile }]
  } catch {
    return []
  }
}

export function readStudios(): StudioRecord[] {
  if (!canUseStorage()) return []

  const raw = window.localStorage.getItem(studiosKey)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as StudioRecord[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter((item) => item && typeof item.id === "string")
          .map((item) => ({ id: item.id, profile: normalizeProfile(item.profile) }))
      }
    } catch {
      // fall through to migration
    }
  }

  const migrated = migrateLegacyStudio()
  if (migrated.length > 0) {
    // persist immediately so the migration only ever mints one id, not a new one per read
    window.localStorage.setItem(studiosKey, JSON.stringify(migrated))
    window.localStorage.setItem(activeStudioKey, migrated[0].id)
  }
  return migrated
}

export function readActiveStudioId(studios: StudioRecord[]): string {
  if (!canUseStorage()) return studios[0]?.id ?? ""
  const raw = window.localStorage.getItem(activeStudioKey)
  if (raw && studios.some((item) => item.id === raw)) return raw
  return studios[0]?.id ?? ""
}

export function saveStudios(studios: StudioRecord[], activeStudioId: string) {
  if (!canUseStorage()) return
  window.localStorage.setItem(studiosKey, JSON.stringify(studios))
  window.localStorage.setItem(activeStudioKey, activeStudioId)
}
