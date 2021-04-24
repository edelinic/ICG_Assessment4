var speed = 500;

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
    getXPosition(x){ return this.mesh.position.x;}

    setLane(lane) {
        this.lane = lane; 
        console.log("player current lane: " + this.getLane());
        //this.setXPosition(this.lanes[lane]);
    }
    getLane() { return this.lane; }

}

