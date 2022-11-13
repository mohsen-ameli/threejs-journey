import { Environment, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Fox from "./Fox";
import { Hamburger } from "./Hamburger";
import Model from "./Model";
import Placeholder from "./Placeholder";

const Experience = () => {
  return <>
    <OrbitControls makeDefault />

    <Environment background preset="sunset" />

    <Perf position="top-left" />

    <directionalLight castShadow intensity={2} position={[1, 1, 1]} shadow-normalBias={0.04} />
    <ambientLight intensity={0.5} />

    {/* Model */}
    <Suspense fallback={<Placeholder scale={2} position-y={1} />}>
      {/* <Model /> */}
      <Hamburger scale={0.2} position-x={3} />
      {/* <Fox scale={0.05} position-x={-2} /> */}
      <Fox />
    </Suspense>

    <mesh rotation-x={-Math.PI / 2} position-y={0} scale={10} receiveShadow>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>
  </>
}

export default Experience;