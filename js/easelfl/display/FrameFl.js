/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* FrameFl
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
 * FrameFl is transparently used by the EaselFL BitmapAnimation class
 * and does not require direct instantiation in normal usage.
 *
 * It contains data related to a specific frame within a spritesheet
 * and allows efficient reuse of the bitmaps inside Flash.
 */

(function(ns) {

    var FrameFl = function(frame){
        this.id = ns.UID.get();
        this._frame = frame;
    }
    
    var p = FrameFl.prototype;
    p.id = null;
    p._frame = null;
    p._flCtx = null;    
    
    p.sync = function( ctx ){
        if(!this._flCtx){
            
            var f = this._frame;
            
            //-- verify image is pushed to flash
            ns.ImageFl.watch(f.image); 
            f.image.__fl.sync(ctx);
            
            //-- push frame to flash
            this._flCtx = ctx;
            ctx._flCreate.push(['frm', this]);
            ctx._flChange.push([this.id, 'init', [f.image.__fl.id, f.rect.x, f.rect.y, f.rect.width, f.rect.height, f.regX, f.regY]]);
        }
    }
    
    /**
     * Create a FrameFl for a spritesheet frame if one does not already exist.
     * @static
     * @method watch
     * @internal
     * @param Object
     */
    FrameFl.watch = function(frame) {
        if(!frame.__fl){
            frame.__fl = new FrameFl(frame);
            return true;
        }
        
        return false;
    }

ns.FrameFl = FrameFl;

}(createjs||(createjs={})));
var createjs;