import { Center, ContactShadows, Environment, Float, Html, OrbitControls, PresentationControls, Text3D, useGLTF } from '@react-three/drei'

export default function Experience() {
  return <>
    <color args={["#737373"]} attach="background" />

    <Environment preset='studio' />

    <ContactShadows
      opacity={0.5}
      scale={10}
      blur={2}
      far={10}
      resolution={512}
      color="black"
      position-y={-1.5}
    />

    <Model />
  </>
}


const Model = (props) => {
  const { scene } = useGLTF('./model.gltf')
  return (
    <PresentationControls
      global
      rotation={[0.13, 0.1, 0]}
      polar={[-0.4, 0.25]}
      azimuth={[-1, 0.5]}
      config={{ mass: 2, tenstion: 400 }}
      snap={{ mass: 4, tenstion: 1000 }}
    >
      <Float speed={1} rotationIntensity={0.5}>
        <primitive object={scene} position={[0.25, -1.1, 0.25]} {...props}>
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={60}
            // color={"#000033"}
            color={"darkblue"}
            rotation={[-0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          <Html
            transform
            wrapperClass="macbook"
            distanceFactor={1.17}
            position={[0, 1.56, -1.4]}
            rotation-x={-Math.PI / 12}
          >
            <iframe src="https://www.mohsenameli.com/" />
          </Html>
        </primitive>

        <Text3D
          font='./Inter_Bold.json'
          letterSpacing={-0.06}
          size={0.5}
          rotation-y={-Math.PI / 3}
          position={[2, 1, 0.25]}
        >
          {`Mohsen\nAmeli`}
          <meshNormalMaterial />
        </Text3D>
      </Float>
    </PresentationControls>
  )
}