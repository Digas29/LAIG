
function XMLscene(interface) {
    CGFscene.call(this);
    this.interface = interface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initLights();
    this.initCameras();
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.axis = new CGFaxis(this);
    this.print = true;
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.1, 0.1, 0.1, 1.0);
    this.setDiffuse(0.1, 0.1, 0.1, 1.0);
    this.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function (){
	//INITIALS BLOCK

	this.initialsTrans = this.graph.initials.transformationMatrix;
	this.axis = new CGFaxis(this, this.graph.initials.axisLength);
  this.camera.near = this.graph.initials.frustumNear;
  this.camera.far = this.graph.initials.frustumFar;

	//ILLUMINATON BLOCK
	this.gl.clearColor(this.graph.background.r,this.graph.background.g,this.graph.background.b,this.graph.background.a);
	this.setGlobalAmbientLight(this.graph.ambient.r,this.graph.ambient.g,this.graph.ambient.b,this.graph.ambient.a);


	//LIGHTS BLOCK
	for(var i = 0; i < this.graph.lights.length; i++){
		this.lights[i].setPosition(this.graph.lights[i].position.x, this.graph.lights[i].position.y, this.graph.lights[i].position.z,this.graph.lights[i].position.w);
		this.lights[i].setAmbient(this.graph.lights[i].ambient.r, this.graph.lights[i].ambient.g, this.graph.lights[i].ambient.b,this.graph.lights[i].ambient.a);
		this.lights[i].setDiffuse(this.graph.lights[i].diffuse.r, this.graph.lights[i].diffuse.g, this.graph.lights[i].diffuse.b,this.graph.lights[i].diffuse.a);
		this.lights[i].setSpecular(this.graph.lights[i].specular.r, this.graph.lights[i].specular.g, this.graph.lights[i].specular.b,this.graph.lights[i].specular.a);
		this.lights[i].setVisible(true);
		if(this.graph.lights[i].enable == true)
			this.lights[i].enable();
      this.interface.addLightToFolder(this.graph.lights[i]);
	}

	//TEXTURE BLOCK

	this.textures = [];
	this.textInfo = [];
	for(var i = 0; i < this.graph.textures.length; i++){
		this.textures[this.graph.textures[i].id] = new CGFtexture(this, this.graph.textures[i].path);
		this.textInfo[this.graph.textures[i].id] = this.graph.textures[i];
	}

	//MATERIALS BLOCK

	this.materials = [];
	for(var i = 0; i < this.graph.materials.length; i++){
		var material = new CGFappearance(this);
		material.setShininess(this.graph.materials[i].shininess);
		material.setSpecular(this.graph.materials[i].specular.r,this.graph.materials[i].specular.g,
		this.graph.materials[i].specular.b, this.graph.materials[i].specular.a);
		material.setDiffuse(this.graph.materials[i].diffuse.r,this.graph.materials[i].diffuse.g,
		this.graph.materials[i].diffuse.b, this.graph.materials[i].diffuse.a);
		material.setAmbient(this.graph.materials[i].ambient.r,this.graph.materials[i].ambient.g,
		this.graph.materials[i].ambient.b, this.graph.materials[i].ambient.a);
		material.setEmission(this.graph.materials[i].emission.r,this.graph.materials[i].emission.g,
		this.graph.materials[i].emission.b, this.graph.materials[i].emission.a);
		this.materials[this.graph.materials[i].id] = material;
	}

	//LEAVES BLOCK
	this.leaves = [];
  this.leavesProperties = [];
  for (var i = 0; i < this.graph.primitives.length; i++) {
    this.leavesProperties[this.graph.primitives[i].id] = this.graph.primitives[i];
    switch (this.graph.primitives[i].type) {
      case "rectangle":
        this.leaves[this.graph.primitives[i].id] = new MyRectangle(this, this.graph.primitives[i].args[0], this.graph.primitives[i].args[1],
          this.graph.primitives[i].args[2], this.graph.primitives[i].args[3]);
        break;
      case "cylinder":
      this.leaves[this.graph.primitives[i].id] = new MyCylinder(this, this.graph.primitives[i].args[0], this.graph.primitives[i].args[1],
        this.graph.primitives[i].args[2], this.graph.primitives[i].args[3], this.graph.primitives[i].args[4]);
        break;
      case "sphere":
      this.leaves[this.graph.primitives[i].id] = new MySphere(this, this.graph.primitives[i].args[0], this.graph.primitives[i].args[1],
        this.graph.primitives[i].args[2]);
        break;
      case "triangle":
      this.leaves[this.graph.primitives[i].id] = new MyTriangle(this, this.graph.primitives[i].args[0], this.graph.primitives[i].args[1],
        this.graph.primitives[i].args[2], this.graph.primitives[i].args[3], this.graph.primitives[i].args[4], this.graph.primitives[i].args[5], this.graph.primitives[i].args[6],
          this.graph.primitives[i].args[7], this.graph.primitives[i].args[8]);
        break;
      default:
      break;
    }
  }

  //NODES
  this.nodeRoot = this.graph.root;
  this.nodes = this.graph.nodes;
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

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk)
	{
    this.multMatrix(this.initialsTrans);
    this.axis.display();
		for(var i = 0; i < this.graph.lights.length; i++){
			this.lights[i].update();
		}
		this.drawNodes(this.nodeRoot, this.nodes[this.nodeRoot].transformations,this.nodes[this.nodeRoot].material, this.nodes[this.nodeRoot].texture);
		this.print = false;
    this.updateLights();
	}
  else{
    this.axis.display();
  }

    this.shader.unbind();
};

XMLscene.prototype.drawNodes = function(node, matrix, material, texture){
	var nodeInfo = this.nodes[node];

	var materialNode = nodeInfo.material;
	var textureNode = nodeInfo.texture;

	if(materialNode == "null"){
		materialNode = material;
	}
	if(textureNode == "null"){
		textureNode = texture;
	}
  else if(textureNode == "clear"){
    textureNode = "null";
  }
	var geoTrans = nodeInfo.transformations;
	var descendants = nodeInfo.descendants;

	var newMatrix = mat4.create();
	mat4.multiply(newMatrix, matrix, geoTrans);

	for(var i = 0; i < descendants.length; i++){
		var descendant = descendants[i];
		if(this.leaves[descendant] == null){
			this.drawNodes(descendant, newMatrix, materialNode, textureNode);
		}
		else{
			this.drawPrimitive(descendant, newMatrix, materialNode, textureNode);
		}
	}
};

XMLscene.prototype.drawPrimitive = function(primitive, matrix, material, textureName){

    this.pushMatrix();
        this.multMatrix(matrix);
        if(material != "null"){
          this.materials[material].apply();
        }
        var texture;
        if(textureName != "null"){
          this.textures[textureName].bind();
          if(this.leavesProperties[primitive].type == "rectangle" || this.leavesProperties[primitive].type == "triangle"){
            this.leaves[primitive].updateTexCoords(this.textInfo[textureName].ampS, this.textInfo[textureName].ampT);
          }
        }
        this.leaves[primitive].display();
    this.popMatrix();
    this.setDefaultAppearance();
    if(textureName != "null"){
      this.textures[textureName].unbind;
    }

}

XMLscene.prototype.updateLights = function(){
  for (var i = 0; i < this.graph.lights.length; i++) {
    if(this.graph.lights[i].enable){
      this.lights[i].enable();
    }
    else{
      this.lights[i].disable();
    }
  }
}
