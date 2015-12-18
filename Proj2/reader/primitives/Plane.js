/**
* @class Plane
* @constructor
* @param {CGFScene} cena da primitiva
* @param {integer} numero de partes por eixo
*/
function Plane(scene, parts) {
	CGFobject.call(this,scene);
  this.parts = parts;
	this.initBuffers();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor=Plane;

Plane.prototype.initBuffers = function () {
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	var surface = new CGFnurbsSurface(1, // degree on U: 2 control vertexes U
					 1, // degree on V: 2 control vertexes on V
					[0, 0, 1, 1], // knots for U
					[0, 0, 1, 1], // knots for V
					[	// U = 0
						[ // V = 0..1;
							 [-0.5, 0.0, 0.5, 1 ],
							 [-0.5, 0.0, -0.5, 1 ]

						],
						// U = 1
						[ // V = 0..1
							 [ 0.5, 0.0, 0.5, 1 ],
							 [ 0.5, 0.0, -0.5, 1 ]
						]
					]);
	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};
	this.nurb = new CGFnurbsObject(this.scene,getSurfacePoint,this.parts, this.parts);

  this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
Plane.prototype.display = function () {
	this.nurb.display();
}
