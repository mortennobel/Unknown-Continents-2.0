precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;

uniform vec4 mainColor;

#pragma include "light.glsl"

void main(void)
{
    vec3 normal = normalize(vNormal);
    vec3 diffuseDirectionalLight = getDirectionalLightDiffuse(normal,_dLight);
    vec3 diffusePointLight = getPointLightDiffuse(normal,vEcPosition, _pLights);
    vec4 color = vec4(diffuseDirectionalLight+diffusePointLight,1.0)*mainColor;

    gl_FragColor = color;
}
