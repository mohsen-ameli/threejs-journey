import { useHelper } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import { DirectionalLightHelper } from "three"

export default function Lights() {
  const light = useRef()

  // useHelper(light, DirectionalLightHelper)

  // const debug = useControls({
  //   x: { value: -4.6, min: -15, max: 15, step: 0.1 },
  //   y: { value: 5, min: -15, max: 15, step: 0.1 },
  //   z: { value: 3, min: -15, max: 15, step: 0.1 }
  // })

  useFrame((state) => {
    light.current.position.x = state.camera.position.x - 2
    light.current.target.position.x = state.camera.position.x
    light.current.target.updateMatrixWorld()
  })

  return <>
    <directionalLight
      ref={light}
      castShadow
      position={[-10, 5, 3]}
      intensity={1.5}
      shadow-mapSize={[1024, 1024]}
      shadow-camera-near={1}
      shadow-camera-far={10}
      shadow-camera-top={10}
      shadow-camera-right={10}
      shadow-camera-bottom={-10}
      shadow-camera-left={-10}
    />
    <ambientLight intensity={0.5} />
  </>
}