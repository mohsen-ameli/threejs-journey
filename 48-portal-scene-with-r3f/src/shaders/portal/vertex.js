export default /* glsl */`
varying vec2 vUv;

void main() {
    vec4 model = modelMatrix * vec4(position, 1.0);
    vec4 view = viewMatrix * model;
    vec4 project = projectionMatrix * view;

    gl_Position = project;

    vUv = uv;
}
`