(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.toolkit = function() {
	this.initialize();

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AEEAoQAABXg2BbQgyBUhXBJQhUBHhjAoQhmAshdAAQCvh8BBhrQA8hjAAiMQAAh4ByjAQBciaBxh7QgZCDgLB8QgOCSAACoIAAAA").cp();
	this.shape.setTransform(215.5,233.5);

	// Layer 1
	this.instance = new lib.createjs();
	this.instance.setTransform(205,165);

	this.addChild(this.instance,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(184.5,165,120.5,121.5);


// symbols:
(lib.createjs = function() {
	this.initialize(img.createjs);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;