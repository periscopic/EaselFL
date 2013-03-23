package display;

import interfaces.IExec;
import interfaces.IDisplayable;
import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.Lib;
import flash.display.Stage;
import flash.events.Event;
import flash.events.MouseEvent;

class StageFl extends ContainerFl {

	
	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static private function mapMethods(excs:Hash<Dynamic>) :Void {
		ContainerFl.mapMethods(excs);
		execs.set('blt', blit );
		execs.set('aclr', autoClear );
		execs.set('clr', clear );
	}
	
	static private function blit(target, ?nada:Dynamic) :Void {
		target.blitBitmapData.draw(target.display);
		target.blitBitmap.visible = true;
	}
	
	static private function autoClear(target, ?nada:Dynamic) :Void {
		target.blitBitmapData.fillRect(target.blitBitmapData.rect, 0);
		target.blitBitmap.visible = false;
		target.display.visible = true;
	}
	
	static private function clear(target, ?nada:Dynamic) :Void {
		target.blitBitmapData.fillRect(target.blitBitmapData.rect, 0);
		target.blitBitmap.visible = true;
		target.display.visible = false;
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
		stage.addEventListener(flash.events.MouseEvent.MOUSE_UP, handleStageUp, false, 0, true);
		stage.addEventListener(flash.events.MouseEvent.MOUSE_DOWN, handleStageDown, false, 0, true);
		handleResize(null);
	}
	
	private function handleStageUp(e:MouseEvent):Void {
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'stagemouseup'};
		Main.dispatch(evt);
	}
	
	private function handleStageDown(e:MouseEvent):Void {
		var evt:Dynamic = {stageX:e.stageX, stageY:e.stageY, type:'stagemousedown'};
		Main.dispatch(evt);
	}
	
	/**
	 * Create resized bitmap
	 */
	private function handleResize(e:Event):Void{
		blitBitmapData = new BitmapData(stage.stageWidth, stage.stageHeight, true, 0);
		blitBitmap.bitmapData = blitBitmapData;
	}
	
	/**
	 * Execute a method on this StageFl object
	 * @param String key corresponding to the method
	 * @param Array arguments for the method
	 */
	override public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		return execs.get(method)( this, arguments);		
	}
}
