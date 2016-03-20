const Color = require('color');

class Ribbon extends THREE.Object3D {

	constructor ( opt ) {

		super();

		// params
		this.time = 0;
		this.frame = 0;
		this.angle = 0;

		this.speed = 1.1;
		this.smoothCoef = 0.05;
		this.rotateSpeed = 1;

		this.lineLength = 40;
		this.globalX = 0;
		this.globalY = 0;
		this.globalZ = 0;
		this.smoothX = 0;
		this.smoothY = 0;
		this.smoothZ = 0;

		// geometry
		this.geometry = new Float32Array( this.lineLength * 3 );
		this.geometryClone = new Float32Array( this.lineLength * 3 );
		this.geometryShadow = new Float32Array( this.lineLength * 3 );
		this.geometryCloneShadow = new Float32Array( this.lineLength * 3 );

		for( var j = 0; j < this.geometry.length; j += 3 ) {
			this.geometry[ j ] = this.geometry[ j + 1 ] = this.geometry[ j + 2 ] = 0;
			this.geometryClone[ j ] = this.geometryClone[ j + 1 ] = this.geometryClone[ j + 2 ] = 0;
			
			this.geometryShadow[ j ] = this.geometryShadow[ j + 2 ] = 0;
			this.geometryShadow[ j + 1 ] = -100;

			this.geometryCloneShadow[ j ] = this.geometryCloneShadow[ j + 2 ] = 0;
			this.geometryCloneShadow[ j + 1 ] = -100;
		}

		// line
		this.line = new THREE.MeshLine();
		this.line.setGeometry( this.geometry );

		this.lineClone = new THREE.MeshLine();
		this.lineClone.setGeometry( this.geometryClone );

		this.lineShadow = new THREE.MeshLine();
		this.lineShadow.setGeometry( this.geometryShadow );

		this.lineCloneShadow = new THREE.MeshLine();
		this.lineCloneShadow.setGeometry( this.geometryCloneShadow );

		// material
		this.material = new THREE.MeshLineMaterial({ color:new THREE.Color(0xffffff), lineWidth:4 });
		this.materialClone = new THREE.MeshLineMaterial({ color:new THREE.Color(0xF1BBF5), lineWidth:2 });
		this.materialShadow = new THREE.MeshLineMaterial({ color:new THREE.Color(0x000000), lineWidth:4, transparent:true, opacity:0.2 });
		this.materialCloneShadow = new THREE.MeshLineMaterial({ color:new THREE.Color(0x000000), lineWidth:2, transparent:true, opacity:0.2 });


		// mesh
		this.mesh = new THREE.Mesh( this.line.geometry, this.material );
		this.meshClone = new THREE.Mesh( this.lineClone.geometry, this.materialClone );
		this.meshShadow = new THREE.Mesh( this.lineShadow.geometry, this.materialShadow );
		this.meshCloneShadow = new THREE.Mesh( this.lineCloneShadow.geometry, this.materialCloneShadow );

		this.add( this.mesh );
		this.add( this.meshClone );
		this.add( this.meshShadow );
		this.add( this.meshCloneShadow );
		
	}

	handleKeydown() {

		this.speed = 1.03;
		this.smoothCoef = 0.02;
		this.rotateSpeed = 0.3;

	}

	handleKeyup() {

		this.speed = 1.1;
		this.smoothCoef = 0.05;
		this.rotateSpeed = 1;

	}

	changeColor ( color ) {

		this.color = Color( color );
		this.color.lighten( 1.0 );
		this.color.mix(Color("white"), 0.5)
		this.materialClone.uniforms.color.value = new THREE.Color( this.color.hexString() );

	}

	update() {

		if (window.intersects.length > 0) {
			
			for( var j = 0; j < this.geometry.length; j+= 3 ) {
				this.geometry[ j ] = this.geometry[ j + 3 ] * this.speed;
				this.geometry[ j + 1 ] = this.geometry[ j + 4 ] * this.speed;
				this.geometry[ j + 2 ] = this.geometry[ j + 5 ] * this.speed;

				this.geometryClone[ j ] = this.geometryClone[ j + 3 ] * this.speed;
				this.geometryClone[ j + 1 ] = this.geometryClone[ j + 4 ] * this.speed;
				this.geometryClone[ j + 2 ] = this.geometryClone[ j + 5 ] * this.speed;

				this.geometryShadow[ j ] = this.geometryShadow[ j + 3 ] * this.speed;
				this.geometryShadow[ j + 1 ] = this.geometryShadow[ j + 4 ] * this.speed;
				this.geometryShadow[ j + 2 ] = this.geometryShadow[ j + 5 ] * this.speed;

				this.geometryCloneShadow[ j ] = this.geometryCloneShadow[ j + 3 ] * this.speed;
				this.geometryCloneShadow[ j + 1 ] = this.geometryCloneShadow[ j + 4 ] * this.speed;
				this.geometryCloneShadow[ j + 2 ] = this.geometryCloneShadow[ j + 5 ] * this.speed;
			}
			
			this.globalX = window.intersects[ 0 ].point.x;
			this.globalY = window.intersects[ 0 ].point.y;
			this.globalZ = 0;
			
			this.smoothX += (this.globalX - this.smoothX) * this.smoothCoef;
			this.smoothY += (this.globalY - this.smoothY) * this.smoothCoef;
			this.smoothZ += (this.globalZ - this.smoothZ) * this.smoothCoef;

			this.geometry[ this.geometry.length - 3 ] = this.smoothX;
			this.geometry[ this.geometry.length - 2 ] = this.smoothY;
			this.geometry[ this.geometry.length - 1 ] = this.smoothZ;

			this.geometryClone[ this.geometryClone.length - 3 ] = this.smoothX + Math.sin(this.frame * this.rotateSpeed) * 10;
			this.geometryClone[ this.geometryClone.length - 2 ] = this.smoothY + Math.cos(this.frame * this.rotateSpeed) * 10;
			this.geometryClone[ this.geometryClone.length - 1 ] = this.smoothZ + Math.sin(this.frame * this.rotateSpeed) * 10;

			this.geometryShadow[ this.geometryShadow.length - 3 ] = this.smoothX;
			this.geometryShadow[ this.geometryShadow.length - 2 ] = -100;
			this.geometryShadow[ this.geometryShadow.length - 1 ] = 0;

			this.geometryCloneShadow[ this.geometryCloneShadow.length - 3 ] = this.smoothX + Math.sin(this.frame * this.rotateSpeed) * 10;
			this.geometryCloneShadow[ this.geometryCloneShadow.length - 2 ] = -100;
			this.geometryCloneShadow[ this.geometryCloneShadow.length - 1 ] = 0;
			
			this.line.setGeometry( this.geometry, ( p ) => { 
				return Math.sin(p * Math.PI); 
			});

			this.lineClone.setGeometry( this.geometryClone, ( p ) => { 
				return Math.sin(p * Math.PI); 
			});

			this.lineShadow.setGeometry( this.geometryShadow, ( p ) => { 
				return Math.sin(p * Math.PI); 
			});

			this.lineCloneShadow.setGeometry( this.geometryCloneShadow, ( p ) => { 
				return Math.sin(p * Math.PI); 
			});
		}

		this.frame += 0.2;
		this.angle += 0.05;
		this.time++;

	}
	
}

export default Ribbon;