package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;
import flash.events.MouseEvent;
import interfaces.IDisplayable;

import flash.geom.Matrix;
import flash.filters.DropShadowFilter;
import utils.CSSColor;

class DisplayObjectFl implements IDisplayable {	
	
	static public function mapMethods(execs:Hash<Dynamic>){
		execs.set('op',opacity);
		execs.set('vs',visible);
		execs.set('shd', shadow);
		execs.set('mtx', setMatrix);		
		execs.set('amck', addClickHandler);
		execs.set('amot', addOutHandler);
		execs.set('amov', addOverHandler);
		execs.set('aprs', addPressHandler);
		execs.set('rmck', removeClickHandler);
		execs.set('rmot', removeOutHandler);
		execs.set('rmov', removeOverHandler);
		execs.set('rprs', removePressHandler);
		execs.set('smen', setMouseEnabled);
		execs.set('scrs', setHandCursor);
		execs.set('sbtn', setButtonMode);
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
		target.display.addEventListener(MouseEvent.CLICK, target.handleClick, false, 0, true);
	}
	
	inline static private function addOverHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OVER, target.handleOver, false, 0, true);
	}
	
	inline static private function addOutHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_OUT, target.handleOut, false, 0, true);
	}
	
	inline static private function addPressHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.addEventListener(MouseEvent.MOUSE_DOWN, target.handlePress, false, 0, true);
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
	
	inline static private function removePressHandler(target:DisplayObjectFl, ?nada:Dynamic):Void{
		target.display.removeEventListener(MouseEvent.MOUSE_DOWN, target.handlePress, false);
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
	
	inline static private function setMask(target:DisplayObjectFl, maskID:Dynamic):Void{
		
		//mask is a shape
		target.display.mask = Control.displays.exists(maskID) ? Control.displays.get(maskID).display : null;
	}
	
	inline static private function shadow(target:DisplayObjectFl, id:Dynamic):Void{
		var flt = Control.shadows.get(id);
		
		if(target._shadow!=null) {
			target._shadow.unwatch(target.handleShadowUpdate);
		}else {
			var filters = target.display.filters;
			filters[ShadowFl.INDEX] = new DropShadowFilter();
			target.display.filters = filters;
		}
		
		target._shadow = flt;
		
		if(flt==null) {
			var filters = target.display.filters;
			filters[ShadowFl.INDEX] = null;
			target.display.filters = filters;
		} else {
			flt.watch(target.handleShadowUpdate);
			target.handleShadowUpdate();
		}
		
	}
	

	
	//TODO: decide if these should be moved to a Stage specific class
	
	//-- onMouseMove and onMouseUp events are sent back to handlers on the onPress event
	static private var lastMoveEvtTime:Float = 0.0;
	
	static function handleStageMove(e:MouseEvent):Void{
		//-- throttling this to 30fps, since constant dispatches seem to be a bottle neck
		var time:Float = Date.now().getTime();
		if(time-lastMoveEvtTime>=33) {
			lastMoveEvtTime = time;
			var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onMouseMove'};
			Main.dispatch(evt);
		}
	}
	
	static function handleStageUp(e:MouseEvent):Void{
		//-- unsubscribe to receive mousemove, up events which were assigned via an onPress handler
		e.target.removeEventListener(MouseEvent.MOUSE_MOVE, handleStageMove, false);
		e.target.removeEventListener(MouseEvent.MOUSE_UP, handleStageUp, false);
		
		//-- dispatch event to js
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onMouseUp'};
		Main.dispatch(evt);
	}

	/** Instance **/
	public var display:Sprite;
	public var id:Int;
	// stores the shadow props
	private var _shadow:ShadowFl;
	
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
	
	public function handlePress(e:MouseEvent):Void{
		//-- subscribe stage to receive mousemove, up events
		var stg = Control.stageFl;
		stg.display.addEventListener(MouseEvent.MOUSE_MOVE, handleStageMove, false, 0, true);
		stg.display.addEventListener(MouseEvent.MOUSE_UP, handleStageUp, false, 0, true);
		
		//-- dispatch event
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'onPress', id:this.id};
		Main.dispatch(evt);	
	}
	
	public function handleShadowUpdate(?e:Dynamic):Void {

		var filters = display.filters;
		filters[ShadowFl.INDEX].color = _shadow.color;
		filters[ShadowFl.INDEX].alpha = _shadow.alpha;
		filters[ShadowFl.INDEX].blurX = _shadow.blur;
		filters[ShadowFl.INDEX].blurY = _shadow.blur;
		filters[ShadowFl.INDEX].angle = _shadow.angle;
		filters[ShadowFl.INDEX].distance = _shadow.distance;
		display.filters = filters;
	}
}
