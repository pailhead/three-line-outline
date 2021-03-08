uniform vec3 uColor;
varying vec4 vDebug;

void main(){
  gl_FragColor = vec4(uColor,1.);
}