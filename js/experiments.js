/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

var objects = []; // Objects in the scene
var objects_named = {} // object that are named and need to be called

var ball;
var chair;

var clock = new THREE.Clock();

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    // object creation
    addObject( new Table(0, 8, 0),  "table");
    addObject( new Ball(0, 0, 15),  "ball" );
    addObject( new Chair(0, 8, 15), "chair");
}

/**
 * Adds an object to the list of tracket objects in the scene
 * @param {SceneObject} object - The Object add with "new ObjectName(params)"
 * @param {string} name - (Optional) Name for referencing the object
 */
function addObject(object, name){
  if (typeof name !== "undefined"){ //if it is a named object
    if (objects_named[name] === "undefined") {
      console.log("give the object another name")
    } else {
      objects_named[name]=object;
    }
  }
  objects.push(object); // add object to the generic array of scene objects
}

/**
 * Gets an object of a specified name
 * @param {string} name - Name the object we want
 * @return {SceneObject} object - The Object being retrieved
 */
function getObject(name){
  if (objects_named[name] !== "undefined") {
    return objects_named[name]
  } else {
    console.log("error: object is not in the list")
  }
}

function createCamera() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    camera.lookAt(scene.position);
}

function createCameraTop() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function createCameraSide() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 1;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function switchCamera() {
  if (camera instanceof THREE.PerspectiveCamera) {
    createCamera()
  } else {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
  }
}

function onResize() {
    'use strict';

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    /*
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }*/
}

function onKeyDown(e) {
    'use strict';

    // getting the objects
    chair = getObject("chair");
    //console.log(chair)

    console.log(e.keyCode)
    switch (e.keyCode) {
    case 66: //B
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
                console.log(node)
            }
        });
        break;
    case 37: // left
        chair.change_velocity(-1)
        //chair.velocity.x -= 1
        break;
    case 38: // up
        //ball.velocity.z -= 1
        chair.velocity.z -= 1
        break;
    case 39: // right
        //ball.velocity.x += 1
        //chair.velocity.x += 1
        chair.change_velocity(+1)
        break;
    case 40: // down
        //ball.velocity.z += 1
        chair.velocity.z += 1
        break;
    case 49: // 1
        createCameraTop();
        break;
    case 50: // 2
        createCameraSide();
        break;
    case 65: //A
        switchCamera();
        break
    case 83:  //S
    case 115: //s
        ball.userData.jumping = !ball.userData.jumping;
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
              node.visible = !node.visible;
            }
        });
        break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    // Update
    /*if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }*/

    scene.traverse(function (node) {
        if (node instanceof THREE.Object3D) {
          if (typeof node.update === 'function') node.update();
        }
      });



    // Display

    render();

    requestAnimationFrame(animate);
}

/******************************
      OBJ TRANFORMATIONS
******************************/

function rotateObjectAround(obj,center, radious, rotation) {
  obj.position.x = center.x - Math.sin(rotation)*radious;
  obj.position.z = center.z - Math.cos(rotation)*radious;
  obj.rotation.y = rotation;
}
