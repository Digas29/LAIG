/**
* @class LinearAnimation
* @constructor
* @param {string} id da animacao
* @param {integer} tempo da animacao
* @param {Array} pontos de controlo
*/
function LinearAnimation(id, span, controlPoints){
	Animation.call(this, id, span,"linear");
	this.controlPoints = controlPoints;
	this.PointsLength = controlPoints.length;
	this.init();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.init = function(){
	this.translations = new Array(this.PointsLength-1);
	this.rotations = new Array(this.PointsLength-1);
	this.calculateDistance();
	var velocity = this.distance / this.span;

	this.controlPointsTime = new Array(this.PointsLength);
	this.controlPointsTime[0] = 0;

	this.controlPointsSpan = new Array(this.PointsLength-1);

	for(var i=1; i < this.PointsLength; i++){
		this.controlPointsTime[i] = this.controlPointsTime[i-1] + vec3.length(this.translations[i-1]) / velocity;
		this.controlPointsSpan[i-1] = this.controlPointsTime[i] - this.controlPointsTime[i-1];
	}
}
/**
* Calcula a distancia total percorrida na animacao
*
* @method calculateDistance
*/
LinearAnimation.prototype.calculateDistance = function() {
	this.distance = 0;

	for (var i = 0; i < this.PointsLength - 1; i++){

		var vector = vec3.create();

		vec3.sub(vector, this.controlPoints[i+1], this.controlPoints[i]);
		this.translations[i] = vector;

		var projecXZ = vec3.fromValues(vector[0], 0, vector[2]);

		if (projecXZ[0] < 0){
			var signal = -1;
		}
		else signal =1;

		this.rotations[i] = signal * Math.acos(vec3.dot(projecXZ, vec3.fromValues(0, 0, 1))/ vec3.length(projecXZ));

		this.distance += vec3.length(vector);

	}
}
/**
* Calcula a matrix de tranformacoes com base no tempo decorrido
*
* @method calMatrix
* @param {float} tempo decorrido
* @return {mat4} devolve a matrix de tranformacoes
*/
LinearAnimation.prototype.calMatrix = function(t){
	 var matrix = mat4.create();

	 mat4.identity(matrix);

	 if (t < 0)
	 	return matrix;

	 t = Math.min(t, this.span);

	 var index;

	 for(index = this.PointsLength - 1; index > 0; index--){
	 	if(this.controlPointsTime[index] < t)
	 		break;
	 }
	 var scale = (t - this.controlPointsTime[index]) / this.controlPointsSpan[index];
	 var position = vec3.clone(this.controlPoints[index]);
	 var translationA = vec3.create();
	 vec3.scale(translationA, this.translations[index], scale);
	 vec3.add(position,position,translationA);

	 mat4.translate(matrix, matrix, position);
	 mat4.rotateY(matrix, matrix, this.rotations[index]);
	 if(t >= this.span){
		 this.done = true;
	 }
	 return matrix;
}
