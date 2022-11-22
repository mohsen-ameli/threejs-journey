import { EffectComposer, Glitch } from "@react-three/postprocessing"
import { useControls } from "leva"
import { GlitchMode } from "postprocessing"

const GlitchEffect = () => {
  const debug = useControls("glitch", {
    delay: [1.5, 3.5],
    duration: [0.6, 1.0],
    strength: [0.3, 1.0],
    mode: { options: GlitchMode },
    ratio: { value: 0.85, min: 0, max: 1, step: 0.001 },
    active: true
  })

  return (
    <EffectComposer multisampling={8}>
      {/* If you want the effect every n seconds, put the delay to [0, n] and ratio to 1 */}
      <Glitch
        delay={debug.delay} // min and max glitch delay
        duration={debug.duration} // min and max glitch duration
        strength={debug.strength} // min and max glitch strength
        mode={debug.mode} // glitch mode
        ratio={debug.ratio} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
        active={debug.active} // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
      />
    </EffectComposer>
  )
}

export default GlitchEffect