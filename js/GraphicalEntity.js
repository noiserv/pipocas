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
    this.dof = new THREE.Vector3( 0, 0, 0 ); // facing direction
    this.velocity = 0//= new THREE.Vector3( 0, 0, 0 );
    this.acceleration = 0 //= new THREE.Vector3( 0, 0, 0 );
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity += value
  }

  // accepts value in degrees
  rotate(value) {
    this.rotation.y += Math.PI*2*(value/360)
  }

  // update function is called to update the object
  update() {  }

  update_dof(){
    this.dof.x = Math.sin(this.rotation.y)
    this.dof.z = Math.cos(this.rotation.y)
  }
}


/**
* Lamp Object & related functions
*/
class Lamp extends GraphicalEntity {
  constructor(x, y, z) {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0xffff33, wireframe: true });
    this.name = "lamp"

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

    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true });
    this.name = "Table"

    this.addTableTop(  0,  0,  0);
    this.addTableLeg(-25, -10, -8);
    this.addTableLeg(-25, -10,  8);
    this.addTableLeg( 25, -10,  8);
    this.addTableLeg( 25, -10, -8);

    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  addTableLeg( x, y, z) {
      var geometry = new THREE.CylinderGeometry(1, 1, 18);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y , z);
      this.add(mesh);
  }

  addTableTop( x, y, z) {
      var geometry = new THREE.CubeGeometry(60, 2, 20);
      var mesh = new THREE.Mesh(geometry, this.material);
      mesh.position.set(x, y , z);
      this.add(mesh);
  }
}

/**
 * Chair Object & related functions
 */
class Chair extends GraphicalEntity {
    constructor(x, y, z){
      super()

      this.wheels = []
      this.name = "chair"

      this.material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true });

      this.base = this.addChairBase( 0, 0, 0 )
      this.back = this.addChairBack( 0, 0, 0 )
      this.addChairSpindles( 0, 0, 0 )
      this.addChairWheelsBase( 0, 0, 0 , 0)
      this.addChairWheelsBase( 0, 0, 0 , Math.PI/2)
      var numWheels = 4;
      for (var i = 0; i<2*Math.PI; i+=2*Math.PI/numWheels){
        this.wheels.push(this.addChairWheel( 0, 0, 0, 4, i));
      }

      scene.add(this);
      this.position.set(x, y, z)
    }

    addChairWheelsBase( x, y, z, rotation) {
        'use strict';
        var geometry = new THREE.CubeGeometry(2, 1, 10);
        var mesh = new THREE.Mesh(geometry, this.material);
        mesh.rotation.y = rotation;
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
        x += Math.cos(rotation)*radious
        z += Math.sin(rotation)*radious;
        mesh.position.set(x, y - 14, z);
        mesh.rotation.y += Math.PI/2
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
        var rotation = 0


        rotation = this.velocity / 60;
        console.log(this.velocity);
        this.wheels[wheel].rotation.z += rotation;
    	}
    }

    update() {
      var delta = clock.getDelta();
      this.update_dof()
      this.updateWheels()
      //this.updateWheels()
      var friction_factor = 5

      if (this.velocity>0.05) this.velocity -= friction_factor*delta
      else if (this.velocity<-0.05) this.velocity += friction_factor*delta

      this.velocity += this.acceleration*delta
      this.position.x += this.velocity*delta*this.dof.x

      this.position.z += this.velocity*delta*this.dof.z

    }
  }
