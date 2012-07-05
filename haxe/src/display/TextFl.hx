package display;

import flash.text.TextField;
import flash.text.TextFormat;
import flash.text.TextLineMetrics;
import flash.text.TextFieldAutoSize;
import flash.text.TextFormatAlign;
import flash.display.Sprite;
import utils.CSSFont;
import utils.CSSColor;
import interfaces.IExec;
import flash.filters.GlowFilter;

class TextFl extends DisplayObjectFl, implements IExec {

	static private var execs:Hash<Dynamic>;
	
	inline static var LINE_DELIMITER:EReg = ~/(?:\r\n|\r|\n)/;
	inline static var WORD_DELIMITER:EReg = ~/(\s)/g;
	inline static var OUTLINE:GlowFilter = new GlowFilter(0, 1, 2, 2, 8, 1, false, true);
	
	static public function init(){
		execs = new Hash();
		mapMethods(execs);
	}
	
	static public function mapMethods(execs:Hash<Dynamic>) :Void{
		DisplayObjectFl.mapMethods(execs);
		execs.set('fnt', setFont);
		execs.set('clr', setColor);
		execs.set('txt', setText);
		execs.set('bsl', setTextBaseline);
		execs.set('lwd', setLineWidth);
		execs.set('lht', setLineHeight);
		execs.set('otl', setOutline);
		execs.set('aln', setTextAlign);
	}
	
	inline static private function getOutlineFilter(color:Int) {
		return new GlowFilter(color, 1, 1.1, 1.1, 16, 2, true, true);
	}

	inline static private function setFont(target:TextFl, cssFontString:String) {
		var fmt = target.fmt;
		CSSFont.parse(cssFontString);
		fmt.bold = CSSFont.bold;
		fmt.italic = CSSFont.italic;
		fmt.size = CSSFont.size;
		fmt.font = CSSFont.font;
		target.tf.setTextFormat(target.fmt);
		target.tf.defaultTextFormat = target.fmt;
		target.updateBaseline();		
	}
	
	inline static private function setColor(target:TextFl, cssColorString:String) {
		CSSColor.parse(cssColorString);
		target.fmt.color = CSSColor.color;
		target.tf.alpha = CSSColor.alpha;
		target.tf.setTextFormat(target.fmt);
		target.tf.defaultTextFormat = target.fmt;
		
		if(target.outline) {
			target.tf.filters = [getOutlineFilter(target.fmt.color)];
		}
	}
	
	inline static private function setOutline(target:TextFl, outline:Bool) {
		target.outline = outline;
		if(outline) {
			target.tf.filters = [getOutlineFilter(target.fmt.color)];
		}else{
			target.tf.filters = null;
		}
	}
	
	inline static private function setLineWidth(target:TextFl, wd:Dynamic) {		
		target.lineWidth = wd;
		target.updateText();
		target.updateAlign();
	}
	
	inline static private function setLineHeight(target:TextFl, ht:Dynamic) {
		target.lineHeight = ht;		
		target.updateLineHeight();
	}
	
	inline static private function setTextAlign(target:TextFl, align:String) {
		target.align = align;
		target.updateAlign();
	}
	
	inline static private function setTextBaseline(target:TextFl, baseline:String) {
		target.baseline = baseline;
		target.updateBaseline();
	}
	
	
	
	
	
	inline static public function setText(target:TextFl, text:String) {
		target.text = text;
		target.updateText();
	}
	

	private var tf:TextField;
	private var fmt:TextFormat;
	private var baseline:String;
	private var align:String;
	private var text:String;
	private var lineWidth:Float;
	private var lineHeight:Float;
	private var outline:Bool;
	
	public function new(id:Int) {
		super(id);
		
		outline = false;
		tf = new TextField();
		tf.autoSize = TextFieldAutoSize.LEFT;
		tf.selectable = false;
		fmt = new TextFormat();
		tf.defaultTextFormat = fmt;
		text = '';
	
		display = new Sprite();
		display.addChild(tf);
		baseline = 'alphabetic';
	}
	
	function updateBaseline():Void {
		var metrics:TextLineMetrics = tf.getLineMetrics(0);
	
		//ultimately 'hanging', 'ideographic' should be treated differently
		switch(baseline) {
			
			case 'top', 'hanging': 
				tf.y = -2;
				
			case 'bottom':
				tf.y = - (metrics.ascent + metrics.descent + 2);
				
			case 'middle':
				tf.y = - ((metrics.ascent + metrics.descent) * 0.5 +2);	
			
			default: //'alphabetic', 'ideographic', null
				tf.y = - (metrics.ascent + 2);		
		}	
	}
	
	function updateLineHeight():Void{
		if(Math.isNaN(lineHeight)){
			fmt.leading = null;
			
		}else{
			var metrics:TextLineMetrics = tf.getLineMetrics(0);
			fmt.leading = lineHeight - (metrics.ascent + metrics.descent);
		}

		tf.setTextFormat(fmt);
		tf.defaultTextFormat = fmt;
	}
	
	function updateAlign():Void {
		
		// ultimately start, end should be treated differntly
		switch(align) {
			
			case 'end', 'right':
				tf.x = -tf.width;
				fmt.align = TextFormatAlign.RIGHT;
				tf.autoSize = TextFieldAutoSize.RIGHT;
				
			case 'center':
				tf.x = -tf.width*0.5;
				fmt.align = TextFormatAlign.CENTER;	
				tf.autoSize = TextFieldAutoSize.CENTER;
			
			default: //'start', 'left'
				tf.x = 0;
				fmt.align = TextFormatAlign.LEFT;
				tf.autoSize = TextFieldAutoSize.LEFT;
		}
		
		tf.setTextFormat(fmt);
	}
	
	
	/**
	 * Mimic the text application in EaselJS since we want as close as possible
	 * a match to that output.
	 */
	function updateText():Void {
		if(Math.isNaN(lineWidth)){
			tf.text = text;
		}else{

			var lines:Array<String> = LINE_DELIMITER.split(text);
			var finalLines:Array<String> = [];
			var words:Array<String>;
			var line:String;
			var str;
			var metrics:TextLineMetrics;
			
			for( line in lines) {
				
				
				tf.text = line;
				metrics = tf.getLineMetrics(0);
				if(metrics.width < lineWidth) {
					finalLines.push(line);
					continue;
				}
				
				//pass the AS3 native regexp to the AS3 String.split
				//since we want the white space characters included
				words = line.split( untyped WORD_DELIMITER.r );
				str = words[0];
				
				var i =1;
				var l = words.length;
				
				while(i<l) {
					tf.text = str + words[i] + words[i+1];
					metrics = tf.getLineMetrics(0);

					if(metrics.width > lineWidth) {
						
						//add whitespace character to end of last line
						str += words[i];
						
						finalLines.push(str);
						
						str = words[i+1]; //words[i] + words[i+1];
					}else{
						str += words[i] + words[i+1];
					}
					
					i+=2;
				}
				
				finalLines.push(str);
				tf.text = finalLines.join('\n');
			}
		}
	}
	
	inline public function exec(method:String, ?arguments:Dynamic=null):Dynamic{
		#if debug
			if(execs.exists(method)){
		#end
		
		return execs.get(method)( this, arguments);
		
		#if debug
			} else {
				throw 'no method mapped to "'+method+'" in TextFl';	
			}
		#end
	}
	
}
