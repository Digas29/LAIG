function LSXParser(){
}

LSXParser.prototype.getValue = function(tag, nameItem){
	return parseFloat(tag.attributes.getNamedItem(nameItem).value);
}
LSXParser.prototype.getString = function(tag, nameItem){
	return tag.attributes.getNamedItem(nameItem).value;
}
LSXParser.prototype.getBoolean = function(tag){
	 var value = this.getValue(tag,"value");
	 if(value == 1.0){
	 	return true;
	 }
	 else{
	 	return false;
	 }
}
LSXParser.prototype.getRGB = function(tag){
	var rgb = new RGB();
	rgb.r = this.getValue(tag, "r");
	rgb.g = this.getValue(tag, "g");
	rgb.b = this.getValue(tag, "b");
	rgb.a = this.getValue(tag, "a");
	return rgb;
}

LSXParser.prototype.getCoords = function(tag){
	var coords = [];
	coords[0] = this.getValue(tag, "x");
	coords[1] = this.getValue(tag, "y");
	coords[2] = this.getValue(tag, "z");
	return coords;
}
LSXParser.prototype.getAxis = function(tag){
	return this.getString(tag, "axis");
}
LSXParser.prototype.getAngle = function(tag){
	return (this.getValue(tag, "angle") * Math.PI / 180.0);
}
LSXParser.prototype.getScaleCoords = function(tag){
	var coords = [];
	coords[0] = this.getValue(tag, "sx");
	coords[1] = this.getValue(tag, "sy");
	coords[2] = this.getValue(tag, "sz");
	return coords;
}
LSXParser.prototype.getLightPosition = function(tag){
	var coords = this.getCoords(tag);
	coords[3] = this.getValue(tag,"w");
	return coords;
}
LSXParser.prototype.getPrimitive = function(tag){

	var primitive = new Primitive();

	primitive.id = this.getString(tag, "id");
	primitive.type = this.getString(tag, "type");
	var argsArray = this.getString(tag, "args").match(/[-+]?[0-9]*\.?[0-9]+/g);

	for(var i = 0; i < argsArray.length;i++){
		primitive.args[i] = parseFloat(argsArray[i]);
	}
	return primitive;
}

LSXParser.prototype.getNode = function(tag){
	var node = [];
	node[0] = this.getString(tag, "id");
	var nodeInfo = [];
	nodeInfo[0] = this.getString(tag.children[0], "id");
	nodeInfo[1] = this.getString(tag.children[1], "id");
	var matrix = mat4.create();
	mat4.identity(matrix);
	var i = 2;
	while(tag.children[i].tagName != 'DESCENDANTS'){
		switch(tag.children[i].tagName){
		case 'TRANSLATION':
			var translation = this.getCoords(tag.children[i]);
			mat4.translate(matrix, matrix, [translation[0],translation[1], translation[2]]);
			break;
		case 'SCALE':
			var scale = this.getScaleCoords(tag.children[i]);
			mat4.scale(matrix, matrix, [scale[0],scale[1], scale[2]]);
			break;
		case 'ROTATION':
			var axis = this.getAxis(tag.children[i]);
			var rotation = [];
			rotation[0] = this.getAngle(tag.children[i]);
			rotation[1] = 0;
			rotation[2] = 0;
			rotation[3] = 0;
			if(axis == "x"){
				rotation[1] = 1.0;
			}
			else if(axis == "y"){
				rotation[2] = 1.0;
			}
			else if(axis == "z"){
				rotation[3] = 1.0;
			}
			mat4.rotate(matrix, matrix, rotation[0], [rotation[1],rotation[2], rotation[3]]);
			break;
		default:
			break;
		}
		i++;
	}
	nodeInfo[2] = matrix;

	var descendantTag = tag.children[i];
	var descendants = [];
	for(var j = 0; j < descendantTag.children.length; j++){
		descendants[j] = this.getString(descendantTag.children[j], "id");
	};

	nodeInfo[3] = descendants;
	node[1] = nodeInfo;
	return node;
}
