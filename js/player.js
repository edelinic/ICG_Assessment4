

export class Player {
    constructor() {
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


}

