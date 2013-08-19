package display;

import flash.display.DisplayObject;
import flash.display.Loader;
import flash.net.URLRequest;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.display.BitmapData;
import interfaces.IExec;
import interfaces.IBitmapData;
import interfaces.IWatchable;

class ImageFl implements IExec implements IBitmapData implements IWatchable{


	inline static var IMAGE_CHANGE:String = 'imageChange';
	static var dispatcher:EventDispatcher = new EventDispatcher();
	static private var execs:Map<String,Dynamic>;
	
	static public function init(){
		//-- assign method values for keys
		execs = new Map<String,Dynamic>();
		execs.set('src', setSource);
		
		//-- 1x1 transparent bitmapdata
		defaultData = new BitmapData(1,1, true, 0);
	}
	
	/**
	 * Change the source url of an ImageFl
	 * @param ImageFl
	 * @param String the URL
	 */
	inline static private function setSource(target:ImageFl, url:Dynamic){
		var req = new URLRequest();
		req.url = url;
		target.ready = false;
		target.loader.load( req );
	}
	
	static public var defaultData(default, null):BitmapData;
	
	public var ready(default, null):Bool;
	public var bitmapData(default, null):BitmapData;
	
	private var loader:Loader;
	private var eventID:String;	
	
	public function new(id:Int){
		ready = false;
		loader = new Loader();
		bitmapData = defaultData;
		eventID = IMAGE_CHANGE + id;		
		
		loader.contentLoaderInfo.addEventListener(Event.COMPLETE, handleLoad, false, 0, true);
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
	 * Handle load of loader, create new bitmap data 
	 */
	function handleLoad(e:Event):Void{
		bitmapData = new BitmapData(Std.int(loader.width), Std.int(loader.height), true, 0);
		bitmapData.draw(loader);
		ready = true;
		
		dispatcher.dispatchEvent(new Event(eventID));
	}
	
	/**
	 * Execute a method on this ImageFl object
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
				throw 'no method mapped to "'+method+'" in ImageFl';	
			}
		#end
	}	
}
