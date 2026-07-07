import { useEffect, useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import checkBoxAnimation from "../../assets/checkBox.json"

const SIZE = 24

type LottieCheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export default function LottieCheckbox({ checked, onChange, className = "" }: LottieCheckboxProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    const anim = lottieRef.current
    if (!anim) return
    if (checked) {
      anim.goToAndPlay(0, true)
    } else {
      anim.goToAndStop(0, true)
    }
  }, [checked])

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex flex-shrink-0 items-center justify-center p-0 ${className}`}
      style={{ width: SIZE, height: SIZE, background: "none", border: "none" }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={checkBoxAnimation}
        loop={false}
        autoplay={false}
        style={{ width: SIZE, height: SIZE, pointerEvents: "none" }}
      />
    </button>
  )
}
