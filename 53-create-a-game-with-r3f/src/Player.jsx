import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import * as THREE from "three"
import useGame from "./stores/useGame"

export default function Player() {
  const ball = useRef()
  const [keyboardSub, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const [smoothCamPos] = useState(() => new THREE.Vector3(-10, 10, 0))
  const [smoothCamLookAt] = useState(() => new THREE.Vector3())

  const start = useGame(state => state.start)
  const end = useGame(state => state.end)
  const restart = useGame(state => state.restart)
  const trapCount = useGame(state => state.trapCount)
  const endPosition = trapCount * 4 + 2

  // Jumping when spacebar is pressed
  const jump = () => {
    // Shooting a ray from bellow the ball to the ground
    const origin = ball.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }

    const ray = new rapier.Ray(origin, direction)
    const hit = world.raw().castRay(ray, 10, true)

    // if (origin.y < 0.5)
    if (hit.toi < 0.15)
      ball.current?.applyImpulse({ x: 0, y: 0.5, z: 0 })
  }

  const resetBall = () => {
    ball.current.setTranslation({ x: 0, y: 1, z: 0 })
    ball.current.setLinvel({ x: 0, y: 0, z: 0 })
    ball.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  useEffect(() => {
    // When phase changes to ready, reset the ball
    const unsubPhase = useGame.subscribe(
      state => state.phase,
      phase => phase === "ready" && resetBall()
    )

    // When player jumps
    const unsubJump = keyboardSub(
      state => state.jump,
      pressed => pressed && jump()
    )

    // When player hits any key, change the phase of the game to start
    const unsubePress = keyboardSub(
      state => state,
      pressed => {
        if (pressed) {
          start()
        }
      }
    )

    return () => {
      unsubJump()
      unsubePress()
      unsubPhase()
    }
  }, [])

  useFrame((state, delta) => {
    // Current ball position
    const ballPosition = ball.current?.translation()

    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys()
    // The slight forward movement
    const impulse = { x: 0, y: 0, z: 0 }
    // The rotation of the ball
    const torque = { x: 0, y: 0, z: 0 }

    // movement forward
    const impulseStrength = 0.6 * delta
    // rotation forward
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }
    if (backward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }
    if (leftward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }
    if (rightward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    ball.current.applyTorqueImpulse(torque)
    ball.current.applyImpulse(impulse)


    /**
     * Camera
     */
    // Camera following the ball position
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(ballPosition)
    cameraPosition.x -= 2.25
    cameraPosition.y += 0.6

    // Camera locked onto the ball
    const cameraLookAt = new THREE.Vector3()
    cameraLookAt.copy(ballPosition)
    cameraLookAt.y += 0.1

    // Smoothing out the camera animation
    smoothCamPos.lerp(cameraPosition, 5 * delta)
    smoothCamLookAt.lerp(cameraLookAt, 5 * delta)

    // Updating camera position and lookAt
    state.camera.position.copy(smoothCamPos)
    state.camera.lookAt(smoothCamLookAt)


    /**
     * End Phase
     */
    if (ballPosition.x >= endPosition)
      end()

    /**
     * Restart Phase
     */
    if (ballPosition.y < -3)
      restart()
  })

  return <RigidBody
    colliders="ball"
    ref={ball}
    restitution={0.2}
    friction={1}
    linearDamping={0.5}
    angularDamping={0.5}
    position={[0, 1, 0]}
  >
    <mesh castShadow>
      <sphereGeometry args={[0.3, 16]} />
      <meshStandardMaterial color="salmon" />
    </mesh>
  </RigidBody>
}