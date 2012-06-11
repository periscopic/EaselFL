/* TEST */package display;

import flash.display.Graphics;
import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.display.LineScaleMode;
import flash.geom.Point;
import display.Control;

typedef CubicBezier = {
	a1:Point,
	c1:Point,
	c2:Point,
	a2:Point
}

typedef CubicPair = {
	a:CubicBezier,
	b:CubicBezier
}

class GraphicsFl implements IExec{
	
	inline static var QUART_PI:Float = Math.PI*0.25;
	inline static var CUBIC_PRECISION:Float = 1;
	static var recurseCount:Int = 0;

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
	inline static private function cubicCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		//Flash11 version
		#if flash11
		target.graphics.cubicCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
		#else
			var bz:CubicBezier = 				
				{ 	
					a1:new Point(target.curX, target.curY),
					c1:new Point(pts[0], pts[1]),
					c2:new Point(pts[2], pts[3]),
					a2:new Point(pts[4], pts[5])
				};
				
			drawCubicApprox(target, bz, CUBIC_PRECISION, 8);

		#end

      	target.curX = pts[4];
      	target.curY = pts[5];
	}
	
	// TODO : fix crash when 3 of points are co-linear
	
	static function drawCubicApprox(target:GraphicsFl, bz:CubicBezier, tolerance:Float, recurseCount:Int) {
		//points are equal
		if(bz.a1.x == bz.a2.x && bz.a1.y == bz.a2.y && bz.a1.x == bz.c1.x && bz.a1.y == bz.c1.y  && bz.a1.x == bz.c2.x && bz.a1.y == bz.c2.y){			
			return;
		}
		
		// find intersection between bezier arms
		var s:Point = intersectLines(bz.a1.x, bz.a1.y, bz.c1.x, bz.c1.y, bz.c2.x, bz.c2.y, bz.a2.x, bz.a2.y);
		
		var dx:Float;
		var dy:Float;
		
	
		
			/*if(s==null){
				
				return;
			}else{*/
			
			// find distance between the midpoints
				dx = (bz.a1.x + bz.a2.x + s.x * 4 - (bz.c1.x + bz.c2.x) * 3) * .125;
				dy = (bz.a1.y + bz.a2.y + s.y * 4 - (bz.c1.y + bz.c2.y) * 3) * .125;
			
				// split curve if the quadratic isn't close enough
				if (recurseCount<1 || dx*dx + dy*dy > tolerance) {
					
						
					
					var halves = cubicBezierSplit(bz);
					// recursive call to subdivide curve
					drawCubicApprox(target, halves.a, tolerance, recurseCount-1);//this.$cBez (a,     b0.b, b0.c, b0.d, k);
					drawCubicApprox(target, halves.b, tolerance, recurseCount-1);//this.$cBez (b1.a,  b1.b, b1.c, d,    k);
					
						
					
				} else {
					// end recursion by drawing quadratic bezier
					if(recurseCount>1){
						target.graphics.curveTo (s.x, s.y, bz.a2.x, bz.a2.y);
						//target.graphics.drawCircle(bz.a2.x, bz.a2.y, 1);
						
					}
				}
			//}
		
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
		
	/*static function intersectLines (x1:Float, y1:Float, x2:Float, y2:Float, x3:Float, y3:Float, x4:Float, y4:Float):Point {
	  var m1 : Float =(y2 - y1) / (x2 - x1);
	  var m3 : Float = (y4 - y3) / (x4 - x3);
	  
	   if(m1==m3){
		   	if((y4-y1)/(x4-x1) == m1) {
		   		//same line
		   		return new Point(x1, y1);
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
	   
	   return new Point(xInt,yInt);
	}*/	
	
	static function intersectLines(x1:Float, y1:Float, x2:Float, y2:Float, x3:Float, y3:Float, x4:Float, y4:Float):Point {

		var dx1 = x2 - x1;
		var dx2 = x3 - x4;
		
		if (dx1==0 && dx2==0) return null;
		
		var m1 = (y2 - y1) / dx1;
		var m2 = (y3 - y4) / dx2;
		
		if (dx1==0) {
			// infinity
			return new Point(x1, m2 * (x1 - x4) + y4);
	
		} else if (dx2==0) {
			// infinity
			return new Point(x4, m1 * (x4 - x1) + y1);
		}
		var xInt = (-m2 * x4 + y4 + m1 * x1 - y1) / (m1 - m2);
		var yInt = m1 * (xInt - x1) + y1;
		return new Point(xInt, yInt);
	}
	
	
	

	inline static function midpoint(a:Point, b:Point):Point {
		return Point.interpolate(a, b, 0.5);
	}

	inline static function cubicBezierSplit(bz:CubicBezier):CubicPair {
	
		var p01 = midpoint (bz.a1, bz.c1);
		var p12 = midpoint (bz.c1, bz.c2);
		var p23 = midpoint (bz.c2, bz.a2);
		var p02 = midpoint (p01, p12);
		var p13 = midpoint (p12, p23);
		var p03 = midpoint (p02, p13);
		
		return {
			a:{a1:bz.a1,  c1:p01, c2:p02, a2:p03},
			b:{a1:p03, c1:p13, c2:p23, a2:bz.a2 }  
		};
	}
	
}
