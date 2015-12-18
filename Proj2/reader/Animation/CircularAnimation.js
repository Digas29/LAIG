/**
* @class CircularAnimation
* @constructor
* @param {string} id da animacao
* @param {integer} tempo da animacao
* @param {float} raio
* @param {Array} centro
* @param {float} angulo inicial
* @param {float} angulo total de rotacao
*/
function CircularAnimation(id, span, radius, center, sAngle, rAngle){
	Animation.call(this, id, span, "circular");
	this.center = center;
	this.radius = radius;
  this.sAngle = sAngle;
  this.rAngle = rAngle;
	this.init();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function(){
  this.velocity = this.rAngle/this.span;
  this.initial = mat4.create();
	mat4.identity(this.initial);
	mat4.rotateY(this.initial, this.initial, this.sAngle);
	mat4.translate(this.initial, this.initial, vec3.fromValues(this.radius, 0, 0));

}
/**
* Calcula a matrix de tranformacoes com base no tempo decorrido
*
* @method calMatrix
* @param {float} tempo decorrido
* @return {mat4} devolve a matrix de tranformacoes
*/
CircularAnimation.prototype.calMatrix = function(t){
	 var matrix = mat4.create();

	 mat4.identity(matrix);

	 if (t < 0)
	 	return matrix;

	 t = Math.min(t, this.span);
	 var angle = t * this.velocity;
   mat4.translate(matrix, matrix, this.center);
   mat4.rotateY(matrix, matrix, angle);
 	 mat4.multiply(matrix, matrix, this.initial);

   if(t >= this.span){
		 this.done = true;
	 }

	 return matrix;
}
