#ifdef GL_ES
precision highp float;
#endif
varying vec3 n;
varying vec3 u_tangent;
varying vec3 v_tangent;
varying vec2 uv;
varying vec3 pos;

#pragma include "light.glsl"
#pragma include "shadowmap.glsl"

uniform sampler2D heightMap;
uniform sampler2D mainTexture;
uniform float maxHeight;

#extension GL_OES_standard_derivatives : enable

// pragma include "noise2D.glsl for snoise(vec2 v)
// pragma include "noise3D.glsl"] for snoise(vec3 v)
// pragma include "noise4D.glsl"] for snoise(vec4 v)
// pragma include "cellular2D.glsl"] for cellular(vec2 P)
// pragma include "cellular2x2.glsl"] for cellular2x2(vec2 P)
// pragma include "cellular2x2x2.glsl"] for cellular2x2x2(vec3 P)
// pragma include "cellular3D.glsl"] cellular(vec3 P)

vec3 normal(vec2 tc)
{
    // scale height with angle
    float scaledHeight = maxHeight*(dot(n, -normalize(pos)));
    vec2 dUV = dFdx(tc);
    vec2 dUV2 = 2.0*fwidth(tc);
    
    float udiff = 3.0*scaledHeight*(texture2D(heightMap, tc+vec2(dUV.x,0)).r-texture2D(heightMap, tc-vec2(dUV.x,0)).r)/dUV2.x;
    float vdiff = 3.0*scaledHeight*(texture2D(heightMap, tc+vec2(0,dUV.y)).r-texture2D(heightMap, tc-vec2(0,dUV.y)).r)/dUV2.y;
    return normalize(n - udiff * u_tangent - vdiff * v_tangent);
}

void main(void)
{
    vec3 eyeSpaceLigthDirection = vec3(0.0,0.0,1.0);
    vec3 nBumped = normal(uv);

    vec3 diffuse;

    float specular;
    float specularExponent = 0.1;
    getDirectionalLight(nBumped, _dLight, specularExponent, diffuse, specular);

	gl_FragColor = vec4(texture2D(mainTexture,uv).xyz*max(diffuse, _ambient),1.0);
    //gl_FragColor = vec4(nBumped,1.0);
}
