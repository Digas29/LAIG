function LSXParser(){
}
LSXParser.prototype.getValue=function(tag, nameItem){
	return tag.attributes.getNamedItem(nameItem).value;
}
LSXParser.prototype.getRGB=function(tag){
	var RGB = [];
	RGB[0] = this.getValue(tag, "r");
	RGB[1] = this.getValue(tag, "g");
	RGB[2] = this.getValue(tag, "b");
	RGB[3] = this.getValue(tag, "a");
	return RGB;
}