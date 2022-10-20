import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import EventEmitter from "./EventEmmiter"

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    // Options
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    // Saving all of the loaders
    this.setLoaders()

    // Start loading
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.gltfLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
    this.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltf":
          this.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case "texture":
          this.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case "cubeTexture":
          this.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        default:
          break
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      this.trigger("ready")
    }
  }
}
