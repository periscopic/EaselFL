(function(window) {

    var FrameFl = function(frame){
        this.id = UID.get();
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
            ImageFl.watch(f.image); 
            f.image.__fl.sync(ctx);
            
            //-- push frame to flash
            this._flCtx = ctx;
            ctx._flCreate.push(['frm', this]);
            ctx._flChange.push([this.id, 'init', [f.image.__fl.id, f.rect.x, f.rect.y, f.rect.width, f.rect.height, f.regX, f.regY]]);
        }
    }
    
    FrameFl.watch = function(frame) {
        if(!frame.__fl){
            frame.__fl = new FrameFl(frame);
            return true;
        }
        
        return false;
    }

window.FrameFl = FrameFl;
}(window));