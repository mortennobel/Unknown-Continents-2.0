#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main(void)
{
    float trans = dot(normalize(vNormal), vec3(0.0,0.0,1.0));
    trans = pow(trans,7.0);
    gl_FragColor = vec4(vec3(1.0), trans);
}
