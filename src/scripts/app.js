import SoundManager from './managers/soundManager';
import Ribbon from './modules/ribbon';

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
		this.backgroundColor = 0x471E6A;
		this.wWidth = window.innerWidth;
		this.wHeight = window.innerHeight;
		this.useNoise = false;
		this.useVignette = false;
		this.useBloom = false;
		this.autoRotate = false;
		this.cameraTarget = new THREE.Vector3(0,0,0);
		this.gui = window.gui = new dat.GUI();

		// wagner passes
		this.noisePass = new WAGNER.NoisePass();
		this.bloomPass = new WAGNER.MultiPassBloomPass();
		this.vignettePass = new WAGNER.VignettePass();

		// noise pass
		this.noisePass.params.amount = 0.05;
		this.noisePass.params.speed = 0.05;

		// vignette pass
		this.vignettePass.params.amount = 1;

		// bloom pass
		this.bloomPass.params.strength = .5;
        this.bloomPass.params.blurAmount = .1;
        this.bloomPass.params.applyZoomBlur = !0;
        this.bloomPass.params.zoomBlurStrength = .3;
		
		// init gui
		this.wagnerGui = this.gui.addFolder('Wagner');
		this.wagnerGui.add(this, 'useNoise');
		this.wagnerGui.add(this, 'useVignette');
		this.wagnerGui.add(this, 'useBloom');

		this.init();
		
		window.addEventListener('resize', this.resize, true);
		window.addEventListener('mousemove', this.mousemove, true);

	}

	init() {

		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.Fog( this.backgroundColor, 0.1, 1000 );

		this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
		this.renderer.setClearColor(this.backgroundColor, 1);
		this.renderer.autoClearColor = true;
		
		this.camera = new THREE.PerspectiveCamera(45, this.wWidth/this.wHeight, 1, 2000);
		this.camera.position.z = 500;

		this.renderer.setSize(this.wWidth, this.wHeight);

		this.container = document.getElementById('container');

		this.canvas = this.renderer.domElement;

		this.container.appendChild( this.canvas );

		this.composer = new WAGNER.Composer( this.renderer );
		this.composer.setSize( this.wWidth, this.wHeight );

		this.addLights();

		// this.addControls();

		this.plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 4000, 2000 ), new THREE.MeshNormalMaterial( { side: THREE.DoubleSide } ) );
		this.plane.material.visible = false;
		this.scene.add( this.plane );


		this.floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 4000, 1000 ), new THREE.MeshBasicMaterial( { color:0x6B2E9E } ) );
		this.floor.position.y = -550;
		this.floor.position.z = -100;
		// this.floor.rotation.x = -Math.PI/2;
		this.scene.add( this.floor );
		
		this.ribbon = new Ribbon();

		this.scene.add( this.ribbon );

		// this.soundManager = new SoundManager();

		this.update();
		
	}

	addLights() {

		let light = new THREE.DirectionalLight(0xffffff, 0.5);
		light.position.set(300,300,300);
		this.scene.add(light);
		
		let pointlight = new THREE.PointLight(0xffffff, 2, 2000);
		this.scene.add(pointlight);

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

		// this.mouse = {
		// 	x : e.clientX,
		// 	y : e.clientY
		// };

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

		// this.camera.lookAt(this.cameraTarget);

		// this.composer.reset();
		// this.composer.render( this.scene, this.camera );
		// // if (this.useNoise) this.composer.pass( this.noisePass );
		// // if (this.useVignette) this.composer.pass( this.vignettePass );
		// // if (this.useBloom) this.composer.pass( this.bloomPass );

		// console.log(intersects);
		
		// this.composer.toScreen();

		this.renderer.render( this.scene, this.camera );
		

		// if (this.autoRotate) {
		// 	this.scene.rotation.x += 0.002;
		// 	this.scene.rotation.y += 0.002;
		// 	this.scene.rotation.z += 0.002;
		// }

		this.rotateX += (this.mouse.y * 0.05 - this.rotateX) * 0.1;
		this.rotateY += (this.mouse.x * 0.1 - this.rotateY) * 0.1;

		// this.scene.rotation.x = this.rotateX;
		// this.scene.rotation.y = this.rotateY;
		// this.scene.rotation.z = this.rotateY;

		this.camera.lookAt(this.cameraTarget);
		this.camera.rotation.x = this.rotateX;
		this.camera.rotation.z = this.rotateY;

		this.ribbon.update();
		// this.soundManager.update();

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