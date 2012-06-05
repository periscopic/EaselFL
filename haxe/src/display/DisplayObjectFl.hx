/* TEST */package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;
import flash.events.MouseEvent;

import flash.geom.Matrix;

class DisplayObjectFl{	

	static public function init(execs:Hash<Dynamic>){
		execs.set('op',opacity);
		execs.set('vs',visible);
		execs.set('mtx', setMatrix);		
		execs.set('amck', addClickHandler);
		execs.set('amot', addOutHandler);
		execs.set('amov', addOverHandler);
		execs.set('rmck', removeClickHandler);
		execs.set('rmot', removeOutHandler);
		execs.set('rmov', removeOverHandler);
		execs.set('smen', setMouseEnabled);
		execs.set('scrs', setHandCursor);
		execs.set('sbtn', setButtonMode);
		
		//-- has callback
		execs.set('htp',hitTestPoint);
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
	
	inline static private function addClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.CLICK, target.handleClick, false, 0, true);
	}
	
	inline static private function addOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false, 0, true);
	}
	
	inline static private function addOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false, 0, true);
	}
	
	inline static private function removeClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.CLICK, target.handleClick, false);
	}
	
	inline static private function removeOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false);
	}
	
	inline static private function removeOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false);
	}
	
	inline static private function setMouseEnabled(target:DisplayObjectFl,isOn:Bool):Void{
		target.display.mouseEnabled = isOn;
	}
	
	inline static private function setHandCursor(target:DisplayObjectFl,isOn:Bool):Void{
		target.display.useHandCursor = isOn;
	}
	
	inline static private function setButtonMode(target:DisplayObjectFl,isOn:Bool):Void{
		target.display.buttonMode = isOn;
	}
	

	/** Instance **/
	public var display:Sprite;
	public var id:Int;
	
	public function new( id:Int ){ this.id = id;}
	
	public function handleClick(e:MouseEvent):Void{
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
