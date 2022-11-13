import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

const App = () => {
  return (
    <Canvas
      camera={{
        fov: 75,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6]
      }}
      shadows
    >
      <Experience />
    </Canvas>
  )
}

export default App;