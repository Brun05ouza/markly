import {
  Badge,
  Brush,
  CircleDot,
  Crown,
  Flame,
  Gem,
  Heart,
  Layers,
  Palette,
  PenTool,
  Scissors,
  Sparkles,
  Star,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"

export const studioLogoMaxBytes = 64 * 1024

export const studioBrandIconOptions = [
  { id: "sparkles", label: "Sparkles", icon: Sparkles },
  { id: "wand", label: "Wand", icon: WandSparkles },
  { id: "pen-tool", label: "Pen tool", icon: PenTool },
  { id: "brush", label: "Brush", icon: Brush },
  { id: "palette", label: "Palette", icon: Palette },
  { id: "scissors", label: "Scissors", icon: Scissors },
  { id: "gem", label: "Gem", icon: Gem },
  { id: "flame", label: "Flame", icon: Flame },
  { id: "star", label: "Star", icon: Star },
  { id: "heart", label: "Heart", icon: Heart },
  { id: "badge", label: "Badge", icon: Badge },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "circle-dot", label: "Circle dot", icon: CircleDot },
  { id: "zap", label: "Zap", icon: Zap },
  { id: "crown", label: "Crown", icon: Crown },
] as const

export type StudioBrandIconName = (typeof studioBrandIconOptions)[number]["id"]

export function getStudioBrandIcon(iconName?: string): LucideIcon {
  return studioBrandIconOptions.find((item) => item.id === iconName)?.icon ?? Sparkles
}

export function formatLogoSizeLimit() {
  return `${Math.round(studioLogoMaxBytes / 1024)} KB`
}
