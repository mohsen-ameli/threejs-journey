import * as THREE from "three"
import Experience from "./Experience"

export default class Renderer {
  constructor() {
    // Options
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    // Debug
    if (this.debug.active) {
      this.renderer = this.debug.ui.addFolder("renderer")
    }

    // Renderer
    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setClearColor("#211d20")
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

    // Debug
    if (this.debug.active) {
      this.renderer.add(this.instance, "toneMapping", {
        none: THREE.NoToneMapping,
        cineon: THREE.CineonToneMapping,
        reinhard: THREE.ReinhardToneMapping,
        linear: THREE.LinearToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      })
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
