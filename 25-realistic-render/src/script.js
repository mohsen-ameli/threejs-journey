import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObj = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debugObj.envMapIntensity
            child.material.needsUpdate = true
            child.receiveShadow = true
            child.castShadow = true
        }
    })
}

/**
 * Cube Textures
 */
const environmentMap = cubeTextureLoader.load([
    "/textures/environmentMaps/3/px.jpg",
    "/textures/environmentMaps/3/nx.jpg",
    "/textures/environmentMaps/3/py.jpg",
    "/textures/environmentMaps/3/ny.jpg",
    "/textures/environmentMaps/3/pz.jpg",
    "/textures/environmentMaps/3/nz.jpg",
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

debugObj.envMapIntensity = 2.5
gui.add(debugObj, "envMapIntensity").min(1).max(10).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */
gltfLoader.load("/models/hamburger2.glb", gltf => {
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.y = -1
    gltf.scene.rotation.y = Math.PI / 2
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, "y").min(0).max(Math.PI * 2).step(0.001).name("rotationY")

    updateAllMaterials()
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(-0.5, 3, -1.3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(helper)

// Debug
gui.add(directionalLight, "intensity").min(1).max(20).step(0.001).name("light intensity")
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX")
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY")
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ")
// gui.add(directionalLight.shadow, "normalBias").min(0).max(0.07).step(0.001).name("bias")

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()