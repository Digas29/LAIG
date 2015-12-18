function Light(){
	this.id;
	this.enable;
	this.position;
	this.ambient;
	this.diffuse;
	this.specular;
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
function Initials(){
	this.frustumNear;
	this.frustumFar;
	this.transformationMatrix;
	this.axisLength;
}

function TextureInfo(){
	this.path;
	this.id;
	this.ampS;
	this.ampT;
}
