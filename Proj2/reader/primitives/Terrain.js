/**
* @class Terrain
* @constructor
* @param {CGFScene} cena da primitiva
* @param {string} path da textura a aplicar
* @param {string} path do mapa de alturas
*/
function Terrain(scene, textureURL, heightmapURL) {
	CGFobject.call(this, scene);

	this.textureURL = textureURL;
	this.heightmapURL = heightmapURL;
  this.plane = new Plane(this.scene, 200);
	this.initBuffers();
};

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.initBuffers = function () {
  this.texture = new CGFtexture(this.scene, this.textureURL);
  this.heightmap = new CGFtexture(this.scene, this.heightmapURL);
  this.shader = new CGFshader(this.scene.gl, 'scenes/shaders/texture.vert', 'scenes/shaders/texture.frag');
  this.shader.setUniformsValues({heightMap: 1});
  this.shader.setUniformsValues({normScale: 0.25});
};
Terrain.prototype.display = function () {
  this.texture.bind(0);
  this.scene.setActiveShader(this.shader);
  this.heightmap.bind(1);
	this.plane.display();
  this.heightmap.unbind();
  this.texture.unbind();
  this.scene.setActiveShader(this.scene.defaultShader);
};
