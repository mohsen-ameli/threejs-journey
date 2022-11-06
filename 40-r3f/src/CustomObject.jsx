import { useEffect, useMemo, useRef } from "react";
import { DoubleSide } from "three"

const CustomObject = () => {
  const geometry = useRef()

  useEffect(() => {
    geometry.current.computeVertexNormals()
  }, [])

  // each triangle has 3 vertecies
  const triangleCount = 10 * 3

  const positions = useMemo(() => {
    // each vertex has 3 positions (x,y,z)
    const positions = new Float32Array(triangleCount * 3)

    // fill the positions with random values
    for (let i = 0; i < triangleCount * 3; i++)
      positions[i] = (Math.random() - 0.5) * 2
    return positions
  }, [])

  return (
    <mesh>
      <bufferGeometry ref={geometry}>
        <bufferAttribute
          attach="attributes-position"
          count={triangleCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial side={DoubleSide} color="blue" />
    </mesh>
  )
}

export default CustomObject;