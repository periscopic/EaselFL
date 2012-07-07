package display;

import flash.display.Bitmap;
import flash.display.DisplayObject;
import flash.display.BitmapData;
import flash.events.Event;
import flash.geom.Matrix;
import flash.geom.Rectangle;
import interfaces.IExec;
import interfaces.IDisplayable;
import interfaces.IBitmapData;
import geom.RectangleFl;


class BitmapFl extends DisplayObjectFl, implements IExec {

	static private var execs:Hash<Dynamic>;
	static private var tmpMtx:Matrix = new Matrix();
	static private var tmpRect:Rectangle = new Rectangle();
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static public function mapMethods(execs:Hash<Dynamic>) :Void{
		DisplayObjectFl.mapMethods(execs);
		execs.set('img', setImage);
		execs.set('smth', setSmoothing);
		execs.set('rct', setRectangle);
	}
	
	inline static private function setImage(target:BitmapFl, id:Int){
		target.swapImage(Control.bitmapDatas.get(id));
	}
	
	inline static private function setSmoothing(target:BitmapFl, smoothing:Bool){
		target.smoothing = target.bmp.smoothing = smoothing;
	}
	
	inline static private function setRectangle(target:BitmapFl, id:Int){
		target.swapRect(Control.rectangles.get(id));
	}
	
	private var bmp:Bitmap;
	private var smoothing:Bool;
	public var loaded(default, null):Bool;
	private var _img:IBitmapData;
	private var _rect:RectangleFl;
	
	public function new(id:Int){
		super(id);
		display = new flash.display.Sprite();
		smoothing = false;
		bmp = new Bitmap();
		display.addChild(bmp);
	}
	
	function swapImage( image : IBitmapData):Void{
		
		if(_img!=image) {
		
			if(_img!=null){
				//stop listening for load of previous image
				_img.unwatch(updateBitmap);
			}
			
			_img = image;
			
			if(_img != null){
				updateBitmap();
				
				//-- Listen for subsequent loads
				_img.watch(updateBitmap);
			}
			
		}
	}
	
	function swapRect(rect:RectangleFl):Void{
		if(_rect!=rect) {
		
			if(_rect!=null){
				//stop listening for change
				_rect.unwatch(updateBitmap);
			}
			
			_rect = rect;
						
			if(_rect!=null){
				//start listening for change
				_rect.watch(updateBitmap);
			}
			
			updateBitmap();
		}
	}
	
	function updateBitmap(?e:Event=null):Void{
		if(_img == null || !_img.ready){
				//-- clear old bitmapdata
				bmp.bitmapData = ImageFl.defaultData;	
		}else {
			if(_rect!=null) {
				//TODO : reuse bmpd if image changes but rect remains constant
				var cropBmpd = new BitmapData(Std.int(_rect.rect.width), Std.int(_rect.rect.height), true, 0);
				tmpMtx.tx = -_rect.rect.x;
				tmpMtx.ty = -_rect.rect.y;
				tmpRect.width = _rect.rect.width;
				tmpRect.height = _rect.rect.height;
				cropBmpd.draw(_img.bitmapData, tmpMtx, null, null, tmpRect, smoothing);
				bmp.bitmapData = cropBmpd;
			}else{
				//-- sync bitmapdata
				bmp.bitmapData = _img.bitmapData;
			}	
			
			bmp.smoothing = smoothing;		
		}	
	}
	
	/**
	 * Execute a method on this BitmapFl object
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
				throw 'no method mapped to "'+method+'" in BitmapFl';	
			}
		#end
	}	
}
