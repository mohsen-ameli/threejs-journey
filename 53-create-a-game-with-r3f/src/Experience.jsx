import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import Effects from './Effects.jsx'
import { Level } from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'

export default function Experience() {
  const trapCount = useGame(state => state.trapCount)
  const trapSeed = useGame(state => state.trapSeed)

  return <>
    <color args={["#252731"]} attach="background" />

    {/* <OrbitControls makeDefault /> */}

    {/* <Perf position='top-left' /> */}

    <Effects />
    <Lights />

    <Physics>
      {/* <Debug /> */}
      <Level trapCount={trapCount} seed={trapSeed} />
      <Player />
    </Physics>
  </>
}