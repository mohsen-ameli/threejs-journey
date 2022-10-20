import { PerspectiveCamera } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Experience from "./Experience"

const FOV = 35
const NEAR = 0.1
const FAR = 100

export default class Camera {
  constructor() {
    // Options
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene

    // Camera
    this.setInstance()

    // Controls
    this.setOrbitControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      FOV,
      this.sizes.width / this.sizes.height,
      NEAR,
      FAR
    )
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.experience.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}
