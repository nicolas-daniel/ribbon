class Sphere extends THREE.Object3D {

	constructor() {

		super();

		this.speed = 2;

		this.particles = [];
		this.nParticles = 200;
		this.radius = 0.8;
		this.startZ = -500;

		let particleMat = new THREE.MeshBasicMaterial({color:0xffffff});
		let particleGeo = new THREE.CircleGeometry( this.radius, 16 ); 
		let particle;

		for (let i=0; i<this.nParticles; ++i) {
			particle = new THREE.Mesh( particleGeo, particleMat );
			particle.position.x = Math.random() * 600 - 300;
			particle.position.y = Math.random() * 400 - 200;
			particle.position.z = Math.random() * 1000;
			this.add( particle );
			this.particles.push( particle );
		}

	}

	handleKeydown() {

		this.speed = 10;

	}

	handleKeyup() {

		this.speed = 2;

	}

	update() {

		let z;
		for (let i=0; i<this.particles.length; ++i) {
			z = this.particles[i].position.z + this.speed;
			this.particles[i].position.z = (z > - this.startZ) ? z + 2 * this.startZ : z;
		}

	}

	
}

export default Sphere;