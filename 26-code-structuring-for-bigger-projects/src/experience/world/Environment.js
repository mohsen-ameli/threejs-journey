import * as THREE from "three"
import Experience from "../Experience"

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active) {
      this.envFolder = this.debug.ui.addFolder("environment")
      this.lights = this.debug.ui.addFolder("lights")
    }

    this.setEnvMap()
    this.setLights()
  }

  setLights() {
    this.light = new THREE.DirectionalLight("#ffffff", 4)
    this.light.castShadow = true
    this.light.shadow.camera.far = 15
    this.light.shadow.mapSize.set(1024, 1024)
    this.light.shadow.normalBias = 0.05
    this.light.position.set(3.5, 2, -1.25)
    this.scene.add(this.light)

    // Debug
    if (this.debug.active) {
      this.lights
        .add(this.light, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("intensity")
      this.lights
        .add(this.light.position, "x")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("position x")
      this.lights
        .add(this.light.position, "y")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("position y")
      this.lights
        .add(this.light.position, "z")
        .min(-5)
        .max(5)
        .step(0.001)
        .name("position z")
    }
  }

  setEnvMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.envMap
    this.environmentMap.texture.encoding = THREE.sRGBEncoding

    this.scene.environment = this.environmentMap.texture

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }

    this.environmentMap.updateMaterials()

    // Debug
    if (this.debug.active) {
      this.envFolder
        .add(this.environmentMap, "intensity")
        .min(0)
        .max(4)
        .step(0.001)
        .name("intensity")
        .onChange(this.environmentMap.updateMaterials)
    }
  }
}
