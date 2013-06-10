attribute vec3 vertex;
attribute vec2 uv1;

uniform mat4 _mvProj;
uniform mat3 _norm;
uniform mat4 _mv;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;
varying float vDistToOrigin;

mat4 rotationMatrix(vec3 axis_, float angle)
{
    vec3 axis = normalize(axis_);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec4 computeRotatedAtmosphere(){
    vec3 origin = (_mv * vec4(0.0,0.0,0.0,1.0)).xyz;
    // find rotate angle so the surface is perpendicular to the visible horizon
    float lengthToOrigin = length(origin);
    const float planetRadius = 1.0;
    float atmosphereRotationAngle = 3.1415*0.5 - acos(planetRadius/lengthToOrigin);

    vec4 v = vec4(vertex, 1.0);
    mat4 rotation = rotationMatrix(cross(normalize((_mv * v).xyz),normalize(vertex)), atmosphereRotationAngle);
    return rotation * v;
}

void main(void) {
    vec4 v = computeRotatedAtmosphere();
    // compute position
    gl_Position = _mvProj * v;


    vDistToOrigin = length(vertex);

    vEcPosition = (_mv * v).xyz;
    vUv = uv1;
    // compute light info
    vNormal= normalize(_norm * vertex);
}