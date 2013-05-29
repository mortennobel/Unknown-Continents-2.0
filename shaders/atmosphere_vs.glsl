attribute vec3 vertex;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat3 _norm;
uniform mat4 _mv;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;
varying float vDistToOrigin;

void main(void) {
    vec4 v = vec4(vertex, 1.0);
    // compute position
    gl_Position = _mvProj * v;


    vDistToOrigin = length(vertex);

    vEcPosition = (_mv * v).xyz;
    vUv = uv1;
    // compute light info
    vNormal= normalize(_norm * vertex);
}