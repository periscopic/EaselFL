/* TEST */package display;

import flash.display.Graphics;
import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.display.LineScaleMode;
import flash.display.CapsStyle;
import flash.display.JointStyle;
import flash.display.GradientType;
import flash.display.SpreadMethod;
import flash.display.InterpolationMethod;
import flash.events.Event;
import flash.geom.Point;
import flash.geom.Matrix;
import Control;
import utils.Geometry;
import utils.CSSColor;
import interfaces.IExec;
import interfaces.IBitmapData;

typedef Command = {
	method : String,
	arguments : Dynamic
}

class GraphicsFl implements IExec{
	
	inline static var QUART_PI:Float = Math.PI*0.25;
	inline static var HALF_PI:Float = Math.PI*0.5;
	inline static var TWO_PI:Float = Math.PI*2;
	inline static var CUBIC_PRECISION:Float = 1;
	inline static var IDENTITY_MATRIX = new flash.geom.Matrix();

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		execs.set('f', beginFill );		
		execs.set('bf', beginBitmapFill );		
		execs.set('rf', beginRadialGradientFill );	
		execs.set('lf', beginLinearGradientFill );	
		execs.set('ef', endFill );		
		execs.set('mt', moveTo );		
		execs.set('lt', lineTo );		
		execs.set('bt', cubicCurveTo );		
		execs.set('qt', quadraticCurveTo );		
		execs.set('dp', drawPolyStar );
		execs.set('dr', drawRect );
		execs.set('rr', drawRoundRect );		
		execs.set('rc', drawRoundRectComplex );		
		execs.set('a', drawArc );		
		execs.set('at', drawArcTo );		
		execs.set('dc', drawCircle );		
		execs.set('de', drawEllipse );		
		execs.set('c', clear );		
		execs.set('ss', setStrokeStyle);
		execs.set('s', beginStroke);
		execs.set('rs', beginRadialGradientStroke);
		execs.set('ls', beginLinearGradientStroke);
		execs.set('bs', beginBitmapStroke);
		execs.set('es', endStroke);
		execs.set('cp', closePath);
	}

	static private function beginFill(target:GraphicsFl, color:String):Void{
		CSSColor.parse(color);
		target.graphics.beginFill(CSSColor.color, CSSColor.alpha);
		
		target.activePath = false;
		
		//-- these are necessary due to difference in winding rules between canvas/flash
		target.fillMethod = beginFill;
		target.fillArgs = color;
	}
	
	static private function beginBitmapFill(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO : handle repeat-x, repeat-y
		var img = Control.bitmapDatas.get(args[0]);	
		target.graphics.beginBitmapFill(img.bitmapData, IDENTITY_MATRIX, args[1]!='no-repeat', false);
		watchBitmapData(target, img);
		
		target.activePath = false;
		
		//-- these are necessary due to difference in winding rules between canvas/flash
		target.fillMethod = beginBitmapFill;
		target.fillArgs = args;
	}
	
	
	static private function beginRadialGradientFill(target:GraphicsFl, args:Array<Dynamic>):Void{
		applyRadialGradientFillOrStroke(target.graphics.beginGradientFill, args);
		target.activePath = false;
		
		//-- these are necessary due to difference in winding rules between canvas/flash
		target.fillMethod = beginRadialGradientFill;
		target.fillArgs = args;
	}
	
	static private function beginLinearGradientFill(target:GraphicsFl, args:Array<Dynamic>):Void{
		applyLinearGradientFillOrStroke( target.graphics.beginGradientFill, args );
		target.activePath = false;
		
		//-- these are necessary due to difference in winding rules between canvas/flash
		target.fillMethod = beginRadialGradientFill;
		target.fillArgs = args;
	}
	
	inline static private function applyRadialGradientFillOrStroke(method:Dynamic, args:Dynamic) {
		var cssColors:Array<String> = args[0];
		var colors:Array<Int> = [];
		var alphas:Array<Float> = [];
		// copy so that original args are not modified, which causes issues if redraw
		// is forced by bmp load
		var ratios:Array<Float> = args[1].copy();
		var x0:Float = args[2];
		var y0:Float = args[3];
		var r0:Float = args[4];
		var x1:Float = args[5];
		var y1:Float = args[6];
		var r1:Float = args[7];
		var radRatio:Float;
		var invRadRatio:Float;
		var focalPointRatio:Float;
		
		for(colorString in cssColors) {
			CSSColor.parse(colorString);
			colors.push(CSSColor.color);
			alphas.push(CSSColor.alpha);
		}
		
		if(r1<r0) {
			var temp;
			temp = r1;
			r1 = r0;
			r0 = temp;
			temp = x1;
			x1 = x0;
			x0 = temp;
			temp = y1;
			y1 = y0;
			y0 = temp;
			
			for(i in 0...ratios.length) {
				 ratios[i] = (1-ratios[i]);				
			}
			ratios.reverse();
		}
		
		radRatio = r0/r1;
		invRadRatio = 1 - radRatio;
		
		//convert ratios to 0-255
		for(i in 0...ratios.length) {
			ratios[i] = (radRatio + invRadRatio * ratios[i])*255;
		}

		var dx = x0-x1;
		var dy = y0-y1;
		var mtx = new Matrix();
		mtx.createGradientBox(r1*2, r1*2, Math.atan2(y0-y1, x0-x1), x1-r1, y1-r1);
		focalPointRatio = Math.sqrt(dx*dx + dy*dy) / r1;
		method(GradientType.RADIAL, colors, alphas, ratios, mtx, SpreadMethod.PAD, InterpolationMethod.RGB, focalPointRatio);
	}
	
	inline static private function applyLinearGradientFillOrStroke(method:Dynamic, args:Dynamic) {
		var cssColors:Array<String> = args[0];
		var colors:Array<Int> = [];
		var alphas:Array<Float> = [];
		// copy so that original args are not modified, which causes issues if redraw
		// is forced by bmp load
		var ratios:Array<Float> = args[1].copy();
		var x0:Float = args[2];
		var y0:Float = args[3];
		var x1:Float = args[4];
		var y1:Float = args[5];
		
		// parse css colors to color + alpha
		for(colorString in cssColors) {
			CSSColor.parse(colorString);
			colors.push(CSSColor.color);
			alphas.push(CSSColor.alpha);
		}
		
		// convert ratios to 0-255
		for(i in 0...ratios.length) {
			ratios[i] *= 255;
		}
		
		// calculate matrix
		var dx = x1-x0;
		var dy = y1-y0;
		var mtx = new Matrix();
		var ang = Math.atan2(dy, dx);
		var size = Math.max(Math.abs(dx), Math.abs(dy))/Math.max(Math.abs(Math.sin(ang)),Math.abs(Math.cos(ang)));
		mtx.createGradientBox(size, size, ang, (x0+x1-size)*0.5, (y0+y1-size)*0.5);
		
		// apply gradient
		method(GradientType.LINEAR, colors, alphas, ratios, mtx, SpreadMethod.PAD, InterpolationMethod.RGB);
	}
	
	
	inline static private function setStrokeStyle(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO map : caps, joints, miterLimit
		var caps:Dynamic = args[1];
		var joints:Dynamic = args[2];
		
		target.activePath = false;
		target.strokeThickness = args[0];
		target.miterLimit = Math.isNaN(args[3]) ? 10 : args[3];
		
		switch(caps) {
			case 'round', 1:
				target.capsStyle = CapsStyle.ROUND;
			case 'square', 2:
				target.capsStyle = CapsStyle.SQUARE;
			default:	//'butt', 0
				target.capsStyle = CapsStyle.NONE;
		}
		
		switch(joints) {
			case 'round', 1:
				target.jointsStyle = JointStyle.ROUND;
			case 'bevel', 2:
				target.jointsStyle = JointStyle.BEVEL;
			default:	//'butt', 0
				target.jointsStyle = JointStyle.MITER;
		}
		
		
	}
	
	inline static private function beginStroke(target:GraphicsFl, color:String):Void{
		target.activePath = false;
		CSSColor.parse(color);
		target.graphics.lineStyle(target.strokeThickness, CSSColor.color, CSSColor.alpha, false, LineScaleMode.NONE, target.capsStyle, target.jointsStyle, target.miterLimit);
	}
	
	inline static private function beginBitmapStroke(target:GraphicsFl, args:Array<Dynamic>):Void{
		//TODO : handle repeat-x, repeat-y
		target.activePath = false;
		var img = Control.bitmapDatas.get(args[0]);	
		target.graphics.lineStyle(target.strokeThickness, 0, 1, false, LineScaleMode.NONE, target.capsStyle, target.jointsStyle, target.miterLimit);	
		target.graphics.lineBitmapStyle(img.bitmapData, null, args[1]!='no-repeat', false);
		watchBitmapData(target, img);
	}
	
	static private function beginRadialGradientStroke(target:GraphicsFl, args:Array<Dynamic>):Void{
		target.activePath = false;
		target.graphics.lineStyle(target.strokeThickness, 0, 1, false, LineScaleMode.NONE, target.capsStyle, target.jointsStyle, target.miterLimit);	
		applyRadialGradientFillOrStroke(target.graphics.lineGradientStyle, args);
	}
	
	static private function beginLinearGradientStroke(target:GraphicsFl, args:Array<Dynamic>):Void{
		target.activePath = false;
		target.graphics.lineStyle(target.strokeThickness, 0, 1, false, LineScaleMode.NONE, target.capsStyle, target.jointsStyle, target.miterLimit);	
		applyLinearGradientFillOrStroke(target.graphics.lineGradientStyle, args);
	}
	
	inline static private function endStroke(target:GraphicsFl, ?nada:Dynamic):Void{
		target.activePath = false;
		target.graphics.lineStyle();
	}
	
	inline static private function endFill(target:GraphicsFl, ?nada:Dynamic):Void{
		target.activePath = false;
		target.graphics.endFill();
		
		target.activeFill = false;
		target.fillMethod = target.fillArgs = null;
	}
	
	inline static private function closePath(target:GraphicsFl, ?nada:Dynamic):Void{
		if(target.activePath == true) {
			target.graphics.lineTo(target.startX, target.startY);
			target.activePath = false;
		}
	}
	
	/**
	 * Move drawing head to a point
	 * 
	 */
	inline static private function moveTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.graphics.moveTo(xy[0], xy[1]);
		
		//-- store current drawing point
		target.curX = xy[0];
		target.curY = xy[1];
	}
	
	inline static private function lineTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.checkFreshPath();
		target.graphics.lineTo(xy[0], xy[1]);
		
		//-- store current drawing point
		target.curX = xy[0];
		target.curY = xy[1];
	}
	
	inline static private function cubicCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		target.checkFreshPath();
		
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

		//-- store current drawing point
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
			//-- doing so avoids gross errors when handles are nearly parallel
			target.graphics.lineTo( bz.a2.x, bz.a2.y);	
		}
	}

	
	inline static private function quadraticCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		target.checkFreshPath();
		target.graphics.curveTo(pts[0], pts[1], pts[2], pts[3]);
		
		//-- store current drawing point
		target.curX = pts[2];
		target.curY = pts[3];
	}
	
	inline static private function drawRect(target:GraphicsFl, rct:Array<Dynamic>):Void{
		//-- TODO : check if this should change current XY position
		target.checkFreshFill();
		target.graphics.drawRect(rct[0], rct[1], rct[2], rct[3]);
	}
	
	inline static private function clear(target:GraphicsFl, ?nada:Dynamic):Void{
		target.graphics.clear();
		target.setDefaults();
		
		//-- Clear redraw serialization
		//-- Empty commands
		target.commands = [];
		//-- Stop listening for redraws
		var bmpds = target.bitmapDatas;
		while(bmpds!=null && bmpds.length>0) {
			bmpds.pop().unwatch(target.handleRedraw);
		}		
	}
	
	inline static private function drawPolyStar(target:GraphicsFl, args:Dynamic):Void{
		target.checkFreshFill();
		var x:Float = args[0];
		var y:Float = args[1];
		var radius:Float = args[2];
		var sides:Int = args[3];
		var pointSize:Dynamic = args[4];
		var angle:Dynamic = args[5];
		
		if (pointSize == null) { pointSize = 0; }
		
		pointSize = 1-pointSize;
		
		if (angle == null) { angle = 0; }
		else { angle /= 180/Math.PI; }
		
		var a = Math.PI/sides;
		
		var g = target.graphics;
		
		g.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		
		for (i in 0...sides) {
			angle += a;
			if (pointSize != 1) {
				g.lineTo(x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize);
			}
			angle += a;
			g.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		}
	}
	
	
	 /**
	 * Draw a simple round cornered rectangle
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	inline static private function drawRoundRect(target:GraphicsFl, rect:Dynamic):Void{
		target.checkFreshFill();
		target.graphics.drawRoundRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
	}
	
	 /**
	 * Draw a complex round cornered rectangle
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	inline static private function drawRoundRectComplex(target:GraphicsFl, rect:Array<Dynamic>):Void{
		target.checkFreshFill();
		target.graphics.drawRoundRectComplex(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5], rect[7], rect[6]);
	}
	
	/**
	 * Draw a circle
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	inline static private function drawCircle(target:GraphicsFl, circ:Array<Dynamic>):Void{
		target.checkFreshFill();
		target.graphics.drawCircle(circ[0], circ[1], circ[2]);
	}
	
	/**
	 * Draw an ellipse
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	inline static private function drawEllipse(target:GraphicsFl, ell:Array<Dynamic>):Void{
		target.checkFreshFill();
		target.graphics.drawEllipse(ell[0], ell[1], ell[2], ell[3]);
	}
	
	/**
	 * Draw an arcTo
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	 inline static function drawArcTo(target:GraphicsFl, args:Array<Dynamic>):Void{
		
		//-- control point
		var x1:Float = args[0];
		var y1:Float = args[1];
		var ang1:Float = Math.atan2(target.curY-y1, target.curX-x1);
		var ang2:Float = Math.atan2(args[3]-y1, args[2]-x1);
		var radius:Float = args[4];
		var angDif:Float = ang1-ang2;
	
		//-- fit angular distance to range -PI, PI
		if(angDif<-Math.PI){
			angDif+=TWO_PI;
			ang1+=TWO_PI;
		}else if(angDif>Math.PI) {
			angDif-=TWO_PI;
			ang1-=TWO_PI;
		}
		
		//-- length and angle of bisecting segment to center of arc
		//-- from control point
		var distBisect:Float = radius / Math.sin(angDif * 0.5);
		var angBisect:Float = angDif * 0.5 + ang2;
		
		//-- clockwise
		var direction:Int = angDif>0? 1 : -1;
		
		//-- center point of circular arc
		var sx:Float = Math.cos(angBisect) * distBisect * direction + x1;
		var sy:Float = Math.sin(angBisect) * distBisect * direction + y1;
		
		//-- start and end angle 
		var sAng = ang1 + HALF_PI * direction;
		var eAng = sAng + Math.PI * direction - angDif;
		
		//-- if line or fill, set start point a current head and
		//-- make drawArc to a lineto from current point
		target.checkFreshPath();
		
		//-- draw the arc itself
		drawArc(target, [sx, sy, radius, sAng, eAng, direction==-1 ]);
	}
	
	/**
	 * Draw an arc
	 * @param GraphicsFl
	 * @param Array The arguments for the corresponding EaselJS method
	 */
	inline static function drawArc(target:GraphicsFl, args:Array<Dynamic>):Void{
 
       	//-- center of arc
       	var ax:Float = args[0]; 
        var ay:Float = args[1];
        
        var radius:Float = args[2];
       	var startAngle:Float = args[3];
       	var endAngle:Float = args[4];
        
        //-- arc angle in radians
        var arc:Float = endAngle - startAngle;
        var anticlockwise:Bool = args[5]==null ? true : args[5];
        
        //-- start of segment
       	var bx:Float = ax + Math.cos(startAngle) * radius;
       	var by:Float = ay + Math.sin(startAngle) * radius;
       	       
       //-- graphics on which to render
        var g:flash.display.Graphics = target.graphics;
     	
        var segAngle:Float;
        var angle:Float;
        var angleMid:Float;
        var numSegs:Int;
        var cx:Float;
        var cy:Float;
        var cRadius:Float;
 
        //-- line to start
        if(target.activePath) {
        	g.lineTo(bx, by);
        } else {
        	g.moveTo(bx, by);
        	target.curX = bx;
        	target.curY = by;
        	target.checkFreshPath();
        }
        

		
        //-- draw only full circle if more than that is specified
        if (Math.abs(arc) > TWO_PI) {
                arc = TWO_PI;
                
        //-- or if necessary to flip direction of rendering        
        }else if(arc!=0 && (anticlockwise != (arc<0))) {
        	arc = (anticlockwise ? -1 : 1) * TWO_PI + arc;
        }
        
        //-- number of segments
        numSegs = Math.ceil(Math.abs(arc) / QUART_PI);
        
        //-- angle of each segment
        segAngle = arc / numSegs;
        
        //-- radius of control pts
        cRadius = (radius / Math.cos(segAngle / 2));
        
        //-- current angle
        angle = startAngle;
        
		//-- calculate and render segments
	
        for( i in 0...numSegs) {
            //-- increment the angle
            angle += segAngle;
            
            //-- angle halfway between the last and this
            angleMid = angle - (segAngle / 2);
            
            //-- find the end pt
            bx = ax + Math.cos(angle) * radius;
            by = ay + Math.sin(angle) * radius;
            
            //-- find the control pt
            cx = ax + Math.cos(angleMid) * cRadius;
            cy = ay + Math.sin(angleMid) * cRadius;
			
            //-- render segment
            g.curveTo(cx, cy, bx, by);
        }
    
    	//-- store current drawing point
    	target.curX = bx;
		target.curY = by;
    }
	
	/**
	 * Watch an IBitmapData for change, so that a redraw can be triggered.
	 */
	inline static private function watchBitmapData(target:GraphicsFl, bmpd:IBitmapData):Void {
		if(target.bitmapDatas==null){
			target.bitmapDatas = [];
		}
		target.bitmapDatas.push(bmpd);
		bmpd.watch(target.handleRedraw);
	}
	
	
	/**** Instance variable and methods ****/
	
	private var graphics:Graphics;
	private var strokeThickness:Float;
	private var capsStyle:Dynamic;
	private var jointsStyle:Dynamic;
	private var miterLimit:Float;
	
	private var fillMethod:Dynamic;
	private var fillArgs:Dynamic;
	private var activeFill:Bool;
	
	//-- The current position of the drawing head
	private var curX:Float;
	private var curY:Float;
	
	//-- Start of current path
	private var startX:Float;
	private var startY:Float;
	private var activePath:Bool;
	
	//-- serialized commands
	private var commands:Array<Dynamic>;
	private var bitmapDatas:Array<IBitmapData>;

	public function new(){
		
		commands = [];
		setDefaults();
	}
	
	inline private function setDefaults() {
		startX = startY = curX = curY = 0;	
		strokeThickness = 1;
		capsStyle = CapsStyle.NONE;
		jointsStyle = JointStyle.MITER;
		miterLimit = 10;
		activePath = activeFill = false;
		fillMethod = fillArgs = null;
	}
	
	
	/**
	 * Map this object to a graphics object from a DisplayObject
	 * @param Graphics
	 */
	inline public function link(g:Graphics):Void{
		this.graphics = g;	
	}
	
	/**
	 * Redraw when an IBitmapData on which this dependant
	 * has changed.
	 */
	private function handleRedraw(e:Dynamic):Void {
		this.graphics.clear();
		this.setDefaults();
		
		for(cmd in commands) {
			execs.get(cmd.method)(this, cmd.arguments);
		}
	}
	
	/**
	 * Store the first coordinates in a path, so that
	 * when closePath is called, it can be fulfilled
	 */
	inline private function checkFreshPath():Void{
		
		if(!activePath){
			checkFreshFill();
			startX = curX;
			startY = curY;
			activePath = true;
		}
	}
	
	/**
	 * When drawing successive shapes without calling beginFill/endFill,
	 * Flash will knockout areas filled an even number of times, whereas
	 * EaselJS will simply fill them. 
	 */
	inline private function checkFreshFill():Void{
		if(activeFill && fillMethod!=null) {
			this.graphics.endFill();
			fillMethod(this, fillArgs);
		}

		activeFill = true;
	}
	
	/**
	 * Execute a method on this GraphicsFl object
	 * @param String key corresponding to the method
	 * @param Array arguments for the method
	 */
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
