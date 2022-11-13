uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
    vec4 model = modelMatrix * vec4(position, 1.0);

    model.y += sin(uTime + 100.0 *  model.x) / 10.0;

    vec4 view = viewMatrix * model;
    vec4 project = projectionMatrix * view;

    gl_Position = project;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -view.z);
}