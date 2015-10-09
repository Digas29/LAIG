/**
 * MySphere 
 * @constructor
 */

function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
 	this.normals = []; 
 	this.texCoords = [];
 	
 	for (var latNumber = 0; latNumber <= this.stacks; latNumber++) {
      var theta = latNumber * Math.PI / this.stacks;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= this.slices; longNumber++) {
        var phi = longNumber * 2 * Math.PI / this.slices;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / this.slices);
        var v = 1 - (latNumber / this.stacks);

        this.normals.push(x);
        this.normals.push(y);
        this.normals.push(z);
        this.texCoords.push(u);
        this.texCoords.push(v);
        this.vertices.push(this.radius * x);
        this.vertices.push(this.radius * y);
        this.vertices.push(this.radius * z);
      }
    }
    for(j = 0; j < this.stacks; j++){
 	  for(i = 0; i < this.slices; i++){
 			var index = j * this.slices + i;
 			if((index + this.slices + 1) % this.slices == 0){
 				this.indices.push(index + 1, index, index - this.slices + 1);
 				this.indices.push(index, index + 1 , index + this.slices);
 			}
 			else{
 				this.indices.push(index + 1, index + this.slices + 1, index + this.slices);
 				this.indices.push(index, index + 1 , index + this.slices);
 			}
 		};
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};