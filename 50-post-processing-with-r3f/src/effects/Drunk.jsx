import { useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import DrunkEffect from "./DrunkEffect";

const Drunk = props => {
  const debug = useControls({
    "frequency": props.frequency,
    "amplitude": props.amplitude,
  })

  // useFrame((state, delta) => {

  // })

  const drunkEffect = new DrunkEffect(debug)

  return (
    <EffectComposer multisampling={8}>
      <primitive object={drunkEffect} />
    </EffectComposer>
  )
}

export default Drunk;