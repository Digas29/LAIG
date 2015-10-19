/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.y1 = y1;
	this.y2 = y2;
	this.y3 = y3;
	this.z1 = z1;
	this.z2 = z2;
	this.z3 = z3;

	this.a = Math.sqrt((x1 - x3) * (x1 - x3) +
			 		   (y1 - y3) * (y1 - y3) +
			 		   (z1 - z3) * (z1 - z3));

	this.b = Math.sqrt((x2 - x1) * (x2 - x1) +
			 		   (y2 - y1) * (y2 - y1) +
			 		   (z2 - z1) * (z2 - z1));

	this.c = Math.sqrt((x3 - x2) * (x3 - x2) +
			 		   (y3 - y2) * (y3 - y2) +
			 		   (z3 - z2) * (z3 - z2));

	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);

	this.beta = Math.acos(this.cosBeta);

	this.xU = x2 - x1;
	this.yU = y2 - y1;
	this.zU = z2 - z1;

	this.xV = x3 - x1;
	this.yV = y3 - y1;
	this.zV = z3 - z1;

	this.normalX = this.yU * this.zV - this.zU * this.yV;
	this.normalY = this.zU * this.xV - this.xU * this.zV;
	this.normalZ = this.xU * this.yV - this.yU * this.xV;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3
			];

	this.indices = [
            0, 1, 2
        ];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.normals = [
						this.normalX, this.normalY, this.normalZ,
            this.normalX, this.normalY, this.normalZ,
            this.normalX, this.normalY, this.normalZ
	];
	this.texCoords= [
			0, 0,
			1, 0,
			1, 1
		];
	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function(ampS, ampT){

    this.texCoords= [
    		(this.c - this.a * Math.cos(this.beta)) / ampS, this.a * Math.sin(this.beta)/ampT,
    		0.0, 0.0,
    		this.c / ampS, 0.0];

    this.updateTexCoordsGLBuffers();
}
