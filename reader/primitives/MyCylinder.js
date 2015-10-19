/**
* MyCylinder
* @constructor
* @param {CGFScene} cena da primitiva
* @param {float} altura do cilindro
* @param {float} raio da base
* @param {float} raio do topo
* @param {integer} numero de particoes em xz
* @param {integer} numero de particoes em xy
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

      if(i != this.slices && j != this.stacks){
        var index = j * (this.slices + 1)+ i;
        var index2 = (j+1) * (this.slices+1) + i;
        this.indices.push(index, index + 1, index2 + 1);
        this.indices.push(index, index2 + 1, index2);
      };
    };
    radius += radiusIncrement;
  };

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
