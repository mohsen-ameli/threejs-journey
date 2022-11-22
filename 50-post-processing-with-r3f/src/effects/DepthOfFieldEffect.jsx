import { DepthOfField, EffectComposer } from "@react-three/postprocessing";

const DepthOfFieldEffect = () => {
  return (
    <EffectComposer multisampling={8}>
      <DepthOfField
        focusDistance={0.025}
        focalLength={0.025}
        bokehScale={6}
      />
    </EffectComposer>
  )
}

export default DepthOfFieldEffect