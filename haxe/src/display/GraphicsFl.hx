package display;

import flash.display.Graphics;
import flash.display.DisplayObject;

class GraphicsFl implements IExec{
	

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		execs.set('f', beginFill );		
		execs.set('ef', endFill );		
		execs.set('mt', moveTo );		
		execs.set('lt', lineTo );		
		//execs.set('bt', cubicCurveTo );		
		execs.set('qt', quadraticCurveTo );		
		execs.set('dr', drawRect );		// or is it 'r'
		execs.set('rr', drawRoundRect );		
		execs.set('rc', drawRoundRectComplex );		
		execs.set('dc', drawCircle );		
		execs.set('de', drawEllipse );		
		execs.set('c', clear );		
		execs.set('ss', setStrokeStyle);
		execs.set('bs', beginStroke);
		execs.set('es', endStroke);
	}

	//TODO : arc, arcTo
	//TODO : bezierTo (cubic)
	//TODO : clearPath
	//TODO : begin linearGradientFill, radialGradientFill, bitmapFill
	//TODO : setStrokeStyle
	//TODO : beginStroke, beginLinearGradientStroke, beginRadialGradientStroke, beginBitmapStroke
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
		target.graphics.lineStyle(target.strokeThickness, col.color, col.alpha);//, pixelHinting, scaleMode, caps, joints, miterLimit)
	}
	
	inline static private function endStroke(target:GraphicsFl, ?nada:Dynamic):Void{
		target.graphics.lineStyle();
	}
	
	inline static private function endFill(target:GraphicsFl, ?nada:Dynamic):Void{
		target.graphics.endFill();
	}
	
	inline static private function moveTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.graphics.moveTo(xy[0], xy[1]);
	}
	
	inline static private function lineTo(target:GraphicsFl, xy:Array<Dynamic>):Void{
		target.graphics.lineTo(xy[0], xy[1]);
	}
	
	/*inline static private function cubicCurveTo(target:Graphics, pts:Array<Dynamic>):Void{
		target.cubicCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
	}*/
	
	inline static private function quadraticCurveTo(target:GraphicsFl, pts:Array<Dynamic>):Void{
		target.graphics.curveTo(pts[0], pts[1], pts[2], pts[3]);
	}
	
	inline static private function drawRect(target:GraphicsFl, rct:Array<Dynamic>):Void{
		target.graphics.drawRect(rct[0], rct[1], rct[2], rct[3]);
	}
	
	inline static private function clear(target:GraphicsFl, ?nada:Dynamic):Void{
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

	private var graphics:Graphics;
	private var strokeThickness:Float;

	public function new(){ }
	
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
	

	
	
}
