class Sphere extends THREE.Object3D {

	constructor() {

		super();

		this.speed = 10;

		this.particles = [];
		this.nParticles = 200;
		this.radius = 0.8;
		this.startZ = -500;

		// geometry
		this.geometry = new THREE.CircleGeometry( this.radius, 16 ); 
		
		// material
		this.material = new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true });
		this.material.opacity = 0.8;

		let particle;
		for (let i=0; i<this.nParticles; ++i) {
			particle = new THREE.Mesh( this.geometry, this.material );
			particle.position.x = Math.random() * 600 - 300;
			particle.position.y = Math.random() * 400 - 200;
			particle.position.z = Math.random() * 1000;
			this.add( particle );
			this.particles.push( particle );
		}

	}

	handleKeydown() {

		this.speed = 2;

	}

	handleKeyup() {

		this.speed = 10;

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