/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* Bitmap
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
* A Bitmap represents an Image, Canvas, or Video in the display list.
* @class Bitmap
* @extends DisplayObject
* @constructor
* @param {Image | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
**/
var Bitmap = function(imageOrUri) {
  this.initialize(imageOrUri);
}
var p = Bitmap.prototype = new ns.DisplayObject();

// public properties:
	/**
	 * The image to render. This can be an Image, a Canvas, or a Video.
	 * @property image
	 * @type Image | HTMLCanvasElement | HTMLVideoElement
	 **/
	p.image = null;
	
	/**
	 * Whether or not the Bitmap should be draw to the canvas at whole pixel coordinates.
	 * @property snapToPixel
	 * @type Boolean
	 * @default true
	 **/
	p.snapToPixel = true;

	/**
	 * Specifies an area of the source image to draw. If omitted, the whole image will be drawn.
	 * @property sourceRect
	 * @type Rectangle
	 * @default null
	 */
	p.sourceRect = null;
	
	// constructor:

	/**
	 * @property DisplayObject_initialize
	 * @type Function
    * @private
	 **/
	p.DisplayObject_initialize = p.initialize;

	/** 
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(imageOrUri) {
		this.DisplayObject_initialize();
		if (typeof imageOrUri == "string") {
			this.image = new Image();
			this.image.src = imageOrUri;
		} else {
			this.image = imageOrUri;
		}
	}
	
// public methods:

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	p.isVisible = function() {
		return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext || this.image.readyState >= 2);
	}

	/**
	 * @property DisplayObject_draw
	 * @type Function
	 * @private
	 **/
	p.DisplayObject_draw = p.draw;
	
	/**
	 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
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
		var rect = this.sourceRect;
		if (rect) {
			ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
		} else {
			ctx.drawImage(this.image, 0, 0);
		}
		return true;
	}
	*/
	p.draw = function(ctx, ignoreCache) {
	
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }


		// sync image to this
		if(this.image!==this._flImg) {
			//dereference image
			if(this._flImg) {
				this._flImg.__fl.deretain();
			}

			this._flImg = this.image;
			
			if(this.image) {
				ns.ImageFl.watch(this.image);
				//reference image
				this._flImg.__fl.retain(ctx);
				ctx._flChange.push([this._flId, 'img', this.image.__fl._flId]);
			} else {
				ctx._flChange.push([this._flId, 'img', null]);
			}
		}

		//sync image properties
		if(this.image) {
			this.image.__fl.sync();
		}
			
		//sync rect to this
		if(this.sourceRect!==this._flSourceRect) {
			if(this._flSourceRect) {
				this._flSourceRect._flDeretain();
			}

			this._flSourceRect = this.sourceRect;
			
			if(this._flSourceRect) {
				this._flSourceRect._flRetain(ctx);
			}

			ctx._flChange.push([this._flId, 'rct', this.sourceRect ? this.sourceRect._flId : null]);
		}

		//sync rect properties
		if(this.sourceRect) {
			this.sourceRect._flSync();
		}
		
		return true;
	}

	//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
	//Bitmap. This is why they have no method implementations.
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method cache
	 **/
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method updateCache
	 **/
	
	/**
	 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
	 * You should not cache Bitmap instances as it can degrade performance.
	 * @method uncache
	 **/
	
	/**
	 * Returns a clone of the Bitmap instance.
	 * @method clone
	 * @return {Bitmap} a clone of the Bitmap instance.
	 **/
	p.clone = function() {
		var o = new Bitmap(this.image);
		this.cloneProps(o);
		return o;
	}
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[Bitmap (name="+  this.name +")]";
	}
	
	
	/**** Begin EaselFL specific code ****/
	
	p._flType = 'bmp';
	p._flCtx = null;
	p._flImg = null;
	p._flSourceRect = null;
	p._flSmoothing = false;
	p.flSmoothing = false;
	
	p.flSetSmoothing = function(smooth) {
		if(this._flCtx && smooth!==this._flSmoothing){
			this.flSmoothing = this._flSmoothing = smooth;
			this._flCtx._flChange.push([this._flId, 'smth', smooth]);	
		}else{
			this.flSmoothing = smooth;
		}
	}

	/**
	 * Add the creation command for this object and its children to the CanvasFl context, to be created in Flash
	 * @protected
	 * @param Object The CanvasFl context
	 **/
	p._flDisplayObjectRunCreate = p._flRunCreate;

	p._flRunCreate = function(ctx){
		this._flDisplayObjectRunCreate(ctx);	
		//we have a context, so we can update smoothing
		this.flSetSmoothing(this.flSmoothing);		
	}

	p._flDisplayObjectResetProps = p._flResetProps;

	p._flResetProps = function() {
		this._flDisplayObjectResetProps();
		this._flSourceRect = 
		this._flImg = null;
	}

	p._flDisplayObjectRetain = p._flRetain;

	p._flRetain = function(ctx) {
		this._flDisplayObjectRetain(ctx);

		if(this._flSourceRect) {
			this._flSourceRect._flRetain();
		}

		if(this._flImg) {
			this._flImg.__fl.retain();
		}
	}

	p._flDisplayObjectDeretain = p._flDeretain;

	p._flDeretain = function() {
		this._flDisplayObjectDeretain();
		
		if(this._flSourceRect) {
			this._flSourceRect._flDeretain();
		}

		if(this._flImg) {
			this._flImg.__fl.deretain();
		}
	}


	/**** End EaselFL specific code ****/

// private methods:

ns.Bitmap = Bitmap;
}(createjs||(createjs={})));
var createjs;