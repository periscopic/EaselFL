package display;

import flash.display.BitmapData;
import flash.events.IEventDispatcher;

interface IBitmapData{
	var dispatcher(default, null):IEventDispatcher;
	var bitmapData(default, null):BitmapData;
	var ready(default, null):Bool;
}
