import { Canvas } from "@react-three/fiber"
import Experience from "./Expreience"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"

export default function App() {
  return (
    <Canvas
      // orthographic
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        // zoom: 100
        position: [0, 6, 10]
      }}
      // flat={true}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding
      }}
    // dpr={Math.min(window.devicePixelRatio, 2)}
    // dpr={[1, 2]}
    >
      <OrbitControls enableDamping={true} />
      <Experience />
    </Canvas>
  )
}