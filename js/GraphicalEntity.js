/**
 * In this file, we define the objects
 */

/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor() {
    super()

    // Physics Variables
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.acceleration = new THREE.Vector3( 0, 0, 0 );
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity.addScalar(value);
    console.log("changing velocity")
  }

  // update function is called to update the object
  update() {  }
}


/**
* Lamp Object & related functions
*/
class Lamp extends GraphicalEntity {
  constructor(x, y, z) {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    this.addLampBase( 0, 0, 0);
    this.addLampFoot( 0, 0, 0);
    this.addLampBulb( 0, 0, 0);
    this.addLampCover(0, 0, 0);

    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  addLampBase( x, y, z) {
      var geometry = new THREE.CylinderGeometry(8, 8, 0.5);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y + 0.25, z);
      this.add(mesh);
  }

  addLampFoot( x, y, z) {
      var geometry = new THREE.CylinderGeometry(0.5, 0.5, 44);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y + 22.5, z);
      this.add(mesh);
  }

  addLampBulb( x, y, z) {
      var geometry = new THREE.SphereGeometry(1.5, 8, 6);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y + 43.25, z);
      this.add(mesh);
  }

  addLampCover( x, y, z) {
      var geometry = new THREE.ConeGeometry(6, 10, 16, true, 0, 2*Math.PI);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y + 45, z);
      mesh.rotateX(Math.PI);
      this.add(mesh);
  }
}


/**
* Table Object & related functions
*/
class Table extends GraphicalEntity {
  constructor(x, y, z) {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    this.addTableTop(  0,  0,  0);
    this.addTableLeg(-25, -1, -8);
    this.addTableLeg(-25, -1,  8);
    this.addTableLeg( 25, -1,  8);
    this.addTableLeg( 25, -1, -8);

    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  addTableLeg( x, y, z) {
      var geometry = new THREE.CylinderGeometry(1, 1, 6);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y - 3, z);
      this.add(mesh);
  }

  addTableTop( x, y, z) {
      var geometry = new THREE.CubeGeometry(60, 2, 20);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y, z);
      this.add(mesh);
  }
}

/**
 * Ball Object & related functions
 */
class Ball extends GraphicalEntity {
  constructor(x, y, z){
    super()

    this.userData = { jumping: true, step: 0 };
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.acceleration = new THREE.Vector3( 0, 0, 0 );

    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    var geometry = new THREE.SphereGeometry(4, 10, 10);
    var mesh = new THREE.Mesh(geometry, this.material);

    this.add(mesh);
    this.position.set(x, y + 4, z);

    scene.add(this);
  }
}

/**
 * Chair Object & related functions
 */
class Chair extends GraphicalEntity {
    constructor(x, y, z){
      super()

      this.wheels = []

      this.material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true });
      var geometry = new THREE.SphereGeometry(4, 10, 10);
      this.mesh = new THREE.Mesh(geometry, this.material);

      this.base = this.addChairBase( x, y, z)
      this.back = this.addChairBack( x, y, z)
      this.addChairSpindles( x, y, z)
      this.addChairWheelsBase( x, y, z)
      var numWheels = 4;
      for (var i = 0; i<2*Math.PI; i+=2*Math.PI/numWheels){
        this.wheels.push(this.addChairWheel( x, y, z, 4, i));
      }

      scene.add(this);
      this.position.set(x, y, z)
    }

    addChairWheelsBase( x, y, z) {
        'use strict';
        var geometry = new  THREE.TorusGeometry(4, 1, 8, 20, Math.PI * 2);
        var mesh = new THREE.Mesh(geometry, this.material);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, y - 12, z);
        this.add(mesh);
    }

    addChairSpindles( x, y, z) {
        'use strict';
        var geometry = new THREE.CubeGeometry(1, 9, 1);
        var mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(x, y - 7, z);
        this.add(mesh);
    }

    addChairWheel( x, y, z, radious, rotation) {
        'use strict';
        var geometry = new  THREE.TorusGeometry(0.5, 1, 3, 10, Math.PI * 2);
        var mesh = new THREE.Mesh(geometry, this.material);
        console.log(Math.cos(rotation)*radious)
        console.log(Math.sin(rotation)*radious)
        x += Math.cos(rotation)*radious
        z += Math.sin(rotation)*radious;
        mesh.position.set(x, y - 14, z);
        this.add(mesh);

        return mesh;
    }

   addChairBack( x, y, z) {
       'use strict';

       var geometry = new THREE.CubeGeometry(15, 15, 2);
       var mesh = new THREE.Mesh(geometry, this.material);
       mesh.position.set(x, y+4, z-6.5);
       this.add(mesh);

       return mesh;
   }

   addChairBase( x, y, z) {
       'use strict';
       var geometry = new THREE.CubeGeometry(15, 1.5, 15);
       var mesh = new THREE.Mesh(geometry, this.material);
       mesh.position.set(x, y - 3, z);
       this.add(mesh);

       return mesh;
   }


    updateWheels() {
      for (var wheel in this.wheels){
        var rotation = 0;
        length = this.velocity.length();

        if (length == 0) break;

        x = this.velocity.x / length;
        z = this.velocity.z / length;

        if (z > 0) rotation = -Math.acos(x);
        else rotation = Math.acos(x);

        this.wheels[wheel].rotation.y = rotation;

        rotation = length / 100
        this.wheels[wheel].rotation.z = rotation;
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
