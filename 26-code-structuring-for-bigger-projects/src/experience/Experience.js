import * as THREE from "three"
import Camera from "./Camera"
import Renderer from "./Renderer"
import Resources from "./utils/Resources"
import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import World from "./world/World"
import sources from "./sources"
import Debug from "./utils/Debug"

let instance = null

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance
    }
    instance = this

    window.experience = this

    // Options
    this.canvas = canvas

    // Instances
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // Sizes event
    this.sizes.on("resize", () => this.resize())

    // Time event
    this.time.on("tick", () => this.update())
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off("resize")
    this.time.off("tick")

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        for (const key in child.material) {
          const value = child.material[key]

          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    window.removeEventListener("resize", () => {})
  }
}
