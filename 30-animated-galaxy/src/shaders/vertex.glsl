uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
    /**
    * Position
    */
    vec4 model = modelMatrix * vec4(position, 1.0);
    
    float angle = atan(model.x, model.z);
    float distanceCenter = length(model.xz);
    float angleOffset = (1.0 / distanceCenter) * uTime * 0.2;
    angle += angleOffset;

    model.x = cos(angle) * distanceCenter;
    model.z = sin(angle) * distanceCenter;

    model.xyz += aRandomness;

    vec4 view = viewMatrix * model;
    vec4 project = projectionMatrix * view;
    
    gl_Position = project;

    /**
    * Size
    */
    gl_PointSize = uSize * aScale;
    // Size attuniation
    gl_PointSize *= (1.0 / -view.z);

    vColor = color;
}