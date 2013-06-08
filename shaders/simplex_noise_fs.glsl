#ifdef GL_ES
precision highp float;
#endif
varying vec2 uv;

uniform float scale;

#pragma include "noise4D.glsl"

vec3 unproject(vec2 uv){
    const float PI = 3.14159265359;
    // normalize to -PI to +PI
    float azimuth = (uv.x -1.0)*2.0*PI;
    float y = (uv.y-0.5) * 2.0;
    return vec3(cos(azimuth) * cos(y),
            y,
            sin(azimuth) * cos(y));
}

void main(void)
{
    vec3 pos = unproject(uv);

    float n =
        snoise(vec4(pos.xyz*scale,0.0))+
        0.5*snoise(vec4(pos.xyz*scale*2.0,2.0))+
        0.25*snoise(vec4(pos.xyz*scale*4.0,4.0))+
        0.125*snoise(vec4(pos.xyz*scale*8.0,6.0))+
        0.0625*snoise(vec4(pos.xyz*scale*16.0,8.0))
        ;
	gl_FragColor = vec4(0.4*n+0.5);
}
