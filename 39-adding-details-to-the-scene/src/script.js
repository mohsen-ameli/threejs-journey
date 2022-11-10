import "./style.css"
import * as dat from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 400,
})

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
const portalMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
