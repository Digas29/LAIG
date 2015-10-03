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
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


