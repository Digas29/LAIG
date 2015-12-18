/**
* @class Patch
* @constructor
* @param {CGFScene} cena da primitiva
* @param {integer} ordem da curva de Bezier
* @param {integer} nr de divisoes na direcao u
* @param {integer} nr de divisoes na direcao v
* @param {Array} pontos de controlo da curva de Bezier
*/
function Patch(scene, order, uDivs, vDivs, controlPoints) {

	CGFobject.call(this, scene);

	this.order = order;
	this.uDivs = uDivs;
	this.vDivs = vDivs;
	this.controlPoints = controlPoints;
	this.nurb;

	this.initBuffers();
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.initBuffers = function () {
	var knots = [];
	for(var i = 0; i <= this.order; i++){
		knots.push(0);
	}
	for(var i = 0; i <= this.order; i++){
		knots.push(1);
	}
	var surface = new CGFnurbsSurface(this.order, this.order, knots, knots, this.controlPoints);
	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};
	this.nurb = new CGFnurbsObject(this.scene, getSurfacePoint, this.uDivs, this.vDivs);
};
Patch.prototype.display = function () {
	this.nurb.display();
};
