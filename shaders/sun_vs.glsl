attribute vec3 vertex;
attribute vec3 normal;

uniform mat4 _mvProj;
uniform mat3 _norm;

varying vec3 vNormal;

void main(void) {
    vNormal = _norm * normal;
    gl_Position = _mvProj * vec4(vertex, 1.0);
}