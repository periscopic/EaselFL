

var TestUtils = (function(){
	
var ScriptLoader = {
    
    /**
     * Load a script
     * @param String a script URL
     * @param Function callback method
     */
    load : function( filename, finished ){
        var fired = false;
        var fileref;
      
        fileref = document.createElement("script");
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src",filename);
        
        var handleLoad = function() {
            if(!fired) {
                fired = true;
                finished.call(null);
                try {
                  delete fileref.onreadystatechange;
                }
                catch( err ) {}
                try {
                  delete fileref.onload;
                }
                catch( err2 ) {}
            }
        };
        
        if(document.all) {
            fileref.onreadystatechange = function () {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    handleLoad();
                }
            };
        }
        else {
            fileref.onload = function () { handleLoad();};
        }
        
        document.getElementsByTagName("head")[0].appendChild(fileref);  
    },
    
    
    /**
     * Load a set of scripts in order
     * @param Array list of URLs
     * @param Function callback method
     */
    loadInOrder : function( files, finished ) {
      
        var next = function(){
            if(files.length===0) {
                finished();
            }else{
                ScriptLoader.load(files.shift(), next);
            }
        }
        
        files = files.slice(0);
        next();
    }
  };
	
	
    var usingCanvas = false;	
    
    function buildHTML(label, swapLabel){
        var doc = document;

        var cont = document.createElement('div');
        cont.setAttribute('id', 'testContainer');
        doc.body.appendChild(cont);
        
        var curRender = doc.createElement('div');
        curRender.setAttribute('id','curRender');
        curRender.innerHTML = label;
        doc.body.appendChild(curRender);
        
        var swap = doc.createElement('a');
        swap.setAttribute('id', 'swap');
        swap.setAttribute('href', '#');
        swap.setAttribute('onclick', 'TestUtils.swapRenderMethod(); return false;');
        swap.innerHTML = swapLabel;
        doc.body.appendChild(swap);
    }
           
    return {
        useCanvas : window.location.search.toUpperCase().indexOf('CANVAS')>=0,	
    
        loadWithEaselJS : function(init, extras) {
            var list;
            usingCanvas = true;
            buildHTML('Canvas + EaselJS', 'view in Flash with EaselFL');
            
            /*list = [
                'js/easeljs/utils/UID.js',
                'js/easeljs/events/EventDispatcher.js',
                'js/easeljs/utils/Ticker.js',
                'js/easeljs/events/MouseEvent.js',
                'js/easeljs/geom/Matrix2D.js',
                'js/easeljs/geom/Point.js',
                'js/easeljs/geom/Rectangle.js',
                'js/easeljs/ui/ButtonHelper.js',
                'js/easeljs/display/Shadow.js',
                'js/easeljs/display/SpriteSheet.js',
                'js/easeljs/display/Graphics.js',
                'js/easeljs/display/DisplayObject.js',
                'js/easeljs/display/Container.js',
                'js/easeljs/display/Stage.js',
                'js/easeljs/display/Bitmap.js',
                'js/easeljs/display/BitmapAnimation.js',
                'js/easeljs/display/Shape.js',
                'js/easeljs/display/Text.js',
                'js/easeljs/utils/SpriteSheetUtils.js',
                'js/easeljs/utils/SpriteSheetBuilder.js',
                'js/easeljs/display/DOMElement.js',
                'js/easeljs/filters/Filter.js',
                'js/easeljs/ui/Touch.js',
                'js/easeljs/version.js'
            ];*/

            list = [
                'js/easeljs-0.6.0.min.js'
            ];

            if(extras) {
                list = list.concat(extras);
            }

            ScriptLoader.loadInOrder(list, init);
             
        },
      
        loadWithEaselFL : function(init, extras) {
            var list;

            usingCanvas = false;
            buildHTML('Flash + EaselFL', 'view in Canvas with EaselJS');            
                        
            list = [
                '../js/swfobject.js',
                '../js/easelfl/utils/ContextConfig.js',
                '../js/easelfl/utils/Log.js',
                '../js/easelfl/utils/UID.js',
                '../js/easelfl/events/Event.js',
                '../js/easelfl/events/EventDispatcher.js',
                '../js/easelfl/utils/Ticker.js',
                '../js/easelfl/events/MouseEvent.js',
                '../js/easelfl/geom/Matrix2D.js',
                '../js/easelfl/geom/Point.js',
                '../js/easelfl/geom/Rectangle.js',
                '../js/easelfl/ui/ButtonHelper.js',
                '../js/easelfl/display/CanvasFl.js',
                '../js/easelfl/display/ImageFl.js',
                '../js/easelfl/display/Shadow.js',
                '../js/easelfl/display/FrameFl.js',
                '../js/easelfl/display/SpriteSheet.js',
                '../js/easelfl/display/Graphics.js',
                '../js/easelfl/display/DisplayObject.js',
                '../js/easelfl/display/Container.js',
                '../js/easelfl/display/Stage.js',
                '../js/easelfl/display/Bitmap.js',
                '../js/easelfl/display/BitmapAnimation.js',
                '../js/easelfl/display/Shape.js',
                '../js/easelfl/display/Text.js',
                '../js/easelfl/utils/SpriteSheetUtils.js',
                //'../js/easelfl/utils/SpriteSheetBuilder.js',
                '../js/easelfl/display/DOMElement.js',
                '../js/easelfl/filters/Filter.js',
                //'../js/easelfl/ui/Touch.js',
                '../js/easelfl/version.js'
            ];        

            /*list = [
                '../js/swfobject.js',
                '../build/output/easelfl-NEXT.min.js'
            ]; */     
            
            if(extras) {
                list = list.concat(extras);
            }

            ScriptLoader.loadInOrder(list, init);
        },
        
        swapRenderMethod : function() {
            window.location = window.location.href.split('?')[0] + (!usingCanvas ? '?canvas' : '');
        }
      };
})()