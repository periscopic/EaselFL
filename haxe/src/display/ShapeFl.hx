package display;

import flash.display.Shape;
import flash.display.DisplayObject;

class ShapeFl extends DisplayObjectFl, implements IExec, implements IDisplayable{


	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		DisplayObjectFl.init(execs);
		execs.set('gfx', linkGraphics);
	}
	
	inline static private function linkGraphics(target:ShapeFl, id:String){
		Control.graphicsList.get(id).link(target.shape.graphics);
	}

	private var shape:Shape;
	
	public function new(){
		super();		
		display = shape = new Shape();
	}
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in ShapeFl';	
			}
		#end
	}
}
