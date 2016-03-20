void main() {

	vec3 finalPosition = vec3( position.x, position.y, position.z + cos(position.x * 0.0008) * 200.0 );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( finalPosition, 1.0 );

}