/**
 * Current known shortcomings:
 * -Garbage collection will not remove EaselFl objects either from
 * Flash or JS due to stage level index of items. This could be
 * remedied by storing all commands passed to flash for a specific
 * object, removing it from flash and from the index whenever it is
 * removed from the display list. A new instance would then be created
 * again in Flash when added to the display list.
 * -Event handlers are not applied in Flash synchronously
 * -MouseOver, MouseOut, MouseClick tested using shape of
 * display object, not alpha of pixel as in EaselJS
 * -Graphics have lineScaleMode set to 'none' which prevents issue of lines
 * scaling when only scaling horizontal or vertical, but causes lines not
 * to scale proportionately, as they would in EaselJS.
 **/

(function(window) {

    function ContextFl(thecanvas, fl_url, width, height){
       this.initialize(thecanvas, fl_url, width, height); 
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
	
	p._flAttempts = 0;

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
    
    p.initialize = function(thecanvas, fl_url, width, height){
	  
      var cnvID = thecanvas.getAttribute('id'),
	  cnvWd = thecanvas.getAttribute('width') || CanvasFl.FL_WIDTH,
	  cnvHt = thecanvas.getAttribute('height') || CanvasFl.FL_HEIGHT,
      fl_swf_url = thecanvas.getAttribute('fl_swf_url') || CanvasFl.FL_URL;
      
	  //-- Handle dispatches from Flash
      function handleEvents(obj) {         
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
      myID = 'EaselFl_'+ContextFl._flCount++;
      this._flInstanceID = cnvID || myID;
	  
	  if(cnvID!==this._flInstanceID){
		 thecanvas.setAttribute('id', myID);
	  }
	  
	          
      //-- Create proxy of function to be called when Flash Movie is ready
      CanvasFl._flHooks[myID] = function(){
         //reassign hook to receive calls from Flash
         CanvasFl._flHooks[myID] = handleEvents;
         self._flOnReady();
      }
     
      //-- Embed and initial loading of Flash Movie
      ContextFl._flLoadInstance(myID, cnvWd, cnvHt, this._flInstanceID, fl_swf_url);
   }
    
   ContextFl._flCount = 0;
  
   /**
  * @method _flLoadInstance
  * @protected
  * @param {int} id             ID of the container
  * @param {int} width          Width of the container to load the swf into
  * @param {int} height         Height of the container to load the swf into
  * @param {String} elementId   Unique instance ID of this CanvasFl
  * @param {String} swfUrl      The name and location of the EaselFl.swf file.  Defaults to :
  **/
   ContextFl._flLoadInstance = function(id, width, height, elementId, swfUrl) {
	
	  var flashvars = {
		 id : id
	  }
	  
	  var params = {
		 wmode : (CanvasFl.FL_TRANSPARENT?'transparent':'opaque')
	  }
 
	 swfobject.embedSWF(swfUrl, elementId, width.toString(), height.toString(), '9.0.0', false, flashvars, params)
   }

   //-- Get the movie object by id
   ContextFl._flGetInstance = function(id){
	   if (/Explorer/.test(navigator.appName)) {
			   return window[id];
		   } else {
			   return document[id];
	   }
   }

   function CanvasFl(thecanvas, fl_url, width, height){
	   this._ctx = new ContextFl(thecanvas, fl_url, width, height);
   }
   
   var p = CanvasFl.prototype;

   p._ctx = null;
   
   /**
	* READ-ONLY Used for testing type in Stage.js
	* @property
	* @type Boolean
	**/
   p.isFl = true;
   
   p.getContext = function(type) {
	  if(type==='2d'){
		  return this._ctx;
	  }
	  return null;
   }

   //-- Static	
   //-- Defaults

   CanvasFl.FL_URL = 'EaselFl.swf';
   CanvasFl.FL_TRANSPARENT = true;
   CanvasFl.FL_WIDTH = '400';
   CanvasFl.FL_HEIGHT= '400';
   CanvasFl.VERBOSE = false; //--log warnings
   

   //-- Object on which 'ready' callback is exposed to Flash Movie
   CanvasFl._flHooks = {};
	
  
   window.CanvasFl = CanvasFl;
        
}(window));        
