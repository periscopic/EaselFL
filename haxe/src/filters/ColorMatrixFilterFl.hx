package filters;

import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.ColorMatrixFilter;
import flash.filters.BitmapFilter;
import interfaces.IExec;
import interfaces.IBitmapFilter;


class ColorMatrixFilterFl implements IExec, implements IBitmapFilter{

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Hash();
		execs.set('flt', updateFilter);
	}
	
	/**
	 * Change the filter's attributes
	 * @param ColorMatrixFilterFl
	 * @param Array
	 */
	inline static private function updateFilter(target:ColorMatrixFilterFl, args:Dynamic){
		target._filter.matrix = args;
	}
	
	inline private static function getAngleFromOffsets(ox:Float, oy:Float):Float {
		return  Math.atan2(oy,ox) * 180/Math.PI;
	}
	
	private var eventID:String;
	private var colorString:String;
	public var filter(default,null):BitmapFilter;
	private var _filter:ColorMatrixFilter;
	
	public function new(id:Int){		
		colorString = null;				
		filter = _filter = new ColorMatrixFilter();
	}
	
	/**
	 * Execute a method on this ColorMatrixFilterFl object
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
				throw 'no method mapped to "'+method+'" in ColorMatrixFilterFl';	
			}
		#end
	}	
}
