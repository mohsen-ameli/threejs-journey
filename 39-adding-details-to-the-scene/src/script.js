import "./style.css"
import * as dat from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import fireflyVertex from "./shaders/fireflies/vertex.glsl"
import fireflyFragment from "./shaders/fireflies/fragment.glsl"
import portalVertex from "./shaders/portal/vertex.glsl"
import portalFragment from "./shaders/portal/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 400,
})
const debugObj = {}
debugObj.bgColor = 0xb15f3a

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()
const bakedTexture = textureLoader.load("baked.jpg")
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("draco/")

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Materials
 */
const bakedMat = new THREE.MeshBasicMaterial({ map: bakedTexture })
const poleLightMat = new THREE.MeshBasicMaterial({ color: 0xFF4500 })
const portalMat = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: portalVertex,
  fragmentShader: portalFragment,
  uniforms: {
    uTime: {value: 0},
    uCenterColor: {value: new THREE.Color(0xb4cc7f)},
    uOutColor: {value: new THREE.Color(0xffebd6)},
  }
})

gui.addColor(portalMat.uniforms.uCenterColor, "value").name("Center")
gui.addColor(portalMat.uniforms.uOutColor, "value").name("Out")

/**
 * Models
 */
gltfLoader.load("portal.glb", (gltf) => {
  const wholeScene = gltf.scene.children.find(child => child.name === "baked")
  const portal = gltf.scene.children.find(child => child.name === "EmissionPortal")
  const poleLightA = gltf.scene.children.find(child => child.name === "EmissionPoleLightA")
  const poleLightB = gltf.scene.children.find(child => child.name === "EmissionPoleLightB")

  wholeScene.material = bakedMat
  portal.material = portalMat
  poleLightA.material = poleLightMat
  poleLightB.material = poleLightMat

  scene.add(gltf.scene)
})

/**
 * Fireflies
 */
const count = 30
const position = new Float32Array(count * 3)
const scale = new Float32Array(count)

for (let i = 0; i < count; i++) {
  position[i * 3] = (0.5 - Math.random()) * 4
  position[i * 3 + 1] = (0.35 + Math.random()) * 1.5
  position[i * 3 + 2] = (0.5 - Math.random()) * 4

  scale[i] = Math.random()
}

const firefliesGeo = new THREE.BufferGeometry()
firefliesGeo.setAttribute("position", new THREE.BufferAttribute(position, 3))
firefliesGeo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1))

const firefliesMat = new THREE.ShaderMaterial({
  vertexShader: fireflyVertex,
  fragmentShader: fireflyFragment,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: {
    uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
    uSize: {value: 90},
    uTime: {value: 0}
  }
})
gui.add(firefliesMat.uniforms.uSize, "value").min(0).max(200).step(0.001).name("size")


const fireflies = new THREE.Points(firefliesGeo, firefliesMat)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Updating the shader
  firefliesMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -3
camera.position.y = 2
camera.position.z = -4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor(debugObj.bgColor)

gui.addColor(debugObj, "bgColor").onChange(() => renderer.setClearColor(debugObj.bgColor))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  firefliesMat.uniforms.uTime.value = elapsedTime
  portalMat.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
