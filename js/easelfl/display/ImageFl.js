(function(window) {

    var ImageFl = function(img){
        this.id = UID.get();
        this._img = img;
    }
    
    var p = ImageFl.prototype;
    p.id = null;
    p._img = null;
    p._flCtx = null;    
    p._flSrc = null;
    
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
    
    ImageFl.watch = function(HTMLImageElement) {
        if(!HTMLImageElement.__fl){
            HTMLImageElement.__fl = new ImageFl(HTMLImageElement);
            return true;
        }
        
        return false;
    }

window.ImageFl = ImageFl;
}(window));