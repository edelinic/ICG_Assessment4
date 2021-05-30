import * as Main from './main.js';
import * as Utils from './utils.js';


var lanes = [-5, 0, 5];
var speed = 0.5; // speed of obstacles

export class Obstacle {
    constructor(index, lane, obstacle, onScreen) {
        this.index = index;
        this.lane = lane;
        this.obstacle = obstacle;
        this.onScreen = onScreen;
    }

     

    init() {
        
        // Init BoxGeometry object (rectangular cuboid)
        const obstacleGeometry = new THREE.BoxGeometry(3, 3, 3);
        // Create material with color
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        // Create mesh with geo and material
           var crate_texture = new THREE.TextureLoader().load('textures/crate1_diffuse.png');
           obstacleMaterial.map = crate_texture;
           obstacleMaterial.color = new THREE.Color(1,1,1);
           var normalMapObstacle = new THREE.TextureLoader().load('textures/crate1_normal.png');
           obstacleMaterial.normalMap = normalMapObstacle;
        this.obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        this.onScreen = true;
        this.remove();
        return this.obstacle;
        
    }

    animate() {
        
        if(this.isOnScreen()) {
            this.obstacle.position.z += speed;
            
            if(this.obstacle.position.z > 15) {
                this.remove();
                if (speed < 0.1){
                    speed = speed + 0.008;
                console.log("Speed has been increased! " + speed);
                
            }
                return true;
            }
            
        }
    }
    /** Not using anymore, buggy (was using with a setInterval) 
    SpeedIncrease(){
        //if(Main.GetScore > 500){

       
        speed = speed + 0.1;
        console.log("Speed increased"); 
        //}
     }*/
    

    setPosition(x, y, z) {
        this.obstacle.position.x = x;
        this.obstacle.position.y = y;
        this.obstacle.position.z = z;

        // check if the obstacles are in the lanes
        if(lanes.includes(x)) {
            this.onScreen = true;
        }
    }

    // the remove() method sends the item into our virtual rubbish bin
    remove() {
        if(this.onScreen) {
            this.setPosition(-100, -10, 0);
            this.onScreen = false;
        }
    }

    enterScene(lane = 0) {
        if(this.onScreen != true) {
            this.obstacle.position.x = lanes[lane];
            this.obstacle.position.y = -2;
            this.obstacle.position.z = -55;
            this.onScreen = true;
            console.log(this.index + ' has entered the scene in lane: ' + lane);
        }
    }

    isOnScreen() {
        if(this.onScreen != false) {
            return true;
        }
        return false;
    }

    currentPosition() {
        return this.obstacle.position.z;
    }

    currentLane() {
        return this.obstacle.x;
    }
}
    

export function setRow(currentIndex, maxObstacleIndex, maxPerRow) {
    var data = [];
    var lanesTaken = [];
    var amountOfObstacles = Utils.randomInt(0, maxPerRow);
    var newIndex = currentIndex;
    //console.log('amount of obstacles to create: ' + amountOfObstacles);
    while(lanesTaken.length < maxPerRow){
        var lane = Utils.randomInt(0, 2);
        if(lanesTaken.indexOf(lane) === -1) {
            lanesTaken.push(lane);
        }
    }

    //console.log("--------rows created: " + amountOfObstacles);
    for(var i = 0; i < amountOfObstacles; i++) {
        var entry = [];

        if(newIndex > maxObstacleIndex - 2) {
            newIndex = 0;
        } else {
            newIndex = newIndex + i;
        }

        lane = lanesTaken[i];

        entry.push(newIndex, lane);
        data.push([entry]);
        //console.log("currentIndex: " + newIndex + " lane: " + lane);
    }
    return data;
}
