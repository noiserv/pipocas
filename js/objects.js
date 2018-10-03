/**
 * In this file, we define the objects
 */

/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class SceneObject {
  constructor() {
    // Physics Variables
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.acceleration = new THREE.Vector3( 0, 0, 0 );

    // THREE.js Object3D
    this.mesh;
  }

  position(){ return this.mesh.position }

  // rotates the object arround its Y axis
  rotateY(radians){
    this.mesh.rotateY(radians)
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity.addScalar(value);
    console.log("changing velocity")
  }

  // update function is called to update the object
  update() {
    console.log("update not implemented yet for " + this)
  }
}

/**
 * Lamp Object & related functions
 */
function addLampBase(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(8, 8, 0.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 0.25, z);
    obj.add(mesh);
}

function addLampFoot(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.5, 0.5, 44);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 22.5, z);
    obj.add(mesh);
}

function addLampBulb(obj, x, y, z) {
    'use strict';

    geometry = new THREE.SphereGeometry(1.5, 8, 6);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 43.25, z);
    obj.add(mesh);
}

function addLampCover(obj, x, y, z) {
    'use strict';

    geometry = new THREE.ConeGeometry(6, 10, 16, true, 0, 2*Math.PI);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 45, z);
    mesh.rotateX(Math.PI);
    obj.add(mesh);
}



class Lamp extends SceneObject {
  constructor(x, y, z) {
    super()
    var lamp = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addLampBase(lamp, 0, 0, 0);
    addLampFoot(lamp, 0, 0, 0);
    addLampBulb(lamp, 0, 0, 0);
    addLampCover(lamp, 0, 0, 0);

    scene.add(lamp);

    lamp.position.x = x;
    lamp.position.y = y;
    lamp.position.z = z;
  }
}


/**
 * Table Object & related functions
 */
function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(1, 1, 6);
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
    ball.position.set(x, y + 4, z);

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

class Chair extends SceneObject {
    constructor(x, y, z){
      super()

      chair = new THREE.Object3D();
      this.mesh = chair;
      chair.wheels = []

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

      chair.update = function() { Chair.prototype.update()}

      scene.add(chair);
      chair.position.set(x, y, z)
    }

    updateWheels() {
      for (var wheel in chair.wheels){
        var rotation = 0;
        length = this.velocity.length();

        if (length == 0) break;

        x = this.velocity.x / length;
        z = this.velocity.z / length;

        if (z > 0) rotation = -Math.acos(x);
        else rotation = Math.acos(x);

        chair.wheels[wheel].rotation.y = rotation;

        rotation = length / 100
        chair.wheels[wheel].rotation.z = rotation;
      }
    }

    updateBack() {
      var rotation = Math.PI/2;
      length = this.velocity.length();

      if (length == 0) return;
      console.log(this.velocity.x)
      var x = this.velocity.x / length;
      var z = this.velocity.z;

      if (z > 0) rotation -= Math.acos(x);
      else rotation += Math.acos(x);
      rotateObjectAround(this.mesh.back, this.mesh.base.position, 7.5, rotation);

      /*chair.back.position.x = chair.base.position.x - Math.sin(rotation)*7.5;
      chair.back.position.z = chair.base.position.z - Math.cos(rotation)*7.5;

      chair.back.rotation.y = rotation;*/
    }

    updateBase() {
      var rotation = Math.PI/2;
      length = this.velocity.length();

      if (length == 0) return;

      var x = this.velocity.x / length;
      var z = this.velocity.z;

      if (z > 0) rotation -= Math.acos(x);
      else rotation += Math.acos(x);
      rotateObjectAround(this.mesh.base, this.mesh.base.position, 0, rotation);
    }

    update() {
      console.log("updated chair")
      var delta = clock.getDelta();

      this.updateWheels()
      this.updateBase()
      this.updateBack()

      this.velocity.x += this.acceleration.x*delta
      this.mesh.position.x += this.velocity.x*delta

      this.velocity.y += this.acceleration.y*delta
      this.mesh.position.y += this.velocity.y*delta

      this.velocity.z += this.acceleration.z*delta
      this.mesh.position.z += this.velocity.z*delta

    }
  }
