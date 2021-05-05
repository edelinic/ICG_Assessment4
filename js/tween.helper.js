/* Animates a Vector3 to the target using the Tween.umd.js library */
// ED: I used this function in player.js to tween player between lanes
// source : https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples-c598a19b1263

export function animateVector3(vectorToAnimate, target, options){
    options = options || {};
    // get targets from options or set to defaults
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Linear.None,
        duration = options.duration || 2000;
    // create the tween
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){ 
                options.update(d);
            }
            })
        .onComplete(function(){
            if(options.callback) options.callback();
        });

    // start the tween
    tweenVector3.start();
    // return the tween in case we want to manipulate it later on
    return tweenVector3;
    }

    