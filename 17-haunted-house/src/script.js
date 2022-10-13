import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { MeshStandardMaterial } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog(0x282637, 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// walls
const brickColor = textureLoader.load("/textures/bricks/color.jpg")
const brickNormal = textureLoader.load("/textures/bricks/normal.jpg")
const brickRoughness = textureLoader.load("/textures/bricks/roughness.jpg")
const brickAmbientOcclusion = textureLoader.load("/textures/bricks/ambientOcclusion.jpg")

// roof
const roofColor = textureLoader.load("/textures/roof2/color.jpg")
const roofNormal = textureLoader.load("/textures/roof2/normal.jpg")
const roofRoughness = textureLoader.load("/textures/roof2/roughness.jpg")
const roofHeight = textureLoader.load("/textures/roof2/height.png")
const roofAmbientOcclusion = textureLoader.load("/textures/roof2/ambientOcclusion.jpg")

roofColor.repeat.set(2, 2)
roofNormal.repeat.set(2, 2)
roofRoughness.repeat.set(2, 2)
roofHeight.repeat.set(2, 2)
roofAmbientOcclusion.repeat.set(2, 2)

roofColor.wrapS = THREE.RepeatWrapping
roofColor.wrapT = THREE.RepeatWrapping
roofNormal.wrapS = THREE.RepeatWrapping
roofNormal.wrapT = THREE.RepeatWrapping
roofRoughness.wrapS = THREE.RepeatWrapping
roofRoughness.wrapT = THREE.RepeatWrapping
roofHeight.wrapS = THREE.RepeatWrapping
roofHeight.wrapT = THREE.RepeatWrapping
roofAmbientOcclusion.wrapS = THREE.RepeatWrapping
roofAmbientOcclusion.wrapT = THREE.RepeatWrapping

// window
const glassColor = textureLoader.load("/textures/glass/glassColor.jpg")
const glassNormal = textureLoader.load("/textures/glass/glassNormal.jpg")
const glassHeight = textureLoader.load("/textures/glass/glassHeight.png")
const glassMetalness = textureLoader.load("/textures/glass/glassMetalness.jpg")
const glassAmbientOcclusion = textureLoader.load("/textures/glass/glassAmbientOcclusion.jpg")

const grassColor = textureLoader.load("/textures/grass/color.jpg")
const grassNormal = textureLoader.load("/textures/grass/normal.jpg")
const grassRoughness = textureLoader.load("/textures/grass/roughness.jpg")
const grassAmbientOcclusion = textureLoader.load("/textures/grass/ambientOcclusion.jpg")

grassColor.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)
grassAmbientOcclusion.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassColor.wrapT = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping

// door
const doorColor = textureLoader.load("/textures/door/color.jpg")
const doorNormal = textureLoader.load("/textures/door/normal.jpg")
const doorRoughness = textureLoader.load("/textures/door/roughness.jpg")
const doorAmbientOcclusion = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorAlpha = textureLoader.load("/textures/door/alpha.jpg")
const doorHeight = textureLoader.load("/textures/door/height.jpg")
const doorMetalness = textureLoader.load("/textures/door/metalness.jpg")

// grave
const graveColor = textureLoader.load("/textures/grave/color.jpg")
const graveAmbientOcclusion = textureLoader.load("/textures/grave/ambientOcclusion.jpg")
const graveHeight = textureLoader.load("/textures/grave/height.png")
const graveNormal = textureLoader.load("/textures/grave/normal.jpg")
const graveRoughness = textureLoader.load("/textures/grave/roughness.jpg")

/**
 * House
 */
const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassColor,
    normalMap: grassNormal,
    roughnessMap: grassRoughness,
    aoMap: grassAmbientOcclusion
})

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    grassMaterial
)
floor.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// House
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({
        map: brickColor,
        normalMap: brickNormal,
        roughnessMap: brickRoughness,
        aoMap: brickAmbientOcclusion
    })
)
walls.receiveShadow = true
walls.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.5
house.add(walls)

// Windows
const glassWindowGeometry = new THREE.PlaneGeometry(1, 1, 50, 50)
const glassWindowMaterial = new THREE.MeshStandardMaterial({
    map: glassColor,
    normalMap: glassNormal,
    displacementMap: glassHeight,
    displacementScale: 0.1,
    metalnessMap: glassMetalness,
    aoMap: glassAmbientOcclusion
})
const glassWindow1 = new THREE.Mesh(glassWindowGeometry, glassWindowMaterial)
glassWindow1.rotation.y = Math.PI / 2
glassWindow1.position.x = walls.geometry.parameters.width / 2 + 0.01
glassWindow1.position.y = walls.geometry.parameters.height / 2
glassWindow1.position.z = 1

const glassWindow2 = new THREE.Mesh(glassWindowGeometry, glassWindowMaterial)
glassWindow2.rotation.y = Math.PI / 2
glassWindow2.position.x = walls.geometry.parameters.width / 2 + 0.01
glassWindow2.position.y = walls.geometry.parameters.height / 2
glassWindow2.position.z = -1

glassWindowGeometry.setAttribute("uv2", new THREE.Float32BufferAttribute(glassWindow1.geometry.attributes.uv.array, 2))

house.add(glassWindow1, glassWindow2)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 2, 4, 64, true),
    new MeshStandardMaterial({
        map: roofColor,
        normalMap: roofNormal,
        roughnessMap: roofRoughness,
        displacementMap: roofHeight,
        displacementScale: 0.1,
        aoMap: roofAmbientOcclusion
    })
)
roof.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2))
roof.rotation.y = Math.PI / 4
roof.position.y = roof.geometry.parameters.height / 2 + walls.geometry.parameters.height - .4
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        normalMap: doorNormal,
        roughnessMap: doorRoughness,
        aoMap: doorAmbientOcclusion,
        transparent: true,
        alphaMap: doorAlpha,
        metalnessMap: doorMetalness,
        displacementMap: doorHeight,
        displacementScale: .1
    })
)
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = .9
door.position.z = walls.geometry.parameters.depth / 2
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(.8, 15, 15)
bushGeometry.setAttribute("uv2", new THREE.Float32BufferAttribute(bushGeometry.attributes.uv.array, 2))

const bush1 = new THREE.Mesh(bushGeometry, grassMaterial)
bush1.position.set(-1.8, 0, 3)

const bush2 = new THREE.Mesh(bushGeometry, grassMaterial)
bush2.position.set(2.12, 0, 3)

const bush3 = new THREE.Mesh(bushGeometry, grassMaterial)
bush3.position.set(-2.4, 0, 1.82)
bush3.scale.set(0.5, 0.5, 0.5)

const bush4 = new THREE.Mesh(bushGeometry, grassMaterial)
bush4.position.set(1, 0, 2.95)
bush4.scale.set(0.5, 0.5, 0.5)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(.1, 1, .1, 50, 50)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColor,
    aoMap: graveAmbientOcclusion,
    // displacementMap: graveHeight,
    // displacementScale: 0.1,
    normalMap: graveNormal,
    roughnessMap: graveRoughness
})
const graveSectionGeometry = new THREE.BoxGeometry(.4, .1, .1, 50, 50)
graveGeometry.setAttribute("uv2", new THREE.Float32BufferAttribute(graveGeometry.attributes.uv.array, 2))

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 5.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Group()

    const main = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.add(main)

    const section = new THREE.Mesh(graveSectionGeometry, graveMaterial)
    section.position.y = 0.32
    grave.add(section)

    grave.position.set(x, 0.4, z)
    grave.rotation.z = (Math.random() - 0.4) * .5
    grave.castShadow = true

    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#506886', 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#506886', 0.2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.5, 3)
gui.add(doorLight, 'distance').min(0).max(10).step(0.001)
house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight(0xffff00, 2, 2)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xff00ff, 2, 2)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0x00ffff, 2, 2)
scene.add(ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x282637)

// Shadows
renderer.shadowMap.enabled = true
moonLight.castShadow = true

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

ghost1.castShadow = true
ghost2.castShadow = true
ghost2.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animating ghosts
    const angle1 = elapsedTime * 0.5          // speed
    ghost1.position.x = Math.cos(angle1) * 4  // 4 is the radius
    ghost1.position.z = Math.sin(angle1) * 4
    ghost1.position.y = Math.sin(angle1 * 4)

    const angle2 = -elapsedTime * 0.3
    ghost2.position.x = Math.cos(angle2) * 7
    ghost2.position.z = Math.sin(angle2) * 7
    ghost2.position.y = Math.sin(angle2 * 2) + Math.sin(angle2 * 4)

    const angle3 = elapsedTime * 1
    ghost3.position.x = Math.cos(angle3) * (5 + Math.tan(elapsedTime) * .5)
    ghost3.position.z = Math.sin(angle3) * (5 + Math.tan(elapsedTime) * .5)
    ghost3.position.y = Math.sin(angle3 * 10)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()