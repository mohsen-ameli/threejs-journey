varying vec2 vUv;
varying float vElavation;

uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float vColorOffset;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

void main () {
    // float strength = 1.0 - distance(vUv, vec2(0.5));
    float strength = vUv.y;

    // Clamp
    // float elavation = clamp(vElavation, 0.0, 1.0);

    // Color
    vec3 mixColor = mix(uLowColor, uHighColor, vElavation * vColorOffset);

    gl_FragColor = vec4(mixColor, 1.0);

    #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
}