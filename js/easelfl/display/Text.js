/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* Text
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

// namespace:
this.createjs = this.createjs||{};

(function() {
	
/**
 * Display one or more lines of dynamic text (not user editable) in the display list. Line wrapping support (using the
 * lineWidth) is very basic, wrapping on spaces and tabs only. Note that as an alternative to Text, you can position HTML
 * text above or below the canvas relative to items in the display list using the {{#crossLink "DisplayObject/localToGlobal"}}{{/crossLink}}
 * method, or using {{#crossLink "DOMElement"}}{{/crossLink}}.
 *
 * <b>Please note that Text does not support HTML text, and can only display one font style at a time.</b> To use
 * multiple font styles, you will need to create multiple text instances, and position them manually.
 *
 * <h4>Example</h4>
 *      var text = new createjs.Text("Hello World", "20px Arial", #ff7700");
 *      text.x = 100;
 *      text.textBaseline = "alphabetic";
 *
 * CreateJS Text supports web fonts (the same rules as Canvas). The font must be loaded and supported by the browser
 * before it can be displayed.
 *
 * @class Text
 * @extends DisplayObject
 * @constructor
 * @param {String} [text] The text to display.
 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
 * 36px Arial").
 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
 * "#F00", "red", or "#FF0000").
 **/
var Text = function(text, font, color) {
  this.initialize(text, font, color);
}
var p = Text.prototype = new createjs.DisplayObject();


	/**
	 * @property _workingContext
	 * @type {CanvasRenderingContext2D}
	 * @private
	 **/
	/*
	 //-- EaselJS
	Text._workingContext = (createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")).getContext("2d");
	*/

// public properties:
	/**
	 * The text to display.
	 * @property text
	 * @type {String}
	 **/
	p.text = "";
	
	/**
	 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial"). 
	 * @property font
	 * @type {String}
	 **/
	p.font = null;
	
	/**
	 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
	 * @property color
	 * @type String
	 **/
	p.color = "#000";
	
	/**
	 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed 
	 * information view the 
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
	 * whatwg spec</a>. Default is "left".
	 * @property textAlign
	 * @type String
	 **/
	p.textAlign = "left";
	
	/** The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", 
	 * "ideographic", or "bottom". For detailed information view the 
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
	 * whatwg spec</a>. Default is "top".
	 * @property textBaseline
	 * @type String
	*/
	p.textBaseline = "top";
	
	/** The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or 
	 * shrunk to make it fit in this width. For detailed information view the 
	 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
	 * whatwg spec</a>.
	 * @property maxWidth
	 * @type Number
	*/
	p.maxWidth = null;
	
	/** If true, the text will be drawn as a stroke (outline). If false, the text will be drawn as a fill.
	 * @property outline
	 * @type {Boolean}
	 **/
	p.outline = false;
	
	/** Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0, 
	 * the value of getMeasuredLineHeight is used.
	 * @property lineHeight
	 * @type {Number}
	 **/
	p.lineHeight = 0;
	
	/**
	 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null, 
	 * the text will not be wrapped.
	 * @property lineWidth
	 * @type {Number}
	 **/
	p.lineWidth = null;
	
// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @private
	 * @type {Function}
	 **/
	p.DisplayObject_initialize = p.initialize;
	
	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function(text, font, color) {
		this.DisplayObject_initialize();
		this.text = text;
		this.font = font;
		this.color = color ? color : "#000";
	}
	
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Whether the display object would be visible if drawn to a canvas
	 **/
	/*
	//-- EaselJS	
	p.isVisible = function() {
		var hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}
	*/
	p.isVisible = function() {
		var hasContent = (this.text != null && this.text !== "");
		return Boolean(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
	}

	/**
	 * @property DisplayObject_draw
	 * @private
	 * @type {Function}
	 **/
	p.DisplayObject_draw = p.draw;
	
	/**
	 * Draws the Text into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	/*
	 //-- EaselJS
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		
		if (this.outline) { ctx.strokeStyle = this.color; }
		else { ctx.fillStyle = this.color; }
		ctx.font = this.font;
		ctx.textAlign = this.textAlign||"start";
		ctx.textBaseline = this.textBaseline||"alphabetic";

		this._drawText(ctx);
		return true;
	}
	*/
	p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		
		if(this.text!==this._flText) {
			ctx._flChange.push([this.id, 'txt', this.text]);
			this._flText = this.text;
		}
		
		if(this.color!==this._flColor) {
			ctx._flChange.push([this.id, 'clr', this.color]);
			this._flColor = this.color;
		}
		
		if(this.font!==this._flFont) {
			ctx._flChange.push([this.id, 'fnt', this.font]);
			this._flFont = this.font;
		}
		
		if(this.textBaseline!==this._flTextBaseline) {
			ctx._flChange.push([this.id, 'bsl', this.textBaseline]);
			this._flTextBaseline = this.textBaseline;
		}
		
		if(this.textAlign!==this._flTextAlign) {
			ctx._flChange.push([this.id, 'aln', this.textAlign]);
			this._flTextAlign = this.textAlign;
		}
		
		if(this.lineWidth!==this._flLineWidth) {
			ctx._flChange.push([this.id, 'lwd', this.lineWidth]);
			this._flLineWidth = this.lineWidth;
		}
		
		if(this.lineHeight!==this._flLineHeight) {
			//-- pass null to flash if lineheight equals 0
			ctx._flChange.push([this.id, 'lht', !this.lineHeight===0 ? null : this.lineHeight]);
			this._flLineHeight = this.lineHeight;
		}
		
		if(this.outline!==this._flOutline) {
			ctx._flChange.push([this.id, 'otl', this.outline]);
			this._flOutline = this.outline;
		}
		
		return true;
	}
	
	/**
	 * Returns the measured, untransformed width of the text.
	 * @method getMeasuredWidth
	 * @return {Number} The measured, untransformed width of the text.
	 **/
	/*
	 //-- EaselJS
	 p.getMeasuredWidth = function() {
		return this._getWorkingContext().measureText(this.text).width;
	}
	*/
	p.getMeasuredWidth = function() {
		if(this._flCtx){
			this.draw(this._flCtx, true); //queue any changes to this text
			this._flCtx._flFlush();
			return this._flCtx.flInvoke (this.id, 'gmwd', []);
		}
		
		return -1;
	}
	


	/**
	 * Returns an approximate line height of the text, ignoring the lineHeight property. This is based 
	 * on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
	 * @method getMeasuredLineHeight
	 * @return {Number} an approximate line height of the text, ignoring the lineHeight property. This is 
	 * based on the measured width of a "M" character multiplied by 1.2, which approximates em for most fonts.
	 **/
	/*
	 //-- EaselJS
	p.getMeasuredLineHeight = function() {
		return this._getWorkingContext().measureText("M").width*1.2;
	}
	*/
	p.getMeasuredLineHeight = function() {
		if(this._flCtx){
			this.draw(this._flCtx, true); //queue any changes to this text
			this._flCtx._flFlush();
			return this._flCtx.flInvoke (this.id, 'gmlht', []);
		}

		return -1;
	}
	
	/**
	 * Returns the approximate height of multiline text by multiplying the number of lines against
	 * either the lineHeight (if specified) or getMeasuredLineHeight(). Note that this operation
	 * requires the text flowing logic to run, which has an associated CPU cost.
	 * @method getMeasuredHeight
	 * @return {Number} The approximate height of the drawn multiline text.
	 **/
	/*
	 //-- EaselJS
	p.getMeasuredHeight = function() {
		return this._drawText()*(this.lineHeight||this.getMeasuredLineHeight());
	}
	*/
	p.getMeasuredHeight = function() {
		if(this._flCtx){
			this.draw(this._flCtx, true); //queue any changes to this text
			this._flCtx._flFlush();
			return this._flCtx.flInvoke (this.id, 'gmht', []);
		}

		return -1;
	}
	
	/**
	 * Returns a clone of the Text instance.
	 * @method clone
	 * @return {Text} a clone of the Text instance.
	 **/
	p.clone = function() {
		var o = new Text(this.text, this.font, this.color);
		this.cloneProps(o);
		return o;
	}
		
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Text (text="+  (this.text.length > 20 ? this.text.substr(0, 17)+"..." : this.text) +")]";
	}
	
// private methods:
	
	/**
	 * @property DisplayObject_cloneProps
	 * @private
	 * @type {Function}
	 **/
	p.DisplayObject_cloneProps = p.cloneProps;

	/** 
	 * @method cloneProps
	 * @param {Text} o
	 * @protected 
	 **/
	p.cloneProps = function(o) {
		this.DisplayObject_cloneProps(o);
		o.textAlign = this.textAlign;
		o.textBaseline = this.textBaseline;
		o.maxWidth = this.maxWidth;
		o.outline = this.outline;
		o.lineHeight = this.lineHeight;
		o.lineWidth = this.lineWidth;
	}

	/** 
	 * @method _getWorkingContext
	 * @protected 
	 **/
	/*
	 //-- EaselJS
	p._getWorkingContext = function() {
		var ctx = Text._workingContext;
		ctx.font = this.font;
		ctx.textAlign = this.textAlign||"start";
		ctx.textBaseline = this.textBaseline||"alphabetic";
		return ctx;
	}
	*/
	
	/** 
	 * @method _drawTextLine
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Text} text
	 * @param {Number} y
	 * @protected 
	 **/
	/*
	 //-- EaselJS
	p._drawTextLine = function(ctx, text, y) {
		// Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
			if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
			else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
		
	}
	*/
	
	/**** Begin EaselFL specific code ****/
	
	p._flFont = null;
	p._flText = "";
	p._flColor = "#000";
	p._flTextAlign = "left";
	p._flTextBaseline = "top";
	p._flOutline = false;
	p._flLineHeight = 0;
	p._flLineWidth = null;
	
	p._flType = 'txt';

	p._flDisplayObjectResetProps = p._flResetProps;

	p._flResetProps = function() {
		this._flDisplayObjectResetProps();

		this._flFont = 
		this._flColor =
		this._flTextAlign =
		this._flTextBaseline =
		this._flLineWidth = null;

		this._flText = '';
		this._flOutline = false;
		this._flLineHiehgt = 0;
	}
	
	/**** End EaselFL specific code ****/
	

createjs.Text = Text;

}());