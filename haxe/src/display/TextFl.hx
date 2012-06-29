package display;

import flash.text.TextField;
import flash.text.TextFormat;
import flash.display.Sprite;
import utils.CSSFont;
import utils.CSSColor;
import interfaces.IExec;

class TextFl extends DisplayObjectFl, implements IExec {

	static private var execs:Hash<Dynamic>;
	
	static public function init(){
		execs = new Hash();
		DisplayObjectFl.init(execs);
		execs.set('fnt', setFont);
		execs.set('clr', setColor);
		execs.set('txt', setText);
	}

	inline static public function setFont(target:TextFl, cssFontString:String) {
		var fmt = target.fmt;
		CSSFont.parse(cssFontString);
		fmt.bold = CSSFont.bold;
		fmt.italic = CSSFont.italic;
		fmt.size = CSSFont.size;
		fmt.font = CSSFont.font;
		target.tf.setTextFormat(target.fmt);		
	}
	
	inline static public function setColor(target:TextFl, cssColorString:String) {
		CSSColor.parse(cssColorString);
		target.fmt.color = CSSColor.color;
		target.tf.alpha = CSSColor.alpha;
		target.tf.setTextFormat(target.fmt);
	}
	
	inline static public function setText(target:TextFl, text:String) {
		target.tf.text = text;
	}

	private var tf:TextField;
	private var fmt:TextFormat;
	
	public function new(id:Int) {
		super(id);
		
		tf = new TextField();
		fmt = new TextFormat();
	
		display = new Sprite();
		display.addChild(tf);
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
