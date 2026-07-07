import { useEffect, useState } from "react"
import {
  defaultStudioProfile,
  readStudioProfile,
  readStudioSetupCompleted,
  resetStudioSetup,
  saveStudioSetup,
  type StudioProfile,
} from "../utils/studioStorage"

export function useStudioSetup() {
  const [studioSetupCompleted, setStudioSetupCompleted] = useState(() => readStudioSetupCompleted())
  const [studioProfile, setStudioProfile] = useState<StudioProfile>(() => readStudioProfile())

  useEffect(() => {
    setStudioSetupCompleted(readStudioSetupCompleted())
    setStudioProfile(readStudioProfile())
  }, [])

  const completeStudioSetup = (profile: StudioProfile) => {
    saveStudioSetup(profile)
    setStudioProfile(profile)
    setStudioSetupCompleted(true)
  }

  const reopenStudioSetup = () => {
    resetStudioSetup()
    setStudioSetupCompleted(false)
  }

  return {
    studioProfile,
    studioSetupCompleted,
    completeStudioSetup,
    reopenStudioSetup,
  }
}
