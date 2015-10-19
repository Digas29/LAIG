/**
 * MyRectangle
 * @constructor
 */
function MyRectangle(scene, x1, y1, x2, y2) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y2, 0,
            this.x2, this.y2, 0,
            this.x1, this.y1, 0,
            this.x2, this.y1, 0
			];

	this.indices = [
            0, 1, 2,
						3, 2, 1
        ];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
	];

	this.texCoords = [
			0,0,
			1,0,
			0,1,
			1,1
	];
	this.initGLBuffers();
};

MyRectangle.prototype.updateTexCoords = function(ampS, ampT){
	var height = this.y1 - this.y2;
	var width = this.x2 - this.x1;

	var sMax = 1.0 * width / ampS;
	var tMax = 1.0 * height / ampT;
    this.texCoords= [
    		0, 0,
    		sMax, 0,
    		0, tMax,
    		sMax, tMax];

    this.updateTexCoordsGLBuffers();
};
