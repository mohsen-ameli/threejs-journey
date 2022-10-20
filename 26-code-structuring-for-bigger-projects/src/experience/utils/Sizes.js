import EventEmitter from "./EventEmmiter.js"

export default class Sizes extends EventEmitter {
  constructor() {
    super()

    // Setup
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Listen for changes
    window.addEventListener("resize", () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      super.trigger("resize")
    })
  }
}