import { OrbitControls } from '@react-three/drei'
import { button, useControls } from 'leva'
import { Perf } from "r3f-perf"
import Cube from './Cube'

export default function Experience() {
    const debug = useControls("firstFolder", {
        position: {
            value: { x: -2, y: 0 },
            step: 0.1,
            joystick: "invertY"
        },
        color: "#ff6900",
        visible: true,
    })

    const debug2 = useControls("secondFolder", {
        clickaMe: button(() => console.log("hi")),
        myInteraval: {
            value: [2, 3],
            min: 0,
            max: 10
        },
        maChoises: { options: ["a", "ba", "cee", "daa"] },
        scale: { value: 2, min: 0, max: 5, step: 0.01 }
    })

    return <>
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <mesh position={[debug.position.x, debug.position.y, 0]} visible={debug.visible}>
            <sphereGeometry />
            <meshStandardMaterial color={debug.color} />
        </mesh>

        <Cube scale={debug2.scale} />

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}