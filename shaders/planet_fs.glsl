precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;

uniform vec4 mainColor;
uniform float specularExponent;
uniform vec4 specularColor;
uniform sampler2D mainTexture;

#pragma include "light.glsl"
#pragma include "shadowmap.glsl"

void main(void)
{
    vec3 normal = normalize(vNormal);
    vec3 diffuse;
    float specular;
    getDirectionalLight(normal, _dLight, specularExponent, diffuse, specular);
    vec3 diffusePoint;
    float specularPoint;
    getPointLight(normal,vEcPosition, _pLights,specularExponent,diffusePoint,specularPoint);
    float visibility;
    if (SHADOWS){
        visibility = computeLightVisibility();
    } else {
        visibility = 1.0;
    }
    vec3 color = max((diffuse+diffusePoint)*visibility,_ambient.xyz)*mainColor.xyz;

    gl_FragColor = vec4(texture2D(mainTexture,vUv).xyz*color.xyz, 1.0)+vec4((specular+specularPoint)*specularColor.xyz,0.0);
}
