import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import vertexShader from "./shaders/water/vertex.glsl"
import fragmentShader from "./shaders/water/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObj = {
  lowColor: 0x1b2564,
  highColor: 0x537697,
}

// Loaders
const cubeLoader = new THREE.CubeTextureLoader()
cubeLoader.setPath("/sky-cube-map2/")

const sky = cubeLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
])

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(debugObj.lowColor, 1, 15)
// sky.encoding = THREE.sRGBEncoding
scene.background = new THREE.Color(debugObj.lowColor)
// scene.environment = sky

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(25, 25, 512, 512)

// Material
const uniforms = {
  fogColor: { value: scene.fog.color },
  fogNear: { value: scene.fog.near },
  fogFar: { value: scene.fog.far },

  uTime: { value: 0 },

  uSpeed: { value: 1.0 },
  uElavation: { value: 0.1 },
  uFrequency: { value: new THREE.Vector2(5, 2) },

  uLowColor: { value: new THREE.Color(debugObj.lowColor) },
  uHighColor: { value: new THREE.Color(debugObj.highColor) },
  vColorOffset: { value: 4.223 },

  uSmallWavesElavation: { value: 0.15 },
  uSmallWavesSpeed: { value: 0.52 },
  uSmallWavesFrequency: { value: 4 },
  uSmallWavesCount: { value: 5 },
}

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.DoubleSide,
  fog: true,
})

// Debug
gui.add(waterMaterial.uniforms.uFrequency.value, "x").min(0).max(20).step(0.001).name("Wave Rows x") // prettier-ignore
gui.add(waterMaterial.uniforms.uFrequency.value, "y").min(0).max(20).step(0.001).name("Wave Rows z") // prettier-ignore
gui.add(waterMaterial.uniforms.uSpeed, "value").min(0).max(10).step(0.001).name("Wave Speed") // prettier-ignore
gui.add(waterMaterial.uniforms.uElavation, "value").min(0).max(1).step(0.001).name("Wave Elavation") // prettier-ignore
gui.addColor(waterMaterial.uniforms.uLowColor, "value").name("Wave Lower Color") // prettier-ignore
gui.addColor(waterMaterial.uniforms.uHighColor, "value").name("Wave Higher Color") // prettier-ignore
gui.add(waterMaterial.uniforms.vColorOffset, "value").min(0).max(10).step(0.001).name("Wave Color Offset") // prettier-ignore
gui.add(waterMaterial.uniforms.uSmallWavesElavation, "value").min(0).max(1).step(0.0001).name("Small Waves Elavation") // prettier-ignore
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, "value").min(0).max(5).step(0.001).name("Small Waves Speed") // prettier-ignore
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, "value").min(0).max(10).step(0.001).name("Small Waves Frequency") // prettier-ignore
gui.add(waterMaterial.uniforms.uSmallWavesCount, "value").min(0).max(10).step(1).name("Small Waves Count") // prettier-ignore

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Shaders
  waterMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
