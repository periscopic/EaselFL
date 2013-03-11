/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* Rectangle
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
 * Represents a rectangle as defined by the points (x, y) and (x+width, y+height).
 *
 * @example
 *      var rect = new createjs.Rectangle(0, 0, 100, 100);
 *
 * @class Rectangle
 * @constructor
 * @param {Number} [x=0] X position.
 * @param {Number} [y=0] Y position.
 * @param {Number} [width=0] The width of the Rectangle.
 * @param {Number} [height=0] The height of the Rectangle.
 **/
var Rectangle = function(x, y, width, height) {
  this.initialize(x, y, width, height);
}
var p = Rectangle.prototype;
	
// public properties:
	/** 
	 * X position. 
	 * @property x
	 * @type {Number}
	 **/
	p.x = 0;
	
	/** 
	 * Y position. 
	 * @property y
	 * @type {Number}
	 **/
	p.y = 0;
	
	/** 
	 * Width.
	 * @property width
	 * @type {Number}
	 **/
	p.width = 0;
	
	/** 
	 * Height.
	 * @property height
	 * @type {Number}
	 **/
	p.height = 0;
	
// constructor:
	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	p.initialize = function(x, y, width, height) {
		this.x = (x == null ? 0 : x);
		this.y = (y == null ? 0 : y);
		this.width = (width == null ? 0 : width);
		this.height = (height == null ? 0 : height);

		this._flId = createjs.UID.get();
	}
	
// public methods:
	/**
	 * Returns a clone of the Rectangle instance.
	 * @method clone
	 * @return {Rectangle} a clone of the Rectangle instance.
	 **/
	p.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")]";
	}
	
	/**** Begin EaselFL specific code ****/
	
	p._flType = 'rct';	
	p._flX = 0;
	p._flY = 0;
	p._flWidth = 0;
	p._flHeight = 0;
	p._flCtx = null;
	p._flId = null;
	p._flRefs = 0;
	
	//-- sync rectangle to flash context 
	p._flSync = function(){
		
		//-- sync properties
		if(this._flCtx  && (this._flX!==this.x || this._flY!==this.y || this._flWidth!==this.width || this._flHeight!==this.height)){
				this._flX = this.x;
				this._flY = this.y;
				this._flWidth = this.width;
				this._flHeight = this.height;
				this._flCtx._flChange.push([this._flId, 'dim', [this.x, this.y, this.width, this.height]]);
		}
	}

	p._flResetProps = function() {
		this._flX = 
		this._flY = 
		this._flWidth = 
		this._flHeight = 0;


		this._flSourceRect =
		this._flCtx = null;
	}
	
	p._flRetain = function(ctx) {
		this._flRefs++;

		//-- create flash counterpart
		if(!this._flCtx){
			this._flCtx = ctx;
			ctx._flCreate.push([this._flType, this]);
		}
	}

	p._flDeretain = function() {
		this._flRefs--;
	}
	/**** End EaselFL specific code ****/

createjs.Rectangle = Rectangle;
}());