package interfaces;

import flash.display.BitmapData;
import flash.events.IEventDispatcher;

interface IBitmapData extends IWatchable {
	var bitmapData(default, null):BitmapData;
	var ready(default, null):Bool;
}
