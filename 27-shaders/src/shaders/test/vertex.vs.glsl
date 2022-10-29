// uniform mat4 projectionMatrix; // transform the coordinates into clip space coorinates.
// uniform mat4 viewMatrix; // camera: position, rotation, fov, near, far
// uniform mat4 modelMatrix; // mesh: position, scale, rotation
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

varying float vRandom;
varying vec2 vUv;
varying float vElavation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elavation = sin(modelPosition.x * uFrequency.x - uTime * 1.0) / 10.0;
    elavation += sin(modelPosition.y * uFrequency.y + uTime * 2.0) / 10.0;

    modelPosition.z += elavation;
    // modelPosition.z += aRandom / 10.0;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vUv = uv;
    vElavation = elavation;
}