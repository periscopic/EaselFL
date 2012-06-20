package display;

import flash.display.Shape;
import flash.display.DisplayObject;
import flash.display.Loader;
import flash.net.URLRequest;
import flash.events.Event;
import flash.events.IEventDispatcher;
import flash.display.BitmapData;

class ImageFl implements IExec, implements IBitmapData{



	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		execs.set('src', setSource);
		
		//-- 1x1 transparent bitmapdata
		defaultData = new BitmapData(1,1, true, 0);
	}
	
	inline static private function setSource(target:ImageFl, url:Dynamic){
		var req = new URLRequest();
		req.url = url;
		target.ready = false;
		target.loader.load( req );
	}
	
	// TODO : verify this is max int in Flash 9
	inline static var MAX_INT:Int = Std.int(Math.pow(2,8));
	static public var defaultData(default, null):BitmapData;
	
	
	private var loader:Loader;
	
	public var ready(default, null):Bool;
	public var bitmapData(default, null):BitmapData;
	public var dispatcher(default, null):IEventDispatcher;
	
	
	public function new(){
		ready = false;
		loader = new Loader();
		bitmapData = defaultData;
		dispatcher = loader.contentLoaderInfo;
		
		loader.contentLoaderInfo.addEventListener(Event.COMPLETE, handleLoad, false, MAX_INT, true);
	}
	
	/*
	 * Handle load of loader, create new bitmap data 
	 */
	function handleLoad(e:Event):Void{
		bitmapData = new BitmapData(Std.int(loader.width), Std.int(loader.height), true, 0);
		bitmapData.draw(loader);
		ready = true;
	}
	
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
