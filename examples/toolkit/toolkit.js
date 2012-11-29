(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.toolkit = function() {
	this.initialize();

	// Layer 2
	this.text = new cjs.Text("TEXT", "44px Verdana", "#0066FF");
	this.text.lineHeight = 46;
	this.text.lineWidth = 205;
	this.text.setTransform(346,93);

	this.instance = new lib.container();
	this.instance.setTransform(266,96,0.3,0.997,35.8,0,0,-21.3,46.5);

	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#FFFFFF","#000000"],[0,1],-30.9,0,31,0).s().p("AEEAoQAABXg2BbQgyBUhXBJQhUBHhjAoQhnAshcAAQCvh8BBhrQA8hjAAiMQAAh4ByjAQBbiaByh7QgZCDgLB8QgOCSAACoIAAAA").cp();
	this.shape.setTransform(310.5,233.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#FF0000","#000000"],[0,1],0,0,0,0,0,61.4).s().p("AEEAoQAABXg2BbQgyBUhXBJQhUBHhjAoQhnAshcAAQCvh8BBhrQA8hjAAiMQAAh4ByjAQBbiaByh7QgZCDgLB8QgOCSAACoIAAAA").cp();
	this.shape_1.setTransform(357.5,233.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AEEAoQAABXg2BbQgyBUhXBJQhUBHhjAoQhmAshdAAQCvh8BBhrQA8hjAAiMQAAh4ByjAQBbiaByh7QgZCDgLB8QgOCSAACoIAAAA").cp();
	this.shape_2.setTransform(272.5,233.5);

	// Layer 1
	this.instance_1 = new lib.createjs();
	this.instance_1.setTransform(126,186.5);

	this.addChild(this.instance_1,this.shape_2,this.shape_1,this.shape,this.instance,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(126,52.5,429,234);


// symbols:
(lib.createjs = function() {
	this.initialize(img.createjs);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


(lib.container = function() {
	this.initialize();

	// Layer 1
	this.text = new cjs.Text("TXT", "44px Verdana", "#0066FF");
	this.text.lineHeight = 46;
	this.text.lineWidth = 191;
	this.text.setTransform(-112.9,58.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AMijTQAABLgyA0QgxA1hHAAQhGAAgyg1Qgyg0AAhLQAAhKAyg1QAyg1BGAAQBHAAAxA1QAyA1AABKIAAAAAAHicIsoAAIAAiMIMoAAIAACMACwgfIBVEFIjfCiIjdiiIBVkFIESAA").cp();
	this.shape.setTransform(-28.7,51.7);

	this.addChild(this.shape,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-112.9,12.5,195,103.1);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;