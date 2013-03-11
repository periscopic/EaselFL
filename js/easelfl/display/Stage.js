/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* Stage
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
 * A stage is the root level {{#crossLink "Container"}}{{/crossLink}} for a display list. Each time its {{#crossLink "Stage/tick"}}{{/crossLink}}
 * method is called, it will render its display list to its target canvas.
 *
 * <h4>Example</h4>
 * This example creates a stage, adds a child to it, then uses {{#crossLink "Ticker"}}{{/crossLink}} to update the child
 * and redraw the stage using {{#crossLink "Stage/update"}}{{/crossLink}}.
 *
 *      var stage = new createjs.Stage("canvasElementId");
 *      var image = new createjs.Bitmap("imagePath.png");
 *      createjs.Ticker.addEventListener("tick", handleTick);
 *      function handleTick(event) {
 *          bitmap.x += 10;
 *          stage.update();
 *      }
 *
 * @class Stage
 * @extends Container
 * @constructor
 * @param {HTMLCanvasElement | String | Object} canvas A canvas object that the Stage will render to, or the string id
 * of a canvas object in the current document.
 **/
var Stage = function(canvas) {
  this.initialize(canvas);
}
var p = Stage.prototype = new createjs.Container();

// static properties:
	/**
	 * @property _snapToPixelEnabled
	 * @protected
	 * @static
	 * @type {Boolean}
	 * @default false
	 * @deprecated Hardware acceleration in modern browsers makes this unnecessary.
	 **/
	/*
	//-- EaselJS
	Stage._snapToPixelEnabled = false; // snapToPixelEnabled is temporarily copied here during a draw to provide global access.
	*/

// events:

	/**
	 * Dispatched when the user moves the mouse over the canvas.
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event stagemousemove
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event stagemouseup
	 * @since 0.6.0
	 */

	/**
	 * Dispatched when the user the user releases the mouse button anywhere that the page can detect it (this varies slightly between browsers).
	 * See the {{#crossLink "MouseEvent"}}{{/crossLink}} class for a listing of event properties.
	 * @event stagemouseup
	 * @since 0.6.0
	 */

// public properties:
	/**
	 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to false to manually
	 * control clearing (for generative art, or when pointing multiple stages at the same canvas for example).
	 * @property autoClear
	 * @type {Boolean}
	 * @default true
	 **/
	p.autoClear = true;

	/**
	 * The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
	 * first stage that will be ticked (or they will clear each other's render).
	 * @property canvas
	 * @type {HTMLCanvasElement | Object}
	 **/
	p.canvas = null;

	/**
	 * READ-ONLY. The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseX
	 * @type {Number}
	 **/
	p.mouseX = 0;

	/**
	 * READ-ONLY. The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseY
	 * @type {Number}
	 **/
	p.mouseY = 0;

	/**
	 * The onMouseMove callback is called when the user moves the mouse over the canvas.  The handler is passed a single param
	 * containing the corresponding MouseEvent instance.
	 * @property onMouseMove
	 * @type Function
	 * @deprecated In favour of the "stagemousemove" event. Will be removed in a future version.
	 */
	p.onMouseMove = null;

	/**
	 * The onMouseUp callback is called when the user releases the mouse button anywhere that the page can detect it.  The handler
	 * is passed a single param containing the corresponding MouseEvent instance.
	 * @property onMouseUp
	 * @type Function
	 * @deprecated In favour of the "stagemouseup" event. Will be removed in a future version.
	 */
	p.onMouseUp = null;

	/**
	 * The onMouseDown callback is called when the user presses the mouse button over the canvas.  The handler is passed a single
	 * param containing the corresponding MouseEvent instance.
	 * @property onMouseDown
	 * @type Function
	 * @deprecated In favour of the "stagemousedown" event. Will be removed in a future version.
	 */
	p.onMouseDown = null;

	/**
	 * Indicates whether this stage should use the snapToPixel property of display objects when rendering them. See
	 * DisplayObject.snapToPixel for more information.
	 * @property snapToPixelEnabled
	 * @type Boolean
	 * @default false
	 * @deprecated Hardware acceleration makes this not beneficial
	 **/
	p.snapToPixelEnabled = false;

	/**
	 * Indicates whether the mouse is currently within the bounds of the canvas.
	 * @property mouseInBounds
	 * @type {Boolean}
	 * @default false
	 **/
	p.mouseInBounds = false;

	/**
	 * If true, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
	 * You can call 
	 * @property tickOnUpdate
	 * @type Boolean
	 * @default true
	 **/
	p.tickOnUpdate = true;

	/**
	 * If true, mouse move events will continue to be called when the mouse leaves the target canvas. See
	 * mouseInBounds, and MouseEvent.x/y/rawX/rawY.
	 * @property mouseMoveOutside
	 * @type Boolean
	 * @default false
	 **/
	console.log("TODO: verify Stage.mouseMoveOutside works")
	p.mouseMoveOutside = false;

	/**
	 * The hitArea property is not supported for Stage.
	 * @property hitArea
	 * @type {DisplayObject}
	 * @default null
	 */
	
// private properties:

	/**
	 * Holds objects with data for each active pointer id. Each object has the following properties:
	 * x, y, event, target, overTarget, overX, overY, inBounds
	 * @property _pointerData
	 * @type {Object}
	 * @private
	 */
	p._pointerData = null;
	
	/**
	 * Number of active pointers.
	 * @property _pointerCount
	 * @type {Object}
	 * @private
	 */
	p._pointerCount = 0;
	
	/**
	 * Number of active pointers.
	 * @property _pointerCount
	 * @type {Object}
	 * @private
	 */
	p._primaryPointerID = null;

	/**
	 * @property _mouseOverIntervalID
	 * @protected
	 * @type {Number}
	 **/
	p._mouseOverIntervalID = null;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type {Function}
	 * @private
	 **/
	p.Container_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * @param {HTMLCanvasElement | String | Object} canvas A canvas object, or the string id of a canvas object in the current document.
	 * @protected
	 **/
	/*
	//-- EaselJS
	p.initialize = function(canvas) {
		this.Container_initialize();
		this.canvas = (typeof canvas == "string") ? document.getElementById(canvas) : canvas;
		this._pointerData = {};
		this.enableDOMEvents(true);
	}
	*/
	p.initialize = function(canvas) {
		if(canvas.isFl === true) {
		  //-- Already a CanvasFl
		  this.canvas = canvas;
		}
		else {
		  //-- Not a CanvasFl
		  canvas = (typeof canvas == "string") ? document.getElementById(canvas) : canvas;
		  this.canvas = new createjs.CanvasFl(canvas);
		}
		
		this.canvas._stage = this;

		//-- Begin EaselFl specific setup		
		this.Container_initialize();
		
		this._pointerData = {};
		this.enableDOMEvents(true);
		
		//-- Set this container as Stage in flash
		var ctx = this.canvas.getContext('2d');			
	
		//-- Set as stage in flash
		this._flCtx = ctx;
		ctx._flCreate.push(['stg', this]);		
	}

// public methods:

	/**
	 * @event tick
	 * Broadcast to children when the stage is updated.
	 **/

	/**
	 * Each time the update method is called, the stage will tick any descendants exposing a tick method (ex. {{#crossLink "BitmapAnimation"}}{{/crossLink}})
	 * and render its entire display list to the canvas. Any parameters passed to update will be passed on to any
	 * onTick handlers.
	 * @method update
	 **/
	/*
	 //-- EaselJS
	p.update = function() {
		if (!this.canvas) { return; }
		if (this.autoClear) { this.clear(); }
		Stage._snapToPixelEnabled = this.snapToPixelEnabled;
		if (this.tickOnUpdate) { this._tick((arguments.length ? arguments : null)); }
		var ctx = this.canvas.getContext("2d");
		ctx.save();
		this.updateContext(ctx);
		this.draw(ctx, false);
		ctx.restore();
	}
	*/
	console.log('TODO: verify draw method fired via Stage.update still has correct params');
	p.update = function() {
		if(!(this.canvas && this.canvas._ctx && this.canvas._ctx.flReady)) { return; }
		
		if(this.autoClear === false) {
			this._flAutoClear = this.autoClear;
			this.canvas._ctx._flChange.push([this.id, 'blt']);
		}else if(this._flAutoClear === false) {
			this._flAutoClear = true;
			this.canvas._ctx._flChange.push([this.id, 'clr']);
		}
		
		Stage._snapToPixelEnabled = this.snapToPixelEnabled;

		if (this.tickOnUpdate) { this._tick((arguments.length ? arguments : null)); }
		
		//-- Should anything be passed in place of the canvas, the first parameter?
		this.draw( this.canvas._ctx, false, this.getConcatenatedMatrix(this._matrix));
		
		//-- send commands to Flash movie
		this.canvas._ctx._flFlush();
	};

	/**
	 * Calls the update method. Useful for adding stage as a listener to {{#crossLink "Ticker"}}{{/crossLink}} directly.
	 * @property tick
	 * @deprecated In favour of using Ticker.addEventListener in conjunction with handleEvent.
	 * @type Function
	 **/
	p.tick = p.update;

	/**
	 * Default event handler that calls Stage.update() when a "tick" event is received. This allows you to register a
	 * Stage instance as a event listener on {{#crossLink "Ticker"}}{{/crossLink}} directly, using:
	 * 
	 *      Ticker.addEventListener("tick", myStage");
	 * 
	 * Note that if you subscribe to ticks using this pattern then the tick event object will be passed through to display
	 * object tick handlers, instead of delta and paused parameters.
	 * @property handleEvent
	 * @type Function
	 **/
	p.handleEvent = function(evt) {
		if (evt.type == "tick") { this.update(evt); }
	}

	/**
	 * Clears the target canvas. Useful if <code>autoClear</code> is set to false.
	 * @method clear
	 **/
	/*
	 //-- EaselJS
	p.clear = function() {
		if (!this.canvas) { return; }
		var ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	*/
	p.clear = function() {
		//this only has usage where autoclear is false or ticker is not auto updating
		//could potentially clear blit bmp and hide internal stage in flash until next draw...
		if(Stage.FL_THROW_UNIMPLEMENTED) throw 'EaseFl:Stage.clear not yet implemented';
	}

	/**
	 * Returns a data url that contains a Base64-encoded image of the contents of the stage. The returned data url can be
	 * specified as the src value of an image element.
	 * @method toDataURL
	 * @param {String} backgroundColor The background color to be used for the generated image. The value can be any value HTML color
	 * value, including HEX colors, rgb and rgba. The default value is a transparent background.
	 * @param {String} mimeType The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
	 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	 * @return {String} a Base64 encoded image.
	 **/
	/*
	 //-- EaselJS
	p.toDataURL = function(backgroundColor, mimeType) {
		if(!mimeType) {
			mimeType = "image/png";
		}

		var ctx = this.canvas.getContext('2d');
		var w = this.canvas.width;
		var h = this.canvas.height;

		var data;

		if(backgroundColor) {

			//get the current ImageData for the canvas.
			data = ctx.getImageData(0, 0, w, h);

			//store the current globalCompositeOperation
			var compositeOperation = ctx.globalCompositeOperation;

			//set to draw behind current content
			ctx.globalCompositeOperation = "destination-over";

			//set background color
			ctx.fillStyle = backgroundColor;

			//draw background on entire canvas
			ctx.fillRect(0, 0, w, h);
		}

		//get the image data from the canvas
		var dataURL = this.canvas.toDataURL(mimeType);

		if(backgroundColor) {
			//clear the canvas
			ctx.clearRect (0, 0, w, h);

			//restore it with original settings
			ctx.putImageData(data, 0, 0);

			//reset the globalCompositeOperation to what it was
			ctx.globalCompositeOperation = compositeOperation;
		}

		return dataURL;
	}
	*/
	p.toDataURL = function(backgroundColor, mimeType) {
		if(Stage.FL_THROW_UNIMPLEMENTED) throw "Stage.toDataURL not implemented in EaselFl";
		return null;
	}

	/**
	 * Enables or disables (by passing a frequency of 0) mouse over events (mouseover and mouseout) for this stage's display
	 * list. These events can be expensive to generate, so they are disabled by default, and the frequency of the events
	 * can be controlled independently of mouse move events via the optional <code>frequency</code> parameter.
	 * @method enableMouseOver
	 * @param {Number} [frequency=20] Optional param specifying the maximum number of times per second to broadcast
	 * mouse over/out events. Set to 0 to disable mouse over events completely. Maximum is 50. A lower frequency is less
	 * responsive, but uses less CPU.
	 **/
	/*
	 //-- EaselJS
	p.enableMouseOver = function(frequency) {
		if (this._mouseOverIntervalID) {
			clearInterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
		}
		if (frequency == null) { frequency = 20; }
		else if (frequency <= 0) { return; }
		var o = this;
		this._mouseOverIntervalID = setInterval(function(){ o._testMouseOver(); }, 1000/Math.min(50,frequency));
	}
	*/
	p.enableMouseOver = function(frequency) {
		/* MouseEvents are currently always enabled in EaselFL; they can be disabled on each DisplayObject */
	}

	/**
	 * Enables or disables the  event listeners that stage adds to DOM elements (window, document and canvas).
	 * It is good practice to disable events when disposing of a Stage instance, otherwise the stage will
	 * continue to receive events from the page.
	 * @method enableDOMEvents
	 * @param {Boolean} [enable=true] Indicates whether to enable or disable the events. Default is true.
	 **/
	/*
	//-- EaselJS
	p.enableDOMEvents = function(enable) {
		if (enable == null) { enable = true; }
		var n, o, ls = this._eventListeners;
		if (!enable && ls) {
			for (n in ls) {
				o = ls[n];
				o.t.removeEventListener(n, o.f);
			}
			this._eventListeners = null;
		} else if (enable && !ls) {
			var t = window.addEventListener ? window : document;
			var _this = this;
			ls = this._eventListeners = {};
			ls["mouseup"] = {t:t, f:function(e) { _this._handleMouseUp(e)} };
			ls["mousemove"] = {t:t, f:function(e) { _this._handleMouseMove(e)} };
			ls["dblclick"] = {t:t, f:function(e) { _this._handleDoubleClick(e)} };
			t = this.canvas;
			if (t) { ls["mousedown"] = {t:t, f:function(e) { _this._handleMouseDown(e)} }; }
			
			for (n in ls) {
				o = ls[n];
				o.t.addEventListener(n, o.f);
			}
		}
	}
	*/

console.log("TODO: verify IE uses removeEvent as counterpart of attachEvent");
console.log("TODO: verify IE event names");
console.log("TODO: verify mousedown behavior in Stage");

	p.enableDOMEvents = function(enable) {
		var n, o, ls, t, bind, unbind, ms, _this;

		if (enable == null) { enable = true; }

		ms = Stage.__MS_BINDING;

		if(!enable && ls) {
			unbind = ms ? 'detachEvent' : 'removeEventListener';

			for (n in ls) {
				o = ls[n];
				o.t[unbind](o.native, o.f);
			}
		} else if (enable && !ls) {
			_this = this;
			bind = ms ? 'attachEvent' : 'addEventListener';
			t = document[bind] ? document : window; //prefer document since IE8 window has 'attachEvent' but fails to call after binding
			ls = this._eventListeners = {};
			ls["mouseup"] = {t:t, native: ms?'onmouseup':'mouseup', f:function(e) { _this._handleMouseUp(e);} };
			ls["mousemove"] = {t:t, native: ms?'onmousemove':'mousemove', f:function(e) { _this._handleMouseMove(e);} };
			ls["dblclick"] = {t:t, native: ms?'ondblclick':'dblclick', f:function(e) { _this._handleDoubleClick(e);} };

			for (n in ls) {
				o = ls[n];
				o.t[bind](o.native, o.f);
			}
		}
	};


	/**
	 * Returns a clone of this Stage.
	 * @return {Stage} A clone of the current Container instance.
	 **/
	p.clone = function() {
		var o = new Stage(null);
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Stage (name="+  this.name +")]";
	}

	// private methods:
	
	/**
	 * @method _getPointerData
	 * @protected
	 * @param {Number} id
	 **/
	p._getPointerData = function(id) {
		var data = this._pointerData[id];
		if (!data) {
			data = this._pointerData[id] = {x:0,y:0};
			// if it's the mouse (id == NaN) or the first new touch, then make it the primary pointer id:
			if (this._primaryPointerID == null) { this._primaryPointerID = id; }
		}
		return data;
	}
	
	/**
	 * @method _handleMouseMove
	 * @protected
	 * @param {MouseEvent} e
	 **/
	/*
	 //-- EaselJS
	p._handleMouseMove = function(e) {
		if(!e){ e = window.event; }
		this._handlePointerMove(-1, e, e.pageX, e.pageY);
	}
	*/
	p._handleMouseMove = function(e) {
	  
		if (!this.canvas) {
			this.mouseX = this.mouseY = null;
			return;
		}
		
		if(!e){ e = window.event; }
		
		var inBounds = this.mouseInBounds;		
		
		if(Stage.__MS_BINDING) {
		  this._updatePointerPosition(
		  	-1,
			e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
			e.clientY + document.body.scrollTop + document.documentElement.scrollTop
		  );
									
		} else {
		  this._updatePointerPosition(-1, e.pageX, e.pageY);
		}		
		
		if (!inBounds && !this.mouseInBounds) { return; }
		
		var evt = new createjs.MouseEvent("onMouseMove", this.mouseX, this.mouseY, this, e);

		if (this.onMouseMove) { this.onMouseMove(evt); }
		if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) { this._activeMouseEvent.onMouseMove(evt); }
	}
	
	/**
	 * @method _handlePointerMove
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} pageX
	 * @param {Number} pageY
	 **/
	/*
	 //-- EaselJS
	p._handlePointerMove = function(id, e, pageX, pageY) {
		if (!this.canvas) { return; } // this.mouseX = this.mouseY = null;
		var evt;
		var o = this._getPointerData(id);

		var inBounds = o.inBounds;
		this._updatePointerPosition(id, pageX, pageY);
		if (!inBounds && !o.inBounds && !this.mouseMoveOutside) { return; }
		
		if (this.onMouseMove || this.hasEventListener("stagemousemove"))  {
			evt = new createjs.MouseEvent("stagemousemove", o.x, o.y, this, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
			this.onMouseMove&&this.onMouseMove(evt);
			this.dispatchEvent(evt);
		}
		
		var oEvt = o.event;
		if (oEvt && (oEvt.onMouseMove || oEvt.hasEventListener("mousemove"))) {
			evt = new createjs.MouseEvent("mousemove", o.x, o.y, oEvt.target, e, id, id == this._primaryPointerID, o.rawX, o.rawY);
			oEvt.onMouseMove&&oEvt.onMouseMove(evt);
			oEvt.dispatchEvent(evt, oEvt.target);
		}
	}
	*/

	/**
	 * @method _updatePointerPosition
	 * @protected
	 * @param {Number} id
	 * @param {Number} pageX
	 * @param {Number} pageY
	 **/
	/*
	 //-- EaselJS
	p._updatePointerPosition = function(id, pageX, pageY) {
		var rect = this._getElementRect(this.canvas);
		pageX -= rect.left;
		pageY -= rect.top;
		
		var w = this.canvas.width;
		var h = this.canvas.height;
		pageX /= (rect.right-rect.left)/w;
		pageY /= (rect.bottom-rect.top)/h;
		var o = this._getPointerData(id);
		if (o.inBounds = (pageX >= 0 && pageY >= 0 && pageX <= w-1 && pageY <= h-1)) {
			o.x = pageX;
			o.y = pageY;
		} else if (this.mouseMoveOutside) {
			o.x = pageX < 0 ? 0 : (pageX > w-1 ? w-1 : pageX);
			o.y = pageY < 0 ? 0 : (pageY > h-1 ? h-1 : pageY);
		}
		
		o.rawX = pageX;
		o.rawY = pageY;
		
		if (id == this._primaryPointerID) {
			this.mouseX = o.x;
			this.mouseY = o.y;
			this.mouseInBounds = o.inBounds;
		}
	}
	*/
	p._updatePointerPosition = function(id, pageX, pageY) {	
		//-- TODO : finish converting to pointers from mouse
		var o = this.canvas._ctx._flInstance;
		if(o){
		  do {
			  pageX -= o.offsetLeft;
			  pageY -= o.offsetTop;
		  } while (o = o.offsetParent);		  
		  
		  this.mouseInBounds = (pageX >= 0 && pageY >= 0 && pageX < this.canvas.width && pageY < this.canvas.height);
		
		  if (this.mouseInBounds) {
			  this.mouseX = pageX;
			  this.mouseY = pageY;
		  }
		}
	}
	

	console.log("TODO: implement IE8 Stage._getElementRect");

	/**
	 * @method _getElementRect
	 * @protected
	 * @param {HTMLElement} e
	 **/
	p._getElementRect = function(e) {
		var bounds;
		try { bounds = e.getBoundingClientRect(); } // this can fail on disconnected DOM elements in IE9
		catch (err) { bounds = {top: e.offsetTop, left: e.offsetLeft, width:e.offsetWidth, height:e.offsetHeight}; }
		
		var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
		var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || document.body.clientTop  || 0);
		
		var styles = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle; // IE <9 compatibility.
		var padL = parseInt(styles.paddingLeft)+parseInt(styles.borderLeftWidth);
		var padT = parseInt(styles.paddingTop)+parseInt(styles.borderTopWidth);
		var padR = parseInt(styles.paddingRight)+parseInt(styles.borderRightWidth);
		var padB = parseInt(styles.paddingBottom)+parseInt(styles.borderBottomWidth);
		
		// note: in some browsers bounds properties are read only.
		return {
			left: bounds.left+offX+padL,
			right: bounds.right+offX-padR,
			top: bounds.top+offY+padT,
			bottom: bounds.bottom+offY-padB
		}
	};


/**
	 * @method _handleMouseUp
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleMouseUp = function(e) {
		this._handlePointerUp(-1, e, false);
	}

	/**
	 * @method _handlePointerUp
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Boolean} clear
	 **/
	p._handlePointerUp = function(id, e, clear) {
		var o = this._getPointerData(id);
		var evt;
		
		if (this.onMouseMove || this.hasEventListener("stagemouseup")) {
			evt = new createjs.MouseEvent("stagemouseup", o.x, o.y, this, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
			this.onMouseUp&&this.onMouseUp(evt);
			this.dispatchEvent(evt);
		}
		
		var oEvt = o.event;
		if (oEvt && (oEvt.onMouseUp || oEvt.hasEventListener("mouseup"))) {
			evt = new createjs.MouseEvent("mouseup", o.x, o.y, oEvt.target, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
			oEvt.onMouseUp&&oEvt.onMouseUp(evt);
			oEvt.dispatchEvent(evt, oEvt.target);
		}
		
		var oTarget = o.target;
		if (oTarget && (oTarget.onClick  || oTarget.hasEventListener("click")) && this._getObjectsUnderPoint(o.x, o.y, null, true, (this._mouseOverIntervalID ? 3 : 1)) == oTarget) {
			evt = new createjs.MouseEvent("click", o.x, o.y, oTarget, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
			oTarget.onClick&&oTarget.onClick(evt);
			oTarget.dispatchEvent(evt);
		}
		
		if (clear) {
			if (id == this._primaryPointerID) { this._primaryPointerID = null; }
			delete(this._pointerData[id]);
		} else { o.event = o.target = null; }
	}

	/**
	 * @method _handleMouseDown
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleMouseDown = function(e) {
		this._handlePointerDown(-1, e, false);
	}
	
	
	/**
	 * @method _handlePointerDown
	 * @protected
	 * @param {Number} id
	 * @param {Event} e
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/*
	 //-- EaselJS
	p._handlePointerDown = function(id, e, x, y) {
		var o = this._getPointerData(id);
		if (y != null) { this._updatePointerPosition(id, x, y); }
		
		if (this.onMouseDown || this.hasEventListener("stagemousedown")) {
			var evt = new createjs.MouseEvent("stagemousedown", o.x, o.y, this, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
			this.onMouseDown&&this.onMouseDown(evt);
			this.dispatchEvent(evt);
		}
		
		var target = this._getObjectsUnderPoint(o.x, o.y, null, (this._mouseOverIntervalID ? 3 : 1));
		if (target) {
			o.target = target;
			if (target.onPress || target.hasEventListener("mousedown")) {
				evt = new createjs.MouseEvent("mousedown", o.x, o.y, target, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
				target.onPress&&target.onPress(evt);
				target.dispatchEvent(evt);
				
				if (evt.onMouseMove || evt.onMouseUp || evt.hasEventListener("mousemove") || evt.hasEventListener("mouseup")) { o.event = evt; }
			}
		}
	}
	*/
	p._handlePointerDown = function(id, e, x, y) {
		var o = this._getPointerData(id);
		if (y != null) { this._updatePointerPosition(id, x, y); }
		
		if (this.onMouseDown || this.hasEventListener("stagemousedown")) {
			var evt = new createjs.MouseEvent("stagemousedown", o.x, o.y, this, e, id, id==this._primaryPointerID, o.rawX, o.rawY);
			this.onMouseDown&&this.onMouseDown(evt);
			this.dispatchEvent(evt);
		}
	}

	/**
	 * @method _testMouseOver
	 * @protected
	 **/
	/*
	 //-- EaselJS
	p._testMouseOver = function() {
		// for now, this only tests the mouse.
		if (this._primaryPointerID != -1) { return; }
		
		// only update if the mouse position has changed. This provides a lot of optimization, but has some trade-offs.
		if (this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) { return; }
		var target = null;
		if (this.mouseInBounds) {
			target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
			this._mouseOverX = this.mouseX;
			this._mouseOverY = this.mouseY;
		}
		
		var mouseOverTarget = this._mouseOverTarget;
		if (mouseOverTarget != target) {
			var o = this._getPointerData(-1);
			if (mouseOverTarget && (mouseOverTarget.onMouseOut ||  mouseOverTarget.hasEventListener("mouseout"))) {
				var evt = new createjs.MouseEvent("mouseout", o.x, o.y, mouseOverTarget, null, -1, o.rawX, o.rawY);
				mouseOverTarget.onMouseOut&&mouseOverTarget.onMouseOut(evt);
				mouseOverTarget.dispatchEvent(evt);
			}
			if (mouseOverTarget) { this.canvas.style.cursor = ""; }
			
			if (target && (target.onMouseOver || target.hasEventListener("mouseover"))) {
				evt = new createjs.MouseEvent("mouseover", o.x, o.y, target, null, -1, o.rawX, o.rawY);
				target.onMouseOver&&target.onMouseOver(evt);
				target.dispatchEvent(evt);
			}
			if (target) { this.canvas.style.cursor = target.cursor||""; }
			
			this._mouseOverTarget = target;
		}
	}
	*/

	/**
	 * @method _handleDoubleClick
	 * @protected
	 * @param {MouseEvent} e
	 **/
	/*
	 //-- EaselJS
	p._handleDoubleClick = function(e) {
		var o = this._getPointerData(-1);
		var target = this._getObjectsUnderPoint(o.x, o.y, null, (this._mouseOverIntervalID ? 3 : 1));
		if (target && (target.onDoubleClick || target.hasEventListener("dblclick"))) {
			evt = new createjs.MouseEvent("dblclick", o.x, o.y, target, e, -1, true, o.rawX, o.rawY);
			target.onDoubleClick&&target.onDoubleClick(evt);
			target.dispatchEvent(evt);
		}
	}
	*/
	
	/**** Begin EaselFL specific code ****/
	
	/**
	 * @override
	 */
	p._flRefs = 1;
	
	/**
	 * @protected
	 * The CanvasFl context
	 **/
	p._flCtx = null;
	
	/**
	 * @private
	 * Synced state of the autoclear
	 **/
	p._flAutoClear = true;


	/** 
		* The flOnReady callback is called when the Flash Movie has loaded, all existing commands have been flushed
		* to it, and it is prepared for invocation of synchronous methods (such as hitTestPoint).
		* @event flOnReady
		* @param Stage The stage instance which is ready.
		**/
	 p.flOnReady = null;

	 /**
		* READ-ONLY Indicates whether the Flash Movie is ready.
		* @property
		* @type {Boolean}
		**/
	 p.flReady = false;

	Stage.isEaselFl = Stage.isEaselFL = true;
	
	Stage.__MS_BINDING = window.addEventListener || document.addEventListener ? false : true;
	Stage.FL_THROW_UNIMPLEMENTED = true; //--throw error on use of unimplemented features
	Stage.FL_LOG_PART_IMPLEMENTED = true; //--log warning notes for partial implementations
	
	/**** End EaselFL specific code ****/

createjs.Stage = Stage;

}());