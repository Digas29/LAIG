attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D heightMap;
uniform float normScale;

void main() {
	vec3 offset = vec3(0.0,0.0,0.0);

	vTextureCoord = aTextureCoord;
	vec4 height = texture2D(heightMap, vec2(0.0,0.0) + vTextureCoord);

	offset.y = height.g;
	offset *= normScale;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
