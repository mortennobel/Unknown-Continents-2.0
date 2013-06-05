#ifdef GL_ES
precision highp float;
#endif
varying vec2 uv;

#pragma include "noise3D.glsl"

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

    float n = snoise(pos.xyz*20.0);
	gl_FragColor = vec4(vec3(n),1.0);
}
