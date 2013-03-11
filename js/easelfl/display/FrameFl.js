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

// namespace:
this.createjs = this.createjs||{};

(function() {

    var FrameFl = function(frame){
        this._flId = createjs.UID.get();
        this._frame = frame;
    }
    
    var p = FrameFl.prototype;
    p._flId = null;
    p._frame = null;
    p._flCtx = null;
    p._flRefs = 0;
    p._flType = 'frm';
    p._flDep = null;

    p.retain = function(ctx) {
        this._flRefs ++;

        if(!this._flCtx){
            
            var f = this._frame;
            this._flCtx = ctx;
            ctx._flCreate.push([this._flType, this]);

            if(f.flip) {
                //-- this is a copy of another frame
                //-- make sure source frame is synced to flash
                FrameFl.watch(f.src);
                this._flDep = f.src.__fl;
                this._flDep.retain(ctx);

                //-- push frame to flash
                ctx._flChange.push([this._flId, 'flp', [this._flDep._flId, f.h, f.v]]);
            } else {
                //-- verify image is pushed to flash
                createjs.ImageFl.watch(f.image);
                this._flDep = f.image.__fl;
                this._flDep.retain(ctx).sync();
                
                //-- push frame to flash
                ctx._flChange.push([this._flId, 'init', [this._flDep._flId, f.rect.x, f.rect.y, f.rect.width, f.rect.height, f.regX, f.regY]]);
            }
        } else {
            // retain frame or image on which this depends
            this._flDep.retain(ctx); 
        }
    }

    p.deretain = function() {
        this._flRefs --;

        //_flDep should never be undefined here
        this._flDep.deretain();
    }

    p._flResetProps = function() {
        this._flCtx = 
        this._flDep = null;
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

createjs.FrameFl = FrameFl;

}());