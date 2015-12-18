/**
* MySphere
* @constructor
* @param {CGFScene} cena da primitiva
* @param {float} raio
* @param {integer} numero de particoes em xz
* @param {integer} numero de particoes em xy
*/

function MySphere(scene, radius, stacks, slices) {
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
        var s = 1 - (longNumber / this.slices);
        var t = 1 - (latNumber / this.stacks);
        var index = latNumber * this.slices + longNumber;

        this.normals.push(x);
        this.normals.push(y);
        this.normals.push(z);
        this.texCoords.push(s);
        this.texCoords.push(t);
        this.vertices.push(this.radius * x);
        this.vertices.push(this.radius * y);
        this.vertices.push(this.radius * z);
        if(longNumber != this.slices && latNumber != this.stacks){
        	this.indices.push(index , index + this.slices + 1, index + this.slices);
 			this.indices.push(index, index + 1, index + this.slices +1);
        }
      }
    }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};
