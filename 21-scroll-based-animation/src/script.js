import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from "gsap"

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#f3b712'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load("/textures/gradients/3.jpg")
gradient.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({color: parameters.materialColor, gradientMap: gradient})

// Objs
const space = 4

const obj1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const obj2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2.5, 60, 64),
    material
)
const obj3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.3, 60, 60),
    material
)

obj2.position.y = - space * 1
obj3.position.y = - space * 2

obj1.position.x = 2
obj2.position.x = -2
obj3.position.x = 1.5

scene.add(obj1, obj2, obj3)

const allObjs = [obj1, obj2, obj3]

/**
 * Particles
 */
const particleGeometry = new THREE.BufferGeometry()
const count = 200

const array = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    let i3 = i * 3

    array[i3 + 0] = (Math.random() - 0.5) * 8
    array[i3 + 1] = (Math.random() - 0.5) * 20
    array[i3 + 2] = (Math.random() - 0.5) * 5
}

particleGeometry.setAttribute("position", new THREE.BufferAttribute(array, 3))

const pointsMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 0.05,
    sizeAttenuation: true
})

const particles = new THREE.Points(particleGeometry, pointsMaterial)
scene.add(particles)

/**
 * Lights
 */
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-1, -1, 0)
scene.add(light)

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
const camGroup = new THREE.Group()
scene.add(camGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
camGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let section = 0

window.addEventListener('scroll', e => {
    scrollY = window.scrollY

    const sect = Math.round(scrollY / sizes.height)

    if (sect !== section) {
        section = sect

        gsap.to(
            allObjs[section].rotation,
            {
                duration: 1.5,
                ease: "power2.inOut",
                x: "+=6",
                y: "+=1",
                z: "+=5"
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {x: 0, y: 0}

window.addEventListener("mousemove", e => {
    cursor.x = (e.clientX / sizes.width - 0.5) / 2
    cursor.y = - (e.clientY / sizes.height - 0.5) / 2
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Scroll
    camera.position.y = - scrollY / sizes.height * space

    // Cursor
    camGroup.position.x += (cursor.x - camGroup.position.x) * 5 * deltaTime
    camGroup.position.y += (cursor.y - camGroup.position.y) * 5 * deltaTime

    // Animation
    for (const obj of allObjs) {
        obj.rotation.x += deltaTime / 5
        obj.rotation.y += deltaTime / 3
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}; tick()