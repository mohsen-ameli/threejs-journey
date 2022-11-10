import { useControls } from "leva";

const Cube = ({ scale }) => {
  const debug = useControls("secondFolder", {
    colour: "#fa61ce"
  })

  return <>
    <mesh position-x={2} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={debug.colour} />
    </mesh>
  </>
}

export default Cube;