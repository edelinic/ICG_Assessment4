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
        this.obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        this.remove();
        return this.obstacle;
    }

    animate() {
        this.obstacle.position.z += speed;
        if(this.obstacle.position.z > 15) {
            this.remove();
            //console.log(this.index + ' has been binned...');
        }
    }

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
        this.obstacle.position.set(-100, -10, 0);
        this.onScreen = false;
    }

    enterScene(lane = 0) {
        if(this.onScreen != true) {
            this.obstacle.position.x = lanes[lane];
            this.obstacle.position.y = -1;
            this.obstacle.position.z = -55; 
            this.onScreen = true;
            //console.log(this.index + ' has entered the scene in lane: ' + lane);
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
    console.log('amount of obstacles to create: ' + amountOfObstacles);
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
