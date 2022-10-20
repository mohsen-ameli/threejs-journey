import Experience from "../Experience.js"
import * as THREE from "three"
import Environment from "./Environment.js"

export default class World {
  constructor() {
    // Options
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.time = this.experience.time

    // Debug
    if (this.debug.active) {
      this.foxFolder = this.debug.ui.addFolder("fox")
    }

    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment()
      this.items = this.environment.resources.items

      // Objects
      this.addFloor()
      this.addFox()
    })
  }

  /**
   * Floor
   */
  addFloor() {
    this.items.floorColor.encoding = THREE.sRGBEncoding

    this.items.floorColor.repeat.set(1.5, 1.5)
    this.items.floorNormal.repeat.set(1.5, 1.5)

    this.items.floorColor.wrapS = THREE.RepeatWrapping
    this.items.floorNormal.wrapS = THREE.RepeatWrapping

    this.items.floorColor.wrapT = THREE.RepeatWrapping
    this.items.floorNormal.wrapT = THREE.RepeatWrapping

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5, 64),
      new THREE.MeshStandardMaterial({
        map: this.items.floorColor,
        normalMap: this.items.floorNormal,
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = -Math.PI * 0.5
    this.scene.add(floor)
  }

  /**
   * Fox
   */
  addFox() {
    this.fox = this.items.fox
    this.fox.scene.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.fox.scene)

    this.setAnimations()

    // Update materials
    this.fox.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }
  setAnimations() {
    this.foxMixer = new THREE.AnimationMixer(this.fox.scene)

    const animations = {}
    animations.idle = this.foxMixer.clipAction(this.fox.animations[0])
    animations.walk = this.foxMixer.clipAction(this.fox.animations[1])
    animations.run = this.foxMixer.clipAction(this.fox.animations[2])
    animations.current = animations.idle
    animations.current.play()

    // different animations
    if (this.debug.active) {
      const play = (name) => {
        const oldAnimation = animations.current
        const newAnimation = animations[name]

        newAnimation.reset()
        newAnimation.play()
        newAnimation.crossFadeFrom(oldAnimation, 1)

        animations.current = newAnimation
      }

      const debugObj = {
        idle: () => {
          play("idle")
        },
        walk: () => {
          play("walk")
        },
        run: () => {
          play("run")
        },
      }

      this.foxFolder.add(debugObj, "idle")
      this.foxFolder.add(debugObj, "walk")
      this.foxFolder.add(debugObj, "run")
    }
  }

  /**
   * updating the animation
   */
  update() {
    if (this.fox) {
      this.foxMixer.update(this.time.delta / 1000)
    }
  }
}
