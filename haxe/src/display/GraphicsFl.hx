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
	}

	//TODO : arc, arcTo
	//TODO : bezierTo (cubic)
	//TODO : clearPath
	//TODO : begin linearGradientFill, radialGradientFill, bitmapFill
	//TODO : setStrokeStyle
	//TODO : beginStroke, beginLinearGradientStrok, beginRadialGradientStroke, beginBitmapStroke
	//TODO : endStroke
	//TODO : drawPolystar


	inline static private function beginFill(target:Graphics, color:String):Void{
		var col = CSSColor.parse(color);
		target.beginFill(col.color, col.alpha);
	}
	
	inline static private function endFill(target:Graphics):Void{
		target.endFill();
	}
	
	inline static private function moveTo(target:Graphics, xy:Array<Dynamic>):Void{
		target.moveTo(xy[0], xy[1]);
	}
	
	inline static private function lineTo(target:Graphics, xy:Array<Dynamic>):Void{
		target.lineTo(xy[0], xy[1]);
	}
	
	/*inline static private function cubicCurveTo(target:Graphics, pts:Array<Dynamic>):Void{
		target.cubicCurveTo(pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]);
	}*/
	
	inline static private function quadraticCurveTo(target:Graphics, pts:Array<Dynamic>):Void{
		target.curveTo(pts[0], pts[1], pts[2], pts[3]);
	}
	
	inline static private function drawRect(target:Graphics, rct:Array<Dynamic>):Void{
		target.drawRect(rct[0], rct[1], rct[2], rct[3]);
	}
	
	inline static private function clear(target:Graphics, ?nada:Dynamic):Void{
		target.clear();
	}
	
	inline static private function drawRoundRect(target:Graphics, rect:Dynamic):Void{
		target.drawRoundRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
	}
	inline static private function drawRoundRectComplex(target:Graphics, rect:Array<Dynamic>):Void{
		target.drawRoundRectComplex(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5], rect[6], rect[7]);
	}
	
	inline static private function drawCircle(target:Graphics, circ:Array<Dynamic>):Void{
		target.drawCircle(circ[0], circ[1], circ[2]);
	}
	
	inline static private function drawEllipse(target:Graphics, ell:Array<Dynamic>):Void{
		target.drawEllipse(ell[0], ell[1], ell[2], ell[3]);
	}
	
	
	
	

	private var graphics:Graphics;

	public function new(){ }
	
	inline public function link(g:Graphics):Void{
		this.graphics = g;
	}
	

	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( graphics, arguments);
		
		#if debug
			} else {
				throw 'no method command mapped to "'+method+'" in GraphicsFl';	
			}
		#end
	}
	

	
	
}
