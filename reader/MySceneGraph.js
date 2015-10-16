function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();
	this.parser = new LSXParser();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("LSX Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseInitials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parseIllumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parseLights(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parseTextures(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parseMaterials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parsePrimitives(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	error = this.parseNodes(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


MySceneGraph.prototype.parseInitials= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return  "INITIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	var matrix = mat4.create();
	mat4.identity(matrix);

	var frustum_tag = elems[0].children[0];
	this.near = this.parser.getValue(frustum_tag, "near");
	this.far = this.parser.getValue(frustum_tag, "far");

	var translation_tag = elems[0].children[1];
	var translation = this.parser.getCoords(translation_tag);
	mat4.translate(matrix, matrix, [translation[0], translation[1], translation[2]]);

	for(var i = 2; i < 5; i++){
		var rotation_tag = elems[0].children[i];
		var angle = this.parser.getAngle(rotation_tag);
		var axis = this.parser.getAxis(rotation_tag);
		switch(axis){
		case "x":
			mat4.rotate(matrix, matrix, angle, [1, 0, 0]);
			break;
		case "y":
			mat4.rotate(matrix, matrix, angle, [0, 1, 0]);
			break;
		case "z":
			mat4.rotate(matrix, matrix, angle, [0, 0, 1]);
			break;
		default:
			console.log("INITIALS rotation on axis " + axis + "is incorrect");
		}

	}
	var scale_tag =  elems[0].children[5];
	var reference_tag = elems[0].children[6];

	this.axisLength = this.parser.getValue(reference_tag, "length");

	var scale = this.parser.getScaleCoords(scale_tag);
	mat4.scale(matrix, matrix, [scale[0], scale[1], scale[2]]);
	this.initialsTrans = matrix;
};

MySceneGraph.prototype.parseIllumination= function(rootElement) {
	var elems =  rootElement.getElementsByTagName('ILLUMINATION');
	if (elems == null) {
		return  "ILLUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'ILLUMINATION' element found.";
	}
	var ambient_tag = elems[0].children[0];
	var background_tag = elems[0].children[1];
	this.background = this.parser.getRGB(background_tag);
	this.ambient = this.parser.getRGB(ambient_tag);
}
MySceneGraph.prototype.parseLights = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('LIGHTS');
	if (elems == null) {
		return  "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LIGHTS' element found.";
	}
	this.lights = [];
	var nLights = elems[0].children.length;
	for(var i = 0; i < nLights; i++){
		var lightValues = new Light();
		var light = elems[0].children[i];
		var enable_tag = light.children[0];
		var position_tag = light.children[1];
		var ambient_tag = light.children[2];
		var diffuse_tag = light.children[3];
		var specular_tag = light.children[4];
		lightValues.id = this.parser.getString(light, "id");
		lightValues.enable = this.parser.getBoolean(enable_tag);
		lightValues.position = this.parser.getLightPosition(position_tag);
		lightValues.ambient = this.parser.getRGB(ambient_tag);
	 	lightValues.diffuse = this.parser.getRGB(diffuse_tag);
		lightValues.specular = this.parser.getRGB(specular_tag);
		this.lights[i] = lightValues;
		console.log("Light with id=" + lightValues.id + " was processed successfuly.")
	}
}
MySceneGraph.prototype.parseTextures = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('TEXTURES');
	if (elems == null) {
		return  "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'TEXTURES' element found.";
	}
	this.textures = [];
	var nTextures = elems[0].children.length;
	for(var i = 0; i < nTextures; i++){
		var textureInfo = [];
		var texture_tag = elems[0].children[i];
		textureInfo[0] = this.parser.getString(texture_tag, "id");
		var path_tag = texture_tag.children[0];
		var amp_tag = texture_tag.children[1];
		textureInfo[1] = this.parser.getString(path_tag, "path");
		textureInfo[2] = this.parser.getValue(amp_tag, "s");
		textureInfo[3] = this.parser.getValue(amp_tag, "t");
		this.textures[i] = textureInfo;
	}
}
MySceneGraph.prototype.parseMaterials = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('MATERIALS');
	if (elems == null) {
		return  "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'MATERIALS' element found.";
	}
	this.materials = [];
	var nMaterials = elems[0].children.length;
	for(var i = 0; i < nMaterials; i++){
		var materialInfo = new Material();
		var material_tag = elems[0].children[i];
		var shininess_tag = material_tag.children[0];
		var specular_tag = material_tag.children[1]
		var diffuse_tag = material_tag.children[2];
		var ambient_tag = material_tag.children[3];
		var emission_tag = material_tag.children[4];
		materialInfo.id = this.parser.getString(material_tag, "id");
		materialInfo.shininess = this.parser.getValue(shininess_tag, "value");
		materialInfo.specular = this.parser.getRGB(specular_tag);
		materialInfo.diffuse = this.parser.getRGB(diffuse_tag);
		materialInfo.ambient = this.parser.getRGB(ambient_tag);
		materialInfo.emission = this.parser.getRGB(emission_tag);
		this.materials[i] = materialInfo;
	}
}
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('LEAVES');
	if (elems == null) {
		return  "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}

	this.rectangle = this.parser.getPrimitiveArgs(elems[0].children[0]);
	if(this.rectangle.length != 5){
		return "Please check rectangle args LEAVE to see if matches the prototype args=\"ff ff ff ff\"";
	}

	this.cylinder = this.parser.getPrimitiveArgs(elems[0].children[1]);
	if(this.cylinder.length != 6){
		return "Please check cylinder args LEAVE to see if matches the prototype args=\"ff ff ff ii ii\"";
	}

	this.sphere = this.parser.getPrimitiveArgs(elems[0].children[2]);
	if(this.sphere.length != 4){
		return "Please check sphere args LEAVE to see if matches the prototype args=\"ff ii ii\"";
	}

	this.triangle = this.parser.getPrimitiveArgs(elems[0].children[3]);
	if(this.triangle.length != 10){
		return "Please check triangle args LEAVE to see if matches the prototype args=\"ff ff ff  ff ff ff  ff ff ff\"";
	}
}
MySceneGraph.prototype.parseNodes = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('NODES');
	if (elems == null) {
		return  "NODES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'NODES' element found.";
	}

	this.root = this.parser.getString(elems[0].children[1], "id");
	this.nodes = [];
	for(i = 1; i < elems[0].children.length; i++){
		var tempNode = this.parser.getNode(elems[0].children[i]);
		this.nodes[tempNode[0]] = tempNode[1];
	}
}

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("LSX Loading Error: "+message);
	this.loadedOk=false;
};
