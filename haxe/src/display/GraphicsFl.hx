/* TEST */package display;

import flash.display.Graphics;
import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.display.LineScaleMode;
import display.Control;

class GraphicsFl implements IExec{
	
	inline static var QUART_PI:Float = Math.PI*0.25;
	inline static var CUBIC_SAMPLES:Int = 4;

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		execs.set('f', beginFill );		
		execs.set('ef', endFill );		
		execs.set('mt', moveTo );		
		execs.set('lt', lineTo );		
		execs.set('bt', cubicCurveTo );		
		execs.set('qt', quadraticCurveTo );		
		execs.set('dr', drawRect );		// or is it 'r'
		execs.set('rr', drawRoundRect );		
		execs.set('rc', drawRoundRectComplex );		
		execs.set('arc', drawArc );		
		execs.set('dc', drawCircle );		
		execs.set('de', drawEllipse );		
		execs.set('c', clear );		
		execs.set('ss', setStrokeStyle);
		execs.set('bs', beginStroke);
		execs.set('bbs', beginBitmapStroke);
		execs.set('es', endStroke);
	}

	//TODO : arc, arcTo
	//TODO : bezierTo (cubic)
	//TODO : clearPath
	//TODO : begin linearGradientFill, radialGradientFill, bitmapFill
	//TODO : beginLinearGradientStroke, beginRadialGradientStroke
	//TODO : endStroke
	//TODO : drawPolystar


	inline static private function beginFill(target:GraphicsFl, color:String):Void{
		var col = CSSColor.parse(color);
		target.graphics.beginFill(col.color, col.alpha);
	}
	
	inline static private function setStrokeStyle(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO map : caps, joints, miterLimit
		target.strokeThickness = args[0];
	}
	
	inline static private function beginStroke(target:GraphicsFl, color:String):Void{
		var col = CSSColor.parse(color);
		target.graphics.lineStyle(target.strokeThickness, col.color, col.alpha, false, LineScaleMode.NONE);//, pixelHinting, scaleMode, caps, joints, miterLimit)
	}
	
	inline static private function beginBitmapStroke(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO : handle repeat-x, repeat-y
		var img = Control.bitmapDatas.get(args[0]);		
		target.graphics.lineBitmapStyle(img.bitmapData, null, args[1]!='no-repeat', false);
	}
	
	inline static private function endStroke(target:GraphicsFl, ?nada:Dynamic):Void{
		target.graphics.lineStyle();
	}
	
	inline static private function endFill(target:GraphicsFl, ?nada:Dynamic):Void{
		target.graphics.endFill();
	}
	
	inline static private function moveTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.curX = xy[0];
		target.curY = xy[1];
		target.graphics.moveTo(xy[0], xy[1]);
	}
	
	inline static private function lineTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.curX = xy[0];
		target.curY = xy[1];
		target.graphics.lineTo(xy[0], xy[1]);
	}
	
	//-- Native version of cubicCurveTo not implemented until Flash11. 
	//-- Implement approximation using Quadratic bezier segments
	static private function cubicCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		//Flash11 version
		#if flash11
		target.graphics.cubicCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
		#else
		
		//Flash9 version
		//TODO : test accuracy and recurse if not precise enough
		var startX:Float = target.curX;
		var startY:Float = target.curY;
		var t:Float;
		var it:Float;
		var tri1X:Float;
		var tri1Y:Float;
		var tri2X:Float;
		var tri2Y:Float;
		var tri3X:Float;
		var tri3Y:Float;
		var l1X:Float;
		var l1Y:Float;
		var l2X:Float;
		var l2Y:Float;
		
		t = 1/CUBIC_SAMPLES;
		it = 1-t;
		
		var a1X:Float = startX;
		var a1Y:Float = startY;
		var c1X:Float = startX*it + pts[0]*t;
		var c1Y:Float = startY*it + pts[1]*t; 
		var c2X:Float;
		var c2Y:Float;
		var a2X:Float;
		var a2Y:Float;
		var pt:Dynamic;
		
		
		
		for(i in 1...(CUBIC_SAMPLES+1)) {
			t = i/CUBIC_SAMPLES;
			it = 1-t;
			
			//-- Quadratic cage
			tri1X = startX*it + pts[0]*t;
	      	tri1Y = startY*it + pts[1]*t;      		
	      	tri2X = pts[0]*it + pts[2]*t;
	      	tri2Y = pts[1]*it + pts[3]*t;
	      	tri3X = pts[2]*it + pts[4]*t;
	      	tri3Y = pts[3]*it + pts[5]*t;
	      		
	      	//-- Linear cage
	      	l1X = tri1X*it+tri2X*t;
	      	l1Y = tri1Y*it+tri2Y*t;
	      	l2X = tri2X*it+tri3X*t;
	      	l2Y = tri2Y*it+tri3Y*t;
		
			//-- Second control point and anchor point for this segment
			c2X = l1X;
			c2Y = l1Y;
			a2X = l1X*it+l2X*t;
			a2Y = l1Y*it+l2Y*t; 
		
			//-- Intersection of handle segments (used for quadratic control point)
			pt = intersectLines(a1X, a1Y, c1X, c1Y, c2X, c2Y, a2X, a2Y);
			
			//-- if segment uses parallel handles, call recursively using this segment.
			//-- this will only occur if the initial handles intersect, so there will
			//-- only be 1 level of recursion
			if(pt==null) {
				target.curX = a1X;
      			target.curY = a1Y;
				if(i==1){
					cubicCurveTo(target, [c1X, c1Y, c2X, c2Y, a2X, a2Y]);
				}else{
					//-- first control point must be mirrored around anchor in all but first segment
					cubicCurveTo(target, [2*a1X - c1X, 2*a1Y - c1Y, c2X, c2Y, a2X, a2Y]);
				}
			}else{
				//-- Draw the approximated Quad curve
				target.graphics.curveTo(pt.x, pt.y, a2X, a2Y);
			}
			
			a1X = a2X;
			a1Y = a2Y;
			c1X = c2X;
			c1Y = c2Y;
		}

		#end

      	target.curX = pts[4];
      	target.curY = pts[5];
	}
	
	inline static private function quadraticCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		target.curX = pts[2];
		target.curY = pts[3];
		target.graphics.curveTo(pts[0], pts[1], pts[2], pts[3]);
	}
	
	inline static private function drawRect(target:GraphicsFl, rct:Array<Dynamic>):Void{
		//-- Does this change current XY position?
		target.graphics.drawRect(rct[0], rct[1], rct[2], rct[3]);
	}
	
	inline static private function clear(target:GraphicsFl, ?nada:Dynamic):Void{
		target.curX = 0;
		target.curY = 0;
		target.graphics.clear();
	}
	
	inline static private function drawRoundRect(target:GraphicsFl, rect:Dynamic):Void{
		target.graphics.drawRoundRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
	}
	inline static private function drawRoundRectComplex(target:GraphicsFl, rect:Array<Dynamic>):Void{
		target.graphics.drawRoundRectComplex(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5], rect[6], rect[7]);
	}
	
	inline static private function drawCircle(target:GraphicsFl, circ:Array<Dynamic>):Void{
		target.graphics.drawCircle(circ[0], circ[1], circ[2]);
	}
	
	inline static private function drawEllipse(target:GraphicsFl, ell:Array<Dynamic>):Void{
		target.graphics.drawEllipse(ell[0], ell[1], ell[2], ell[3]);
	}
	
	inline static private function drawArc(target:GraphicsFl, args:Array<Dynamic>):Void{
	
		var cx:Float = args[0];
		var cy:Float = args[1];
		var rad:Float = args[2];
		var sAng:Float;
		var eAng:Float;
		var difAng:Float;
		var a1x:Float;
		var a1y:Float;
		var a2x:Float;
		var a2y:Float;
		var ctrl:Dynamic;
		var g:flash.display.Graphics = target.graphics;
		var dir:Int = 1;
		
		sAng = args[3];
		eAng = args[4];
		
		
		if(args.length>5 && args[5]){
			dir = -1;
		}
		
		//-- render using quadratic beziers		
		a2x = Math.cos(sAng) * rad;
		a2y = Math.sin(sAng) * rad;				
		
		target.graphics.lineTo(a2x + cx, a2y + cy);	
		
		
		while(eAng*dir>sAng*dir) {
			a1x = a2x;
			a1y = a2y;
			
			//step forward by max 1/8th of a circle
			sAng +=  Math.min(QUART_PI, Math.abs(eAng - sAng)) * dir;
			
			//-- next anchor point			
			a2x = Math.cos(sAng) * rad;
			a2y = Math.sin(sAng) * rad;
			
			//find intersection between tangents
			ctrl = intersectLines(a1x, a1y, a1x-a1y, a1y+a1x, a2x, a2y, a2x-a2y, a2y+a2x);
			g.curveTo(ctrl.x + cx, ctrl.y + cy, a2x + cx, a2y + cy);
		}
		
		target.curX = a2x+cx;
		target.curY = a2y+cy;		
	}

	

	/**** Instance variable and methods ****/
	
	private var graphics:Graphics;
	private var strokeThickness:Float;
	//-- The current position of the drawing head
	private var curX:Float;
	private var curY:Float;

	public function new(){
		curX = 0;
		curY = 0;	
	}
	
	inline public function link(g:Graphics):Void{
		this.graphics = g;
		strokeThickness = 1;
	}
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method command mapped to "'+method+'" in GraphicsFl';	
			}
		#end
	}
	
	/** Geometric utils **/
		
	static function intersectLines (x1:Float, y1:Float, x2:Float, y2:Float, x3:Float, y3:Float, x4:Float, y4:Float):Dynamic {
	  var m1 : Float =(y2 - y1) / (x2 - x1);
	  var m3 : Float = (y4 - y3) / (x4 - x3);
	  
	   if(m1==m3){
		   	if((y4-y1)/(x4-x1) == m1) {
		   		//same line
		   		return {x:x1, y:y1}
		   	}
			//parallel lines
		   	return null;
	   }

	   var xInt:Float;
	   
	   if(x1==x2){
	   	xInt = x1;
	   }else if(x3==x4){
	   	xInt = x3;
	   }else {
	   	xInt = (y3 - y1 - m3 * x3 + m1 * x1) / (m1 - m3);
	   }
	   
	   //intercept on more horizontal slope for greater precision
	   var yInt:Float = Math.abs(m3) < Math.abs(m1) ? m3 * (xInt - x3) + y3 : m1 * (xInt - x1) + y1;
	   
	   return { x:xInt,y:yInt };
	}
	

	
}
