(function(window) {

    var ImageFl = function(){
        this.id = UID.get();
        Stage._flPushCreate('img', this);
        Ticker.addListener(this);
    }
    
    var p = ImageFl.prototype;
    p.complete = true;
    p.id = null;
    p._flSrc = null;
    p.src = null;
    p._flOnload = null;
    p.onload = null;
    
    p.tick = function() {
        if(this._flSrc!==this.src){
            this._flSrc = this.src;
            Stage._flPushChange(this, 'src', this.src);
        }
    }

window.ImageFl = ImageFl;
}(window));