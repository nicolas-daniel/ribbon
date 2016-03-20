let glslify = require('glslify');
const Color = require('color');

class Floor extends THREE.Object3D {

	constructor ( color ) {

		super();

		// geometry
		this.geometry = new THREE.PlaneBufferGeometry( 5000, 2000, 32, 32 );

		// material
		this.material = new THREE.ShaderMaterial( {
			 uniforms: { 
			 	color: { type: 'c', value: new THREE.Color(color) },
			},
			vertexShader: glslify('../../shaders/floor.vert'),
			fragmentShader: glslify('../../shaders/floor.frag')
		} );

		// mesh
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		
		this.mesh.position.y = -500;
		this.mesh.position.z = -1000;
		this.mesh.rotation.x = -Math.PI/2;

		this.add( this.mesh );
		
	}

	changeColor ( color ) {

		this.color = Color( color );
		this.color.lighten( 0.4 );
		this.material.uniforms.color.value = new THREE.Color( this.color.hexString() );

	}

}

export default Floor;