package display;

import flash.Lib;


class Control {
	
	static public var items:Hash<IExec>;
	static public var containers:Hash<ContainerFl>;
	static public var displays:Hash<IDisplayable>;
	static public var bitmapDatas:Hash<IBitmapData>;
	static public var graphicsList:Hash<GraphicsFl>;
	static public var makers:Hash<String->Void>;
	static private var stageFl:ContainerFl;
	
	
	static public function init(){
		items = new Hash<IExec>();
		containers = new Hash<ContainerFl>();
		displays = new Hash<IDisplayable>();
		bitmapDatas = new Hash<IBitmapData>();
		graphicsList = new Hash<GraphicsFl>();
		makers = new Hash<String->Void>();
		
		makers.set('img', image);
		makers.set('bmp', bitmap);
		makers.set('shp', shape);
		makers.set('gfx', graphics);
		makers.set('cnt', container);
		makers.set('stg', stage);
		
		ImageFl.init();
		BitmapFl.init();
		ShapeFl.init();
		GraphicsFl.init();
		ContainerFl.init();
		
		//-- Define stage
		// TODO : make sure stage doesn't have issues arising from transforms being applied to it
		//stageFl = new ContainerFl( Lib.current.stage );
		//items.set('stage', stageFl);
		//displays.set('stage', stageFl);
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
	
	inline static public function invokeOn( cmd:Array<Dynamic> ):Dynamic{
		return items.get(cmd[0]).exec(cmd[1], cmd[2]);
	}
	
	inline static private function image(id:String):Void{
		var img:ImageFl = new ImageFl();
		items.set(id, img);
		bitmapDatas.set(id, img);
	}
	
	inline static private function bitmap(id:String):Void{
		var bmp:BitmapFl = new BitmapFl(id);
		items.set(id, bmp);
		displays.set(id, bmp);
	}
	
	inline static private function shape(id:String):Void{
		var shp:ShapeFl = new ShapeFl(id);
		items.set(id, shp);
		displays.set(id, shp);
	}
	
	inline static private function graphics(id:String):Void{
		var gfx:GraphicsFl = new GraphicsFl();
		items.set(id, gfx);
		graphicsList.set(id, gfx);
	}
	
	inline static private function container(id:String):Void{
		var cnt:ContainerFl = new ContainerFl(id);
		containers.set(id, cnt);
		displays.set(id, cnt);
		items.set(id, cnt);
	}	
	
	inline static private function stage(id:String):Void{
		//-- Alias stage as another ID
		//-- by assigning to an already created ContainerFl
		var cnt = containers.get(id);		
		cnt.display = cnt.container = Lib.current.stage;
		
		containers.set('stage', cnt);
		items.set('stage', cnt);
		displays.set('stage', cnt);
	}	
	
}
