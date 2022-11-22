import { EffectComposer, Noise } from "@react-three/postprocessing"
import { useControls } from "leva"
import { BlendFunction } from "postprocessing"

const NoiseEffect = () => {
  const debug2 = useControls("noise", {
    blendFunction: {
      options: {
        "overlay": BlendFunction.OVERLAY,
        "screen": BlendFunction.SCREEN,
        "softLight": BlendFunction.SOFT_LIGHT,
        "average": BlendFunction.AVERAGE,
      }
    }
  })

  return (
    <EffectComposer multisampling={8}>
      <Noise
        premultiply
        blendFunction={debug2.blendFunction}
      />
    </EffectComposer>
  )
}

export default NoiseEffect