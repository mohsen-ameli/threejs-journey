import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from "cannon"

/**
 * Debug
 */
const gui = new dat.GUI()
const guiElements = {}

guiElements.makeSphere = () => {
    createSphere(
        Math.random(),
        {   x: (Math.random() - 0.5) * 5,
            y: 3,
            z: (Math.random() - 0.5) * 5
        }
    )
}
guiElements.makeBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 5,
            y: 3,
            z: (Math.random() - 0.5) * 5
        }
    )
}
guiElements.makeBoth = () => {
    createSphere(
        Math.random(),
        {   x: (Math.random() - 0.5) * 5,
            y: 3,
            z: (Math.random() - 0.5) * 5
        }
    )
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 5,
            y: 3,
            z: (Math.random() - 0.5) * 5
        }
    )
}
guiElements.reset = () => {
    objectsToUpdate.map(obj => {
        obj.body.removeEventListener("collide", playCollisionSound)
        world.remove(obj.body)

        scene.remove(obj.mesh)
    })
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(guiElements, "makeSphere")
gui.add(guiElements, "makeBox")
gui.add(guiElements, "makeBoth")
gui.add(guiElements, "reset")

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const audio = new Audio("/sounds/hit.mp3")

const playCollisionSound = collision => {
    if (collision.contact.getImpactVelocityAlongNormal() > 1) {
        audio.volume = Math.random()
        audio.currentTime = 0
        audio.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.png',
    '/textures/environmentMaps/1/nx.png',
    '/textures/environmentMaps/1/py.png',
    '/textures/environmentMaps/1/ny.png',
    '/textures/environmentMaps/1/pz.png',
    '/textures/environmentMaps/1/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Material
const defaultMaterial = new CANNON.Material("default")
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
)
world.add(floorBody)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utilitis
 */
let objectsToUpdate = []

// Sphere
const sphereGeo = new THREE.SphereGeometry(1, 30, 30)
const material = new THREE.MeshStandardMaterial({
    envMap: environmentMapTexture,
    roughness: 0,
    metalness: 1
})

const createSphere = (radius, position) => {
    // THREE.js
    const mesh = new THREE.Mesh(sphereGeo, material)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // CANNON.js
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        shape,
        position
    })
    body.position.copy(position)
    body.addEventListener("collide", playCollisionSound)
    world.addBody(body)

    // body.collisionResponse = console.log("first")

    // save in objects to update
    objectsToUpdate.push({mesh, body})
}

// Box
const boxGeo = new THREE.BoxGeometry(1, 1, 1)

const createBox = (width, height, depth, position) => {
    // THREE.js
    const mesh = new THREE.Mesh(boxGeo, material)
    mesh.scale.set(width, height, depth)
    mesh.position.copy(position)
    mesh.castShadow = true
    scene.add(mesh)

    // CANNON.js
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
    const body = new CANNON.Body({
        shape,
        position,
        mass: 1
    })
    body.position.copy(position)
    body.addEventListener("collide", playCollisionSound)
    world.addBody(body)

    // Saving our objs to objectsToUpdate
    objectsToUpdate.push({mesh, body})
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsed = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsed
    oldElapsed = elapsedTime

    // Update physics world
    world.step(1 / 60, deltaTime, 3)

    // Updating the objects
    objectsToUpdate.map(obj => {
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}; tick()