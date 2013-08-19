//TODO : check if EventDispatcher is best method

package geom;

	import flash.geom.Rectangle;
	import interfaces.IExec;
	import interfaces.IWatchable;
	import flash.events.EventDispatcher;
	import flash.events.Event;
	
class RectangleFl implements IExec implements IWatchable {
	
	inline static var RECT_CHANGE:String = 'rectChange';
	static var dispatcher:EventDispatcher = new EventDispatcher();

	static public function init() {
		//currently only one executable method implemented; nothing to do	
	}


	//-- instance
	
	public var rect:Rectangle;
	private var eventID:String;
	
	public function new(id:Int) {
		rect = new Rectangle();
		eventID = RECT_CHANGE + id;
	}
	
	inline public function watch(method:Dynamic->Void):Void {
		dispatcher.addEventListener(eventID, method, false, 0, true);
	}
	
	inline public function unwatch(method:Dynamic->Void):Void {
		dispatcher.removeEventListener(eventID, method, false);
	}
	
	private function dimensions(args:Dynamic):Dynamic {
		rect.x = args[0];
		rect.y = args[1];
		rect.width = args[2];
		rect.height = args[3];
		dispatcher.dispatchEvent(new Event(eventID));
		return null;
	}
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		//-- currently there is nothing you can do except set the dimension
		//-- so do that instead of looking up the method and then executing
		return this.dimensions(arguments);
	}
}
