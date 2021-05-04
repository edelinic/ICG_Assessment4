import * as Player from './player.js';
import * as Obstacles from './obstacles.js';
import * as Utils from './utils.js';
import * as TweenHelper from './tween.helper.js';

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
var cylinder;

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

    // Create Floor (Rotation Cylinder)

    var material_floor = new THREE.MeshLambertMaterial();           //material 
    material_floor.color= new THREE.Color(0.8,0.8,1.0);
    var dirt_texture = new THREE.TextureLoader().load('resources/dirt.jpg')

    dirt_texture.wrapS = THREE.RepeatWrapping;                      //texture
    dirt_texture.wrapT = THREE.RepeatWrapping;
    const timesToRepeatHorizontally = 100;
    const timesToRepeatVertically = 15;
    dirt_texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
    material_floor.map = dirt_texture;

    var cylinder_radius = 1700;                                       //create cylinder
    var ground_offset = -4 //where the ground is for the cubes
    const planeGeometry = new THREE.CylinderGeometry(cylinder_radius, cylinder_radius, 1000, 100);
    cylinder = new THREE.Mesh(planeGeometry, material_floor);
    cylinder.rotation.x = Math.PI / 2;
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.set(0, ground_offset - cylinder_radius,0);
    scene.add(cylinder);
    
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
            
                break;
            }

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

    //make cylinder (ground) rotate
    cylinder.rotation.x += 0.0005;
	
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
