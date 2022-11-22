import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { useControls } from "leva";
import { BlendFunction } from 'postprocessing'

const VignetteEffect = () => {
  const debug = useControls("vignette", {
    offset: 0.5,
    darkness: 0.5,
    eskil: false,
    blend: { options: BlendFunction }
  })

  return (
    <EffectComposer multisampling={8}>
      <Vignette
        offset={debug.offset} // vignette offset
        darkness={debug.darkness} // vignette darkness
        eskil={debug.eskil} // Eskil's vignette technique
        blendFunction={debug.blend} // blend mode  
      />
    </EffectComposer>
  )
}

export default VignetteEffect