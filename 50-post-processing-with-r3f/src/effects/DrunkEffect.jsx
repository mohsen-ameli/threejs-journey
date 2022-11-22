import { useFrame } from "@react-three/fiber"
import { Effect } from "postprocessing"

const fragmentShader = /* glsl */`
  uniform float frequency;
  uniform float amplitude;
  uniform float offset;

  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * frequency + offset) / amplitude;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 color = inputColor;
    color.rgb *= vec3(0.7, 1.0, 0.5);
    
    outputColor = color;
  }
`

export default class DrunkEffect extends Effect {
  constructor(props) {
    super(
      "DrunkEffect",
      fragmentShader,
      {
        uniforms: new Map([
          ["frequency", { value: props.frequency }],
          ["amplitude", { value: props.amplitude }],
          ["offset", { value: 0 }]
        ])
      }
    )
  }

  update(renderer, inputBuffer, delta) {
    this.uniforms.get("offset").value += delta
  }
}