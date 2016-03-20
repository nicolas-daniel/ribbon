let glslify = require('glslify');

class Floor extends THREE.Object3D {

	constructor ( color ) {

		super();

		// geometry
		this.geometry = new THREE.PlaneBufferGeometry( 5000, 2000 );

		// material
		// this.material = new THREE.MeshBasicMaterial({ color:color });
		this.material = new THREE.ShaderMaterial( {
			 uniforms: { 
			 	color: { type: 'c', value: new THREE.Color(color) },
			},
			vertexShader: glslify('../../shaders/floor.vert'),
			fragmentShader: glslify('../../shaders/floor.frag')
		} );

		// mesh
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		
		this.mesh.position.y = -400;
		this.mesh.position.z = -1000;
		this.mesh.rotation.x = -Math.PI/2;
		
		this.add( this.mesh );
		
	}

	initGui () {

		let geometry = window.gui.add(this, 'form', [ 'Sphere','Cube','Icosahedron' ] );
		geometry.onChange((geometry) => {
			this.remove(this.mesh);
			switch ( geometry ) {
				case 'Sphere':
					this.geometry = new THREE.SphereGeometry( 150, 32, 32 );
					break;
				case 'Cube':
					this.geometry = new THREE.BoxGeometry( 220, 220, 220 );
					break;
				case 'Icosahedron':
					this.geometry = new THREE.IcosahedronGeometry( 150, 0 );
					break;
			}
			this.mesh = new THREE.Mesh( this.geometry, this.material );
			this.add( this.mesh );
		});

		let color = window.gui.addColor(this, 'formColor');
		color.onChange(() => {
			this.material.uniforms.color.value = new THREE.Color(this.formColor);
		});

		window.gui.add(this, 'noiseSpeed', 1.0, 10.0 );
		window.gui.add(this, 'noiseSize', 0.0, 1.0 );

	}
	
}

export default Floor;