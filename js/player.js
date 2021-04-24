import * as TweenHelper from './tween.helper.js';

export class Player {
    constructor(lanes) {
        this.lanes = lanes;
        this.lane = 0;
    }

    init() {
        // Init BoxGeometry object (rectangular cuboid)
        const obstacleGeometry = new THREE.BoxGeometry(3, 3, 3);
        // Create material with color
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        // Create mesh with geo and material
        this.mesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        return this.mesh;
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }

    setXPosition(x){
        this.mesh.position.x = x;
    }
    getXPosition() { return this.mesh.position.x;}
    getYPosition() { return this.mesh.position.y;}
    getZPosition() { return this.mesh.position.z;}

    setLane(targetLane) {
        var target = new THREE.Vector3(this.lanes[targetLane], this.mesh.position.y, this.mesh.position.z); // create on init
        TweenHelper.animateVector3(this.mesh.position, target, {
        duration: 250
    });

    //change lane 
    this.lane = targetLane; 

    }

    getLane() { return this.lane; }

}

