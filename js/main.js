import * as Player from './player.js';
import * as Obstacles from './obstacles.js';
import * as Score from './score.js';
import * as Utils from './utils.js';
import * as TweenHelper from './tween.helper.js';
import {GUI} from './gui.js';
import * as GLTFLoader from './GLTFLoader.js';


// To learn more about how to import modules: https://www.youtube.com/watch?v=s9kNndJLOjg

//Global Variables
let camera, scene, renderer, score, scoreElement;
const obstacleCount = 15;
var obstacles = [];
var player = null;
var timer = 0;
var rowSpeed = 0.85; // row of obstacles spawn every X seconds
var currentIndex = 0;
var laneWidth = 5;
var lanes = [-laneWidth, 0, laneWidth]; //coord of lanes
var cylinder;
var model, skeleton, mixer, clock, mixerUpdateDelta;
var idleAction, runAction, jumpAction;
var actions, settings;
var modelReady = false;

var isPaused = true;
var Death = false

document.getElementById('startGame').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('startMenu').style.display = "none";
    isPaused = false;
});

     

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

    //Create Background Skybox
    var loader = new THREE.TextureLoader();
    var bgTexture = loader.load('textures/desert.jpg');
    scene.background = bgTexture;

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
        console.log('currrentPosition: ' + obstacles[i].currentPosition());
    }

    // Instantiate Score
    score = new Score.Score();
    scoreElement = document.getElementById('score');


    //Player Animations
    clock = new THREE.Clock();
    const gltfloader = new THREE.GLTFLoader();
    gltfloader.load( 'models/RemyAnimated02.glb', function ( gltf ) {

      model = gltf.scene;
      console.log('model position x: ' + model.position.x);
      console.log('model position y: ' + model.position.y);

      scene.add( model );
      model.animations = gltf.animations;
      model.traverse( function ( object ) {

        if ( object.isMesh ) object.castShadow = true;

        object.lookAt(0,-1000,-50);
        object.position.y = -1.3;//-0.45;


      } );

      skeleton = new THREE.SkeletonHelper( model );
      skeleton.visible = false;
      scene.add( skeleton );


      const animations = gltf.animations;

      mixer = new THREE.AnimationMixer( model );


      idleAction = mixer.clipAction( animations[ 0 ] );
      runAction = mixer.clipAction( animations[ 1 ] );
      jumpAction = mixer.clipAction( animations[ 3 ] );

      actions = [ idleAction, runAction, jumpAction ];

      runAction.play();


      modelReady = true;
      console.log('model ready: ' + modelReady);



    } );

    // Player and Controls
    //Player Init

    player = new Player.Player(lanes);
    //player.init();
    if(modelReady == true)
    {
      player.setPosition(0, -1, 10, model);
    }
    scene.add(player.mesh);


    //Pause all actions
    function pauseAllActions()
    {
      actions.forEach( function ( action )
    {
      action.paused = true;
    } );
  }

  function unPauseAllActions()
  {

    actions.forEach( function ( action )
    {
      action.paused = false;
    } );
  }

  //


    //add Event Listener for Keys
    var onKeyDown = function ( event ) {

        if(!isPaused) {
            switch ( event.keyCode ) {

                case 37: // left
                case 65: // a
                    if (TWEEN.getAll().length == 0){        //wait for current tween to complete to not allow double input
                        if (player.getLane() != 0) {        //do not move if already in left lane
                            player.setLane(player.getLane() - 1, model);
                        }
                    }
                    break;

            case 39: // right
            case 68: // d
                if (TWEEN.getAll().length == 0){
                    if (player.getLane() != 2) {        //do not move if already in right lane
                        player.setLane(player.getLane() + 1, model);
                    }
                }
                break;

            case 38: //up
            case 87: // w
                if (TWEEN.getAll().length == 0){

                    player.jump(2.6, model);
                    //if (modelReady == true)
                    //{
                      //jumpAction.play();
                      //jumpAction.weight = 1;
                      //jumpAction.time = 0;

                      // Crossfade with warping - you can also try without warping by setting the third parameter to false

                      //runAction.crossFadeTo( jumpAction, 1, false );
                      //executeCrossFade(runAction, jumpAction, 1);
                      //runAction.pause = true;
                      //runAction.fadeIn(5);
                      //executeCrossFade(jumpAction, runAction, 1);
                    //}

                }
                break;
            }
        }
    };

    function executeCrossFade( startAction, endAction, duration )
    {

      // Not only the start action, but also the end action must get a weight of 1 before fading
      // (concerning the start action this is already guaranteed in this place)

      endAction.weight = 1;
      startAction.weight = 1;
      endAction.time = 0;

      // Crossfade with warping - you can also try without warping by setting the third parameter to false

      startAction.crossFadeTo( endAction, duration, true );

    }

    document.addEventListener("keydown" , onKeyDown, false);

    // Lighting
	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add(light);

	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	scene.add(directionalLight);

	var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5 );
	camera.add(cameralight);
	scene.add(camera);

	// Position camera
	camera.position.z = 7; //original position 15
    camera.position.y = 3;
}

// Draw the scene every time the screen is refreshed
function animate(timestamp) {
    if(!isPaused) {
        scoreElement.innerHTML = score.getScore();


        let timeInSeconds = timestamp / 1000;
        if (timeInSeconds - timer >= rowSpeed) {
            timer = timeInSeconds;
            var spawner = Obstacles.setRow(currentIndex, obstacleCount, 3);
            for(var j = 0; j < spawner.length; j++) {
                //console.log(spawner[j][0] + ' --- index: ' + spawner[j][0][0] + ', lane: ' + spawner[j][0][1]);
                currentIndex = spawner[j][0][0] + 1;
                if(currentIndex > obstacleCount - 1) { currentIndex = 0; }
                obstacles[currentIndex].enterScene(spawner[j][0][1]);
            }
        }
        for(var i = 0; i < obstacleCount; i++) {
            var obs_result = obstacles[i].animate();
            if(obs_result) {
                score.updateScore(100);
            }
        }

        //make cylinder (ground) rotate
        cylinder.rotation.x += 0.00035;

        if(modelReady) { 
            CheckForCollisions(model);
        }

    }
    
	renderer.render(scene, camera);



    requestAnimationFrame(animate);

    //updates mixer to change animations
    if(modelReady == true)
    {
      mixerUpdateDelta = clock.getDelta();
      mixer.update( mixerUpdateDelta );
    }

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

//Create a function to determine the colission ** No longer needed**
/*function IsBetween(a1, a2, b){
    var temp;
if (a1 < a2){
    temp = a1;
    a1 = a2;
    a2 = temp;
}

if (a1 <= b && b <= a2){
    return true;
} else {
    return false;
}
}*/


// For player collisions, breakdown the boundaries the mesh has.
function CheckForCollisions(model){
    var PlayerX0 = model.position.x - (1.5);
    var PlayerX1 = model.position.x + (1.5);
    var PlayerY0 = model.position.y - (1.5);
    var PlayerY1 = model.position.y + (1.5);
    var PlayerZ0 = model.position.z - (1.5);
    var PlayerZ1 = model.position.z + (1.5);

    //Loop through every object the player can collide with

    for (let i = 0; i < obstacles.length; i++){
        

        var ObstacleX0 = obstacles[i].obstacle.position.x; //- (1.5)
        var ObstacleX1 = obstacles[i].obstacle.position.x; //+ (1.5)
        var ObstacleY0 = obstacles[i].obstacle.position.y;
        var ObstacleY1 = obstacles[i].obstacle.position.y;
        var ObstacleZ0 = obstacles[i].obstacle.position.z;
        var ObstacleZ1 = obstacles[i].obstacle.position.z;


                if ((PlayerX0 < ObstacleX1) && (PlayerX1 > ObstacleX0) &&
                (PlayerY0 < ObstacleY1) && (PlayerY1 > ObstacleY0) &&
                (PlayerZ0 < ObstacleZ1) && (PlayerZ1 > ObstacleZ0))
                {
                    console.log("WOOOOO");
                    isPaused = true;
                    
                    

                    //player.mesh.color = new THREE.color(1,1,1);
                }

            }
        } 



window.addEventListener('resize', onWindowResize, false);

document.getElementById('pause').addEventListener('click', function(el) {
    isPaused = true;
    document.getElementById('pause').style.display = "none";
    document.getElementById('play').style.display = "flex";
}, false);

document.getElementById('pause').addEventListener('onkeydown', function(el) {
    isPaused = true;
    document.getElementById('pause').style.display = "none";
    document.getElementById('play').style.display = "flex";
}, false);

document.getElementById('play').addEventListener('click', function(el) {
    isPaused = false;
    document.getElementById('play').style.display = "none";
    document.getElementById('pause').style.display = "flex";
}, false);

/*document.getElementById('death').addEventListener('click', function(){
    document.querySelector('.Death-screen').style.display = 'flex';
    Death = true;
    
}); */
   

init();
animate();
