package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;

import flash.geom.Matrix;

class DisplayObjectFl{
	
	/**
	 * TODO: add registrationX, registrationY, skewX, skewY, mouseEnabled
	 */
	static public function init(execs:Hash<Dynamic>){
		execs.set('x',x);
		execs.set('y',y);
		execs.set('sx',scaleX);
		execs.set('sy',scaleY);
		execs.set('rt',rotation);
		execs.set('op',opacity);
		execs.set('vs',visible);
		execs.set('mtx', setMatrix);
		
		//-- has callback
		execs.set('htp',hitTestPoint);
	}
	

	inline static private function x(target:IDisplayable, val:Float):Void{
		target.display.x = val;
	}
	
	inline static private function y(target:IDisplayable, val:Float):Void{
		target.display.y = val;
	}
	
	inline static private function scaleX(target:IDisplayable, val:Float):Void{
		target.display.scaleX = val;
	}
	
	inline static private function scaleY(target:IDisplayable, val:Float):Void{
		target.display.scaleY = val;
	}
	
	inline static private function rotation(target:IDisplayable, val:Float):Void{
		target.display.rotation = val;
	}
	
	inline static private function opacity(target:IDisplayable, val:Float):Void{
		target.display.alpha = val;
	}
	
	inline static private function visible(target:IDisplayable, val:Bool):Void{
		target.display.visible = val;
	}
	
	inline static private function setMatrix(target:IDisplayable, vals:Array<Float>):Void{
		var trn = target.display.transform;
		var mtx = trn.matrix;
		mtx.a = vals[0];
		mtx.b = vals[1];
		mtx.c = vals[2];
		mtx.d = vals[3];
		mtx.tx = vals[4];
		mtx.ty = vals[5];
		trn.matrix = mtx;
	}
	
	//-- Note: this does not test against opacity values as Easel does
	//-- and will therefore yield slightly different results
	inline static private function hitTestPoint(target:IDisplayable, xy:Array<Float>):Bool{
		return target.display.hitTestPoint(xy[0], xy[1], true);
	}
	
	
	public var display:DisplayObject;
	
	public function new( ){	}
	
}
