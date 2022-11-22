import { Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three"

THREE.ColorManagement.legacyMode = false

const boxGeo = new THREE.BoxGeometry(1, 1, 1)
const floor1Mat = new THREE.MeshStandardMaterial({ color: "#111111", metalness: 0, roughness: 0 })
const floor2Mat = new THREE.MeshStandardMaterial({ color: "#222222", metalness: 0, roughness: 0 })
const obstacleMat = new THREE.MeshStandardMaterial({ color: "#ff0000", metalness: 0, roughness: 1 })
const wallMat = new THREE.MeshStandardMaterial({ color: "#887777", metalness: 0, roughness: 0 })

const speed = 1.3

const WallBlock = props => {
  return <mesh geometry={boxGeo} material={wallMat} {...props} />
}

const StartBlock = ({ position = [0, 0, 0] }) => {
  return <group position={position}>
    <mesh
      geometry={boxGeo}
      material={floor1Mat}
      receiveShadow
      position-y={-0.25}
      scale={[4, 0.5, 4]}
    />

    <Float>
      <Text
        fontSize={0.5}
        position={[0.8, 0.8, 1.2]}
        rotation-y={-Math.PI / 2}
        lineHeight={0.8}
        textAlign="right"
        font="./bebas-neue-v9-latin-regular.woff"
      >
        Rollie{`\n`}Ball
      </Text>
    </Float>
  </group>
}

const EndBlock = ({ position }) => {
  const hamburger = useGLTF("./hamburger.glb")
  hamburger.scene.children.map(item => item.castShadow = true)

  return <group position={position}>
    <mesh
      geometry={boxGeo}
      material={floor1Mat}
      receiveShadow
      position-y={-0.17}
      scale={[4, 0.5, 4]}
    />

    {/* Hamburger */}
    <RigidBody type="fixed" colliders="hull" restitution={0.2} friciton={0}>
      <primitive object={hamburger.scene} scale={0.3} />
    </RigidBody>

    {/* Finish text */}
    <Text
      fontSize={1.75}
      position={[0, 2.5, 0]}
      rotation-y={-Math.PI / 2}
      font="./bebas-neue-v9-latin-regular.woff"
    >
      FINISH
    </Text>
  </group>
}

const TrapFloor = () => {
  return <mesh
    geometry={boxGeo}
    material={floor2Mat}
    receiveShadow
    position-y={-0.25}
    scale={[4, 0.5, 4]}
  />
}

export const SpinTrap = ({ position = [0, 0, 0] }) => {
  const trap = useRef()
  const rand = (Math.random() < 0.5 ? -1 : 1) * (Math.random() + 0.5) * speed

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * rand

    const quaternian = new THREE.Quaternion()
    quaternian.setFromEuler(new THREE.Euler(0, time, 0))
    trap.current.setNextKinematicRotation(quaternian)
  })

  return <group position={position}>
    {/* Floor */}
    <TrapFloor />

    {/* Trap */}
    <RigidBody type="kinematicPosition" restitution={0.2} friciton={0} ref={trap}>
      <mesh
        castShadow
        geometry={boxGeo}
        material={obstacleMat}
        position-y={0.125}
        scale={[0.25, 0.25, 3]}
      />
    </RigidBody>
  </group>
}

export const BlockTrap = ({ position = [0, 0, 0] }) => {
  const trap = useRef()
  const x = position[0]
  const y = position[1]
  const rand = (Math.random() < 0.5 ? -1 : 1) * (Math.random() + 0.5) * speed

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * rand

    const z = Math.cos(time) * 1.25
    trap.current.setNextKinematicTranslation({ x, y, z })
  })

  return <group position={position}>
    {/* Floor */}
    <TrapFloor />

    {/* Trap */}
    <RigidBody type="kinematicPosition" restitution={0.2} friciton={0} ref={trap}>
      <mesh
        castShadow
        geometry={boxGeo}
        material={obstacleMat}
        position-y={1}
        scale={[0.25, 2, 1.5]}
      />
    </RigidBody>
  </group>
}

export const AxeTrap = ({ position = [0, 0, 0] }) => {
  const trap = useRef()
  const x = position[0]
  const z = position[2]
  const rand = (Math.random() + 0.5) * speed

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime * rand

    const y = Math.sin(time) + 0.125
    trap.current.setNextKinematicTranslation({ x, y, z })
  })

  return <group position={position}>
    {/* Floor */}
    <TrapFloor />

    {/* Trap */}
    <RigidBody type="kinematicPosition" restitution={0.2} friciton={0} ref={trap}>
      <mesh
        castShadow
        geometry={boxGeo}
        material={obstacleMat}
        position-y={1}
        scale={[0.25, 0.25, 3]}
      />
    </RigidBody>
  </group>
}

export const Level = ({ trapCount = 50, traps = [SpinTrap, BlockTrap, AxeTrap], seed = 0 }) => {
  const blockWidth = 4
  const wallWidth = (trapCount + 2) * blockWidth

  const blocks = useMemo(() => {
    const blocks = []

    for (let i = 0; i < trapCount; i++) {
      const trap = traps[Math.floor(Math.random() * traps.length)]
      blocks.push(trap)
    }

    return blocks
  }, [trapCount, traps, seed])

  return <>
    {/* Floor */}
    <CuboidCollider
      args={[wallWidth / 2, 0.25, 2]}
      position={[(wallWidth / 2) - 2, -0.25, 0]}
      restitution={0.2}
      friction={1}
    />

    {/* Start */}
    <StartBlock />

    {/* Traps */}
    {blocks?.map((Block, index) => <Block key={index} position={[blockWidth * (index + 1), 0, 0]} />)}

    {/* End */}
    <EndBlock position={[blockWidth * (trapCount + 1), 0, 0]} />

    {/* Walls */}
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      {/* Right */}
      <WallBlock castShadow scale={[wallWidth, 4, 0.5]} position={[(wallWidth / 2) - 2, 2, 2.25]} />
      {/* Left */}
      <WallBlock receiveShadow scale={[wallWidth, 4, 0.5]} position={[(wallWidth / 2) - 2, 2, -2.25]} />
      {/* End */}
      <WallBlock scale={[4, 4, 0.5]} position={[(wallWidth) - 1.75, 2, 0]} rotation-y={Math.PI / 2} />
    </RigidBody>
  </>
}









{/* {[...Array(trapCount)].map((key, index) => {
      // Selecting a random trap type
      const Trap = traps[Math.floor(Math.random() * traps.length)]

      // Rendering the trap with appropriate position
      return <Trap key={index} position={[blockWidth * (index + 1), 0, 0]} />
    })} */}