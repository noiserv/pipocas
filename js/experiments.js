/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;

var geometry, material, mesh;

var ball;
var chair;

var clock = new THREE.Clock();

/***************************************
       T A B L E   R E L A T E D
***************************************/

function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 6, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };
    ball.velocity = new THREE.Vector3( 0, 0, 0 );
    ball.acceleration = new THREE.Vector3( 0, 0, 0 );

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.add(mesh);
    ball.position.set(x, y, z);

    /*ball.update = function() {
      var delta = clock.getDelta()

      ball.velocity.x += ball.acceleration.x*delta
      ball.position.x += ball.velocity.x*delta

      ball.velocity.y += ball.acceleration.y*delta
      ball.position.y += ball.velocity.y*delta

      ball.velocity.z += ball.acceleration.z*delta
      ball.position.z += ball.velocity.z*delta
    }*/

    scene.add(ball);
}


function createTable(x, y, z) {
    'use strict';

    var table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function addChairBack(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(15, 15, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y+4, z-6.5);
    obj.add(mesh);

    return mesh;
}

function addChairBase(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(15, 1.5, 15);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);

    return mesh;
}

function addChairWheelsBase(obj, x, y, z) {
    'use strict';
    geometry = new  THREE.TorusGeometry(4, 1, 8, 20, Math.PI * 2),
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y - 12, z);
    obj.add(mesh);
}

function addChairWheel(obj, x, y, z, radious, rotation) {
    'use strict';
    geometry = new  THREE.TorusGeometry(0.5, 1, 3, 10, Math.PI * 2),
    mesh = new THREE.Mesh(geometry, material);
    console.log(Math.cos(rotation)*radious)
    console.log(Math.sin(rotation)*radious)
    x += Math.cos(rotation)*radious
    z += Math.sin(rotation)*radious;
    mesh.position.set(x, y - 14, z);
    obj.add(mesh);

    return mesh;
}

function addChairSpindles(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(1, 9, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 7, z);
    obj.add(mesh);
}

function createChair(x, y, z) {
    'use strict';

    chair = new THREE.Object3D();
    chair.wheels = []

    chair.velocity = new THREE.Vector3( 0, 0, 0 );
    chair.acceleration = new THREE.Vector3( 0, 0, 0 );

    material = new THREE.MeshBasicMaterial({ color: 0xdedede, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    chair.base = addChairBase(chair, x, y, z)
    chair.back = addChairBack(chair, x, y, z)
    addChairSpindles(chair, x, y, z)
    addChairWheelsBase(chair, x, y, z)
    var numWheels = 4;
    for (var i = 0; i<2*Math.PI; i+=2*Math.PI/numWheels){
      chair.wheels.push(addChairWheel(chair, x, y, z, 4, i));
    }

    chair.updateWheels = function() {
      for (var wheel in chair.wheels){
        var rotation = 0;
        length = chair.velocity.length();

        if (length == 0) break;

        x = chair.velocity.x / length;
        z = chair.velocity.z / length;

        if (z > 0) rotation = -Math.acos(x);
        else rotation = Math.acos(x);

        chair.wheels[wheel].rotation.y = rotation;
      }
    }


    chair.updateBack = function() {

      var rotation = Math.PI/2;
      length = chair.velocity.length();

      if (length == 0) return;

      x = chair.velocity.x / length;
      z = chair.velocity.z / length;

      if (z > 0) rotation -= Math.acos(x);
      else rotation += Math.acos(x);
      rotateObjectAround(chair.back, chair.base.position, 7.5, rotation);

      /*chair.back.position.x = chair.base.position.x - Math.sin(rotation)*7.5;
      chair.back.position.z = chair.base.position.z - Math.cos(rotation)*7.5;

      chair.back.rotation.y = rotation;*/
    }

    chair.updateBase = function() {

      var rotation = Math.PI/2;
      length = chair.velocity.length();

      if (length == 0) return;

      x = chair.velocity.x / length;
      z = chair.velocity.z / length;

      if (z > 0) rotation -= Math.acos(x);
      else rotation += Math.acos(x);
      rotateObjectAround(chair.base, chair.base.position, 0, rotation);

    }

    chair.update = function() {
      var delta = clock.getDelta();

      chair.updateWheels()
      chair.updateBack()
      chair.updateBase()

      chair.velocity.x += chair.acceleration.x*delta
      chair.position.x += chair.velocity.x*delta

      chair.velocity.y += chair.acceleration.y*delta
      chair.position.y += chair.velocity.y*delta

      chair.velocity.z += chair.acceleration.z*delta
      chair.position.z += chair.velocity.z*delta

    }

    scene.add(chair);

    chair.position.set(x, y, z)
  }

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createTable(0, 8, 0);
    createBall(0, 0, 15);
    createChair(0, 8, 15);
}

function createLamp() {
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 0, 0 );
  scene.add(spotLight);
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

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';
    console.log(e.keyCode)
    switch (e.keyCode) {
    case 66: //B
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 37: // left
        //ball.velocity.x -= 1
        chair.velocity.x -= 1
        break;
    case 38: // up
        //ball.velocity.z -= 1
        chair.velocity.z -= 1
        break;
    case 39: // right
        //ball.velocity.x += 1
        chair.velocity.x += 1
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
    createLamp();

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
          //node.update()
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
