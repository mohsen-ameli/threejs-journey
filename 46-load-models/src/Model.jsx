import { Clone, useGLTF } from "@react-three/drei";

const Model = () => {
  // const hamburger = useLoader(GLTFLoader, "./hamburger-draco.glb", loader => {
  //   const dracoLoader = new DRACOLoader()
  //   dracoLoader.setDecoderPath("./draco/")
  //   loader.dracoLoader = dracoLoader
  // })
  const hamburger = useGLTF("./hamburger-draco.glb")

  return <>
    <Clone object={hamburger.scene} scale={0.3} position={[-4, 0, 0]} />
    <Clone object={hamburger.scene} scale={0.3} position={[0, 0, 0]} />
    <Clone object={hamburger.scene} scale={0.3} position={[4, 0, 0]} />
    <Clone object={hamburger.scene} scale={0.3} position={[4, 0, -4]} />
    <Clone object={hamburger.scene} scale={0.3} position={[4, 0, 0]} />
    <Clone object={hamburger.scene} scale={0.3} position={[4, 0, 4]} />
  </>
}

useGLTF.preload("./hamburger-draco.glb")

export default Model;