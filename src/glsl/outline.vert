attribute vec3 aN0;
attribute vec3 aN1;
attribute vec4 aOtherVert;
uniform float uAngleThresh;
uniform int uOutline;

varying vec4 vDebug;

void main() {
	vec4 mv = modelViewMatrix * vec4( position , 1. );
	
	gl_Position = projectionMatrix * mv;
	gl_Position.z -= 0.001; //wtf?

	vec3 viewDir = normalize(-mv.xyz);
	
	//check for null normals
	float l0 = length(aN0); 
	float l1 = length(aN1);

	if(l0*l1 < 0.0001) return; //end of mesh

	float dd = dot(normalize(aN0),normalize(aN1));

	if(acos(dd) > uAngleThresh) return;
	
	//find point
	bool isOther = aOtherVert.w > 0.5;
	vec3 a;
	vec3 b;

	if(isOther){
		a = aOtherVert.xyz;
		b = position;
	} else {
		a = position;
		b = aOtherVert.xyz;
	}

	vec3 ld = normalize(b - a);
	vec3 camToEdge = cameraPosition - a;
	float f = dot(camToEdge,ld);
	vec3 p = a + ld * f;
	p = normalize(p-cameraPosition);

	vec3 vp =  ( modelViewMatrix * vec4(p,   0.) ).xyz;
	vec3 vN0 = ( modelViewMatrix * vec4(aN0, 0.) ).xyz;
	vec3 vN1 = ( modelViewMatrix * vec4(aN1, 0.) ).xyz;

	vDebug.x = sign(dot(vN0,viewDir));
	vDebug.y = sign(dot(vN1,viewDir));

	bool outline = sign(dot(vN0,viewDir)) * sign(dot(vN1,viewDir)) < 0.;
	
	if(uOutline == 1 && outline) return;

	gl_Position.z = -2000.; //wtf?
}