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
		excs.set('dl', syncDisplayList);	 
	}
	
	inline static function syncDisplayList(target:ContainerFl, ids:Array<Int>) {
		var childIDs = target.childIDs;
		var ci:Int = 0;
		var i:Int = 0;
		var container:Sprite = target.container;
		
		//iterate while there are still some of both
		while(ci<childIDs.length && i<ids.length) {
			if(childIDs[ci]!=ids[i]) {
				//remove from existing if not equal
				container.removeChildAt(ci);
				childIDs.slice(ci, 1);
			} else {
				//skip any that are equal
				ci+=1;
				i+=1;
			}
		}
		
		//remove excess existing children
		while(childIDs.length>i) {
			childIDs.pop();
			container.removeChildAt(childIDs.length);
		}
		
		//add any remaining new children
		while(i<ids.length) {
			childIDs.push(ids[i]);
			container.addChild(Control.displays.get(ids[i]).display);
			i+=1;
		}
	}
	
	public var container:Sprite;
	private var childIDs:Array<Int>;
	
	public function new(id:Int){
		super(id);
		display = this.container = new Sprite();
		childIDs = [];
	}
	
	/**
	 * Execute a method on this ContainerFl object
	 * @param String key corresponding to the method
	 * @param Array arguments for the method
	 */
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

