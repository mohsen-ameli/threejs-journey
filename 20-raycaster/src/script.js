import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.position.y = -10

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

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

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = -(e.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', e => {
    if (witness) {
        switch (witness.object) {
            case object1:
                console.log("obj1")
                break
            case object2:
                console.log("obj2")
                break
            case object3:
                console.log("obj3")
                break
            default:
                console.log("clicked")
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

let witness = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animating
    object1.position.y = (Math.sin(elapsedTime * 0.8)) * 1.2
    object2.position.y = (Math.sin(elapsedTime * 1)) * 1.2
    object3.position.y = (Math.sin(elapsedTime * 1.2)) * 1.2

    // Raycaster
    raycaster.setFromCamera(mouse, camera)

    const objs = [object1, object2, object3]
    const intersected = raycaster.intersectObjects(objs)

    objs.map(obj => obj.material.color.set("red"))
    intersected.map(obj => obj.object.material.color.set("blue"))

    if (intersected.length) { // intersecting
        // mouse enter
        if (witness === null) {
            console.log("mouse enter")
        }

        witness = intersected[0]
    } else { // exiting intersection
        if (witness) { // mouse leave
            console.log("mouse leave")
        }

        witness = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()