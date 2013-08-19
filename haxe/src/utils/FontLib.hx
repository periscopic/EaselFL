package utils;
/**
 * NOTE: this is util is incomplete.
 */

	import flash.display.Loader;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.net.URLRequest;
	import flash.text.Font;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextLineMetrics;
	import flash.events.EventDispatcher;
	import flash.Lib;
	import haxe.Timer;
	

    class FontLib {
		
		static function __init__() {
			 dispatcher =  new EventDispatcher();
		}

		static private var _embedded:Map<String,Bool> = new Map<String,Bool>();
		static public var dispatcher(default, null):EventDispatcher;
		static private var tf:TextField;
		static private var fmt:TextFormat;
		static private var tmr:Timer;
		
		
		static public function isEmbedded(font:String) {
			return _embedded.get(font);
		}
		
		inline static public function embedFonts(a:Array<Dynamic>):Void {
			new FontLib(a[0], a[1]);
		}
		
		private var _fontList:Array<String>;

		private function new(fontList:Array<String>, filePath:String) {
			var loader:Loader = new Loader();
			_fontList = fontList;
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onFontLoaded);
			loader.addEventListener(IOErrorEvent.IO_ERROR, onFontLoadingFailed);
			loader.addEventListener(IOErrorEvent.NETWORK_ERROR, onFontLoadingFailed);
			loader.addEventListener(IOErrorEvent.VERIFY_ERROR, onFontLoadingFailed);
			loader.addEventListener(IOErrorEvent.DISK_ERROR, onFontLoadingFailed);
			loader.load(new URLRequest(filePath));
		}	

		function onFontLoaded(e:Event):Void {
			for(className in _fontList) {
				if(e.target.applicationDomain.hasDefinition(className)) {
					var FontClass:Dynamic = e.target.applicationDomain.getDefinition(className);					
					Font.registerFont(FontClass);
				}
			}
			
			noteFonts();
		}
		
		function noteFonts():Void {
			for(font in Font.enumerateFonts()) {
				if(!_embedded.exists(font.fontName)) {
					_embedded.set(font.fontName, true);
					dispatcher.dispatchEvent(new Event(font.fontName));
				}	
			}
		}
		
		
		function onFontLoadingFailed(e:IOErrorEvent):Void {			
			//trace("failed:");
			//trace(e);
		}
    
	}