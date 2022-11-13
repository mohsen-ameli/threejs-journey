import { Center, OrbitControls, shaderMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import portalVert from "./shaders/portal/vertex.js"
import portalFrag from "./shaders/portal/fragment.js"
import { extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from "three"

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uCenterColor: new THREE.Color(0xb4cc7f),
    uOutColor: new THREE.Color(0xffebd6),
  },
  portalVert,
  portalFrag
)

extend({ PortalMaterial })

export default function Experience() {
  const { nodes } = useGLTF("./model/portal.glb")
  const texture = useTexture("./model/baked.jpg")
  texture.flipY = false

  const portalRef = useRef()

  useFrame((state, delta) => portalRef.current.uTime += delta)

  return <>
    <OrbitControls makeDefault />

    <color attach="background" args={["black"]} />

    {/* Portal */}
    <Center>

      {/* EmissionPortal */}
      <mesh
        geometry={nodes.EmissionPortal.geometry}
        position={nodes.EmissionPortal.position}
        rotation={nodes.EmissionPortal.rotation}
      >
        <portalMaterial ref={portalRef} />
      </mesh>

      {/* EmissionPoleLightA */}
      <mesh
        geometry={nodes.EmissionPoleLightA.geometry}
        material={nodes.EmissionPoleLightA.material}
        position={nodes.EmissionPoleLightA.position}
        scale={nodes.EmissionPoleLightA.scale}
      >
        <meshBasicMaterial color={0xffa280} />
      </mesh>

      {/* EmissionPoleLightB */}
      <mesh
        geometry={nodes.EmissionPoleLightB.geometry}
        position={nodes.EmissionPoleLightB.position}
        scale={nodes.EmissionPoleLightB.scale}
      >
        <meshBasicMaterial color={0xffa280} />
      </mesh>

      {/* baked */}
      <mesh
        geometry={nodes.baked.geometry}
        position={nodes.baked.position}
        rotation={nodes.baked.rotation}
      >
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Sparkles */}
      <Sparkles
        size={6}
        scale={[4, 2, 4]}
        position-y={1.1}
        speed={0.3}
        count={50}
      />

    </Center>
  </>
}

useGLTF.preload("./model/portal.glb")