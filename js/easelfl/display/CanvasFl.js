
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
    
    
   /* 

    p._flPushChange = function( target, command, params) {
       // console.log('change', target.id, command, params);
        this._flCommandQueues.change.push([target.id, command, params]);
    }
    
    p._flPushCreate = function( type, target) {
        console.log('create', type, target.id);
        this._flCommandQueues.create.push([type, target.id]);
    }
   */
    p._flFlush = function() {
		//-- TODO : pass values to Flash movie
		
	//	if(Stage._flFlushCount<3){
			
	//	console.log('flush:' + Stage._flFlushCount++);
		
    if(this.flReady){
      
      
      var inst = this._flInstance;
		
      //-- Create Flash counterparts of EaselJS and asset classes
      if(this._flCreate.length){
        inst.create(this._flCreate);
        console.log(this._flCreate);
        this._flCreate = [];
      }
      
      
      //-- Adjust state of Flash counterparts 
      if(this._flChange.length){
         console.log(this._flChange);
        inst.change(this._flChange);
        this._flChange = [];
      }
    }
		
		
	//	}
	}
    
   /**
	 * Triggered when associated Flash Movie is ready for interaction
	 * @method _flOnReady
	 * @protected
	 **/
	p._flOnReady = function() {
   console.log('on ready');
		this._flInstance = ContextFl._flGetInstance( this._flInstanceID );
		this.flReady = true;
		this._flFlush();
		
    if( this.flOnReady ){
				this.flOnReady(this);
		}
	}
    
    
    p.initialize = function(){
        var myID, self = this;
        
         //-- Setup flush data staging queues
       this._flCreate = [];
       this._flChange = [];
        
        //-- Assign unique ID to this EaseFl canvasFl
        this._flInstanceID = myID = 'EaselFl_'+ContextFl._flCount++;
        
        //-- Create proxy of function to be called when Flash Movie is ready
        CanvasFl._flHooks[myID] = function(){ self._flOnReady(); }
        
        //-- Embed and initial loading of Flash Movie
        ContextFl._flLoadInstance(myID, CanvasFl.FL_WIDTH, CanvasFl.FL_HEIGHT, CanvasFl.FL_ELEMENT_ID);
        
        //-- End EaselFl specific setup
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
	

	//-- Object on which 'ready' callback is exposed to Flash Movie
	CanvasFl._flHooks = {};
	
  
  window.CanvasFl = CanvasFl;
        
}(window));        
