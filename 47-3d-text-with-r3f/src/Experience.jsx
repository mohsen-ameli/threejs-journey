import { Center, Clone, OrbitControls, Text3D, useMatcapTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect } from 'react'
import { useRef, useState } from 'react'
import * as THREE from "three"

const geometry = new THREE.TorusGeometry(0.3, 0.1, 20, 30)
const material = new THREE.MeshMatcapMaterial()

export default function Experience() {
  const [texture] = useMatcapTexture("8B892C_D4E856_475E2D_47360A", 256)

  // const [geometry, setGeometry] = useState()
  // const [material, setMaterial] = useState()

  const count = 200

  useEffect(() => {
    texture.encoding = THREE.sRGBEncoding
    texture.needsUpdate = true

    material.matcap = texture
    material.needsUpdate = true
  }, [])

  return <>
    <Perf position="top-left" />

    <OrbitControls makeDefault />

    {/* <geometrymetry ref={setGeometry} args={[0.3, 0.1, 20, 30]} />
    <meshmaterialerial ref={setMaterial} matcap={texture} /> */}

    {[...Array(count)].map((value, index) => (
      <Donut key={index} geometry={geometry} material={material} />
    ))}

    <Center>
      <Text3D
        font="./fonts/helvetiker_regular.typeface.json"
        size={0.75}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        material={material}
      >
        My Name's Mohsen Ameli
      </Text3D>
    </Center>
  </>
}

const Donut = (props) => {
  const donut = useRef()

  useFrame((state, delta) => {
    donut.current.rotation.y += delta / 10
    donut.current.rotation.x += 0.001
  })

  return (
    <mesh
      ref={donut}
      position={[
        (0.5 - Math.random()) * 20,
        (0.5 - Math.random()) * 20,
        (0.5 - Math.random()) * 20
      ]}
      scale={(0.2 + Math.random())}
      rotation-x={(0.5 - Math.random()) * 5}
      {...props}
    />
  )
}