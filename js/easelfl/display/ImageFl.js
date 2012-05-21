(function(window) {

    var ImageFl = function(){
        this.id = UID.get();
       // Stage._flPushCreate('img', this);
        //Ticker.addListener(this);
    }
    
    var p = ImageFl.prototype;
    p._flCtx = null;
    p.complete = true;
    p.id = null;
    p._flSrc = null;
    p.src = null;
    p._flOnload = null;
    p.onload = null;
    
    p.draw = function( ctx ){
        if(!this._flCtx){
            this._flCtx = ctx;
            ctx._flCreate.push(['img', this.id]);
        }
        
        if(this._flSrc!==this.src){
            this._flSrc = this.src;
            ctx._flChange.push([this.id, 'src', this.src]);
        }
    }
    

window.ImageFl = ImageFl;
}(window));