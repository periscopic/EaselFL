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
import display.FrameFl;


class BitmapAnimationFl extends DisplayObjectFl, implements IExec {

	static private var execs:Hash<Dynamic>;
	static private var tmpMtx:Matrix = new Matrix();
	static private var tmpRect:Rectangle = new Rectangle();
	
	static public function init(){
		execs = new Hash();
		DisplayObjectFl.init(execs);
		execs.set('frm', setFrame);
		execs.set('smth', setSmoothing);
	}
	
	inline static private function setFrame(target:BitmapAnimationFl, frameID:Dynamic){
		target.swapFrame(Control.frames.get(frameID));		
	}
	
	inline static private function setSmoothing(target:BitmapAnimationFl, smoothing:Bool){
		target.smoothing = target.bmp.smoothing = smoothing;
	}
	
	private var bmp:Bitmap;
	private var smoothing:Bool;
	public var loaded(default, null):Bool;
	private var _frame:FrameFl;
	
	public function new(id:Int){
		super(id);
		display = new flash.display.Sprite();
		smoothing = false;
		bmp = new Bitmap();
		display.addChild(bmp);
	}
	
	function swapFrame( frame : FrameFl):Void{
		
		if(_frame!=frame) {
		
			if(_frame!=null){
				//stop listening for load of previous image
				_frame.unwatch(updateBitmap);
			}
			
			_frame = frame;
			
			if(_frame != null){
				updateBitmap();
				
				//-- Listen for subsequent loads
				_frame.watch(updateBitmap);
			}
		}
	}
	
	
	
	function updateBitmap(?e:Event=null):Void{
		if(_frame!=null) {
			bmp.bitmapData = _frame.bitmapData;	
			bmp.x = -_frame.regX;
			bmp.y = -_frame.regY;
			bmp.smoothing = smoothing;		
		}
	}
	
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in BitmapAnimationFl';	
			}
		#end
	}	
}
