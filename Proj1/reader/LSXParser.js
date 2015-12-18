function LSXParser(){
}
/*
* Extract property integer or float from a tag
* @param {string} tag with information
* @param {string} property to be extracted
*/
LSXParser.prototype.getValue = function(tag, nameItem){
	for(var i = 0 ;  i < tag.attributes.length; i++){
		if(tag.attributes[i].name == nameItem){
			return parseFloat(tag.attributes[i].value);
		}
	}
	return undefined;
}
/*
* Extract property string from a tag
* @param {string} tag with information
* @param {string} property to be extracted
*/
LSXParser.prototype.getString = function(tag, nameItem){
	for(var i = 0 ;  i < tag.attributes.length; i++){
		if(tag.attributes[i].name == nameItem){
			return tag.attributes[i].value;
		}
	}
	return undefined;
}
/*
* Extract property boolean from a tag
* @param {string} tag with information
*/
LSXParser.prototype.getBoolean = function(tag){
	 var value = this.getValue(tag,"value");
	 if(value == 1.0){
	 	return true;
	 }
	 else if (value == 1.0){
	 	return false;
	 }
	 else{
		 return undefined;
	 }
}
/*
* Extract rgb info from a tag
* @param {string} tag with information
* @return {object} object with rgb info
*/
LSXParser.prototype.getRGB = function(tag){
	var rgb = {
		r : this.getValue(tag, "r"),
		g : this.getValue(tag, "g"),
		b : this.getValue(tag, "b"),
		a : this.getValue(tag, "a")
	};
	return rgb;
}
/*
* Extract coordinates info from a tag
* @param {string} tag with information
* @return {object} object with coordinates info
*/
LSXParser.prototype.getCoords = function(tag){
	var coords = {
		x: this.getValue(tag, "x"),
		y: this.getValue(tag, "y"),
		z: this.getValue(tag, "z")
	};
	return coords;
}
/*
* Extract axis info from a tag
* @param {string} tag with information
* @return {string} axis
*/
LSXParser.prototype.getAxis = function(tag){
	return this.getString(tag, "axis");
}
/*
* Extract angle info from a tag
* @param {string} tag with information
* @return {float} angle
*/
LSXParser.prototype.getAngle = function(tag){
	return (this.getValue(tag, "angle") * Math.PI / 180.0);
}
/*
* Extract scale coordinates info from a tag
* @param {string} tag with information
* @return {object} object with scale coordinates info
*/
LSXParser.prototype.getScaleCoords = function(tag){
	var coords = {
		x: this.getValue(tag, "sx"),
		y: this.getValue(tag, "sy"),
		z: this.getValue(tag, "sz")
	};
	return coords;
}
/*
* Extract light position info from a tag
* @param {string} tag with information
* @return {object} object with light position info
*/
LSXParser.prototype.getLightPosition = function(tag){
	var coords = this.getCoords(tag);
	var position ={
		x: coords.x,
		y: coords.y,
		z: coords.z,
		w: this.getValue(tag, "w")
	};
	return position;
}
/*
* Extract leave info from a tag
* @param {string} tag with information
* @return {object} object with leave info
*/
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
/*
* Extract node info from a tag
* @param {string} tag with information
* @return {object} object with node info
*/
LSXParser.prototype.getNode = function(tag){

	var matrix = mat4.create();
	mat4.identity(matrix);
	var i = 2;
	while(tag.children[i].tagName != 'DESCENDANTS'){
		switch(tag.children[i].tagName){
		case 'TRANSLATION':
			var translation = this.getCoords(tag.children[i]);
			mat4.translate(matrix, matrix, [translation.x,translation.y, translation.z]);
			break;
		case 'SCALE':
			var scale = this.getScaleCoords(tag.children[i]);
			mat4.scale(matrix, matrix, [scale.x,scale.y, scale.z]);
			break;
		case 'ROTATION':
			var axis = this.getAxis(tag.children[i]);
			var angle = this.getAngle(tag.children[i]);
			if(axis == "x"){
				mat4.rotate(matrix, matrix, angle, [1,0,0]);
			}
			else if(axis == "y"){
				mat4.rotate(matrix, matrix, angle, [0,1,0]);
			}
			else if(axis == "z"){
				mat4.rotate(matrix, matrix, angle, [0,0,1]);
			}
			break;
		default:
			break;
		}
		i++;
	}

	var descendantTag = tag.children[i];
	var descendants = [];
	for(var j = 0; j < descendantTag.children.length; j++){
		descendants[j] = this.getString(descendantTag.children[j], "id");
	};

	var node = {
		id: this.getString(tag, "id"),
		material: this.getString(tag.children[0], "id"),
		texture: this.getString(tag.children[1], "id"),
		transformations: matrix,
		descendants: descendants
	};
	return node;
}
