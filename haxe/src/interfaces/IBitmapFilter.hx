package interfaces;

import flash.display.BitmapData;
import flash.events.IEventDispatcher;
import flash.filters.BitmapFilter;

interface IBitmapFilter {
	var filter(default, null):BitmapFilter;
}
