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
 * Galexy
 */
const params = {}
params.count = 100000
params.size = 0.01
params.radius = 7
params.branches = 3
params.spin = 1
params.randomness = 0.2
params.randomnessPower = 2
params.insideColor = 0xff8800
params.outsideColor = 0x88aaff

let geometry = null
let material = null
let points = null

const generateGalexy = () => {
    /**
     * Destroy old galexy
     */
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const array = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)

    const insideColor = new THREE.Color(params.insideColor)
    const outsideColor = new THREE.Color(params.outsideColor)

    for (let i = 0; i < params.count; i++) {
        let i3 = i * 3

        // Posision
        const radius = Math.random() * params.radius
        const spinAngle = radius * params.spin
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2

        const randX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
        const randY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
        const randZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius

        array[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randX
        array[i3 + 1] = randY
        array[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ

        // Colors
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / params.radius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(array, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        // color: 0xffffff,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalexy()

// Debug
gui.add(params, "count").min(100).max(1000000).step(100).onFinishChange(generateGalexy)
gui.add(params, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalexy)
gui.add(params, "radius").min(0.1).max(20).step(0.1).onFinishChange(generateGalexy)
gui.add(params, "branches").min(3).max(20).step(1).onFinishChange(generateGalexy)
gui.add(params, "spin").min(-5).max(5).step(0.01).onFinishChange(generateGalexy)
gui.add(params, "randomness").min(0).max(2).step(0.01).onFinishChange(generateGalexy)
gui.add(params, "randomnessPower").min(2).max(10).step(1).onFinishChange(generateGalexy)

gui.addColor(params, "insideColor").onFinishChange(generateGalexy)
gui.addColor(params, "outsideColor").onFinishChange(generateGalexy)

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
camera.position.x = 3
camera.position.y = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animating
    points.rotation.y = -elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()