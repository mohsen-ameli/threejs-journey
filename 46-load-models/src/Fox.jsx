import { useAnimations, useGLTF } from "@react-three/drei"
import { useControls } from "leva"
import { useEffect } from "react"

const Fox = () => {
  const fox = useGLTF("./Fox/glTF-Binary/Fox.glb")
  const { actions } = useAnimations(fox.animations, fox.scene)

  const { animations } = useControls({
    "animations": { options: { "Walk": actions.Walk, "Run": actions.Run, "Survey": actions.Survey } }
  })

  useEffect(() => {
    animations.reset().play().fadeIn(1)

    return () => {
      animations.fadeOut(1)
    }
  }, [animations])

  return <>
    <primitive object={fox.scene} scale={0.03} position-x={-2} />
  </>
}

useGLTF.preload("./Fox/glTF-Binary/Fox.glb")

export default Fox;