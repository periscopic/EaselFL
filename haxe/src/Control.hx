package;

import flash.Lib;
import interfaces.IExec;
import interfaces.IDisplayable;
import interfaces.IBitmapData;
import interfaces.IBitmapFilter;
import display.StageFl;
import display.ContainerFl;
import display.BitmapFl;
import display.BitmapAnimationFl;
import display.ShapeFl;
import display.GraphicsFl;
import display.ImageFl;
import display.FrameFl;
import display.TextFl;
import display.ShadowFl;
import filters.ColorMatrixFilterFl;
import filters.ColorFilterFl;
import filters.BoxBlurFilterFl;
import geom.RectangleFl;
import flash.events.EventDispatcher;
import flash.events.Event;
import utils.CSSFont;
import utils.FontLib;


class Control {
	
	static public var items:Map<Int,IExec>;
	static public var containers:Map<Int,ContainerFl>;
	static public var displays:Map<Int,IDisplayable>;
	static public var bitmapDatas:Map<Int,IBitmapData>;
	static public var bmpAnimations:Map<Int,BitmapAnimationFl>;
	static public var graphicsList:Map<Int,GraphicsFl>;
	static public var rectangles:Map<Int,RectangleFl>;
	static public var frames:Map<Int,FrameFl>;
	static public var texts:Map<Int,TextFl>;
	static public var shadows:Map<Int,ShadowFl>;
	static public var filters:Map<Int,IBitmapFilter>;
	static public var commands:Map<String,Dynamic->Void>;
	static public var makers:Map<String,Int->Void>;
	static public var unmakers:Map<String,Int->Void>;
	static public var dispatcher:EventDispatcher;
	
	static public var stageFl:StageFl;
	
	static public function init(){
		dispatcher = new EventDispatcher();
		
		items = new Map();
		containers = new Map();
		displays = new Map();
		bitmapDatas = new Map();
		bmpAnimations = new Map();
		graphicsList = new Map();
		rectangles = new Map();
		frames = new Map();
		texts = new Map();
		shadows = new Map();
		filters = new Map();
		commands = new Map();
		makers = new Map();
		unmakers = new Map();
		
		makers.set('stg', stage);
		makers.set('img', image);
		makers.set('bmp', bitmap);
		makers.set('ban', bitmapAnimation);
		makers.set('dom', shape); //DOMElement currently uses an empty shape to simplify display list issues
		makers.set('shp', shape);
		makers.set('gfx', graphics);
		makers.set('cnt', container);
		makers.set('rct', rectangle);
		makers.set('frm', frame);
		makers.set('shd', shadow);
		makers.set('cmtxfl', colorMatrixFilter);
		makers.set('clrfl', colorFilter);
		makers.set('bxblr', boxBlurFilter);
		makers.set('txt', text);
		
		unmakers.set('img', unimage);
		unmakers.set('bmp', unbitmap);
		unmakers.set('ban', unbitmapAnimation);
		unmakers.set('dom', unshape);
		unmakers.set('shp', unshape);
		unmakers.set('gfx', ungraphics);
		unmakers.set('cnt', uncontainer);
		unmakers.set('rct', unrectangle);
		unmakers.set('frm', unframe);
		unmakers.set('shd', unshadow);
		unmakers.set('cmtxfl', unFilter);
		unmakers.set('clrfl', unFilter);
		unmakers.set('bxblr', unFilter);
		unmakers.set('txt', untext);
		
		commands.set('fnts', FontLib.embedFonts);
		
		ImageFl.init();
		BitmapFl.init();
		ShapeFl.init();
		GraphicsFl.init();
		ContainerFl.init();
		RectangleFl.init();
		BitmapAnimationFl.init();
		FrameFl.init();
		TextFl.init();
		ShadowFl.init();
		ColorMatrixFilterFl.init();
		ColorFilterFl.init();
		BoxBlurFilterFl.init();
		StageFl.init();
	}
	
	inline static public function runCommands(a:Array<Array<Dynamic>>):Void {
		for(cmd in a) {
			commands.get(cmd[0])(cmd[1]);
		}
	}
	
	
	/*
	 * Takes a list of creation commands [ ['type','id'], ...] 
	 */
	inline static public function createItems(a:Array<Array<Dynamic>>):Void{
		for(baby in a){
			if(baby.length==2){
				makers.get(baby[0])(baby[1]);
			}			
		}
	}
	
	/*
	 * Takes a list of destruction commands [ ['type','id'], ...] 
	 */
	inline static public function destroyItems(a:Array<Array<Dynamic>>):Void{
		for(crone in a){
			if(crone.length==2){
				unmakers.get(crone[0])(crone[1]);
			}			
		}
		
		#if debug 
			//force garbage collection for testing
			//see http://gskinner.com/blog/archives/2006/08/as3_resource_ma_2.html
			try {
				new flash.net.LocalConnection().connect('foo');
				new flash.net.LocalConnection().connect('foo');
			} catch (e:Dynamic) {}
		#end
	}
	
	/*
	 * Takes a list of change commands [['002','f',['#FF0000', 0.5]], ...] 
	 */
	inline static public function changeItems(a:Array<Array<Dynamic>>):Void{
		for(cmd in a){
			//-- Get item by id and delegate execution to it
			items.get(cmd[0]).exec(cmd[1], cmd[2]);			
		}
		dispatcher.dispatchEvent(new Event('CHANGES_COMPLETE'));
	}
	
	/*
	 * Takes a command that is in form ['002','hitTestPoint',[100, 100]] 
	 */
	
	inline static public function invoke( cmd:Dynamic ):Dynamic{
		return items.get(cmd[0]).exec(cmd[1], cmd[2]);
	}
	
	inline static private function unimage(id:Int):Void{
		items.remove(id);
		bitmapDatas.remove(id);
	}
	
	inline static private function image(id:Int):Void{
		var img:ImageFl = new ImageFl(id);
		items.set(id, img);
		bitmapDatas.set(id, img);
	}
	
	inline static private function unbitmap(id:Int):Void{
		items.remove(id);
		displays.remove(id);
	}
	
	inline static private function bitmap(id:Int):Void{
		var bmp:BitmapFl = new BitmapFl(id);
		items.set(id, bmp);
		displays.set(id, bmp);
	}
	
	inline static private function bitmapAnimation(id:Int):Void{
		var bmpAnim:BitmapAnimationFl = new BitmapAnimationFl(id);
		items.set(id, bmpAnim);
		displays.set(id, bmpAnim);
		bmpAnimations.set(id, bmpAnim);
	}
	
	inline static private function unbitmapAnimation(id:Int):Void {
		//TODO: verify, destroy call may not actually be necessary
		bmpAnimations.get(id).destroy();
		items.remove(id);
		displays.remove(id);
		bmpAnimations.remove(id);
	}
	
	inline static private function shape(id:Int):Void{
		var shp:ShapeFl = new ShapeFl(id);
		items.set(id, shp);
		displays.set(id, shp);
	}
	
	inline static private function unshape(id:Int):Void{
		displays.get(id).destroy();
		items.remove(id);
		displays.remove(id);
	}
	
	inline static private function graphics(id:Int):Void{
		var gfx:GraphicsFl = new GraphicsFl();
		items.set(id, gfx);
		graphicsList.set(id, gfx);
	}
	
	inline static private function ungraphics(id:Int):Void{
		items.remove(id);
		graphicsList.remove(id);
	}
	
	inline static private function container(id:Int):Void{
		var cnt:ContainerFl = new ContainerFl(id);
		containers.set(id, cnt);
		displays.set(id, cnt);
		items.set(id, cnt);
	}
	
	inline static private function uncontainer(id:Int):Void{
		containers.get(id).destroy();
		containers.remove(id);
		displays.remove(id);
		items.remove(id);
	}
	
	inline static private function rectangle(id:Int):Void{
		var rct:RectangleFl = new RectangleFl(id);
		rectangles.set(id, rct);
		items.set(id, rct);
	}
	
	inline static private function unrectangle(id:Int):Void{
		rectangles.remove(id);
		items.remove(id);
	}	
	
	inline static private function frame(id:Int):Void{
		var frm:FrameFl = new FrameFl(id);
		frames.set(id, frm);
		items.set(id, frm);
	}
	
	inline static private function unframe(id:Int):Void{
		//TODO: verify, destroy call may not actually be necessary
		frames.get(id).destroy();
		frames.remove(id);
		items.remove(id);
	}	
	
	inline static private function text(id:Int):Void{
		var txt:TextFl = new TextFl(id);
		displays.set(id, txt);
		texts.set(id, txt);
		items.set(id, txt);
	}
	
	inline static private function untext(id:Int):Void {
		texts.get(id).destroy();
		displays.remove(id);
		texts.remove(id);
		items.remove(id);
	}
	
	inline static private function shadow(id:Int):Void{
		var sh:ShadowFl = new ShadowFl(id);
		shadows.set(id, sh);
		items.set(id, sh);
	}
	
	inline static private function unshadow(id:Int):Void{
		shadows.remove(id);
		items.remove(id);
	}
	
	inline static private function colorMatrixFilter(id:Int):Void{
		var flt:ColorMatrixFilterFl = new ColorMatrixFilterFl(id);
		filters.set(id, flt);
		items.set(id, flt);
	}
	
	inline static private function colorFilter(id:Int):Void{
		var flt:ColorFilterFl = new ColorFilterFl(id);
		filters.set(id, flt);
		items.set(id, flt);
	}
	
	inline static private function boxBlurFilter(id:Int):Void{
		var flt:BoxBlurFilterFl = new BoxBlurFilterFl(id);
		filters.set(id, flt);
		items.set(id, flt);
	}
	
	inline static private function unFilter(id:Int):Void{
		filters.remove(id);
		items.remove(id);
	}
	
	
	inline static private function stage(id:Int):Void{
		//-- Alias another container as Stage
		//-- The EaselFl 'stage' is a child of the Flash stage
		//-- (Flash stage itself doesn't not have all the interactive object
		//-- characteristics necessary for Easel stage)

		var stg = new StageFl(id, Lib.current.stage);
		containers.set(id, stg);
		displays.set(id, stg);
		items.set(id, stg);
		Lib.current.stage.addChild(stg.blitBitmap);
		Lib.current.stage.addChild(stg.display);
		stageFl = stg;
	}	
}
