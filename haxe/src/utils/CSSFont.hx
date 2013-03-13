package utils;

import flash.text.TextField;
import flash.text.TextFormat;



class CSSFont {

	inline static var boldRgx:EReg = ~/^(?:bold|regular)/i;
	inline static var italicRgx:EReg = ~/^(?:italic|oblique|normal)$/i;

	inline static var DEFAULT_FONT:String = 'Arial';
	inline static var DEFAULT_SIZE:Float = 13;
	
	static public var font(default, null):String;
	static public var size(default, null):Float;
	static public var bold(default, null):Bool;
	static public var italic(default, null):Bool;
	
	static public function parse(str:String) {
		font = null;
		size = DEFAULT_SIZE;
		bold = false;
		italic = false;
		
		
		var chunkRgx = ~/(?:("|').+?(\1))|(?:\b\S+?\b)/; //'"
		var sizeRgx =  ~/\b(\d+\.{0,1}\d*)(?:px|pt)\b/i;		
		var parts:Array<String> = [];		

		//-- break into individual chunks, either quoted groups 
		//-- (for some font names) or by word boundaries 		
		while(chunkRgx.match(str)) {
			parts.push(chunkRgx.matched(0));
			str = chunkRgx.matchedRight();
		}		
		
		//-- process each chunk
		for(part in parts) {
			//-- font size
			if(sizeRgx.match(part)) {
				try{
					size = Std.parseFloat(sizeRgx.matched(1));
				}catch(e:Dynamic) {}
				
			//-- font weight
			}else if(boldRgx.match(part)) {// && boldRgx.matchedPos().pos==0) {
				bold = (part.toUpperCase()!='REGULAR');
				
			//-- font style (posture)
			}else if(italicRgx.match(part)) {// && italicRgx.matchedLeft().length==0) {
				italic = (part.toUpperCase()!='NORMAL');
				
			//-- font name
			}else {
				if(font==null) {
					font = StringTools.replace(StringTools.replace(part, '"', ''), "'", '');
				}
			}
		}
		
		font = font!=null ? font : DEFAULT_FONT;
		size = !Math.isNaN(size) ? size : DEFAULT_SIZE;
	}
	
	/*public function toString() :String {
		return '{ font : '+font+', size : '+size+', bold : '+bold+', italic : '+italic+' }';
	}*/
	
}
