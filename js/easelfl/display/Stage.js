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

(function(ns) {

/**
* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display
* list to its target canvas.
* @class Stage
* @extends Container
* @constructor
* @param {HTMLCanvasElement} canvas The canvas the stage will render to.
**/
var Stage = function(canvas) {
  this.initialize(canvas);
}

Stage.isEaselFl = true;

var p = Stage.prototype = new ns.Container();

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
     * @type Boolean
     **/
    p.flReady = false;



// static properties:
	/**
	 * @property _snapToPixelEnabled
	 * @protected
	 * @static
	 * @type Boolean
	 * @default false
	 **/
	Stage._snapToPixelEnabled = false; // snapToPixelEnabled is temporarily copied here during a draw to provide global access.

// public properties:
	/**
	 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to false to manually
	 * control clearing (for generative art, or when pointing multiple stages at the same canvas for example).
	 * @property autoClear
	 * @type Boolean
	 * @default true
	 **/
	p.autoClear = true;

	/** The canvas the stage will render to. Multiple stages can share a single canvas, but you must disable autoClear for all but the
	 * first stage that will be ticked (or they will clear each other's render).
	 * @property canvas
	 * @type HTMLCanvasElement
	 **/
	p.canvas = null;
	
	/** 
	 * The flOnReady callback is called when the Flash Movie has loaded, all existing commands have been flushed
	 * to it, and it is prepared for invocation of synchronous methods (such as hitTestPoint).
	 * @event flOnReady
	 * @param Stage The stage instance which is ready.
	 **/
	//p.flOnReady = null;

	/**
	 * READ-ONLY Indicates whether the Flash Movie is ready.
	 * @property
	 * @type Boolean
	 **/
	//p.flReady = false;

	/**
	 * READ-ONLY. The current mouse X position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseX
	 * @type Number
	 * @final
	 **/
	p.mouseX = null;

	/** READ-ONLY. The current mouse Y position on the canvas. If the mouse leaves the canvas, this will indicate the most recent
	 * position over the canvas, and mouseInBounds will be set to false.
	 * @property mouseY
	 * @type Number
	 * @final
	 **/
	p.mouseY = null;

	/** The onMouseMove callback is called when the user moves the mouse over the canvas.  The handler is passed a single param
	 * containing the corresponding MouseEvent instance.
	 * @event onMouseMove
	 * @param {MouseEvent} event A MouseEvent instance with information about the current mouse event.
	 **/
	p.onMouseMove = null;

	/**
	 * The onMouseUp callback is called when the user releases the mouse button anywhere that the page can detect it.  The handler
	 * is passed a single param containing the corresponding MouseEvent instance.
	 * @event onMouseUp
	 * @param {MouseEvent} event A MouseEvent instance with information about the current mouse event.
	 **/
	p.onMouseUp = null;

	/**
	 * The onMouseDown callback is called when the user presses the mouse button over the canvas.  The handler is passed a single
	 * param containing the corresponding MouseEvent instance.
	 * @event onMouseDown
	 * @param {MouseEvent} event A MouseEvent instance with information about the current mouse event.
	 **/
	p.onMouseDown = null;

	/**
	 * Indicates whether this stage should use the snapToPixel property of display objects when rendering them.
	 * @property snapToPixelEnabled
	 * @type Boolean
	 * @default false
	 **/
	p.snapToPixelEnabled = false;

	/** Indicates whether the mouse is currently within the bounds of the canvas.
	 * @property mouseInBounds
	 * @type Boolean
	 * @default false
	 **/
	p.mouseInBounds = false;

	/** If false, tick callbacks will be called on all display objects on the stage prior to rendering to the canvas.
	 * @property tickOnUpdate
	 * @type Boolean
	 * @default false
	 **/
	p.tickOnUpdate = true;

// private properties:

	/**
	 * @property _activeMouseEvent
	 * @protected
	 * @type MouseEvent
	 **/
	p._activeMouseEvent = null;

	/**
	 * @property _activeMouseTarget
	 * @protected
	 * @type DisplayObject
	 **/
	p._activeMouseTarget = null;

	/**
	 * @property _mouseOverIntervalID
	 * @protected
	 * @type Number
	 **/
	p._mouseOverIntervalID = null;

	/**
	 * @property _mouseOverX
	 * @protected
	 * @type Number
	 **/
	p._mouseOverX = 0;

	/**
	 * @property _mouseOverY
	 * @protected
	 * @type Number
	 **/
	p._mouseOverY = 0;

	/**
	 * @property _mouseOverTarget
	 * @protected
	 * @type DisplayObject
	 **/
	p._mouseOverTarget = null;

// constructor:
	/**
	 * @property DisplayObject_initialize
	 * @type Function
	 * @private
	 **/
	p.Container_initialize = p.initialize;

	/**
	 * Initialization method.
	 * @method initialize
	 * param {HTMLCanvasElement} canvas A canvas object, or the string id of a canvas object in the current document.
	 * @protected
	 **/
	p.initialize = function(canvas) {
		if(canvas.isFl == true) {
		  //-- Already a CanvasFl
		  this.canvas = canvas;
		}
		else {
		  //-- Not a CanvasFl
		  this.canvas = new ns.CanvasFl(canvas);
		}
		
		this.canvas._stage = this;

		//-- Begin EaselFl specific setup
		var myID, self = this;		
		
		this.Container_initialize();
		
		this._enableMouseEvents(true);
		
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
	 * Each time the update method is called, the stage will tick any descendants exposing a tick method (ex. BitmapAnimation)
	 * and render its entire display list to the canvas.
	 * @method update
	 **/
	p.update = function(data) {
		if(!(this.canvas && this.canvas._ctx && this.canvas._ctx.flReady)) { return; }
		
		if(this.autoClear === false) {
			this._flAutoClear = this.autoClear;
			this.canvas._ctx._flChange.push([this.id, 'blt']);
		}else if(this._flAutoClear === false) {
			this._flAutoClear = true;
			this.canvas._ctx._flChange.push([this.id, 'clr']);
		}
		
		Stage._snapToPixelEnabled = this.snapToPixelEnabled;
		
		if(this.tickOnUpdate) {
			this._tick(data);
		}
		
		//-- Should anything be passed in place of the canvas, the first parameter?
		this.draw( this.canvas._ctx, false, this.getConcatenatedMatrix(this._matrix));
		
		//-- send commands to Flash movie
		this.canvas._ctx._flFlush();

	}

	/**
	 * Calls the update method. Useful for adding stage as a listener to Ticker directly.
	 * @property tick
	 * @private
	 * @type Function
	 **/
	p.tick = p.update;

	/**
	 * Clears the target canvas. Useful if autoClear is set to false.
	 * @method clear
	 **/
	p.clear = function() {
		if(Stage.FL_THROW_UNIMPLEMENTED) throw 'EaseFl:Stage.clear not yet implemented';
	
		/*if (!this.canvas) { return; }
		var ctx = this.canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);*/
	}

	/**
	 * Returns a data url that contains a Base64 encoded image of the contents of the stage. The returned data url can be
	 * specified as the src value of an image element.
	 * @method toDataURL
	 * @param {String} backgroundColor The background color to be used for the generated image. The value can be any value HTML color
	 * value, including HEX colors, rgb and rgba. The default value is a transparent background.
	 * @param {String} mimeType The MIME type of the image format to be create. The default is "image/png". If an unknown MIME type
	 * is passed in, or if the browser does not support the specified MIME type, the default value will be used.
	 * @return {String} a Base64 encoded image.
	 **/
	p.toDataURL = function(backgroundColor, mimeType) {
		if(Stage.FL_THROW_UNIMPLEMENTED) throw "Stage.toDataURL not implemented in EaselFl";
		/*if(!mimeType) {
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

		return dataURL;*/
	}

	/**
	 * Enables or disables (by passing a frequency of 0) mouse over handlers (onMouseOver and onMouseOut) for this stage's display
	 * list. These events can be expensive to generate, so they are disabled by default, and the frequency of the events
	 * can be controlled independently of mouse move events via the optional frequency parameter.
	 * @method enableMouseOver
	 * @param {Number} frequency Optional param specifying the maximum number of times per second to broadcast mouse over/out events. Set to 0 to disable mouse
	 * over events completely. Maximum is 50. A lower frequency is less responsive, but uses less CPU. Default is 20.
	 **/
	p.enableMouseOver = function(frequency) {
		/*if (this._mouseOverIntervalID) {
			clearInterval(this._mouseOverIntervalID);
			this._mouseOverIntervalID = null;
		}
		if (frequency == null) { frequency = 20; }
		else if (frequency <= 0) { return; }
		var o = this;
		this._mouseOverIntervalID = setInterval(function(){ o._testMouseOver(); }, 1000/Math.min(50,frequency));
		this._mouseOverX = NaN;
		this._mouseOverTarget = null;*/
	}

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
	 * @method _enableMouseEvents
	 * @protected
	 * @param {Boolean} enabled
	 **/
	p._enableMouseEvents = function() {
	  
	
	  var o = this;
	  var evtBindMethod = window.addEventListener || document.addEventListener ? 'addEventListener' : 'attachEvent';
	  var evtTarget = window[evtBindMethod] ? window : document;
	  evtTarget[evtBindMethod]("mousemove", function(e) { o._handleMouseMove(e); }, false);
	  
		/*var o = this;
		var evtTarget = window.addEventListener ? window : document;
		evtTarget.addEventListener("mouseup", function(e) { o._handleMouseUp(e); }, false);
		evtTarget.addEventListener("mousemove", function(e) { o._handleMouseMove(e); }, false);
		evtTarget.addEventListener("dblclick", function(e) { o._handleDoubleClick(e); }, false);
		// this is to facilitate extending Stage:
		if (this.canvas) { this.canvas.addEventListener("mousedown", function(e) { o._handleMouseDown(e); }, false); }*/
	}

	/**
	 * @method _handleMouseMove
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleMouseMove = function(e) {
	

		if (!this.canvas) {
			this.mouseX = this.mouseY = null;
			return;
		}
		
		if(!e){ e = window.event; }

		var inBounds = this.mouseInBounds;
		this._updateMousePosition(e.pageX, e.pageY);
		if (!inBounds && !this.mouseInBounds) { return; }

		/*var evt = new MouseEvent("onMouseMove", this.mouseX, this.mouseY, this, e);

		if (this.onMouseMove) { this.onMouseMove(evt); }
		if (this._activeMouseEvent && this._activeMouseEvent.onMouseMove) { this._activeMouseEvent.onMouseMove(evt); }*/
	}

	/**
	 * @method _updateMousePosition
	 * @protected
	 * @param {Number} pageX
	 * @param {Number} pageY
	 **/
	p._updateMousePosition = function(pageX, pageY) {	
		
		var o = this.canvas._ctx._flInstance;
		if(o){
		  do {
			  pageX -= o.offsetLeft;
			  pageY -= o.offsetTop;
		  } while (o = o.offsetParent);		  
		  
		  this.mouseInBounds = (pageX >= 0 && pageY >= 0 && pageX < this.canvas.width && pageY < this.canvas.height);
		  //console.log(pageX+','+pageY);
		  if (this.mouseInBounds) {
			  this.mouseX = pageX;
			  this.mouseY = pageY;
		  }
		}
	}

	/**
	 * @method _handleMouseUp
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleMouseUp = function(e) {
		/*var evt = new MouseEvent("onMouseUp", this.mouseX, this.mouseY, this, e);
		if (this.onMouseUp) { this.onMouseUp(evt); }
		if (this._activeMouseEvent && this._activeMouseEvent.onMouseUp) { this._activeMouseEvent.onMouseUp(evt); }
		if (this._activeMouseTarget && this._activeMouseTarget.onClick &&
				this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true, (this._mouseOverIntervalID ? 3 : 1)) == this._activeMouseTarget) {

			this._activeMouseTarget.onClick(new MouseEvent("onClick", this.mouseX, this.mouseY, this._activeMouseTarget, e));
		}
		this._activeMouseEvent = this._activeMouseTarget = null;*/
	}

	/**
	 * @method _handleMouseDown
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleMouseDown = function(e) {
	/*	if (this.onMouseDown) {
			this.onMouseDown(new ns.MouseEvent("onMouseDown", this.mouseX, this.mouseY, this, e));
		}
		var target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, (this._mouseOverIntervalID ? 3 : 1));
		if (target) {
			if (target.onPress instanceof Function) {
				var evt = new ns.MouseEvent("onPress", this.mouseX, this.mouseY, target, e);
				target.onPress(evt);
				if (evt.onMouseMove || evt.onMouseUp) { this._activeMouseEvent = evt; }
			}
			this._activeMouseTarget = target;
		}*/
	}

	/**
	 * @method _testMouseOver
	 * @protected
	 **/
	p._testMouseOver = function() {
		/*if (this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) { return; }
		var target = null;
		if (this.mouseInBounds) {
			target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3);
			this._mouseOverX = this.mouseX;
			this._mouseOverY = this.mouseY;
		}

		if (this._mouseOverTarget != target) {
			if (this._mouseOverTarget && this._mouseOverTarget.onMouseOut) {
				this._mouseOverTarget.onMouseOut(new ns.MouseEvent("onMouseOut", this.mouseX, this.mouseY, this._mouseOverTarget));
			}
			if (target && target.onMouseOver) {
				target.onMouseOver(new ns.MouseEvent("onMouseOver", this.mouseX, this.mouseY, target));
			}
			this._mouseOverTarget = target;
		}*/
	}

	/**
	 * @method _handleDoubleClick
	 * @protected
	 * @param {MouseEvent} e
	 **/
	p._handleDoubleClick = function(e) {
		/*if (this.onDoubleClick) {
			this.onDoubleClick(new ns.MouseEvent("onDoubleClick", this.mouseX, this.mouseY, this, e));
		}
		var target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, (this._mouseOverIntervalID ? 3 : 1));
		if (target) {
			if (target.onDoubleClick instanceof Function) {
				target.onDoubleClick(new ns.MouseEvent("onPress", this.mouseX, this.mouseY, target, e));
			}
		}*/
	}
	
	Stage.FL_THROW_UNIMPLEMENTED = true; //--throw error on use of unimplemented features
	Stage.FL_LOG_PART_IMPLEMENTED = true; //--log warning notes for partial implementations

ns.Stage = Stage;

}(createjs||(createjs={})));