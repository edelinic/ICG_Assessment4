import * as TweenHelper from './tween.helper.js';
//import * as FBXLoader from './FBXLoader.js';

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

    jump(jumpHeight) {
        var from = new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z); //curent position
        var to = new THREE.Vector3(this.mesh.position.x, jumpHeight, this.mesh.position.z); //y value changed to jump height

        var duration = 300;                    //tween duration: 0.3s

        // create tween to jump up
        var tweenJump = new TWEEN.Tween(this.mesh.position)
            .to({ x: to.x, y: to.y, z: to.z, }, duration)
            .easing(TWEEN.Easing.Circular.Out);

        // create tween to fall back down
        var tweenFall = new TWEEN.Tween(this.mesh.position)
            .to({ x: from.x, y: from.y, z: from.z, }, duration)
            .easing(TWEEN.Easing.Circular.In);

        //chain tweens: AKA make tweenFall begin when tweenJump finishes
        tweenJump.chain(tweenFall);

        // start the tween
        tweenJump.start();
    }

    getLane() { return this.lane; }


  //   loadRunner(){
  //   const loader = new THREE.FBXLoader();
  //   loader.load( 'models/Running.fbx', function ( object )
  //   {
  //
  //     mixer = new THREE.AnimationMixer( object );
  //
  //     const action = mixer.clipAction( object.animations[ 0 ] );
  //     action.play();
  //
  //     object.traverse( function ( child )
  //     {
  //       if ( child.isMesh )
  //       {
  //
  //         child.castShadow = true;
  //         child.receiveShadow = true;
  //       }
  //     } );
  //     scene.add( object );
  //   } );
  // }

}
