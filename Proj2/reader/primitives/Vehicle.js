/**
* @class Vehicle
* @constructor
* @param {CGFScene} cena da primitiva
*/
function Vehicle(scene) {
	CGFobject.call(this, scene);
	this.bezier = new Patch(this.scene, 2, 10, 10,
		[	// U = 0
			[ // V = 0..1;
				[-0.5, 0.0, 0.5, 1 ],
				[-0.5, 0.0, 0.0, 1],
				[-0.5, 0.0, -0.5, 1 ]
			],
		// U = 1
			[ // V = 0..1
				 [ 0, 1.5, 0.5, 1 ],
				 [ 0, 1.5, 0, 1 ],
				 [ 0, 1.5, -0.5, 1 ]
			],
		// U = 2
			[ // V = 0..1
				[ 0.5, 0.0, 0.5, 1 ],
				[ 0.5, 0.0, 0.0, 1 ],
				[ 0.5, 0.0, -0.5, 1 ]
			]
	]);
	this.cylinder1 = new MyCylinder(this.scene, 2.0, 0.1, 0.1, 50, 50);
	this.cylinder2 = new MyCylinder(this.scene, 2.9, 0.1, 0.1, 50, 50);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Patch;

Vehicle.prototype.display = function () {
	this.scene.pushMatrix();
		this.bezier.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.bezier.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.scale(-1,-1,-1);
		this.bezier.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.scale(-1,-1,-1);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.bezier.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(0,-1.45,0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.cylinder2.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(-1.0,0,0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.cylinder1.display();
	this.scene.popMatrix();
};
