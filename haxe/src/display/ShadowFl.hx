package display;

import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.DropShadowFilter;
import interfaces.IExec;
import interfaces.IWatchable;
import utils.CSSColor;

class ShadowFl implements IExec, implements IWatchable{


	public inline static var INDEX:Int = 0;
	
	inline static var SHADOW_CHANGE:String = 'shadowChange';
	static var dispatcher:EventDispatcher = new EventDispatcher();
	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Hash();
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

		dispatcher.dispatchEvent(new Event(target.eventID));
	}
	
	inline private static function getAngleFromOffsets(ox:Float, oy:Float):Float {
		return  Math.atan2(oy,ox) * 180/Math.PI;
	}
	
	
	private var eventID:String;
	private var colorString:String;
	public var filter(default,null):DropShadowFilter;
	
	public function new(id:Int){		
		eventID = SHADOW_CHANGE + id;
		colorString = null;				
		filter = new DropShadowFilter(0, 0, 0, 0);
	}
	
	/**
	 * Add method to be called when bitmapdata changes
	 * @param Method
	 */
	inline public function watch(method:Dynamic->Void):Void {
		dispatcher.addEventListener(eventID, method, false, 0, true);
	}
	
	/**
	 * Remove method to be called when bitmapdata changes
	 * @param Method
	 */
	inline public function unwatch(method:Dynamic->Void):Void {
		dispatcher.removeEventListener(eventID, method, false);
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
