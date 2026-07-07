export type StudioProfile = {
  studioName: string
  studioType: string
  teamSize: string
  mainContactChannel: string
  usesDeposit: string
  businessHoursStart: string
  businessHoursEnd: string
  flexibleHours: boolean
  mainStyles: string[]
}

export const defaultStudioProfile: StudioProfile = {
  studioName: "",
  studioType: "",
  teamSize: "",
  mainContactChannel: "",
  usesDeposit: "",
  businessHoursStart: "09:00",
  businessHoursEnd: "18:00",
  flexibleHours: false,
  mainStyles: [],
}

const completedKey = "markly_studio_setup_completed"
const profileKey = "markly_studio_profile"

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

export function readStudioSetupCompleted() {
  if (!canUseStorage()) return false
  return window.localStorage.getItem(completedKey) === "true"
}

export function readStudioProfile(): StudioProfile {
  if (!canUseStorage()) return defaultStudioProfile

  const raw = window.localStorage.getItem(profileKey)
  if (!raw) return defaultStudioProfile

  try {
    const parsed = JSON.parse(raw) as Partial<StudioProfile>
    return {
      ...defaultStudioProfile,
      ...parsed,
      mainStyles: Array.isArray(parsed.mainStyles) ? parsed.mainStyles : [],
    }
  } catch {
    return defaultStudioProfile
  }
}

export function saveStudioSetup(profile: StudioProfile) {
  if (!canUseStorage()) return
  window.localStorage.setItem(profileKey, JSON.stringify(profile))
  window.localStorage.setItem(completedKey, "true")
}

export function resetStudioSetup() {
  if (!canUseStorage()) return
  window.localStorage.removeItem(completedKey)
}
