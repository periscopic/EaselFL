
package display;

	import flash.events.EventDispatcher;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.geom.Rectangle;
	import flash.display.BitmapData;
	import Control;
	import interfaces.IBitmapData;
	import interfaces.IExec;
	import interfaces.IWatchable;
	
class FrameFl implements IExec, implements IWatchable {
	
	inline static var FRAME_CHANGE:String = 'frameChange';
	static private var dispatcher:EventDispatcher = new EventDispatcher();
	static private var tmpMtx:Matrix = new Matrix();
	static private var tmpRect:Rectangle = new Rectangle();

	static public function init() {
		//currently only one executable method implemented; nothing to do	
	}


	//-- instance
	
	public var bitmapData:BitmapData;
	public var x(default, null):Float;
	public var y(default, null):Float;
	public var width(default, null):Float;
	public var height(default, null):Float;
	public var regX(default, null):Float;
	public var regY(default, null):Float;
	
	private var _img:IBitmapData;
	private var _eventID:String;
	private var _initialized:Bool;
	
	public function new(id:Int) {
		_eventID = FRAME_CHANGE + id;
	}
	
	inline public function watch(method:Dynamic->Void):Void {
		dispatcher.addEventListener(_eventID, method, false, 0, true);
	}
	
	inline public function unwatch(method:Dynamic->Void):Void {
		dispatcher.removeEventListener(_eventID, method, false);
	}
	
	private function initialize(args:Dynamic):Void {
		if(!this._initialized) {
			this._initialized = true;
			this._img = Control.bitmapDatas.get(args[0]);
			this.x = args[1];
			this.y = args[2];
			this.width = args[3];
			this.height = args[4];
			this.regX = args[5];
			this.regY = args[6];
			
			if(_img.ready){
				updateBitmap();
			}else{
				bitmapData = ImageFl.defaultData;
			}
			
			this._img.watch(updateBitmap);
		}
	}
	
	function updateBitmap(?e:Event=null):Void{
		if(!_img.ready){
				//-- clear old bitmapdata
				this.bitmapData = ImageFl.defaultData;	
		}else {
			if(x==0 && y==0 && width==_img.bitmapData.width && height==_img.bitmapData.height) {
				//-- sync bitmapdata
				bitmapData = _img.bitmapData.clone();
			}else{
				var cropBmpd = new BitmapData(Std.int(width), Std.int(height), true, 0);
				tmpMtx.tx = -x;
				tmpMtx.ty = -y;
				tmpRect.width = width;
				tmpRect.height = height;
				cropBmpd.draw(_img.bitmapData, tmpMtx, null, null, tmpRect);
				bitmapData = cropBmpd;
			}				
		}	
		
		dispatcher.dispatchEvent(new Event(_eventID));
	}
	
	/**
	 * Execute a method on this FrameFl object
	 * @param String key corresponding to the method
	 * @param Array arguments for the method
	 */
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		//-- currently there is nothing you can do except set the dimension
		//-- so do that instead of looking up the method and then executing
		return this.initialize(arguments);
	}
}
