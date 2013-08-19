package filters;

import flash.display.DisplayObject;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.BlurFilter;
import flash.filters.BitmapFilter;
import interfaces.IExec;
import interfaces.IBitmapFilter;


class BoxBlurFilterFl implements IExec implements IBitmapFilter{

	static private var execs:Map<String,Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Map<String,Dynamic>();
		execs.set('flt', updateFilter);
	}
	
	public var filter(default,null):BitmapFilter;
	private var _filter:BlurFilter;
	
	public function new(id:Int){		
		filter = _filter = new BlurFilter(0, 0, 1);
	}
	
	
	/**
	 * Change the filter's attributes
	 * @param ColorFilterFl
	 * @param Array
	 */
	inline static private function updateFilter(target:BoxBlurFilterFl, a:Dynamic){
		target._filter.blurX = a[0];
		target._filter.blurY = a[1];
		target._filter.quality = Math.round(a[2]);
	}
	
	/**
	 * Execute a method on this BoxBlurFilterFl object
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
				throw 'no method mapped to "'+method+'" in BoxBlurFilterFl';	
			}
		#end
	}	
}
