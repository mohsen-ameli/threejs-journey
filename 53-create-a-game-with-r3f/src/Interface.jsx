import { useKeyboardControls } from "@react-three/drei";
import { addEffect, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import useGame from "./stores/useGame";

const Interface = () => {
  const time = useRef()
  const keys = useKeyboardControls(state => state)
  const restart = useGame(state => state.restart)

  const [phase, setPhase] = useState()

  useEffect(() => {
    const unsub = useGame.subscribe(
      state => state.phase,
      phase => setPhase(phase)
    )

    const unsubEffect = addEffect(() => {
      const state = useGame.getState()

      let elapsedTime = 0

      if (state.phase === "playing")
        elapsedTime = Date.now() - state.startTime
      else if (state.phase === "ended")
        elapsedTime = state.endTime - state.startTime

      elapsedTime /= 1000
      elapsedTime = elapsedTime.toFixed(2)

      time.current.textContent = elapsedTime
    })

    return () => {
      unsub()
      unsubEffect()
    }
  }, [])

  return <div className="interface">
    <div className="time" ref={time}>0.00</div>

    {phase === "ended" && <div className="restart" onClick={restart}>RESTART</div>}

    <div className="controls">
      <div className="raw">
        <div className={`key ${keys.forward ? 'active' : ''}`}></div>
      </div>
      <div className="raw">
        <div className={`key ${keys.leftward ? 'active' : ''}`}></div>
        <div className={`key ${keys.backward ? 'active' : ''}`}></div>
        <div className={`key ${keys.rightward ? 'active' : ''}`}></div>
      </div>
      <div className="raw">
        <div className={`key large ${keys.jump ? 'active' : ''}`}></div>
      </div>
    </div>

    <div className={keys.jump ? "active-space" : "key-space"}></div>
  </div>
}

export default Interface;