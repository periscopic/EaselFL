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

(function(ns) {

//--EaselFL specific setup

//-- Find transform property for this browser
var transformProp, transformPropOrigin, transformUnit, isOld;

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
        
isNew = transformProp !== 'filter' && transformProp;
transformPropOrigin = transformProp+"Origin";
transformUnit = transformProp==='MozTransform'?'px':'';
 
if(isNew){
    var cumulativeVis = function(parent){
        var obj = {visible:true, alpha:1};
        while(parent && obj.visible){
            obj.visible = parent.visible;
            obj.alpha *= parent.alpha;
            parent = parent.parent;
        }
        return obj;
    }
}else{
    //force visibility false if alpha less than 50% in IE8, don't use alpha
    var cumulativeVis = function(parent){
        var obj = {visible:true, alpha:1};
        while(parent && obj.visible){
            obj.visible = parent.visible;
            obj.alpha *= parent.alpha;
            parent = parent.parent;
        }
        if(obj.alpha<0.5){
            obj.visible = false;
        }
        obj.alpha = 1;
        return obj;
    }
}
//-- end EaselFL specific setup

// TODO: fix problems with rotation.
// TODO: exclude from getObjectsUnderPoint

/**
 * <b>This class is still experimental, and more advanced use is likely to be buggy. Please report bugs.</b><br/><br/>
* A DOMElement allows you to associate a HTMLElement with the display list. It will be transformed
* within the DOM as though it is child of the Container it is added to. However, it is not rendered
* to canvas, and as such will retain whatever z-index it has relative to the canvas (ie. it will be
* drawn in front of or behind the canvas).<br/><br/>
* The position of a DOMElement is relative to their parent node in the DOM. It is recommended that
* the DOM Object be added to a div that also contains the canvas so that they share the same position
* on the page.<br/><br/>
* DOMElement is useful for positioning HTML elements over top of canvas content, and for elements
* that you want to display outside the bounds of the canvas. For example, a tooltip with rich HTML
* content.<br/><br/>
* DOMElement instances are not full EaselJS display objects, and do not participate in EaselJS mouse
* events or support methods like hitTest.
* @class DOMElement
* @extends DisplayObject
* @constructor
* @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
**/
var DOMElement = function(htmlElement) {
  this.initialize(htmlElement);
}
var p = DOMElement.prototype = new ns.DisplayObject();

// public properties:
	/**
	 * The DOM object to manage.
	 * @property htmlElement
	 * @type HTMLElement
	 **/
	p.htmlElement = null;

// private properties:
	/**
	 * @property _style
	 * @protected
	 **/
	p._style = null;

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
	*/
	/*
	//-- EaselJS
	p.initialize = function(htmlElement) {
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
		if (htmlElement) {
			this._style = htmlElement.style;
			this._style.position = "absolute";
			this._style.transformOrigin = this._style.webkitTransformOrigin = this._style.msTransformOrigin = this._style.MozTransformOrigin = "0% 0%";
		}
	}
	*/
	p.initialize = function(htmlElement) {
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
		this._flLastMtx = {a:null, b:null, c:null, d:null, tx:null, ty:null};

		if (htmlElement) {
			var style = this._style = htmlElement.style;
			style.position = "absolute";

			//not in EaselJS version, but for this to work both in 
			//<= IE8, since matrixes aren't usable for translation
			//in that browser
			style.top = 0;
			style.left = 0;	

			if(isNew) {
				// a 'modern' browser
				this._style[transformPropOrigin] = "0% 0%";
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
	 **/
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
	 **/
	/*	
	//-- EaselJS
	p.draw = function(ctx, ignoreCache) {
		// TODO: possibly save out previous matrix values, to compare against new ones (so layout doesn't need to fire if there is no change)
		if (this.htmlElement == null) { return; }
		var mtx = this.getConcatenatedMatrix(this._matrix);
		
		var o = this.htmlElement;
		o.style.opacity = ""+mtx.alpha;
		// this relies on the _tick method because draw isn't called if a parent is not visible.
		o.style.visibility = this.visible ? "visible" : "hidden";
		o.style.transform = o.style.webkitTransform = o.style.oTransform =  o.style.msTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,(mtx.tx+0.5|0),(mtx.ty+0.5|0)+")"].join(",");
		o.style.MozTransform = ["matrix("+mtx.a,mtx.b,mtx.c,mtx.d,(mtx.tx+0.5|0)+"px",(mtx.ty+0.5|0)+"px)"].join(",");
		return true;
	}
	*/
	p.draw = function(ctx, ignoreCache) {

		if (!this.htmlElement) { return; }

		var mtx = this.getConcatenatedMatrix(this._matrix);		

		// in IE less than 9, just added, measure the bounds
		// if rotation, scaling required in IE8 and HTML changes dimensions, 
		// flUpdateBounds() should be fired again
		if(!isNew && this.htmlElement.parentNode!==this._flParentNode && this.htmlElement.parentNode){    
			this._flParentNode = this.htmlElement.parentNode;   
	        this.flUpdateBounds();
	    }		

	    this._flCumMtx = mtx;

	    if(this._flVisible){
	      this._flSyncTransform();
	    }		

		return true;
	}

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
	 * @method updateCache
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
	 * This presently clones the DOMElement instance, but not the associated HTMLElement.
	 * @method clone
	 * @return {DOMElement} a clone of the DOMElement instance.
	 **/
	p.clone = function() {
		var o = new DOMElement();
		this.cloneProps(o);
		return o;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[DOMElement (name="+  this.name +")]";
	}

// private methods:
	/*
	//-- EaselJS
	p._tick = function(data) {
		if (this.htmlElement == null) { return; }
		this.htmlElement.style.visibility = "hidden";
		if (this.onTick) { this.onTick(data); }
	}
	*/
	p._tick = function(data) {
		if (this.htmlElement == null) { return; }

		if(this._flCumMtx && this._flSyncVisibility() ){
            this._flSyncTransform();
        }

        if (this.onTick) { this.onTick(data); }
    }

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


    p._flSimpleTransform = true;
    p._flWidth = 0;
    p._flHeight = 0;
    p._flLastMtx = null;
    p._flBx = 0;
    p._flBy = 0;
    p._flVisible = true;
    p._flAlpha = 1;
    p._flCumMtx = null;
    p._flMsMtx = '';
    p._flMsAlpha = '';
    p._flMsCum = ' ';
    p._flParentNode = null;
    p._flCtx = null;

	p._flSyncVisibility = function(){
        
        var cumVis = cumulativeVis(this);
        var style = this.htmlElement.style;      
        var swapVis = false;
                
        //-- Update visibility
        if(this._flVisible !== ( (this._flCumMtx !== null) && cumVis.visible )){
            swapVis = true;
            
            this._flVisible = !this._flVisible;               
                        
            if(this._flVisible){
                style.visibility = 'visible';                
            }else{
                style.visibility = 'hidden';
            }
        }
        
        //-- Don't need to update any other props if not visible
        if(this.visible === false){
            return false;
        }
        
        //-- Update alpha
        if(cumVis.alpha !== this.__alpha){
            if(transformProp !== 'filter'){
                style.opacity = cumVis.alpha<1 ? cumVis.alpha : '';         
            }else{
                this._flMsAlpha = cumVis.alpha<1 ? 'progid:DXImageTransform.Microsoft.Alpha(Opacity='+Math.round(100*cumVis.alpha)+')' : '';
            }
            
            this.__alpha = cumVis.alpha;
        }
        
        //-- If swapped and visible, then transform needs to be updated immediately
        return swapVis && this._flVisible;
    }

    p._flSyncTransform = function(){

        //-- From last draw call
        var mtx = this._flCumMtx;
        var style = this.htmlElement.style;          
        
        if(!mtx){
            return;
        }       
        
        //-- Update position, rotation based on parent
        var lmtx = this._flLastMtx;
        
        if( lmtx.tx!== mtx.tx || lmtx.ty!== mtx.ty || lmtx.a !== mtx.a || lmtx.b !== mtx.b || lmtx.c !== mtx.c || lmtx.d !== mtx.d ){
            
            var simple = (mtx.a ===1 && mtx.b === 0 && mtx.a === mtx.d && mtx.b===mtx.c);            
            
            if(simple){
                style.left= mtx.tx+'px';
                style.top = mtx.ty+'px';           
                
                //overwrite complex transform
                if(!this._flSimpleTransform){
                    if(transformProp !== 'filter'){
                        style[transformProp] = '';
                    }else{
                        this._flMsMtx = '';
                    }                  
                }        
            
            } else if( lmtx.a !== mtx.a || lmtx.b !== mtx.b || lmtx.c !== mtx.c || lmtx.d !== mtx.d ){
                //not identity, complex transform
                
                if(transformProp!== 'filter'){
                    style.left= mtx.tx+'px';
                    style.top = mtx.ty+'px';   
                    
                    //modern browser matrix
                   style[transformProp] = 'matrix('+mtx.a.toFixed(4)+','+mtx.b.toFixed(4)+','+mtx.c.toFixed(4)+','+mtx.d.toFixed(4)+',0,0)';
                
                }else{
                    //legacy browser matrix
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
                    var bx = this._flBx = -(wd-ltx);
                    var by = this._flBy = -(ht-lty);
                    
                    //translate                    
                    style.left=(mtx.tx+bx)+"px";
                    style.top=(mtx.ty+by)+"px";
                    //could this be handled better to prevent existing zIndex from being overwritten?
                    style.zIndex = 0; //prevent child dom elements from shifting outside of rotated box in IE8
                }
            }else{
                //simple transform, but don't wipe out old matrix
                style.left=(mtx.tx+this._flBx)+"px";
                style.top=(mtx.ty+this._flBy)+"px";
            }

            
            this._flSimpleTransform = simple;
            
            lmtx.a = mtx.a;
            lmtx.b = mtx.b;
            lmtx.c = mtx.c;
            lmtx.d = mtx.d;
            lmtx.tx = mtx.tx;
            lmtx.ty = mtx.ty;            
            
            if(transformProp === 'filter'){
                var msCum = this._flMsMtx+' '+this._flMsAlpha;
                if(msCum!==this._flMsCum){
                    this._flMsCum = msCum;
                    style[transformProp] = msCum;
                }               
            }           
        }
    }

	p._flRunCreate = function(ctx){    
	    if(this._flCtx !== ctx && ctx){
	      //currently create a dummy shape in Flash to allow for adding removing
	      //without conflict
	      this._flCtx=ctx;
	      
	      ctx._flCreate.push(['shp', this]);
	      //ctx._flCreate.push(['shp', this]);
	    }
	  }


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

ns.DOMElement = DOMElement;
}(createjs||(createjs={})));
var createjs;