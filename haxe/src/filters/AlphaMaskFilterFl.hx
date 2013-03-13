package filters;

import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.filters.BlurFilter;
import flash.filters.BitmapFilter;
import interfaces.IExec;
import interfaces.IBitmapData;
import display.ImageFl;

/**
 * NOTE: Alpha Mask filter is incomplete. 
 * Issue where AlphaMaskFilter would conflict with
 * vector mask needs to be solved.
 */

class AlphaMaskFilterFl implements IExec{

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Hash();
		execs.set('flt', updateFilter);
	}
	
	private var _img:IBitmapData;
	
	public function new(id:Int){}
	
	
	/**
	 * Change the filter's attributes
	 * @param ColorFilterFl
	 * @param Array
	 */
	inline static private function updateFilter(target:AlphaMaskFilterFl, a:Dynamic){
		//target._filter.bitmapData = Control.bitmapDatas.get() = a[0];
		//target._filter.blurY = a[1];
		//target._filter.quality = Math.round(a[2]);
	}
	
	function updateMask(e:Dynamic=null):Void {
		
	}
	
	function swapImage( image : IBitmapData):Void{
		
		if(_img!=image) {
		
			if(_img!=null){
				//stop listening for load of previous image
				_img.unwatch(updateMask);
			}
			
			_img = image;
			
			if(_img != null){
				updateMask();
				
				//-- Listen for subsequent loads
				_img.watch(updateMask);
			}
			
		}
	}
	
	
	/**
	 * Execute a method on this AlphaMaskFilterFl object
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
				throw 'no method mapped to "'+method+'" in AlphaMaskFilterFl';	
			}
		#end
	}	
}
