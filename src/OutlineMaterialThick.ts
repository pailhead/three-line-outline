import { ThickLineMaterial } from 'three-thick-lines'

const cVertexGlobal = `
attribute vec3 aN0;
attribute vec3 aN1;
attribute vec4 aOtherVert;

uniform float uAngleThresh;
uniform int uOutline;
`

const cProjectedSpace = `
	position -= 0.001;
`
const cVertexEnd = `

float l0 = length(aN0);
float l1 = length(aN1);

if(l0*l1 < 0.0001) return; //end of mesh

float d = dot(normalize(aN0),normalize(aN1));

if(acos(d) > uAngleThresh) return;

vec3 vN0 = ( modelViewMatrix * vec4(aN0, 0.) ).xyz;
vec3 vN1 = ( modelViewMatrix * vec4(aN1, 0.) ).xyz;

vDebug.x = sign(dot(vN0,viewDir));
vDebug.y = sign(dot(vN1,viewDir));

// bool outline = sign(vN0.z) * sign(vN1.z) < 0.;
bool outline = sign(dot(vN0,viewDir)) * sign(dot(vN1,viewDir)) < 0.;

if(uOutline == 1 && outline) return;

gl_Position.z = -2000.; //wtf?
`

const CHUNKS: Record<string, string> = {
  cVertexGlobal,
  cProjectedSpace,
  cVertexEnd,
}

export class OutlineMaterialThick extends ThickLineMaterial {
  constructor(private _angleThreshold = 0, outline = true, color = '#ffffff') {
    super({})
    Object.keys(CHUNKS).forEach((key) => {
      this.setChunk(key, CHUNKS[key])
    })
    this.color.setStyle(color)
    this.setUniforms({
      uAngleThresh: { value: 30 },
      uOutline: { value: 1 },
    })
  }
}
