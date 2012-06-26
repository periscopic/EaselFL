package;

import flash.Lib;
import interfaces.IExec;
import interfaces.IDisplayable;
import interfaces.IBitmapData;
import display.ContainerFl;
import display.BitmapFl;
import display.BitmapAnimationFl;
import display.ShapeFl;
import display.GraphicsFl;
import display.ImageFl;
import display.FrameFl;
import geom.RectangleFl;


class Control {
	
	static public var items:IntHash<IExec>;
	static public var containers:IntHash<ContainerFl>;
	static public var displays:IntHash<IDisplayable>;
	static public var bitmapDatas:IntHash<IBitmapData>;
	static public var bmpAnimations:IntHash<BitmapAnimationFl>;
	static public var graphicsList:IntHash<GraphicsFl>;
	static public var rectangles:IntHash<RectangleFl>;
	static public var frames:IntHash<FrameFl>;
	static public var makers:Hash<Int->Void>;
	static public var stageFl:ContainerFl;
	
	//static private var valid:Bool = true;
	//inline static var UPDATE_INTERVAL:Int = 17; //check every 5ms
	
	
	static public function init(){
		items = new IntHash<IExec>();
		containers = new IntHash<ContainerFl>();
		displays = new IntHash<IDisplayable>();
		bitmapDatas = new IntHash<IBitmapData>();
		bmpAnimations = new IntHash<BitmapAnimationFl>();
		graphicsList = new IntHash<GraphicsFl>();
		rectangles = new IntHash<RectangleFl>();
		frames = new IntHash<FrameFl>();
		makers = new Hash<Int->Void>();
		
		makers.set('img', image);
		makers.set('bmp', bitmap);
		makers.set('ban', bitmapAnimation);
		makers.set('shp', shape);
		makers.set('gfx', graphics);
		makers.set('cnt', container);
		makers.set('stg', stage);
		makers.set('rct', rectangle);
		makers.set('frm', frame);
		
		ImageFl.init();
		BitmapFl.init();
		ShapeFl.init();
		GraphicsFl.init();
		ContainerFl.init();
		RectangleFl.init();
		BitmapAnimationFl.init();
		FrameFl.init();
		
		
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
	 * Takes a list of change commands [['002','f',['#FF0000', 0.5]], ...] 
	 */
	inline static public function changeItems(a:Array<Array<Dynamic>>):Void{
		for(cmd in a){
			//-- Get item by id and delegate execution to it
			items.get(cmd[0]).exec(cmd[1], cmd[2]);			
		}
	}
	
	/*
	 * Takes a command that is in form ['002','hitTestPoint',[100, 100]] 
	 */
	
	inline static public function invoke( cmd:Dynamic ):Dynamic{
		return items.get(cmd[0]).exec(cmd[1], cmd[2]);
	}
	
	inline static private function image(id:Int):Void{
		var img:ImageFl = new ImageFl(id);
		items.set(id, img);
		bitmapDatas.set(id, img);
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
	
	inline static private function shape(id:Int):Void{
		var shp:ShapeFl = new ShapeFl(id);
		items.set(id, shp);
		displays.set(id, shp);
	}
	
	inline static private function graphics(id:Int):Void{
		var gfx:GraphicsFl = new GraphicsFl();
		items.set(id, gfx);
		graphicsList.set(id, gfx);
	}
	
	inline static private function container(id:Int):Void{
		var cnt:ContainerFl = new ContainerFl(id);
		containers.set(id, cnt);
		displays.set(id, cnt);
		items.set(id, cnt);
	}
	
	inline static private function rectangle(id:Int):Void{
		var rct:RectangleFl = new RectangleFl(id);
		rectangles.set(id, rct);
		items.set(id, rct);
	}	
	
	inline static private function frame(id:Int):Void{
		var frm:FrameFl = new FrameFl(id);
		frames.set(id, frm);
		items.set(id, frm);
	}
	
	inline static private function stage(id:Int):Void{
		//-- Alias stage as another ID
		//-- by assigning to an already created ContainerFl
		var cnt = containers.get(id);		
		//cnt.display = cnt.container = Lib.current.stage;
		Lib.current.stage.addChild(cnt.display);
		stageFl = cnt;
		/*containers.set('stage', cnt);
		items.set('stage', cnt);
		displays.set('stage', cnt);*/
	}	
	
}
