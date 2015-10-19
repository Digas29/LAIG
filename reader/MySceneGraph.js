function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();
	this.parser = new LSXParser();

	/*
	* Read the contents of the lsx file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/
	this.fullFileName = 'scenes/'+filename;
	this.reader.open(this.fullFileName, this);
}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("LSX Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Calls for different functions to parse the various blocks
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

/*
* Getting informations from INITIALS block
* @param {string} LSX file
*/
MySceneGraph.prototype.parseInitials= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('INITIALS');
	if (elems == null) {
		return  "INITIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	if(elems[0].children.length != 7){
		return "either more or less tags found in the 'INITIALS' block than the expected";
	}
	this.initials = new Initials();
	var matrix = mat4.create();
	mat4.identity(matrix);

	var frustum_tag = elems[0].children[0];
	this.initials.frustumNear = this.parser.getValue(frustum_tag, "near");
	this.initials.frustumFar = this.parser.getValue(frustum_tag, "far");
	var translation_tag = elems[0].children[1];
	var translation = this.parser.getCoords(translation_tag);
	mat4.translate(matrix, matrix, [translation.x, translation.y, translation.z]);

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
			return("INITIALS rotation on axis " + axis + "is incorrect");
		}



	}
	var scale_tag =  elems[0].children[5];
	var scale = this.parser.getScaleCoords(scale_tag);
	mat4.scale(matrix, matrix, [scale.x, scale.y, scale.z]);

	this.initials.transformationMatrix = matrix;

	var reference_tag = elems[0].children[6];
	this.initials.axisLength = this.parser.getValue(reference_tag, "length");
	if(this.initials.axisLength == null || this.initials.axisLength == undefined){
		return "Please check INITIALS reference tag and see if it matches the <reference length=\"ff\" />";
	}
	var validade = this.checkValid(this.initials);
	if(validade != undefined){
		return "Erro no INTIALS" + validade;
	}
};
/*
* Getting informations from ILLUMINATION block
* @param {string} LSX file
*/
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
	var validade = this.checkValid(this.background);
	if(validade != undefined){
		return "Erro no ILLUMINATION background " + validade;
	}
	validade = this.checkValid(this.ambient);
	if(validade != undefined){
		return "Erro no ILLUMINATION ambient " + validade;
	}
}
/*
* Getting informations from LIGHTS block
* @param {string} LSX file
*/
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
		lightValues.id = this.parser.getString(light, "id");

		if(light.children.length != 5){
			return "Please check light " + lightValues.id + " some informations may be missing";
		}
		var enable_tag = light.children[0];
		var position_tag = light.children[1];
		var ambient_tag = light.children[2];
		var diffuse_tag = light.children[3];
		var specular_tag = light.children[4];

		lightValues.enable = this.parser.getBoolean(enable_tag);
		lightValues.position = this.parser.getLightPosition(position_tag);
		lightValues.ambient = this.parser.getRGB(ambient_tag);
		lightValues.diffuse = this.parser.getRGB(diffuse_tag);
		lightValues.specular = this.parser.getRGB(specular_tag);
		var validade = this.checkValid(lightValues);
		if(validade != undefined){
			return "Erro no LIGHTS id= " + lightValues.id + " no " + validade;
		}
		this.lights[i] = lightValues;
		console.log("Light with id=" + lightValues.id + " was processed successfuly.")
	}
}
/*
* Getting informations from TEXTURES block
* @param {string} LSX file
*/
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
		var textureInfo = new TextureInfo();
		var texture_tag = elems[0].children[i];
		textureInfo.id = this.parser.getString(texture_tag, "id");
		if(texture_tag.children.length != 2){
			return "Please check texture " + textureInfo.id + " some informations may be missing";
		}
		var path_tag = texture_tag.children[0];
		var amp_tag = texture_tag.children[1];
		textureInfo.path = this.fullFileName.substring(0, this.fullFileName.lastIndexOf("/")+1) + this.parser.getString(path_tag, "path");
		textureInfo.ampS = this.parser.getValue(amp_tag, "s");
		textureInfo.ampT = this.parser.getValue(amp_tag, "t");
		var validade = this.checkValid(textureInfo);
		if(validade != undefined){
			return "Erro no TEXTURES id= " + textureInfo.id + " no " + validade;
		}
		this.textures[i] = textureInfo;
	}
}

/*
* Getting informations from MATERIAL block
* @param {string} LSX file
*/
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
		materialInfo.id = this.parser.getString(material_tag, "id");

		if(material_tag.children.length != 5){
			return "Please check material " + materialInfo.id + " some informations may be missing";
		}

		var shininess_tag = material_tag.children[0];
		var specular_tag = material_tag.children[1]
		var diffuse_tag = material_tag.children[2];
		var ambient_tag = material_tag.children[3];
		var emission_tag = material_tag.children[4];

		materialInfo.shininess = this.parser.getValue(shininess_tag, "value");
		materialInfo.specular = this.parser.getRGB(specular_tag);
		materialInfo.diffuse = this.parser.getRGB(diffuse_tag);
		materialInfo.ambient = this.parser.getRGB(ambient_tag);
		materialInfo.emission = this.parser.getRGB(emission_tag);
		this.materials[i] = materialInfo;
		var validade = this.checkValid(materialInfo);
		if(validade != undefined){
			return "Erro no MATERIALS id= " + materialInfo.id + " no " + validade;
		}
	}
	this.checkValid(this.materials[0]);
}

/*
* Getting informations from LEAVES block
* @param {string} LSX file
*/
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('LEAVES');
	if (elems == null) {
		return  "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LEAVES' element found.";
	}
	this.primitives = [];
	for (var i = 0; i < elems[0].children.length; i++) {
		this.primitives[i] = this.parser.getPrimitive(elems[0].children[i]);
		var validade = this.checkValid(this.primitives[i]);
		if(validade != undefined){
			return "Erro no LEAVES id= " + this.primitives[i].id + " no " + validade;
		}
		switch (this.primitives[i].type) {
			case "rectangle":
				if(this.primitives[i].args.length != 4){
					return "Please check rectangle (id=" + this.primitives[i].id + ") args LEAVE to see if matches the prototype args=\"ff ff ff ff\"";
				}
				break;
			case "cylinder":
				if(this.primitives[i].args.length != 5){
					return "Please check cylinder (id=" + this.primitives[i].id + ") args LEAVE to see if matches the prototype args=\"ff ff ff ii ii\"";
				}
				break;
			case "sphere":
				if(this.primitives[i].args.length != 3){
					return "Please check sphere (id=" + this.primitives[i].id + ") args LEAVE to see if matches the prototype args=\"ff ii ii\"";
				}
				break;
			case "triangle":
				if(this.primitives[i].args.length != 9){
					return "Please check triangle (id=" + this.primitives[i].id + ") args LEAVE to see if matches the prototype args=\"ff ff ff  ff ff ff  ff ff ff\"";
				}
				break;
			default:
				return this.primitives[i].type + " is not a primitive type (id=" + this.primitives[i].id + ")";
		}
	}
}
/*
* Getting informations from NODES block
* @param {string} LSX file
*/
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
		this.nodes[tempNode.id] = tempNode;
		var validade = this.checkValid(tempNode);
		if(validade != undefined){
			return "Erro no NODES id= " + tempNode.id + " no " + validade;
		}
	}
	if(this.nodes[this.root] == undefined || this.nodes[this.root] == null){
		return "NODES: Root node is not defined";
	}
}

/*
* Checking is there is any undefined field in a object
* @param {object} object to be validated
*/
MySceneGraph.prototype.checkValid = function(object){
	if(object == undefined){
		return;
	}
	for (var key in object) {
		if(object.hasOwnProperty(key)){
			if(typeof(object[key]) == "object"){
				var retorno = this.checkValid(object[key]);
					if(retorno != undefined){
						return key + "  " + retorno;
					}
			}
			else if (typeof(object[key]) == "undefined" || typeof(object[key]) == "null"){
				return key;
			}
		}
	}
	return;
}

/*
* Callback to be executed on any read error
*/

MySceneGraph.prototype.onXMLError=function (message) {
	alert("LSX Loading Error: " + message);
	this.loadedOk=false;
};
