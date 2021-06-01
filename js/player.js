import * as TweenHelper from './tween.helper.js';

export class Player {
    constructor(lanes) {
        this.lanes = lanes;
        this.lane = 1;
    }

    setPosition(x, y, z, model) {
      model.position.x = x;
      model.position.y = y;
      model.position.z = z;
  }

  setXPosition(x){
      model.position.x = x;
  }
  getXPosition() { return model.position.x;}
  getYPosition() { return model.position.y;}
  getZPosition() { return model.position.z;}

  setLane(targetLane, model) {
      var target = new THREE.Vector3(this.lanes[targetLane], model.position.y, model.position.z); // create on init
      TweenHelper.animateVector3(model.position, target, {
          duration: 250
      });
      //change lane
      this.lane = targetLane;
    }

    jump(jumpHeight, model) {
      var from = new THREE.Vector3(model.position.x, model.position.y, model.position.z); //curent position
      var to = new THREE.Vector3(model.position.x, jumpHeight, model.position.z); //y value changed to jump height

      var duration = 300;                    //tween duration: 0.3s

      // create tween to jump up
      var tweenJump = new TWEEN.Tween(model.position)
          .to({ x: to.x, y: to.y, z: to.z, }, duration)
          .easing(TWEEN.Easing.Circular.Out);

      // create tween to fall back down
      var tweenFall = new TWEEN.Tween(model.position)
          .to({ x: from.x, y: from.y, z: from.z, }, duration)
          .easing(TWEEN.Easing.Circular.In);
        //chain tweens: AKA make tweenFall begin when tweenJump finishes
        tweenJump.chain(tweenFall);

        // start the tween
        tweenJump.start();
    }

    getLane() { return this.lane; }


}
