precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vEcPosition;
varying vec3 vWPos; // world position

uniform vec4 mainColor;
uniform float specularExponent;
uniform vec4 specularColor;
uniform sampler2D mainTexture;

#pragma include "light.glsl"
#pragma include "shadowmap.glsl"
#pragma include "noise3D.glsl"


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
    float noise = snoise(vWPos*3.0)+
        snoise(vWPos*1.0)+
        snoise(vWPos*0.5)
        ; // simple noise
    gl_FragColor = vec4(noise ,noise ,noise ,1.0);
}
