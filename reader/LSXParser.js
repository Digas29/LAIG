function LSXParser(){
}

LSXParser.prototype.getValue = function(tag, nameItem){
	return parseFloat(tag.attributes.getNamedItem(nameItem).value);
}
LSXParser.prototype.getString = function(tag, nameItem){
	return tag.attributes.getNamedItem(nameItem).value;
}
LSXParser.prototype.getRGB = function(tag){
	var RGB = [];
	RGB[0] = this.getValue(tag, "r");
	RGB[1] = this.getValue(tag, "g");
	RGB[2] = this.getValue(tag, "b");
	RGB[3] = this.getValue(tag, "a");
	return RGB;
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
	return this.getValue(tag, "angle");
}
LSXParser.prototype.getScaleCoords = function(tag){
	var coords = [];
	coords[0] = this.getValue(tag, "sx");
	coords[1] = this.getValue(tag, "sy");
	coords[2] = this.getValue(tag, "sz");
	return coords;
}