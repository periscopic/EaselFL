package display;

import flash.display.Bitmap;
import flash.display.DisplayObject;
import flash.events.Event;
import interfaces.IExec;
import interfaces.IDisplayable;
import interfaces.IBitmapData;

class BitmapFl extends DisplayObjectFl, implements IExec, implements IDisplayable {

	// TODO : handle cropping of bitmap

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		DisplayObjectFl.init(execs);
		execs.set('img', setImage);
		execs.set('smth', setSmoothing);
	}
	
	inline static private function setImage(target:BitmapFl, id:Int){
		target.swapImage(Control.bitmapDatas.get(id));
	}
	
	inline static private function setSmoothing(target:BitmapFl, smoothing:Bool){
		target.smoothing = target.bmp.smoothing = smoothing;
	}
	
	private var bmp:Bitmap;
	private var smoothing:Bool;
	public var loaded(default, null):Bool;
	private var _img:IBitmapData;
	
	public function new(id:Int){
		super(id);
		display = new flash.display.Sprite();
		smoothing = false;
		bmp = new Bitmap();
		display.addChild(bmp);
	}
	
	function swapImage( image : IBitmapData):Void{
		if(_img!=null && _img!=image){
			//stop listening for load of previous image
			_img.unwatch(updateBitmap);
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
			_img.watch(updateBitmap);
		}
		bmp.smoothing = smoothing;
	}
	
	function updateBitmap(?e:Event=null):Void{
		//-- sync bitmapdata
		bmp.bitmapData = _img.bitmapData;
		bmp.smoothing = smoothing;
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
