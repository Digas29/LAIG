function Light(){
	this.id;
	this.enable;
	this.position;
	this.ambient;
	this.diffuse;
	this.specular;
}
function Coords(){

}
function RGB(){
	this.r;
	this.g;
	this.b;
	this.a;
}

function Material(){
	this.id;
	this.shininess;
	this.ambient;
	this.diffuse;
	this.specular;
	this.emission;
}
function Primitive(){
	this.id;
	this.type;
	this.args = [];
}
