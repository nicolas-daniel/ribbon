import SoundManager from './managers/soundManager';
import Ribbon from './modules/ribbon';
import Particles from './modules/particles';
import Floor from './modules/floor';

WAGNER.vertexShadersPath = '/Wagner/vertex-shaders';
WAGNER.fragmentShadersPath = '/Wagner/fragment-shaders';

class App {
	
	constructor() {

		window.mouseX = 0;
		window.mouseY = 0;
		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.rotateX = 0;
		this.rotateY = 0;

		// binded
		this.resize = this.resize.bind(this);
		this.update = this.update.bind(this);
		this.mousemove = this.mousemove.bind(this);

		// params
		this.color = "#471E6A";
		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;
		this.cameraTarget = new THREE.Vector3(0,0,0);
		this.gui = window.gui = new dat.GUI();

		// init gui
		let guiColor = window.gui.addColor(this, 'color');
		guiColor.onChange((color) => {
			this.renderer.setClearColor( color, 1 );
        	this.scene.fog = new THREE.Fog( color, 0.1, 1000 );
        	this.floor.changeColor( color );
        	this.ribbon.changeColor( color );
		});

		this.init();
		
		window.addEventListener('resize', this.resize, true);
		window.addEventListener('mousemove', this.mousemove, true);
		window.addEventListener('touchmove', this.mousemove, true);
		document.addEventListener('keydown', this.onKeydown.bind(this));
        document.addEventListener('keyup', this.onKeyup.bind(this));

	}

	init() {

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( this.color, 0.1, 1000 );

		this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
		this.renderer.setClearColor(this.color, 1);
		this.renderer.autoClearColor = true;
		this.renderer.shadowMap.enabled = true;
		
		this.camera = new THREE.PerspectiveCamera(45, this.wWidth/this.wHeight, 1, 4000);
		this.camera.position.z = 500;

		this.renderer.setSize(this.wWidth, this.wHeight);

		this.container = document.getElementById('container');

		this.canvas = this.renderer.domElement;

		this.container.appendChild( this.canvas );

		this.composer = new WAGNER.Composer( this.renderer );
		this.composer.setSize( this.wWidth, this.wHeight );

		// this.addControls();

		// raycasting
		this.plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 4000, 2000 ), new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } ) );
		this.plane.material.visible = false;
		this.scene.add( this.plane );

		this.floor = new Floor( 0x6B2E9E );
		this.scene.add( this.floor );
		
		this.ribbon = new Ribbon();
		this.particles = new Particles({ renderer:this.renderer });

		this.scene.add( this.ribbon );
		this.scene.add( this.particles );

		this.soundManager = new SoundManager();

		this.update();
		
	}

	addControls() {

		this.controls = new THREE.TrackballControls( this.camera );
		this.controls.noZoom = false;
		this.controls.noPan = true;
		this.controls.noRoll = true;
		this.controls.noRotate = false;
		this.controls.dynamicDampingFactor = .15;
		this.controls.minDistance = 0;
		this.controls.maxDistance = 1500;

	}

	mousemove ( e ) {

		window.mouseX = e.clientX;
		window.mouseY = e.clientY;

		this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	}

	update() {

		// this.controls.update();
		
		this.animate();

		requestAnimationFrame( this.update );
		
	}

	animate() {

		this.raycaster.setFromCamera( this.mouse, this.camera );
		window.intersects = this.raycaster.intersectObject( this.plane );

		this.renderer.render( this.scene, this.camera );

		this.rotateX += (this.mouse.y * 0.05 - this.rotateX) * 0.1;
		this.rotateY += (this.mouse.x * 0.1 - this.rotateY) * 0.1;

		this.camera.lookAt(this.cameraTarget);
		this.camera.rotation.x = this.rotateX;
		this.camera.rotation.z = this.rotateY;

		this.ribbon.update();
		this.particles.update( this.mouse );
		this.soundManager.update();

	}

	onKeydown ( e ) {

        if (e.keyCode === 32) this.decelerate();

    }

    onKeyup ( e ) {

        if (e.keyCode === 32) this.accelerate();
        
    }

     accelerate() {

        this.particles.handleKeyup();
        this.ribbon.handleKeyup();
        this.soundManager.handleKeyup();

    }

    decelerate() {

        this.particles.handleKeydown();
        this.ribbon.handleKeydown();
        this.soundManager.handleKeydown();

    }

	resize () {

		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;

		this.camera.aspect = this.wWidth / this.wHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( this.wWidth, this.wHeight );

	}

}

window.app = new App();