class Ribbon extends THREE.Object3D {

	constructor ( opt ) {

		super();

		// params
		this.time = 0;
		this.frame = 0;
		this.angle = 0;

		this.speed = 1.03;
		this.lineLength = 100;
		this.globalX = 0;
		this.globalY = 0;
		this.globalZ = 0;
		this.smoothX = 0;
		this.smoothY = 0;
		this.smoothZ = 0;

		// geometry
		this.geometry = new Float32Array( this.lineLength * 3 );
		this.geometryClone = new Float32Array( this.lineLength * 3 );

		console.log(this.geometry);
		for( var j = 0; j < this.geometry.length; j += 3 ) {
			this.geometry[ j ] = this.geometry[ j + 1 ] = this.geometry[ j + 2 ] = 0;
			this.geometryClone[ j ] = this.geometryClone[ j + 1 ] = this.geometryClone[ j + 2 ] = 0;
		}

		// line
		this.line = new THREE.MeshLine();
		this.line.setGeometry( this.geometry, function( p ) { return p; } );

		this.lineClone = new THREE.MeshLine();
		this.lineClone.setGeometry( this.geometryClone, function( p ) { return p; } );

		// material
		this.material = new THREE.MeshLineMaterial({ color:new THREE.Color(0xffffff), lineWidth:4 });
		this.materialClone = new THREE.MeshLineMaterial({ color:new THREE.Color(0xF1BBF5), lineWidth:2 });

		// mesh
		this.mesh = new THREE.Mesh( this.line.geometry, this.material );
		
		this.meshClone = new THREE.Mesh( this.lineClone.geometry, this.materialClone );

		this.add( this.mesh );
		this.add( this.meshClone );
		
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

	update() {

		// if (this.time % 3 === 0 && window.intersects.length > 0) {
		if (window.intersects.length > 0) {
			
			for( var j = 0; j < this.geometry.length; j+= 3 ) {
				this.geometry[ j ] = this.geometry[ j + 3 ] * this.speed;
				this.geometry[ j + 1 ] = this.geometry[ j + 4 ] * this.speed;
				this.geometry[ j + 2 ] = this.geometry[ j + 5 ] * this.speed;

				this.geometryClone[ j ] = this.geometryClone[ j + 3 ] * this.speed;
				this.geometryClone[ j + 1 ] = this.geometryClone[ j + 4 ] * this.speed;
				this.geometryClone[ j + 2 ] = this.geometryClone[ j + 5 ] * this.speed;
			}
			
			var d = window.intersects[ 0 ].point.x;

			this.globalX = d;// * Math.cos( this.angle );
			this.globalY = window.intersects[ 0 ].point.y;
			this.globalZ = 0;//d * Math.sin( this.angle );
			// this.globalX = window.mouseX - window.innerWidth / 2;
			// this.globalY = - window.mouseY + window.innerHeight / 2;
			// this.globalZ = 0;
			
			this.smoothX += (this.globalX - this.smoothX) * 0.1;
			this.smoothY += (this.globalY - this.smoothY) * 0.1;
			this.smoothZ += (this.globalZ - this.smoothZ) * 0.1;

			this.geometry[ this.geometry.length - 3 ] = this.smoothX;
			this.geometry[ this.geometry.length - 2 ] = this.smoothY;
			this.geometry[ this.geometry.length - 1 ] = this.smoothZ;

			this.geometryClone[ this.geometryClone.length - 3 ] = this.smoothX + Math.sin(this.frame) * 10;
			this.geometryClone[ this.geometryClone.length - 2 ] = this.smoothY + Math.cos(this.frame) * 10;
			this.geometryClone[ this.geometryClone.length - 1 ] = this.smoothZ + Math.sin(this.frame) * 10;
			
			this.line.setGeometry( this.geometry );
			this.lineClone.setGeometry( this.geometryClone );
		}

		this.frame += 0.2;
		this.angle += 0.05;
		this.time++;

		// this.mesh.rotation.y = this.angle;
		// this.meshClone.rotation.y = this.angle;

	}
	
}

export default Ribbon;