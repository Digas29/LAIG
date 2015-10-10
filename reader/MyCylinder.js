/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.height = height;
	this.bRadius = bRadius;
	this.tRadius = tRadius;

 	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];
 	var incrementS = 1.0 / this.slices;
 	var incrementT = 1.0 / this.stacks;
 	var alphaIncrement = 2.0 * Math.PI/ this.slices;
 	var radiusIncrement = (this.tRadius - this.bRadius) / this.stacks;
 	var radius = this.bRadius;
 	var alpha;


	for(j = 0; j <= this.stacks; j++){

 		alpha = 0;

 		for(i = 0; i <= this.slices; i++){
 		    var cosAlpha = Math.cos(alpha) * radius;
 		    var sinAlpha = Math.sin(alpha) * radius;

			this.normals.push(cosAlpha, sinAlpha, 0);	
			this.texCoords.push(i*incrementS, j*incrementT);
			this.vertices.push(cosAlpha, sinAlpha, j * this.height / this.stacks);

			alpha += alphaIncrement;

			if(i != this.slices){
                var index = j * this.slices + i;
                this.indices.push(index , index + this.slices + 1, index + this.slices);
                this.indices.push(index, index + 1, index + this.slices +1);
			};
 		};
 		radius += radiusIncrement;
 	};

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};