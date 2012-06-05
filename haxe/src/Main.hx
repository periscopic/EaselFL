/**
 * TODO : 
 * - hitTestPoint : problematic if drawing commands haven't been flushed to Flash
 * - mouseenabled won't work on bitmap or shape ? wrap when necessary?
 * 
 */

package ;

import flash.Lib;
import flash.display.Sprite;
import flash.display.Stage;
import display.Control;
import flash.external.ExternalInterface;
import flash.events.Event;


class Main {
	
	static inline var DEFAULT_ID:String='EaselFl_001';

	static private var callbackMethod:String;
	
	public static function main() {		
		new Main();
	}
	
	public function new(){
		//-- Wait to init until after stage created
		if(Lib.current.stage!=null){
			addedToStage();
		}else{
			Lib.current.addEventListener(Event.ADDED_TO_STAGE, addedToStage);
		}
	}
	
	private function addedToStage(?evt:Event=null):Void{

		//-- Wait to init util stage initialized
		if(Std.is(Lib.current.stage.stageWidth , Int )){
			init();
		}else{
			Lib.current.stage.loaderInfo.addEventListener(Event.INIT, init);
		}	
	}
	
	static public function dispatch(evt:Dynamic):Void{
		ExternalInterface.call(callbackMethod, evt);
	}
	
	private function init(?evt:Event=null):Void{
		
		Lib.current.stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
		
		//-- Can anything be done but fail silently?
		//-- Perhaps flash without external interface can
		//-- be detected in JS earlier?
		if (ExternalInterface.available == false) {
            return;
        }
		
		var flashVars:Dynamic = Lib.current.loaderInfo.parameters;
		var id:String = Reflect.hasField( flashVars, 'id') ? Reflect.field( flashVars, 'id') : DEFAULT_ID;
		
		//-- Setup interface classes
		Control.init();
		
		//-- Add JS  method
		ExternalInterface.addCallback('create', Control.createItems);
		ExternalInterface.addCallback('change', Control.changeItems);
		ExternalInterface.addCallback('invokeOn', Control.invokeOn);	
		//-- Notify JS the module is ready
		callbackMethod = 'CanvasFl._flHooks.'+id;
		ExternalInterface.call(callbackMethod);		
	}
}




