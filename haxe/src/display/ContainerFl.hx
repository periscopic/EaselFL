package display;

import flash.display.Sprite;
import flash.display.DisplayObjectContainer;
import flash.display.DisplayObject;
import interfaces.IExec;
import interfaces.IDisplayable;

class ContainerFl extends DisplayObjectFl, implements IExec {
	
/**
 * TODO: handle sortChildren, getObjectsUnderPoint, clone
 **/
	
	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static public function mapMethods(excs:Hash<Dynamic>) :Void{
		DisplayObjectFl.mapMethods(excs);
		excs.set('ac', addChild );
		excs.set('aca', addChildAt );
		excs.set('rc', removeChild );
		excs.set('rca', removeChildAt );
		excs.set('rac', removeAllChildren);
		excs.set('sc', swapChildren);
		excs.set('sca', swapChildrenAt);
	}
	
	inline static private function addChild(target:ContainerFl, id:Int):Void{
		target.container.addChild(Control.displays.get(id).display);	
	}
	
	/**
	 * Add child at index; props is array in form ['id', index]
	 */
	inline static private function addChildAt(target:ContainerFl, props:Array<Dynamic>):Void{
		target.container.addChildAt(Control.displays.get(props[0]).display, props[1]);	
	}
	
	inline static private function removeChild(target:ContainerFl, id:Int):Void{
		// Since child add/remove is not synchronously called, and are added to flush in
		// an order that is based on the position in the display tree, it is possible
		// that a child will be added to another container, and then removal attempted
		// afterward, even if the calls were made in the correct order in JS
		var child = Control.displays.get(id).display;
		if(child.parent==target.container){
			target.container.removeChild(child);	
		}
	}
	
	inline static private function removeChildAt(target:ContainerFl, index:Int):Void{
		if(target.container.numChildren>index) {
			target.container.removeChildAt(index);
		}
			
	}
	
	inline static private function removeAllChildren(target:ContainerFl, ?nada:Dynamic):Void{
		var numChildren = target.container.numChildren;
		while(numChildren-->0){
			target.container.removeChildAt(numChildren);
		}
	}
	
	inline static private function swapChildren(target:ContainerFl, props:Array<Dynamic>):Void{
		target.container.swapChildren(Control.displays.get(props[0]).display,Control.displays.get(props[1]).display);
	}
	
	inline static private function swapChildrenAt(target:ContainerFl, props:Array<Int>):Void{
		target.container.swapChildrenAt(props[0], props[1]);
	}
	
	public var container:Sprite;
	
	public function new(id:Int){
		super(id);
		display = this.container = new Sprite();
	}
	
	public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no command mapped to "'+method+'" in ContainerFl';	
			}
		#end
	}
}

