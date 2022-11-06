import { extend, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import CustomObject from "./CustomObject"

extend({ OrbitControls })

const Experience = () => {
  const box = useRef()

  const { camera, gl } = useThree()

  useFrame((state, delta) => {
    box.current.rotation.y += delta
    let elapsedTime = state.clock.elapsedTime

    // state.camera.position.x = Math.sin(elapsedTime) * 10
    // state.camera.position.z = Math.cos(elapsedTime) * 10
    // state.camera.rotation.y += Math.sin(delta) / 2

    // state.camera.lookAt(0, 0, 0)
  })

  return <>
    {/* <orbitControls args={[camera, gl.domElement]} /> */}

    <ambientLight intensity={0.5} />
    <directionalLight position={[-2, 3, 0]} intensity={1.5} />

    <group>
      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh ref={box} position-x={2} scale={0.7}>
        <torusKnotGeometry args={[1, 1 / 3, 64, 8]} />
        <meshStandardMaterial color="purple" />
      </mesh>
      <mesh rotation-x={- Math.PI / 2} scale={10} position-y={-1.5}>
        <planeGeometry />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>

    <CustomObject />
  </>
}

export default Experience;