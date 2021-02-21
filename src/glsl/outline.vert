attribute vec3 aN0;
attribute vec3 aN1;

uniform float uAngleThresh;
uniform int uOutline;

varying vec3 vDebug;
void main() {
	vec4 mv = modelViewMatrix * vec4( position , 1. );
	vec3 viewDir = normalize(-mv.xyz);
	gl_Position = projectionMatrix * mv;
	gl_Position.z -= 0.001;
	float l0 = length(aN0);
	float l1 = length(aN1);
	vDebug = vec3(1.);

	if(l0*l1 < 0.0001) return;
	
	vec3 vN0 = normalize((modelViewMatrix * vec4(aN0, 0.)).xyz);
	vec3 vN1 = normalize((modelViewMatrix * vec4(aN1, 0.)).xyz);
	// const vec3 viewDir = vec3(0.,0.,-1.);
	float d0 = dot(vN0,viewDir);
	float d1 = dot(vN1,viewDir);

	// vDebug = vec3(
	// 	d0 >= 0. ? 1. : 0.,
	// 	d1 >= 0. ? 1. : 0.,
	// 	1.
	// );

	bool outline = sign(d0 * d1) > 0.;
	// bool outline = d0 >= 0. && d1 >= 0.;
	// if(uOutline == 1 && outline) {
	if(outline) {
		// gl_Position.x += -.5;
		// gl_Position.x = -0.25 / gl_Position.w;
		// gl_Position.w = 1.;

		// gl_Position.y = -2.;
		gl_Position.z = -2000.;
	}
}