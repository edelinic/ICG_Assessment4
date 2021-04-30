import * as Player from './player.js';
import * as Obstacles from './obstacles.js';
import * as Utils from './utils.js';
// To learn more about how to import modules: https://www.youtube.com/watch?v=s9kNndJLOjg

//Global Variables
let camera, scene, renderer;
const obstacleCount = 15;
var obstacles = [];
var player = null;
var timer = 0;
var speed = 0.5; // in seconds
var currentIndex = 0;
var laneWidth = 5;
var lanes = [-laneWidth, 0, laneWidth]; //coord of lanes

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

		//background loader
		var loader = new THREE.TextureLoader();
		var bgTexture = loader.load('textures/desert.jpg');
		scene.background = bgTexture;


    // Create PlaneGeometry
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 32);
    const planeMaterial = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide} );

		 planeMaterial.color = new THREE.Color(1,1,1);
		 var sand_texture = new THREE.TextureLoader().load('textures/Sand_03_1K_Diffuse.png');
		 planeMaterial.map = sand_texture;
		 var normalMapPlane = new THREE.TextureLoader().load('textures/Sand_03_1K_Normal.png');
		 planeMaterial.normalMap = normalMapPlane;
		 normalMapPlane.wrapS = normalMapPlane.wrapT = THREE.RepeatWrapping;
		 normalMapPlane.repeat = new THREE.Vector2(4,4);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.set(0,-4,0);
    scene.add(plane);

    // Create obstacles
    //scene.add(Obstacles.init(0));
    for(var i = 0; i < obstacleCount; i++) {
        obstacles[i] = new Obstacles.Obstacle(i);
        scene.add(obstacles[i].init());
    }

    // obstacles[0].setPosition(-5, -1, -55);
    // obstacles[1].setPosition(5, -1, -45);
    // obstacles[2].setPosition(0, -1, -35);
    //obstacles[1].remove();
    //obstacles[0].enterScene(0);

    // var spawner = Obstacles.setRow(currentIndex, obstacleCount, 3);
    // for(var j = 0; j < spawner.length; j++) {
    //     currentIndex = spawner[j][0][0];
    //     obstacles[currentIndex].enterScene(spawner[j][0][1]);
    // }


    // Player and Controls
    //Player Init
	player = new Player.Player(lanes);
	player.init();
    player.setPosition(0, -1, 10);
    scene.add(player.mesh);

		//player.loadRunner(); 

    //add Event Listener for Keys
    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 37: // left
            case 65: // a
                if (TWEEN.getAll().length == 0){        //wait for current tween to complete to not allow double input
                    if (player.getLane() != 0) {        //do not move if already in left lane
                        player.setLane(player.getLane() - 1);
                    }
                }
            break;

            case 39: // right
            case 68: // d
            if (TWEEN.getAll().length == 0){
                if (player.getLane() != 2) {        //do not move if already in right lane
                    player.setLane(player.getLane() + 1);
                }
            }
                break;

            case 33: //up
            case 87: // w
            if (TWEEN.getAll().length == 0){
                player.jump(5);
            }


        }

    };

    document.addEventListener( "keydown" , onKeyDown, false );

    // Lighting
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(light);

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	scene.add(directionalLight);

	var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5 );
	camera.add(cameralight);
	scene.add(camera);

	// Position camera
	camera.position.z = 15;
    camera.position.y = 3;
}

speed = 0.75;

// Draw the scene every time the screen is refreshed
function animate(timestamp) {
    let timeInSeconds = timestamp / 1000;
    if (timeInSeconds - timer >= speed) {
        timer = timeInSeconds;
        var spawner = Obstacles.setRow(currentIndex, obstacleCount, 3);
        //console.log(spawner);
        for(var j = 0; j < spawner.length; j++) {
            console.log(spawner[j][0] + ' --- index: ' + spawner[j][0][0] + ', lane: ' + spawner[j][0][1]);
            currentIndex = spawner[j][0][0] + 1;
            if(currentIndex > 14) { currentIndex = 0; }
            // console.log(currentIndex);
            obstacles[currentIndex].enterScene(spawner[j][0][1]);
        }

    }
    for(var i = 0; i < obstacleCount; i++) {
        obstacles[i].animate();
        if(obstacles[i].currentPosition() > 15) {
            obstacles[i].remove();
        }
    }

	renderer.render(scene, camera);
    requestAnimationFrame(animate);
    TWEEN.update();
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
