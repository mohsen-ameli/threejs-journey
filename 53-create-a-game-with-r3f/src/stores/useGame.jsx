import create from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export default create(subscribeWithSelector((set) => {
  return {
    trapCount: 100,
    trapSeed: 0,

    /**
     * Time
     */
    startTime: 0,
    endTime: 0,

    /**
     * Phase
     */
    phase: "ready",

    start: () => set(state => {
      if (state.phase === "ready")
        return { phase: "playing", startTime: Date.now() }
      return {}
    }),

    restart: () => set(state => {
      if (state.phase === "playing" || state.phase === "ended")
        return { phase: "ready", trapSeed: Math.random() }
      return {}
    }),

    end: () => set(state => {
      if (state.phase === "playing")
        return { phase: "ended", endTime: Date.now() }
      return {}
    }),
  }
}))