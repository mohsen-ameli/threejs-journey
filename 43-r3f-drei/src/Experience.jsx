import { Float, Html, MeshReflectorMaterial, OrbitControls, PivotControls, Text, Text3D, TransformControls } from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const sphere = useRef()
  const box = useRef()

  return <>
    <OrbitControls makeDefault />

    <directionalLight position={[1, 2, 3]} intensity={1.5} />
    <ambientLight intensity={0.5} />

    <PivotControls anchor={[0, 0, 0]} opacity={1} depthTest={false}>
      <mesh ref={sphere} position-x={- 2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
        <Html position={[1, 1, 0]} occlude={[sphere, box]}>
          Hello there
        </Html>
      </mesh>
    </PivotControls>

    <mesh ref={box} position-x={2} scale={1.5}>
      <boxGeometry />
      <meshStandardMaterial color="mediumpurple" />
    </mesh>

    <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
      <planeGeometry />
      <MeshReflectorMaterial resolution={1024} mirror={0.5} color="greenyellow" />
    </mesh>

    <Float speed={2} floatIntensity={1} rotationIntensity={2}>
      <Text
        font="./bangers-v20-latin-regular.woff"
        fontSize={2}
        position-y={3}
        color="darkorange"
        maxWidth={5}
        textAlign="center"
      >
        hello world!
        <meshNormalMaterial />
      </Text>
    </Float>

  </>
}