import { useFrame } from '@react-three/fiber'
import { AccumulativeShadows, softShadows, BakeShadows, OrbitControls, useHelper, RandomizedLight, ContactShadows, Sky, Environment, Lightformer, Stage } from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { DirectionalLightHelper } from 'three'
import { useControls } from 'leva'

// softShadows({
//     frustum: 3.75,
//     size: 0.005,
//     near: 9.5,
//     samples: 17,
//     rings: 11
// })

export default function Experience() {
    const cube = useRef()
    const positionalLight = useRef()

    const { color, opacity, blur } = useControls("shadows", {
        color: "#196c00",
        opacity: { value: 0.87, min: 0, max: 5, step: 0.001 },
        blur: { value: 4.67, min: 0, max: 10, step: 0.001 },
    })

    const { sunPosition } = useControls("sky", {
        sunPosition: { value: [1, 2, 3] }
    })

    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls("environment", {
        envMapIntensity: { value: 4.6, min: 0, max: 10 },
        envMapHeight: { value: 7, min: 3, max: 18 },
        envMapRadius: { value: 29, min: 9, max: 100 },
        envMapScale: { value: 170, min: 8, max: 170 },
    })

    useHelper(positionalLight, DirectionalLightHelper)

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
        // cube.current.position.x = 2.5 + Math.sin(state.clock.elapsedTime * 2)
    })

    return <>
        {/* <BakeShadows /> */}

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <ContactShadows
            position={[0, 0, 0]}
            scale={10}
            resolution={512}
            far={5}
            color={color}
            opacity={opacity}
            blur={blur}
        // frames={1}
        /> */}

        {/* <AccumulativeShadows
            position={[0, -0.99, 0]}
            scale={10}
            color="#316d39"
            opacity={0.8}
            frames={Infinity}
            temporal
            blend={100}
        >
            <RandomizedLight
                position={[1, 2, 3]}
                amount={8}
                radius={1}
                ambient={0.5}
                intensity={1}
                bias={0.001}
            />
        </AccumulativeShadows> */}

        {/* <directionalLight
            castShadow
            ref={positionalLight}
            position={sunPosition}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={8}
            shadow-camera-top={3}
            shadow-camera-right={3}
            shadow-camera-bottom={-3}
            shadow-camera-left={-3}
        />
        <ambientLight intensity={0.5} /> */}

        {/* <Sky sunPosition={sunPosition} /> */}

        {/* <Environment
            background
            files={['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']}
            files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
            path="./environmentMaps/0/"
            resolution={1080}
        /> */}

        {/* <Environment
            background
            preset='forest'
            ground={{
                height: envMapHeight,
                radius: envMapRadius,
                scale: envMapScale
            }}
        > */}
        {/* <color args={["black"]} attach="background" /> */}
        {/* <Lightformer
                position-z={-5}
                scale={10}
                color={[10, 0, 0]}
                form="ring"
            /> */}
        {/* </Environment> */}

        {/* <mesh position-x={-2} position-y={1} castShadow>
            <sphereGeometry />
            <meshStandardMaterial envMapIntensity={envMapIntensity} color="orange" />
        </mesh>

        <mesh position-x={2} position-y={1} scale={1.5} ref={cube} castShadow>
            <boxGeometry />
            <meshStandardMaterial envMapIntensity={envMapIntensity} color="mediumpurple" />
        </mesh> */}

        {/* <mesh position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh> */}


        <Stage
            contactShadow={{ opacity: 0.2, blur: 3 }}
            intensity={1.5}
            environment="apartment"
            preset="soft"
        >
            <mesh position-x={-2} position-y={1} castShadow>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh position-x={2} position-y={1} scale={1.5} ref={cube} castShadow>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </Stage>

    </>
}