const Placeholder = (props) => {
  return <mesh {...props}>
    <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
    <meshStandardMaterial wireframe color="orange" />
  </mesh>
}

export default Placeholder