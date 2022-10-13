import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as gui from "lil-gui"

/***
 * Debug
 */
 const debug = new gui.GUI()

/**
 * Textures
 */
 const loadingManager = new THREE.LoadingManager()
 const textureLoader = new THREE.TextureLoader(loadingManager)
 const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
 
 const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
 const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
 const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
 const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
 const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
 const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
 const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
 const gradientTexture = textureLoader.load("/textures/gradients/3.jpg")
 const matcapTexture = textureLoader.load("/textures/matcaps/1.png")
 const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/1/px.jpg",
    "/textures/environmentMaps/1/nx.jpg",
    "/textures/environmentMaps/1/py.jpg",
    "/textures/environmentMaps/1/ny.jpg",
    "/textures/environmentMaps/1/pz.jpg",
    "/textures/environmentMaps/1/nz.jpg"
 ])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objs
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color(0xff00ff)
// material.wireframe = true
// material.opacity = .5
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100

// const material = new THREE.MeshStandardMaterial()
// material.metalness = .2
// material.roughness = .1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1.025
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.alphaMap = doorAlphaTexture
// material.transparent = true

const material = new THREE.MeshStandardMaterial()
material.metalness = .7
material.roughness = .2
material.envMap = environmentMapTexture

debug.add(material, "metalness", 0, 1, 0.001)
debug.add(material, "roughness", 0, 1, 0.001)
debug.add(material, "aoMapIntensity", 0, 10, 0.001)
debug.add(material, "displacementScale", 0, 1, 0.001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5, 64, 64),
    material
)
sphere.geometry.setAttribute("uv2", new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.5, .15, 64, 128),
    material
)
torus.geometry.setAttribute("uv2", new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.position.x = -2
sphere.position.x = 2

scene.add(sphere, plane, torus)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(3, 5, 2)
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.x = elapsedTime * .1
    plane.rotation.x  = elapsedTime * .1
    torus.rotation.x  = elapsedTime * .1

    sphere.rotation.y = elapsedTime * .15
    plane.rotation.y  = elapsedTime * .15
    torus.rotation.y  = elapsedTime * .15

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()