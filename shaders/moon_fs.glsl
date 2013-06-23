#ifdef GL_ES
precision highp float;
#endif
varying vec3 pos;
varying vec3 norm;

uniform float scale;
uniform vec4 color;


#pragma include "noise4D.glsl"
#pragma include "light.glsl"


float getHeight(vec3 pos, float scale){
    float n =
        snoise(vec4(pos*scale,0.0))+
        0.5*snoise(vec4(pos*scale*2.0,2.0))+
        0.25*snoise(vec4(pos*scale*4.0,4.0))+
        0.125*snoise(vec4(pos*scale*8.0,6.0))+
        0.0625*snoise(vec4(pos*scale*16.0,8.0))
        ;
    float height = 0.4*n+0.5;
    
    float heightModifier = 2.0;
    height *= heightModifier;
    if (height > 1.0) {
        height = 2.0-height;    
    }
    return height;
}

void main(void)
{    
    float height = getHeight(pos, scale);
    vec3 diffuse;
    float specular;
    float specularExponent = 20.0;
    getDirectionalLight(normalize(norm), _dLight, specularExponent, diffuse, specular);
    
    gl_FragColor = vec4(color.xyz*(diffuse*0.9 + vec3(0.1))*vec3(height),1.0);
}

