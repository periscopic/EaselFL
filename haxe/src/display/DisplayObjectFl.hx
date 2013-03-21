package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;
import flash.events.MouseEvent;
import interfaces.IDisplayable;
import interfaces.IBitmapFilter;
import flash.filters.BitmapFilter;

import flash.geom.Matrix;
import flash.filters.DropShadowFilter;
import utils.CSSColor;

class DisplayObjectFl implements IDisplayable {	
	
	static public function mapMethods(execs:Hash<Dynamic>){
		execs.set('op',opacity);
		execs.set('vs',visible);
		execs.set('shd', setShadow);
		execs.set('flts', setFilters);
		execs.set('mtx', setMatrix);		
		execs.set('amck', addClickHandler);
		execs.set('adck', addDoubleClickHandler);
		execs.set('amot', addOutHandler);
		execs.set('amov', addOverHandler);
		execs.set('amod', addDownHandler);
		execs.set('rmck', removeClickHandler);
		execs.set('rdck', removeDoubleClickHandler);
		execs.set('rmot', removeOutHandler);
		execs.set('rmov', removeOverHandler);
		execs.set('rmod', removeDownHandler);
		execs.set('smen', setMouseEnabled);
		execs.set('scrs', setCursor);
		execs.set('msk', setMask);
		
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
		//-- Coordinates from Easel are in local coordinates, while flash accepts global coordinates
		var stagePt = target.display.localToGlobal(new flash.geom.Point(xy[0], xy[1]));
		return target.display.hitTestPoint(stagePt.x, stagePt.y, true);
	}
	
	inline static private function addClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.clickActive = true;

		if(!target.dblClickActive) {
			target.display.addEventListener(MouseEvent.CLICK, target.handleClick, false, 0, true);
		}	}
	
	inline static private function addDoubleClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.dblClickActive = true;

		if(!target.clickActive) {
			target.display.addEventListener(MouseEvent.CLICK, target.handleClick, false, 0, true);
		}
	}
	
	inline static private function addOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false, 0, true);
	}
	
	inline static private function addOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false, 0, true);
	}
	
	inline static private function addDownHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_DOWN, target.handleDown, false, 0, true);
	}
	
	inline static private function removeClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.clickActive = false;

		if(!target.dblClickActive) {
			target.display.removeEventListener(MouseEvent.CLICK, target.handleClick, false);
		}
	}	
	
	inline static private function removeDoubleClickHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.dblClickActive = false;

		if(!target.clickActive) {
			target.display.removeEventListener(MouseEvent.CLICK, target.handleClick, false);
		}
	}
	
	inline static private function removeOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false);
	}
	
	inline static private function removeOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false);
	}
	
	inline static private function removeDownHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_DOWN, target.handleDown, false);
	}
	
	inline static private function setMouseEnabled(target:DisplayObjectFl,isOn:Bool):Void{
		target.display.mouseEnabled = isOn;
	}
	
	inline static private function setCursor(target:DisplayObjectFl,cursor:String):Void{
		//TODO: handle other css cursor types
		if(cursor=='pointer') {
			target.display.useHandCursor = 
			target.display.buttonMode = true; 
		} else {
			target.display.useHandCursor = 
			target.display.buttonMode = false;
		}
	}
	
	inline static private function setMask(target:DisplayObjectFl, maskID:Dynamic):Void{
		
		//mask is a shape
		target.display.mask = Control.displays.exists(maskID) ? Control.displays.get(maskID).display : null;
	}
	
	
	/*inline */static private function setShadow(target:DisplayObjectFl, id:Dynamic):Void{
		
		var flt = Control.shadows.get(id);
		
		if(target._shadow!=null) {
			var filters = target.display.filters;
			filters.pop();
			target.display.filters = filters;
			target._shadow.unwatch(target.handleShadowUpdate);	
		} 
		
		target._shadow = flt;
		
		if(target._shadow!=null) {
			var filters = target.display.filters;
			filters.push(flt.filter);
			target.display.filters = filters;
			flt.watch(target.handleShadowUpdate);
		}	
	}
	
	inline static private function setFilters(target:DisplayObjectFl, ids:Array<Dynamic>):Void{		
		var filterFls = [];
		var filters:Array<BitmapFilter> = [];
		
		for(id in ids) {
			var flt = Control.filters.get(id);
			filterFls.push(flt);
			filters.push(flt.filter);
		}
		
		//-- preserve shadow if present
		if(target._shadow!=null) {
			filters.push(target._shadow.filter);
		}
		
		target._filterFls = filterFls;
		target.display.filters = filters;
	}
	
	//TODO: decide if these should be moved to a Stage specific class
	
	//-- onMouseMove and onMouseUp events are sent back to handlers on the onPress event
	static private var lastMoveEvtTime:Float = 0.0;
	
	static function handleStageMove(e:MouseEvent):Void{
		//-- throttling this to 30fps, since constant dispatches seem to be a bottle neck
		var time:Float = Date.now().getTime();
		if(time-lastMoveEvtTime>=33) {
			lastMoveEvtTime = time;
			var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'mousemove'};
			Main.dispatch(evt);
		}
	}
	
	static function handleStageUp(e:MouseEvent):Void{
		//-- unsubscribe to receive mousemove, up events which were assigned via an onPress handler
		e.target.removeEventListener(MouseEvent.MOUSE_MOVE, handleStageMove, false);
		e.target.removeEventListener(MouseEvent.MOUSE_UP, handleStageUp, false);
		
		//-- dispatch event to js
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'mouseup'};
		Main.dispatch(evt);
	}

	/** Instance **/
	public var display:Sprite;
	public var id:Int;
	// stores the shadow props
	private var _shadow:ShadowFl;
	private var _filterFls:Array<IBitmapFilter>;
	private var lastSingleClickTime:Float;
	private var clickActive:Bool;
	private var dblClickActive:Bool;
	
	public function new( id:Int ){ 
		this.id = id;
		clickActive = dblClickActive = false;
		lastSingleClickTime = 0.0;
	}
	
	public function handleClick(e:MouseEvent):Void{
		var evt:Dynamic;
		var now:Float;
		
		if(clickActive) {
			evt = {stageX:e.stageX, stageY:e.stageY, type:'click', id:this.id};
			Main.dispatch(evt);
		}
		
		if(dblClickActive) {
			now = Date.now().getTime();
			if(now-lastSingleClickTime<500) {	
				lastSingleClickTime = 0.0;
				evt = {stageX:e.stageX, stageY:e.stageY, type:'dblclick', id:this.id};
				Main.dispatch(evt);
			} else {
				lastSingleClickTime = now;
			}
		}
	}
	
	public function handleOver(e:MouseEvent):Void{
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'mouseover', id:this.id};
		Main.dispatch(evt);	
	}
	
	public function handleOut(e:MouseEvent):Void{
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'mouseout', id:this.id};
		Main.dispatch(evt);	
	}
	
	public function handleDown(e:MouseEvent):Void{
		//-- subscribe stage to receive mousemove, up events
		var stg = Control.stageFl;
		stg.display.addEventListener(MouseEvent.MOUSE_MOVE, handleStageMove, false, 0, true);
		stg.display.addEventListener(MouseEvent.MOUSE_UP, handleStageUp, false, 0, true);
		
		//-- dispatch event
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'mousedown', id:this.id};
		Main.dispatch(evt);	
	}
	
	
	public function handleShadowUpdate(?e:Dynamic):Void {	
		var filters = display.filters;
		filters[filters.length-1] = _shadow.filter;
		display.filters = filters;
	}
	
	public function destroy():Void {
		if(_shadow!=null) {
			_shadow.unwatch(handleShadowUpdate);
		}
		display.filters = null;
		_filterFls = null;
		_shadow = null;
	}
}
