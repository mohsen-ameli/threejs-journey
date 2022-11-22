import { useFrame } from '@react-three/fiber'
import { meshBounds, OrbitControls, useGLTF } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience() {
  const cube = useRef()

  const hamburger = useGLTF("./hamburger.glb")

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2
  })

  const handleCubeEnter = () => {
    cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`)
    document.body.style.cursor = "pointer"
  }

  const handleCubeLeave = () => {
    cube.current.material.color.set("mediumpurple")
    document.body.style.cursor = "default"
  }

  return <>

    <OrbitControls makeDefault />

    <directionalLight position={[1, 2, 3]} intensity={1.5} />
    <ambientLight intensity={0.5} />

    <mesh
      position-x={- 2}
      onPointerEnter={e => e.stopPropagation()}
    >
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>

    <mesh
      raycast={meshBounds}
      ref={cube}
      onPointerLeave={handleCubeLeave}
      onPointerEnter={handleCubeEnter}
      position-x={2}
      scale={1.5}
    >
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>

    <mesh
      position-y={- 1}
      rotation-x={- Math.PI * 0.5}
      scale={10}
    >
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>

    <primitive
      object={hamburger.scene}
      scale={0.2}
      position-z={-2}
      onClick={(e) => {
        console.log(e.object.name)
        e.stopPropagation()
      }}
    />
  </>
}