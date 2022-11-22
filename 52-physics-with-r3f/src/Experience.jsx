import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { BallCollider, CuboidCollider, CylinderCollider, Debug, Physics, RigidBody } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export default function Experience() {
  const cube = useRef()
  const ball = useRef()
  const bar = useRef()

  const [audio] = useState(() => new Audio("./hit.mp3"))

  const hamburger = useGLTF("./hamburger.glb")

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const euler = new THREE.Euler(0, time, 0)
    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(euler)
    bar.current.setNextKinematicRotation(quaternion)

    const x = Math.cos(time / 2) * 2
    const z = Math.sin(time / 2) * 2
    bar.current.setNextKinematicTranslation({ x, y: -0.7, z })
  })

  const colissionEnter = () => {
    audio.currentTime = 0
    audio.volume = Math.random()
    audio.play()
  }

  const jump = () => {
    const mass = cube.current.mass()

    cube.current.applyImpulse({ x: 0, y: mass * 5, z: 0 })
    cube.current.applyTorqueImpulse({
      x: .5 - Math.random(),
      y: .5 - Math.random(),
      z: .5 - Math.random()
    })
  }

  const forward = () => {
    ball.current.applyImpulse({ x: 10, y: 0, z: 0 })
  }

  return <>
    <Perf position="top-left" />

    <OrbitControls makeDefault />

    <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
    <ambientLight intensity={0.5} />

    <Physics>
      <Debug />

      {/* Hamburger */}
      <RigidBody colliders={false} position={[0, 2, -2]}>
        <CylinderCollider args={[0.7, 1.25]} />
        <primitive object={hamburger.scene} scale={0.25} />
      </RigidBody>

      {/* Sphere */}
      <RigidBody
        restitution={0.5}
        ref={ball}
        colliders="ball"
        position={[-2, 3, 0]}
      >
        <mesh castShadow onClick={forward}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>

      {/* Cube */}
      <RigidBody
        restitution={0.5}
        friction={0}
        ref={cube}
        gravityScale={1}
        position={[2, 1, 0]}
        colliders={false}
      // onCollisionEnter={colissionEnter}
      // onCollisionExit={() => console.log("exit")}
      // onSleep={() => console.log("good night")}
      // onWake={() => console.log("good mornin")}
      >
        <CuboidCollider args={[0.5, 0.5, 0.5]} mass={10} />
        <mesh castShadow onClick={jump}>
          <boxGeometry />
          <meshStandardMaterial color="purple" />
        </mesh>
      </RigidBody>

      {/* Bar */}
      <RigidBody ref={bar} friction={0} type="kinematicPosition" position-y={-0.7}>
        <mesh castShadow>
          <boxGeometry args={[3, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* Floor */}
      <RigidBody
        restitution={0.25}
        friction={0.7}
        type="fixed"
        position-y={- 1.25}
      >
        <mesh receiveShadow>
          <boxGeometry args={[10, 0.5, 10]} />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" position-y={-1}>
        <CuboidCollider args={[0, 3, 5]} position={[-5, 3, 0]} />
        <CuboidCollider args={[0, 3, 5]} position={[5, 3, 0]} />
        <CuboidCollider args={[5, 3, 0]} position={[0, 3, -5]} />
        <CuboidCollider args={[5, 3, 0]} position={[0, 3, 5]} />
      </RigidBody>
    </Physics>
  </>
}