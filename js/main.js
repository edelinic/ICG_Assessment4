import * as Player from './player.js';
import * as Obstacles from './obstacles.js';
// To learn more about how to import modules: https://www.youtube.com/watch?v=s9kNndJLOjg 


console.log(Player.double(5));

let camera, scene, renderer;

function init() {
	// Init scene
	scene = new THREE.Scene();

	// Init camera (PerspectiveCamera)
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// Init renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });

	// Set size (whole window)
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Render to canvas element
	document.body.appendChild(renderer.domElement);

    // Create PlaneGeometry
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 32);
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.set(0,-4,0);
    scene.add(plane);
    
    // Create obstacles
    scene.add(Obstacles.init(0));

	// Position camera
	camera.position.z = 15;
    camera.position.y = 3;
}

// Draw the scene every time the screen is refreshed
function animate() {
	requestAnimationFrame(animate);

    Obstacles.animate();
	
	renderer.render(scene, camera);
}

function onWindowResize() {
	// Camera frustum aspect ratio
	camera.aspect = window.innerWidth / window.innerHeight;
	// After making changes to aspect
	camera.updateProjectionMatrix();
	// Reset size
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
