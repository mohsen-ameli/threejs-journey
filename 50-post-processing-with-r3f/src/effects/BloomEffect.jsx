import { Bloom, EffectComposer } from "@react-three/postprocessing";

const BoolmEffect = () => {
  return <>
    <EffectComposer multisampling={8}>
      <Bloom mipmapBlur />
    </EffectComposer>

    <mesh castShadow position-z={3} scale={0.7}>
      <sphereGeometry />
      {/* <meshBasicMaterial color={[10, 1, 4]} toneMapped={false} /> */}
      <meshStandardMaterial
        color="skyblue"
        emissive="skyblue"
        emissiveIntensity={5}
        toneMapped={false}
      />
    </mesh>
  </>
}

export default BoolmEffect;