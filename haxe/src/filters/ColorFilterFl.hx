package filters;

import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.ColorMatrixFilter;
import flash.filters.BitmapFilter;
import interfaces.IExec;
import interfaces.IBitmapFilter;


class ColorFilterFl implements IExec, implements IBitmapFilter{

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Hash();
		execs.set('flt', updateFilter);
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
	 * Change the filter's attributes
	 * @param ColorFilterFl
	 * @param Array
	 */
	inline static private function updateFilter(target:ColorFilterFl, a:Dynamic){
		//-- use ColorMatrixFilter instead of ColorTransform in order to 
		//-- maintain filter application order as in EaselJS
		
		target._filter.matrix = [
				a[0], 0.0, 0.0, 0.0, a[4], 
				0.0, a[1], 0.0, 0.0, a[5], 
				0.0, 0.0, a[2], 0.0, a[6], 
				0.0, 0.0, 0.0, a[3], a[7], 
				0.0, 0.0, 0.0, 0.0, 0.0
			];
	}
	
	
	
	/**
	 * Execute a method on this ColorFilterFl object
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
				throw 'no method mapped to "'+method+'" in ColorFilterFl';	
			}
		#end
	}	
}
