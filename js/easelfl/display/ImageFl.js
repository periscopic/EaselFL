/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* ImageFl
*
* Copyright (c) 2012 periscopic, inc
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

/*
 * ImageFl is transparently used by the EaselFL Bitmap, Graphics, and BitmapAnimation
 * (via FrameFl) classes and does not require direct instantiation in normal usage.
 *
 * It facilitates loading and syncing of image files into Flash.
 */


(function(ns) {

    /**
     * @constructor
     * @private
     * @param HTMLImageElement
     **/
    var ImageFl = function(img){
        this.id = ns.UID.get();
        this._img = img;
    }
    
    var p = ImageFl.prototype;
    
    /**
	 * @internal
	 * @property id
	 * @type Number
	 **/
    p.id = null;
    
    /**
	 * @private
	 * @property _img
	 * @type HTMLImageElement
	 **/
    p._img = null;
    
    /**
	 * The synced ContextFl
	 * @private
	 * @property _flCtx
	 * @type ContextFl
	 **/
    p._flCtx = null;
    
    /**
	 * The image source URL
	 * @private
	 * @property _flSrc
	 * @type String
	 **/
    p._flSrc = null;
    
    /**
     * If not yet created, create this image in the specified context.
     * If src not set, or has changed, change that within context.
     * This is called during the render/sync cycle.
     * @internal
     * @method sync
     * @param ContextFl
     */
    p.sync = function( ctx ){
        if(!this._flCtx){
            this._flCtx = ctx;
            ctx._flCreate.push(['img', this]);
        }
        
        if(this._flSrc!==this._img.src){
            this._flSrc = this._img.src;
            ctx._flChange.push([this.id, 'src', this._flSrc]);
        }
    }
    
    /**
     * Create an ImageFl for this HTML image if one does not already exist.
     * @static
     * @method watch
     * @internal
     * @param Object
     */
    ImageFl.watch = function(HTMLImageElement) {
        if(!HTMLImageElement.__fl){
            HTMLImageElement.__fl = new ImageFl(HTMLImageElement);
            return true;
        }
        
        return false;
    }

ns.ImageFl = ImageFl;

}(createjs||(createjs={})));
var createjs;