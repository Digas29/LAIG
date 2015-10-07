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
	var frustum_tag = elems[0].children[0];
	var translation_tag = elems[0].children[1];
	for(var i = 2; i < 5; i++){
		var rotation_tag = elems[0].children[i];
		var angle = this.parser.getAngle(rotation_tag);
		var axis = this.parser.getAxis(rotation_tag);
		switch(axis){
		case "x":
			this.rotationX = angle * Math.PI / 180.0 ;
			break;
		case "y":
			this.rotationY = angle * Math.PI / 180.0 ;
			break;
		case "z":
			this.rotationZ = angle * Math.PI / 180.0 ;
			break;
		default:
			console.log("INITIALS rotation on axis " + axis + "is incorrect");
		}
	}
	var scale_tag =  elems[0].children[5];
	var reference_tag = elems[0].children[6];

	this.near = this.parser.getValue(frustum_tag, "near");
	this.far = this.parser.getValue(frustum_tag, "far");
	this.translation = this.parser.getCoords(translation_tag);
	this.scale = this.parser.getScaleCoords(scale_tag);
	this.axisLength = this.parser.getValue(reference_tag, "length");
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
		var lightsValues = [];
		var light = elems[0].children[i];
		var id = this.parser.getString(light, "id");
		var enable_tag = light.children[0];
		var position_tag = light.children[1];
		var ambient_tag = light.children[2];
		var diffuse_tag = light.children[3];
		var specular_tag = light.children[4];
		lightsValues[0] = this.parser.getBoolean(enable_tag);
		lightsValues[1] = this.parser.getLightPosition(position_tag);
		lightsValues[2] = this.parser.getRGB(ambient_tag);
		lightsValues[3] = this.parser.getRGB(diffuse_tag);
		lightsValues[4] = this.parser.getRGB(specular_tag);
		this.lights[i] = lightsValues;
		console.log("Light with id="+id+ " was processed successfuly.")
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
		var materialInfo = [];
		var material_tag = elems[0].children[i];
		materialInfo[0] = this.parser.getString(material_tag, "id");
		var shiness_tag = material_tag.children[0];
		var specular_tag = material_tag.children[1]
		var diffuse_tag = material_tag.children[2];
		var ambient_tag = material_tag.children[3];
		var emission_tag = material_tag.children[4];
		materialInfo[1] = this.parser.getValue(shiness_tag, "value");
		materialInfo[2] = this.parser.getRGB(specular_tag);
		materialInfo[3] = this.parser.getRGB(diffuse_tag);
		materialInfo[4] = this.parser.getRGB(ambient_tag);
		materialInfo[5] = this.parser.getRGB(emission_tag);
		this.materials[i] = materialInfo;
	}
}
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems =  rootElement.getElementsByTagName('LEAVES');
	if (elems == null) {
		return  "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'MATERIALS' element found.";
	}

	this.rectangle = this.parser.getPrimitiveArgs(elems[0].children[0]);
	this.cylinder = this.parser.getPrimitiveArgs(elems[0].children[1]);
	this.sphere = this.parser.getPrimitiveArgs(elems[0].children[2]);
	this.triangle = this.parser.getPrimitiveArgs(elems[0].children[3]);
}
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


