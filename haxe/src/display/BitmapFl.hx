/* TEST */package display;

import flash.display.Bitmap;
import flash.display.DisplayObject;
import flash.events.Event;

class BitmapFl extends DisplayObjectFl, implements IExec, implements IDisplayable{

	// TODO : handle cropping of bitmap

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		DisplayObjectFl.init(execs);
		execs.set('img', setImage);
	}
	
	inline static private function setImage(target:BitmapFl, id:String){
		target.swapImage(Control.bitmapDatas.get(id));
	}
	
	private var bmp:Bitmap;
	public var loaded(default, null):Bool;
	private var _img:IBitmapData;
	
	public function new(){
		super();
		display = bmp = new Bitmap();		
	}
	
	function swapImage( image : IBitmapData):Void{
		if(_img!=null && _img!=image){
			//stop listening for load of previous image
			_img.dispatcher.removeEventListener(Event.COMPLETE, updateBitmap);
		}
		
		_img = image;
		
		if(_img == null){
			//-- clear old bitmapdata
			bmp.bitmapData = ImageFl.defaultData;	
		}else{
			
			if(!_img.ready){
				//-- clear old bitmapdata
				bmp.bitmapData = ImageFl.defaultData;
			}else{
				//-- sync bitmapdata
				bmp.bitmapData = _img.bitmapData;
			}
			
			//-- Listen for subsequent loads
			_img.dispatcher.addEventListener(Event.COMPLETE, updateBitmap);
		}
	}
	
	function updateBitmap(?e:Event=null):Void{
		//-- sync bitmapdata
		bmp.bitmapData = _img.bitmapData;
	}
	
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in BitmapFl';	
			}
		#end
	}	
}
