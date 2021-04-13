import * as Main from './main.js';

let obstacle;
let obstacles;

export function init(lane = 0) {
    switch(lane) {
        case -1:
            lane = -5;
            break;
        case 0:
            lane = 0;
            break;
        case 1:
            lane = 5;
            break;
        default:
            lane = 0;
    }
    // Init BoxGeometry object (rectangular cuboid)
	const obstacleGeometry = new THREE.BoxGeometry(3, 3, 3);
	// Create material with color
	const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
	// Create mesh with geo and material
	obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.x = lane;
    obstacle.position.y = -1;
    obstacle.position.z = -50;
    //obstacle.position.set(0,-1,-50);
    return obstacle;
}

export function animate() {
    //animate obstacle
    obstacle.position.z += 0.5;
    if(obstacle.position.z > 15) {
        // maybe change this to a bin which we can re-use? this is what Nico was saying
        obstacle.position.z = -50;
    }
}