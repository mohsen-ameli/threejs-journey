// Scene
const scene = new THREE.Scene()

// Camera
const sizes = {
  width: 800,
  height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// 3D Cube
const geo = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial({ color: 0x0000c0 })
const mesh = new THREE.Mesh(geo, mat)
mesh.rotation.x = 1
mesh.rotation.y = 1
scene.add(mesh)

// Renderer
const canvas = document.getElementById("threejs")
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
