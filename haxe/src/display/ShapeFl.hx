package display;

import flash.display.Sprite;
import flash.display.DisplayObject;
import interfaces.IExec;
import interfaces.IDisplayable;

class ShapeFl extends DisplayObjectFl, implements IExec {


	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static public function mapMethods(execs:Hash<Dynamic>) :Void{
		DisplayObjectFl.mapMethods(execs);
		execs.set('gfx', linkGraphics);
	}
	
	inline static private function linkGraphics(target:ShapeFl, id:Int){
		Control.graphicsList.get(id).link(target.shape.graphics);
	}

	//Shapes are mapped to Sprite in order to have mouse events
	private var shape:Sprite;
	
	public function new(id:Int){
		super(id);		
		display = shape = new Sprite();
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
