/**
 * Current known shortcomings:
 * -Garbage collection will not remove EaselFl objects either from
 * Flash or JS due to stage level index of items.
 * -Event handlers are not applied in Flash synchronously
 * -MouseOver, MouseOut, MouseClick tested using shape of
 * display object, not alpha of pixel as in EaselJS
 * -Assets (eg images) must be created using an EaselFl
 * function so that they will be loaded in Flash.
 **/

(function(window) {

    function ContextFl(){
       this.initialize(); 
    }
    var p = ContextFl.prototype;
    
    /** 
     * The flOnReady callback is called when the Flash Movie has loaded, all existing commands have been flushed
     * to it, and it is prepared for invocation of synchronous methods (such as hitTestPoint).
     * @event flOnReady
     * @param Stage The stage instance which is ready.
     **/
    p.flOnReady = null;

    /**
     * READ-ONLY Indicates whether the Flash Movie is ready.
     * @property
     * @type Boolean
     **/
    p.flReady = false;


    /**
     * @property _flCommandQueues
     * @protected
     * @type Object
     **/
    p._flCommandQueues = null;
    
    /**
     * @property _flInstance
     * @protected
     * @type Flash Movie
     **/
    p._flInstance = null;	

    /**
     * @property _flInstanceID
     * @protected
     * @type String
     **/
    p._flInstanceID = null;
    
    p._flChange = null;
    p._flCreate = null;
    p._flItemIndex = null;

    p._flFlush = function() {		
      if(this.flReady){
         var inst = this._flInstance;
       
         //-- Create Flash counterparts of EaselJS and asset classes
         if(this._flCreate.length){
            
            //step through items, replacing actual items with id, and recording in index
            var creates = this._flCreate, item, index = this._flItemIndex;
            for(var i=0, l=creates.length; i<l; ++i) {
               item = creates[i][1];         
               creates[i][1] = item.id;
               index[item.id] = item;
            }
            
            //-- notify flash to create these
            inst.create(this._flCreate);
            //-- clean create queue
            this._flCreate = [];
         }
         
         
         //-- Adjust state of Flash counterparts 
         if(this._flChange.length){
           inst.change(this._flChange);
           this._flChange = [];
           
          /* var a = [];
           while(this._flChange.length){
            a[0] = this._flChange.shift();
            try{
               inst.change(a);
            }catch(e){
               console.log('error:');
               console.log(e);
               console.log(a);
               console.log(this._flItemIndex[a[0][0]]);
               debugger;
            }
            
           }*/
           
         }
      }
   }
    
   /**
	 * Triggered when associated Flash Movie is ready for interaction
	 * @method _flOnReady
	 * @protected
	 **/
	p._flOnReady = function() {
		this._flInstance = ContextFl._flGetInstance( this._flInstanceID );
		this.flReady = true;
		this._flFlush();
		
      if( this.flOnReady ){
         this.flOnReady(this);
      }
   }
    
    p.initialize = function(){

      function handleEvents(obj) {
         //-- Handle dispatches from Flash
         
         if(obj.type==='onClick' || obj.type==='onMouseOver' || obj.type==='onMouseOut'){
            //-- Mouse events
            var item = self._flItemIndex[obj.id];
            if(item && item[obj.type]){
               item[obj.type](new MouseEvent(obj.type, obj.stageX, obj.stageY, item, null));  
            }
         }
      }
         
         
      var myID, self = this;
        
      //-- Setup flush data staging queues
      this._flCreate = [];
      this._flChange = [];
       
      //-- Index of created items for distributing events dispatched in Flash
      this._flItemIndex = {};
       
      //-- Assign unique ID to this EaseFl canvasFl
      this._flInstanceID = myID = 'EaselFl_'+ContextFl._flCount++;
        
         
        
      //-- Create proxy of function to be called when Flash Movie is ready
      CanvasFl._flHooks[myID] = function(){
         //reassign hook to receive calls from Flash
         CanvasFl._flHooks[myID] = handleEvents;
         self._flOnReady();
      }
     
      //-- Embed and initial loading of Flash Movie
      ContextFl._flLoadInstance(myID, CanvasFl.FL_WIDTH, CanvasFl.FL_HEIGHT, CanvasFl.FL_ELEMENT_ID);
   }
    
   ContextFl._flCount = 0;
  
/**
	 * @method _flLoadInstance
	 * @protected
	 **/
	//-- TODO : verify cross-browser compatability, specifically regarding 'user focus' issue.
	//-- TODO : use the dom container, dimensions, margins, etc of the canvas passed - instead of the elementId of the container
	ContextFl._flLoadInstance = function(id, width, height, elementId) {
	
		var element, html;
		
		if(elementId && typeof(elementId) === "string") {
			element = document.getElementById(elementId);
		}
		
		if(!element) {
			element = document.createElement("div");
			document.body.appendChild(element);
		}
		
		html = "<object id='"+id+"' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='"+width+"' height='"+height+"'>"
				+ "<param name='flashvars' value='id="+id+"'/>"
				+ "<param name='src' value='"+CanvasFl.FL_URL+"'/>"
				+ ( CanvasFl.FL_TRANSPARENT ? "<param name='wmode' value='transparent'>" : "" )
				+ "<embed name='"+id+"' pluginspage='http://www.macromedia.com/go/getflashplayer' src='"+CanvasFl.FL_URL+"' width='"+width+"' height='"+height+"' flashvars='id="+id+"'"
				+ ( CanvasFl.FL_TRANSPARENT ? " wmode='transparent'" : "" ) + "/>"
				+ "</object>";

		element.innerHTML = html;	         
	}

	//-- Get the movie object by id
	ContextFl._flGetInstance = function(id){
		if (/Explorer/.test(navigator.appName)) {
				return window[id];
			} else {
				return document[id];
		}
	}



    function CanvasFl(){
        this._ctx = new ContextFl();
    }
    var p = CanvasFl.prototype;

    p._ctx = null;
    
    p.getContext = function(type) {
        if(type==='2d'){
            return this._ctx;
        }
        return null;
    }

	//-- Static
	
	//-- Defaults
	CanvasFl.FL_URL = 'EaselFl.swf';
	CanvasFl.FL_WIDTH = 400;
	CanvasFl.FL_HEIGHT = 400;
	CanvasFl.FL_ELEMENT_ID = null;
	CanvasFl.FL_TRANSPARENT = true;
	CanvasFl.VERBOSE = false; //log warnings
	

	//-- Object on which 'ready' callback is exposed to Flash Movie
	CanvasFl._flHooks = {};
	
  
  window.CanvasFl = CanvasFl;
        
}(window));        
