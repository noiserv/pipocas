/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var objects = []; // Objects in the scene
var objects_named = {} // object that are named and need to be called

var clock = new THREE.Clock();

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    // object creation
    addObject( new Table(0, 19, 0),  "table");
    addObject( new Chair(0, 15, 21), "chair");
    addObject( new Lamp(30, 0, -25), "lamp");
}

function createLight() {
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 0, 0 );
  scene.add(spotLight);
}

/**
 * Adds an object to the list of tracket objects in the scene
 * @param {EntidadeGrafica} object - The Object add with "new ObjectName(params)"
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
  onResize() // update to the scale once
}

function createCameraFront() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.position.x = 0;
    camera.position.y = 0;
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

  var w = window.innerWidth;
  var h = window.innerHeight;
  var viewSize =  60 * (1 / h + 1 / w);
  camera.left = w / - 2 * viewSize;
  camera.right = w / 2 * viewSize;
  camera.top = h / 2 * viewSize;
  camera.bottom = h / - 2 * viewSize;
  camera.updateProjectionMatrix();
  renderer.setSize( w, h );
}

function onKeyDown(e) {
    'use strict';

    // getting the objects
    var chair = getObject("chair");

    console.log(e.keyCode)
    switch (e.keyCode) {
    case 66: //B
        break;
    case 37: // left
        chair.rotate(5) // in degrees
        break;
    case 38: // up
        chair.change_velocity(+1)
        break;
    case 39: // right
        chair.rotate(-5) // in degrees
        break;
    case 40: // down
        chair.change_velocity(-1)
        break;
    case 49: // 1
        createCameraTop();
        break;
    case 50: // 2
        createCameraSide();
        break;
    case 51: // 3
        createCameraFront();
        break;
    case 52: // 4
        switchCamera();
        break;
    case 65: //A
        // assuming all submeshes inherit material from parent object
        for (var object in objects)
          objects[object].material.wireframe = !objects[object].material.wireframe;
        break
    case 83:  //S
        scene.traverse(function (node) {
          if (node instanceof THREE.AxisHelper)
            node.visible = !node.visible;
        });
        break;
    case 115: //s
        break;
    case 69:  //E
    case 101: //e
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
    createLight();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    // Update
    objects.map( function(object) {
      if (typeof object.update === 'function') object.update();
    });

    // Display
    render();

    requestAnimationFrame(animate);
}
