/**
* @class Animation
* @constructor
* @param {string} id da animacao
* @param {integer} tempo da animacao
* @param {string} tipo de animacao (circular ou linear)
*/
function Animation(id, span, type){
	this.id = id;
	this.span = span;
	this.type = type;
	this.done = false;
}

Animation.prototype.constructor=Animation;

Animation.prototype.calMatrix = function() {
	var matrix = mat4.create();
	mat4.identity(matrix);

	return matrix;
}
