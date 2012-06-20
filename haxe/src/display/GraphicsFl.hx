/* TEST */package display;

import flash.display.Graphics;
import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.display.LineScaleMode;
import flash.events.Event;
import flash.geom.Point;
import display.Control;
import utils.Geometry;

typedef Command = {
	method : String,
	arguments : Dynamic
}

class GraphicsFl implements IExec{
	
	inline static var QUART_PI:Float = Math.PI*0.25;
	inline static var CUBIC_PRECISION:Float = 1;

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		execs.set('f', beginFill );		
		execs.set('bf', beginBitmapFill );		
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
		execs.set('s', beginStroke);
		execs.set('bs', beginBitmapStroke);
		execs.set('es', endStroke);
	}

	//TODO : arcTo
	//TODO : clearPath
	//TODO : beginLinearGradientFill, radialGradientFill
	//TODO : beginLinearGradientStroke, beginRadialGradientStroke
	//TODO : drawPolystar


	inline static private function beginFill(target:GraphicsFl, color:String):Void{
		var col = CSSColor.parse(color);
		target.graphics.beginFill(col.color, col.alpha);
	}
	
	inline static private function beginBitmapFill(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO : handle repeat-x, repeat-y
		var img = Control.bitmapDatas.get(args[0]);	
		//target.graphics.beginBitmapFill(img.bitmapData, new flash.geom.Matrix(), args[1]!='no-repeat', false);
		target.graphics.beginBitmapFill(img.bitmapData, new flash.geom.Matrix(), args[1]!='no-repeat', false);
		watchBitmapData(target, img);
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
		target.graphics.lineStyle(target.strokeThickness);	
		target.graphics.lineBitmapStyle(img.bitmapData, null, args[1]!='no-repeat', false);
		watchBitmapData(target, img);
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
	
	
	inline static private function cubicCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		//-- Flash11 version
		#if flash11
		target.graphics.cubicCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
		
		#else
		//-- Flash9 version, uses approximation since native not available until 11	
		var bz:CubicBezier = 				
			{ 	
				a1:new Point(target.curX, target.curY),
				c1:new Point(pts[0], pts[1]),
				c2:new Point(pts[2], pts[3]),
				a2:new Point(pts[4], pts[5])
			};
			
		drawCubicApprox(target, bz, CUBIC_PRECISION, 7);
			
		#end

      	target.curX = pts[4];
      	target.curY = pts[5];
	}
		
	/** 
	 * Approximation of Cubic bezier using Quadratic bezier segments	
	 */
	static function drawCubicApprox(target:GraphicsFl, bz:CubicBezier, tolerance:Float, recurseCount:Int) {
		//-- are points equal
		if(bz.a1.x == bz.a2.x && bz.a1.y == bz.a2.y && bz.a1.x == bz.c1.x && bz.a1.y == bz.c1.y  && bz.a1.x == bz.c2.x && bz.a1.y == bz.c2.y){			
			return;
		}
		
		//-- find intersection between bezier arms
		var s:Point = Geometry.intersectLines(bz.a1.x, bz.a1.y, bz.c1.x, bz.c1.y, bz.c2.x, bz.c2.y, bz.a2.x, bz.a2.y);
		
		var dx:Float;
		var dy:Float;
		var dist:Float;

		//-- find distance between the midpoints
		dx = (bz.a1.x + bz.a2.x + s.x * 4 - (bz.c1.x + bz.c2.x) * 3) * .125;
		dy = (bz.a1.y + bz.a2.y + s.y * 4 - (bz.c1.y + bz.c2.y) * 3) * .125;
		dist = dx*dx + dy*dy;
		
		if(dist<tolerance) {
			//-- good enough to draw
			target.graphics.curveTo (s.x, s.y, bz.a2.x, bz.a2.y);
		} else if(recurseCount>0) {
			var halves = Geometry.cubicBezierSplit(bz);
			//-- recursive call to subdivide curve
			//-- if the quadratic isn't close enough
			drawCubicApprox(target, halves.a, tolerance, recurseCount-1);
			drawCubicApprox(target, halves.b, tolerance, recurseCount-1);
		} else {
			//-- give up and draw a straight line for this segment
			//-- this avoids gross errors when handles are nearly parallel
			target.graphics.lineTo( bz.a2.x, bz.a2.y);	
		}
	}

	
	inline static private function quadraticCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		target.graphics.curveTo(pts[0], pts[1], pts[2], pts[3]);
		target.curX = pts[2];
		target.curY = pts[3];
	}
	
	inline static private function drawRect(target:GraphicsFl, rct:Array<Dynamic>):Void{
		//-- TODO : check if this should change current XY position
		target.graphics.drawRect(rct[0], rct[1], rct[2], rct[3]);
	}
	
	inline static private function clear(target:GraphicsFl, ?nada:Dynamic):Void{
		target.curX = 0;
		target.curY = 0;
		target.graphics.clear();
		
		//-- Clear redraw serialization
		
		//-- Empty commands
		target.commands = [];
		//-- Stop listening for redraws
		var bmpds = target.bitmapDatas;
		while(bmpds!=null && bmpds.length>0) {
			bmpds.pop().dispatcher.removeEventListener(Event.COMPLETE, target.handleRedraw, false);
		}		
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
			ctrl = Geometry.intersectLines(a1x, a1y, a1x-a1y, a1y+a1x, a2x, a2y, a2x-a2y, a2y+a2x);
			g.curveTo(ctrl.x + cx, ctrl.y + cy, a2x + cx, a2y + cy);
		}
		
		target.curX = a2x+cx;
		target.curY = a2y+cy;		
	}
	
	
	/**
	 * Watch an IBitmapData for change, so that a redraw can be triggered.
	 */
	inline static private function watchBitmapData(target:GraphicsFl, bmpd:IBitmapData):Void {
		if(target.bitmapDatas==null){
			target.bitmapDatas = [];
		}
		target.bitmapDatas.push(bmpd);
		bmpd.dispatcher.addEventListener(Event.COMPLETE, target.handleRedraw, false, 0, true);
	}
	
	
	/**** Instance variable and methods ****/
	
	private var graphics:Graphics;
	private var strokeThickness:Float;
	
	//-- The current position of the drawing head
	private var curX:Float;
	private var curY:Float;
	
	//-- serialized commands
	private var commands:Array<Dynamic>;
	private var bitmapDatas:Array<IBitmapData>;

	public function new(){
		curX = 0;
		curY = 0;	
		commands = [];
	}
	
	inline public function link(g:Graphics):Void{
		this.graphics = g;
		strokeThickness = 1;
	}
	
	/**
	 * Redraw when an IBitmapData on which this is dependant
	 * has changed.
	 */
	private function handleRedraw(e:Dynamic):Void {
		this.graphics.clear();
		for(cmd in commands) {
			execs.get(cmd.method)(this, cmd.arguments);
		}
	}
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		commands.push({method:method, arguments:arguments});
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in GraphicsFl';	
			}
		#end
	}
}
