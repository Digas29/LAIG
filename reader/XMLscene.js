
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.rectangle = new MyRectangle(this, -0.5, 0.5, 0.5,-0.5);
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	//INITIALS BLOCK
	this.camera.near = this.graph.near;
	this.camera.far = this.graph.far;
	this.camera.setPosition(vec3.fromValues(this.graph.translation[0], this.graph.translation[1], this.graph.translation[2]));
	this.camera.orbit(vec3.fromValues(1,0,0),this.graph.rotationX);
	this.camera.orbit(vec3.fromValues(0,1,0),this.graph.rotationY);
	this.camera.orbit(vec3.fromValues(0,0,1),this.graph.rotationZ);
	this.axis = new CGFaxis(this, this.graph.axisLength);

	//ILLUMINATON BLOCK
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.setAmbient(this.graph.ambient[0],this.graph.ambient[1],this.graph.ambient[2],this.graph.ambient[3])
	
	
	//LIGHTS BLOCK
	for(var i = 0; i < this.graph.lights.length; i++){
		this.lights[i].setPosition(this.graph.lights[i][1][0], this.graph.lights[i][1][1], this.graph.lights[i][1][2],this.graph.lights[i][1][3]);
		this.lights[i].setAmbient(this.graph.lights[i][2][0], this.graph.lights[i][2][1], this.graph.lights[i][2][2],this.graph.lights[i][2][3]);
		this.lights[i].setDiffuse(this.graph.lights[i][3][0], this.graph.lights[i][3][1], this.graph.lights[i][3][2],this.graph.lights[i][3][3]);
		this.lights[i].setSpecular(this.graph.lights[i][4][0], this.graph.lights[i][4][1], this.graph.lights[i][4][2],this.graph.lights[i][4][3]);
		this.lights[i].setVisible(this.graph.lights[i][0]);
		this.lights[i].enable();
	}

	//TEXTURE BLOCK

	this.textures = [];
	for(var i = 0; i < this.graph.textures.length; i++){
		this.textures[this.graph.textures[i][0]] = new CGFtexture(this, this.graph.textures[i][1]);
	}

	//MATERIALS BLOCK

	this.materials = [];
	for(var i = 0; i < this.graph.textures.length; i++){
		var material = new CGFappearance(this);
		material.setShininess(this.graph.materials[i][1]);
		material.setSpecular(this.graph.materials[i][2][0],this.graph.materials[i][2][1], 
		this.graph.materials[i][2][2], this.graph.materials[i][2][3]);
		material.setDiffuse(this.graph.materials[i][3][0],this.graph.materials[i][3][1], 
		this.graph.materials[i][3][2], this.graph.materials[i][3][3]);
		material.setAmbient(this.graph.materials[i][4][0],this.graph.materials[i][4][1], 
		this.graph.materials[i][4][2], this.graph.materials[i][4][3]);
		material.setEmission(this.graph.materials[i][5][0],this.graph.materials[i][5][1], 
		this.graph.materials[i][5][2], this.graph.materials[i][5][3]);
		this.materials[this.graph.materials[i][0]] = material;
	}
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk)
	{
		for(var i = 0; i < this.graph.lights.length; i++){
			this.lights[i].update();
		}
		this.rectangle.display();
		
	};	

    this.shader.unbind();
};

