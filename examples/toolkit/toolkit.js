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
	this.instance_1 = new lib.mc();
	this.instance_1.setTransform(176,236.5,1,1,0,0,0,50,50);

	this.addChild(this.instance_1,this.shape_2,this.shape_1,this.shape,this.instance,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(126,53.2,429,233.3);


// symbols:
(lib.createjs = function() {
	this.initialize(img.createjs);
}).prototype = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


(lib.imgContainer = function() {
	this.initialize();

	// Layer 1
	this.instance = new lib.createjs();

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);


(lib.container = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AMijTQAABLgyA0QgxA1hHAAQhGAAgyg1Qgyg0AAhLQAAhKAyg1QAyg1BGAAQBHAAAxA1QAyA1AABKIAAAAAAHicIsoAAIAAiMIMoAAIAACMACwgfIBVEFIjfCiIjdiiIBVkFIESAA").cp();
	this.shape.setTransform(-28.7,51.7);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-108.9,12.5,160.5,78.4);


(lib.mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{},true);

	// Layer 1
	this.imgContainer = new lib.imgContainer();
	this.imgContainer.setTransform(50,50,1,1,0,0,0,50,50);

	this.timeline.addTween(cjs.Tween.get(this.imgContainer).wait(1).to({y:51.8},0).wait(1).to({y:53.6},0).wait(1).to({y:55.4},0).wait(1).to({y:57.1},0).wait(1).to({y:58.9},0).wait(1).to({y:60.6},0).wait(1).to({y:62.3},0).wait(1).to({y:64},0).wait(1).to({y:65.7},0).wait(1).to({y:67.4},0).wait(1).to({y:69.1},0).wait(1).to({y:70.8},0).wait(1).to({y:72.4},0).wait(1).to({y:74},0).wait(1).to({y:75.6},0).wait(1).to({y:77.2},0).wait(1).to({y:78.8},0).wait(1).to({y:80.4},0).wait(1).to({y:82},0).wait(1).to({y:83.5},0).wait(1).to({y:85.1},0).wait(1).to({y:86.6},0).wait(1).to({y:88.1},0).wait(1).to({y:89.6},0).wait(1).to({y:91.1},0).wait(1).to({y:92.6},0).wait(1).to({y:94},0).wait(1).to({y:95.5},0).wait(1).to({y:96.9},0).wait(1).to({y:98.3},0).wait(1).to({y:99.7},0).wait(1).to({y:101.1},0).wait(1).to({y:102.5},0).wait(1).to({y:103.9},0).wait(1).to({y:105.2},0).wait(1).to({y:106.6},0).wait(1).to({y:107.9},0).wait(1).to({y:109.2},0).wait(1).to({y:110.5},0).wait(1).to({y:111.8},0).wait(1).to({y:113.1},0).wait(1).to({y:114.3},0).wait(1).to({y:115.6},0).wait(1).to({y:116.8},0).wait(1).to({y:118},0).wait(1).to({y:119.2},0).wait(1).to({y:120.4},0).wait(1).to({y:121.6},0).wait(1).to({y:122.8},0).wait(1).to({y:123.9},0).wait(1).to({y:125.1},0).wait(1).to({y:126.2},0).wait(1).to({y:127.3},0).wait(1).to({y:128.4},0).wait(1).to({y:129.5},0).wait(1).to({y:130.6},0).wait(1).to({y:131.6},0).wait(1).to({y:132.7},0).wait(1).to({y:133.7},0).wait(1).to({y:134.7},0).wait(1).to({y:133.3},0).wait(1).to({y:131.2},0).wait(1).to({y:129},0).wait(1).to({y:126.9},0).wait(1).to({y:124.8},0).wait(1).to({y:122.7},0).wait(1).to({y:120.7},0).wait(1).to({y:118.7},0).wait(1).to({y:116.7},0).wait(1).to({y:114.8},0).wait(1).to({y:112.9},0).wait(1).to({y:111},0).wait(1).to({y:109.1},0).wait(1).to({y:107.3},0).wait(1).to({y:105.5},0).wait(1).to({y:103.7},0).wait(1).to({y:101.9},0).wait(1).to({y:100.2},0).wait(1).to({y:98.5},0).wait(1).to({y:96.9},0).wait(1).to({y:95.2},0).wait(1).to({y:93.6},0).wait(1).to({y:92.1},0).wait(1).to({y:90.5},0).wait(1).to({y:89},0).wait(1).to({y:87.5},0).wait(1).to({y:86.1},0).wait(1).to({y:84.6},0).wait(1).to({y:83.2},0).wait(1).to({y:81.9},0).wait(1).to({y:80.5},0).wait(1).to({y:79.2},0).wait(1).to({y:77.9},0).wait(1).to({y:76.7},0).wait(1).to({y:75.5},0).wait(1).to({y:74.3},0).wait(1).to({y:73.1},0).wait(1).to({y:71.9},0).wait(1).to({y:70.8},0).wait(1).to({y:69.8},0).wait(1).to({y:68.7},0).wait(1).to({y:67.7},0).wait(1).to({y:66.7},0).wait(1).to({y:65.7},0).wait(1).to({y:64.8},0).wait(1).to({y:63.9},0).wait(1).to({y:63},0).wait(1).to({y:62.1},0).wait(1).to({y:61.3},0).wait(1).to({y:60.5},0).wait(1).to({y:59.8},0).wait(1).to({y:59},0).wait(1).to({y:58.3},0).wait(1).to({y:57.6},0).wait(1).to({y:57},0).wait(1).to({y:56.4},0).wait(1).to({y:55.8},0).wait(1).to({y:55.2},0).wait(1).to({y:54.7},0).wait(1).to({y:54.2},0).wait(1).to({y:53.7},0).wait(1).to({y:53.2},0).wait(1).to({y:52.8},0).wait(1).to({y:52.4},0).wait(1).to({y:52.1},0).wait(1).to({y:51.7},0).wait(1).to({y:51.4},0).wait(1).to({y:51.2},0).wait(1).to({y:50.9},0).wait(1).to({y:50.7},0).wait(1).to({y:50.5},0).wait(1).to({y:50.4},0).wait(1).to({y:50.2},0).wait(1).to({y:50.1},0).wait(1).wait(1).to({y:50},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,100,100);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;