import { useEffect, useState } from "react"
import {
  defaultStudioProfile,
  generateStudioId,
  readActiveStudioId,
  readStudios,
  saveStudios,
  type StudioProfile,
  type StudioRecord,
} from "../utils/studioStorage"

export function useStudioManager() {
  const [studios, setStudios] = useState<StudioRecord[]>(() => readStudios())
  const [activeStudioId, setActiveStudioId] = useState<string>(() => readActiveStudioId(studios))

  useEffect(() => {
    const initialStudios = readStudios()
    setStudios(initialStudios)
    setActiveStudioId(readActiveStudioId(initialStudios))
  }, [])

  const activeStudio = studios.find((item) => item.id === activeStudioId) ?? null
  const studioSetupCompleted = studios.length > 0

  const persist = (nextStudios: StudioRecord[], nextActiveId: string) => {
    setStudios(nextStudios)
    setActiveStudioId(nextActiveId)
    saveStudios(nextStudios, nextActiveId)
  }

  const createStudio = (profile: StudioProfile) => {
    const id = generateStudioId()
    persist([...studios, { id, profile }], id)
    return id
  }

  const updateActiveStudioProfile = (profile: StudioProfile) => {
    if (!activeStudioId) return
    persist(
      studios.map((item) => (item.id === activeStudioId ? { ...item, profile } : item)),
      activeStudioId,
    )
  }

  const switchStudio = (id: string) => {
    if (id === activeStudioId || !studios.some((item) => item.id === id)) return
    setActiveStudioId(id)
    saveStudios(studios, id)
  }

  return {
    studios,
    activeStudioId,
    studioProfile: activeStudio?.profile ?? defaultStudioProfile,
    studioSetupCompleted,
    createStudio,
    updateActiveStudioProfile,
    switchStudio,
  }
}
