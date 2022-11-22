import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import BoolmEffect from './effects/BloomEffect'
import DepthOfFieldEffect from './effects/DepthOfFieldEffect'
import GlitchEffect from './effects/GlitchEffect'
import NoiseEffect from './effects/NoiseEffect'
import VignetteEffect from './effects/VignetteEffect'
import SSREffect from './effects/SSREffect'
import Drunk from './effects/Drunk'

export default function Experience() {
  return <>

    {/* <SSREffect /> */}
    {/* <BoolmEffect /> */}
    {/* <DepthOfFieldEffect /> */}
    {/* <GlitchEffect /> */}
    {/* <NoiseEffect /> */}
    {/* <VignetteEffect /> */}
    <Drunk
      frequency={8}
      amplitude={8}
    />

    <color args={["salmon"]} attach="background" />

    <Perf position="top-left" />

    <OrbitControls makeDefault />

    <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
    <ambientLight intensity={0.5} />

    <mesh castShadow position-x={-2}>
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>

    <mesh castShadow position-x={2} scale={1.5}>
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>

    <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>

  </>
}