/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */
/*
* DOMElement
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

//--EaselFL specific setup

//-- Find transform property for this browser
var transformProp, transformPropOrigin, transformUnit, isModern;

transformProp = (function(element) {
		var properties = [
			'transform',
			'WebkitTransform',
			'msTransform',
			'MozTransform',
			'OTransform',
			'filter'
		];
		
		var p;
	  
	  do {
		p = properties.shift();
		if (typeof element.style[p] != 'undefined') {
			return p;
			}
	  }while(properties.length)
		return false;
		})(document.createElement("div"));
		
// a 'modern' browser?
isModern = transformProp !== 'filter' && transformProp;
transformPropOrigin = transformProp+"Origin";
transformUnit = transformProp==='MozTransform'?'px':'';
//-- end EaselFL specific setup

// TODO: fix problems with rotation.
// TODO: exclude from getObjectsUnderPoint

/**
 * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b>
 *
 * A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
 * within the DOM as though it is child of the {{#crossLink "Container"}}{{/crossLink}} it is added to. However, it is
 * not rendered to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
 * drawn in front of or behind the canvas).
 *
 * The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
 * the DOM Object be added to a div that also contains the canvas so that they share the same position
 * on the page.
 *
 * DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
 * that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
 * content.
 *
 * <h4>Mouse Interaction</h4>
 *
 * DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
 * events or support methods like hitTest. To get mouse events from a DOMElement, you must instead add handlers to
 * the htmlElement (note, this does not support EventDispatcher)
 *
 *      var domElement = new createjs.DOMElement(htmlElement);
 *      domElement.htmlElement.onclick = function() {
 *          console.log("clicked");
 *      }
 *
 * @class DOMElement
 * @extends DisplayObject
 * @constructor
 * @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
 */
var DOMElement = function(htmlElement) {
  this.initialize(htmlElement);
}
var p = DOMElement.prototype = new createjs.DisplayObject();

// public properties:
	/**
	 * The DOM object to manage.
	 * @property htmlElement
	 * @type {HTMLElement}
	 */
	p.htmlElement = null;

// private properties:
	/**
	 * @property _oldMtx
	 * @protected
	 */
	p._oldMtx = null;

	/**
	 * @property _visible
	 * @type Boolean
	 * @protected
	 */
	p._visible = false;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type {Function}
	 * @private
	 */
	p.DisplayObject_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	*/
	/*
	//-- EaselJS
	p.initialize = function(htmlElement) {
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
		var style = htmlElement.style;
		// this relies on the _tick method because draw isn't called if a parent is not visible.
		style.position = "absolute";
		style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
	}
	*/
	p.initialize = function(htmlElement) {
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;

		if (htmlElement) {
			var style = htmlElement.style;
			style.position = "absolute";

			//start invisible   
			style.visibility = 'hidden';

			//not in EaselJS version, but for this to work both in 
			//<= IE8, since matrixes aren't usable for translation
			//in that browser
			style.top =
			style.left = 0;	

			if(isModern) {
				// a 'modern' browser
				style[transformPropOrigin] = "0% 0%";
			}
		}
	}

// public methods:
	// TODO: fix this. Right now it's used internally to determine if it should be drawn, but DOMElement always needs to be drawn.
	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 */
	p.isVisible = function() {
		return this.htmlElement != null;
	}

	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 */	
	p.draw = function(ctx, ignoreCache) {
		// this relies on the _tick method because draw isn't called if a parent is not visible.
		if (this.visible) { this._visible = true; }
		// the actual update happens in _handleDrawEnd
		return true;
	};
	
	/**
	 * Not applicable to DOMElement.
	 * @method cache
	 */
	p.cache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method uncache
	 */
	p.uncache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method updateCache
	 */
	p.updateCache = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method hitTest
	 */
	p.hitTest = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToGlobal
	 */
	p.localToGlobal = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method globalToLocal
	 */
	p.globalToLocal = function() {}

	/**
	 * Not applicable to DOMElement.
	 * @method localToLocal
	 */
	p.localToLocal = function() {}

	/**
	 * DOMElement cannot be cloned. Throws an error.
	 * @method clone
	 */
	p.clone = function() {
		throw("DOMElement cannot be cloned.")
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 */
	p.toString = function() {
		return "[DOMElement (name="+  this.name +")]";
	}

	/**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event click
	 */
		  
	 /**
	 * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	 * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	 * @event dblClick
	 */
	 
	 /**
	  * Interaction events should be added to `htmlElement`, and not the DOMElement instance, since DOMElement instances
	  * are not full EaselJS display objects and do not participate in EaselJS mouse events.
	  * @event mousedown
	  */
	 
	 /**
	  * The HTMLElement can listen for the mouseover event, not the DOMElement instance.
	  * Since DOMElement instances are not full EaselJS display objects and do not participate in EaselJS mouse events.
	  * @event mouseover
	  */ 
	 
	 /**
	  * Not applicable to DOMElement.
	  * @event tick
	  */

// private methods:
	/**
	 * @property DisplayObject__tick
	 * @type Function
	 * @protected
	 */
	p.DisplayObject__tick = p._tick;

	/**
	 * @method _tick
	 * @protected
	 */
	/*
	//-- EaselJS

	p._tick = function(params) {
		var stage = this.getStage();
		this._visible = false;
		stage&&stage.on("drawend", this._handleDrawEnd, this, true);
		this.DisplayObject__tick(params);
	};
	*/

	p._tick = function(params) {
		var stage = this.getStage();
		this._visible = false;
		stage&&stage.on("drawend", isModern ? this._handleDrawEnd : this._handleDrawEndOld, this, true);
		this.DisplayObject__tick(params);
	};

	/**
	 * @method _handleDrawEnd
	 * @param {Event} evt
	 * @protected
	 */
	p._handleDrawEnd = function(evt) {
		var o = this.htmlElement;
		if (!o) { return; }
		var style = o.style;
		
		var visibility = this._visible ? "visible" : "hidden";
		if (visibility != style.visibility) { style.visibility = visibility; }
		if (!this._visible) { return; }
		
		var mtx = this.getConcatenatedMatrix(this._matrix);
		var oMtx = this._oldMtx;
		if (!oMtx || oMtx.alpha != mtx.alpha) {
			style.opacity = ""+mtx.alpha;
			if (oMtx) { oMtx.alpha = mtx.alpha; }
		}
		if (!oMtx || oMtx.tx != mtx.tx || oMtx.ty != mtx.ty || oMtx.a != mtx.a || oMtx.b != mtx.b || oMtx.c != mtx.c || oMtx.d != mtx.d) {
			style.transform = style.WebkitTransform = style.OTransform = style.msTransform = ["matrix("+mtx.a.toFixed(3),mtx.b.toFixed(3),mtx.c.toFixed(3),mtx.d.toFixed(3),(mtx.tx+0.5|0),(mtx.ty+0.5|0)+")"].join(",");
			style.MozTransform = ["matrix("+mtx.a.toFixed(3),mtx.b.toFixed(3),mtx.c.toFixed(3),mtx.d.toFixed(3),(mtx.tx+0.5|0)+"px",(mtx.ty+0.5|0)+"px)"].join(",");
			this._oldMtx = oMtx ? oMtx.copy(mtx) : mtx.clone();
		}
	};

	/* Not needed with current setup:
	p._calculateVisible = function() {
		var p = this;
		while (p) {
			if (!p.visible) { return false; }
			p = p.parent;
		}
		return true;
	}
	*/


	//-- EaselFl specific code
	p._flWidth = 0;
	p._flHeight = 0;
	p._flBx = 0;
	p._flBy = 0;
	p._flMsMtx = '';
	p._flMsAlpha = '';
	p._flMsCum = ' ';
	p._flParentNode = null;
	p._flType = 'dom';

	// p._flAlpha = 1;
	// p._flVisible = true;
	// p._flCumMtx = null;
	// p._flCtx = null;


	// for non-modern browsers
	p._handleDrawEndOld = function(evt) {
		var o = this.htmlElement;
		if (!o) { return; }
		var style = o.style;
		
		var visibility = this._visible ? "visible" : "hidden";
		if (visibility != style.visibility) { style.visibility = visibility; }
		if (!this._visible) { return; }
		
		var mtx = this.getConcatenatedMatrix(this._matrix);
		var oMtx = this._oldMtx;
		
		// adjust alpha

		if (mtx.alpha < 1) {
			this._flMsAlpha = 'progid:DXImageTransform.Microsoft.Alpha(Opacity='+Math.round(100*mtx.alpha)+')';
		} else {
			this._flMsAlpha = "";
		}

		// adjust matrix transform

		if(!(oMtx && mtx.a === oMtx.a && mtx.b === oMtx.b && mtx.c === oMtx.c && mtx.d === oMtx.d && mtx.e === oMtx.e && mtx.f === oMtx.f)) {
			// update the transform if the matrix has changed
			
			if(mtx.a ===1 && mtx.b === 0 && mtx.a === mtx.d && mtx.b===mtx.c) {
				// simple transform without scale, rotation or skew
				this._flMsMtx = "";
				style.left= mtx.tx+'px';
				style.top = mtx.ty+'px';
			} else {

				if(!(oMtx && oMtx.a === mtx.a && oMtx.b === mtx.b && oMtx.c === mtx.c && oMtx.d === mtx.d)){
					// complex transform where scale, rotation, or skew changed
					this._flMsMtx = 'progid:DXImageTransform.Microsoft.Matrix('+
						'M11='+mtx.a.toFixed(4)+', M12='+mtx.c.toFixed(4)+', M21='+mtx.b.toFixed(4)+', M22='+mtx.d.toFixed(4)+', sizingMethod="auto expand")';
						
					var wd = this._flWidth;
					var ht = this._flHeight;
					var hfwd = wd*0.5;
					var hfht = ht*0.5;
					var ltx = (hfwd*mtx.a+hfht*mtx.c);
					var lty = (hfwd*mtx.b+hfht*mtx.d); 
					var rtx = (-hfwd*mtx.a+hfht*mtx.c);
					var rty = (-hfwd*mtx.b+hfht*mtx.d);
					wd = Math.max(Math.abs(ltx),Math.abs(rtx));
					ht = Math.max(Math.abs(lty),Math.abs(rty));
					this._flBx = -(wd-ltx);
					this._flBy = -(ht-lty);
					
					//could this be handled better to prevent existing zIndex from being overwritten?
					style.zIndex = 0; //prevent child dom elements from shifting outside of rotated box in IE8
				} 

				// adjust the translation
				style.left=(mtx.tx+this._flBx)+"px";
				style.top=(mtx.ty+this._flBy)+"px";
			}
		}  

		// apply the alpha and matrix transform if either have changed
		var msCum = this._flMsMtx+' '+this._flMsAlpha;
		
		if(msCum!==this._flMsCum){
			this._flMsCum = msCum;
			style[transformProp] = msCum;

			console.log(msCum);
			console.log(transformProp);
		}  
	};


	/**
	 * Must be called when updating anything that will change dimensions
	 * if rotating, in order to be correct in IE.
	 **/
	p.flUpdateBounds = function() {
		var el, style, trans;

		el = this.htmlElement;
		style = el.style;
		trans = style[transformProp];
		style[transformProp] = '';
		this._flWidth = el.offsetWidth;
		this._flHeight = el.offsetHeight;
		style[transformProp] = trans;
	}

	//-- end EaselFl specific code

createjs.DOMElement = DOMElement;

}());
