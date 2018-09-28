/**
 * In this file, we define the objects
 */

/**
 * Generic Object
 */
class SceneObject {
  constructor() {
    // Physics Variables
    this.velocity = 0
    this.acceleration = 0
  }

  // update function is called to update the object
  update() {
    console.log("update not implemented yet for " + this)
  }
}


/**
 * Table Object & related functions
 */
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


class Table extends SceneObject {
  constructor(x, y, z) {
    super()
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
}

/**
 * Ball Object & related functions
 */
class Ball extends SceneObject {
  constructor(x, y, z){
    super()
    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };
    ball.velocity = new THREE.Vector3( 0, 0, 0 );
    ball.acceleration = new THREE.Vector3( 0, 0, 0 );

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.add(mesh);
    ball.position.set(x, y, z);

    scene.add(ball);
  }
}

/**
 * Chair Object & related functions
 */
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

class Chair {
    constructor(x, y, z){
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
      
      scene.add(chair);
      chair.position.set(x, y, z)
    }
    updateWheels() {
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


    updateBack() {
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

    updateBase() {
      var rotation = Math.PI/2;
      length = chair.velocity.length();

      if (length == 0) return;

      x = chair.velocity.x / length;
      z = chair.velocity.z / length;

      if (z > 0) rotation -= Math.acos(x);
      else rotation += Math.acos(x);
      rotateObjectAround(chair.base, chair.base.position, 0, rotation);
    }

    update() {
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
  }
