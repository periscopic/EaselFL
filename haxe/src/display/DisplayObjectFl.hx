/* TEST */package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;
import flash.events.MouseEvent;

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
		
		execs.set('amck', addClickHandler);
		execs.set('amot', addOutHandler);
		execs.set('amov', addOverHandler);
		
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
	
	//inline 
	static private function addClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.CLICK, target.handleClick, false, 0, true);
	}
	
	inline static private function addOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false, 0, true);
	}
	
	inline static private function addOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false, 0, true);
	}
	
	
	public var display:DisplayObjectContainer;
	public var id:Int;
	
	public function new( id:Int ){ this.id = id;}
	
	public function handleClick(e:MouseEvent):Void{
		//var evt:Dynamic = e;
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onClick', id:this.id};
		Main.dispatch(evt);
	}
	
	public function handleOver(e:MouseEvent):Void{
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onMouseOver', id:this.id};
		Main.dispatch(evt);	
	}
	
	public function handleOut(e:MouseEvent):Void{
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onMouseOut', id:this.id};
		Main.dispatch(evt);	
	}
	
}
