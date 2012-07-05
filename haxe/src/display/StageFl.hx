/* TEST */package display;

import interfaces.IExec;
import interfaces.IDisplayable;
import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.Lib;
import flash.display.Stage;
import flash.events.Event;

class StageFl extends ContainerFl {

	
	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static private function mapMethods(excs:Hash<Dynamic>) :Void {
		ContainerFl.mapMethods(excs);
		execs.set('blt', blit );
		execs.set('clr', clear );
	}
	
	static private function blit(target, ?nada:Dynamic) :Void {
		target.blitBitmapData.draw(target.display);
		target.blitBitmap.visible = true;
	}
	
	static private function clear(target, ?nada:Dynamic) :Void {
		target.blitBitmapData.fillRect(target.blitBitmapData.rect, 0);
		target.blitBitmap.visible = false;
	}
	
	public var blitBitmap(default, null):Bitmap;
	private var blitBitmapData:BitmapData;
	private var stage:Stage;
	
	public function new(id:Int, stage:Stage){
		super(id);
		blitBitmap = new Bitmap();
		blitBitmap.visible = false;
		this.stage = stage;
		stage.addEventListener(Event.RESIZE, handleResize, false, 0, true);
		handleResize(null);
	}
	
	/**
	 * Create resized bitmap
	 */
	private function handleResize(e:Event):Void{
		blitBitmapData = new BitmapData(stage.stageWidth, stage.stageHeight, true, 0);
		blitBitmap.bitmapData = blitBitmapData;
	}
	
	override public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		return execs.get(method)( this, arguments);		
	}
}
