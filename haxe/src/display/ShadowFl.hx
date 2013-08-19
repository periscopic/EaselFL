/* TEST */package display;

import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.DropShadowFilter;
import interfaces.IExec;
import interfaces.IWatchable;
import utils.CSSColor;

class ShadowFl implements IExec implements IWatchable{

	static private var execs:Map<String,Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Map<String,Dynamic>();
		execs.set('shd', updateShadow);
	}
	
	/**
	 * Change the shadows attributes
	 * @param ShadowFl
	 * @param Array
	 */
	inline static private function updateShadow(target:ShadowFl, args:Dynamic){
		
		if(args[0]!=target.colorString) {
			CSSColor.parse(args[0]);
			target.filter.alpha = CSSColor.alpha;
			target.filter.color = CSSColor.color;
		}
		
		target.filter.blurX = target.filter.blurY = args[3];
		target.filter.angle = getAngleFromOffsets(args[1], args[2]);
		target.filter.distance = args[1] + args[2];

		target.notify();
	}
	
	inline private static function getAngleFromOffsets(ox:Float, oy:Float):Float {
		return  Math.atan2(oy,ox) * 180/Math.PI;
	}
	
	private var colorString:String;
	public var filter(default,null):DropShadowFilter;
	private var listeners:Array<Dynamic>;

	public function new(id:Int){		
		colorString = null;				
		filter = new DropShadowFilter(0, 0, 0, 0);
		listeners = [];
	}
	
	/**
	 * Add method to be called when shadow changes
	 * @param Method
	 */
	inline public function watch(method:Dynamic->Void):Void {	
		listeners.push(method);
	}
	
	/**
	 * Remove method to be called when shadow changes
	 * @param Method
	 */
	inline public function unwatch(method:Dynamic->Void):Void {
		listeners.remove(method);
	}
	
	inline public function notify() {
		for(i in 0...listeners.length) {
			listeners[i]();
		}
	}
	
	/**
	 * Execute a method on this ShadowFl object
	 * @param String key corresponding to the method
	 * @param Array arguments for the method
	 */
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in ShadowFl';	
			}
		#end
	}	
	
}
