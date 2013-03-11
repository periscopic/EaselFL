/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/*
* CanvasFl
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
 * CanvasFl is transparently used by the EaselFL Stage
 * and does not require direct instantiation in normal usage.
 *
 * This file code contains two classes, CanvasFl, a compatability
 * layer that shares some attributes with the HTML5 canvas,
 * and ContextFl, a compatability layer that shares some
 * attributes with the HTML5 2D rendering context. ContextFl
 * is the interface through which all the EaselFL / Flash
 * communication occurs.
 */

// namespace:
this.createjs = this.createjs||{};

(function() {

	/*-------------------------/

	/******** ContextFl ********/

	/**
	* @constructor
	* @class ContextFl
	* @param HTML element
	**/
	function ContextFl(thecanvas){
		this.initialize(thecanvas); 
	}

	var p = ContextFl.prototype;

	/**
	* @property _flCommandQueues
	* @internal
	* @type Object
	**/
	p._flCommandQueues = null;

	/**
	* @property _flInstance
	* @internal
	* @type Flash Movie
	**/
	p._flInstance = null;	

	/**
	* @property _flInstanceID
	* @internal
	* @type String
	**/
	p._flInstanceID = null;

	/**
	* The queue of commands to send to Flash at the end
	* of the render cycle that relate to modification of
	* objects properties.
	* @property _flChange
	* @internal
	* @type Array
	**/
	p._flChange = null;

	/**
	* The queue of commands to send to Flash at the end
	* of the render cycle that relate to creation of
	* Flash counterparts to JS objects.
	* @property _flCreate
	* @internal
	* @type Array
	**/
	p._flCreate = null;

	/**
	* Array of Easel objects keyed by their ID numbers.
	* @property _flIndex
	* @private
	* @type Array
	**/
	p._flItemIndex = null;

	/**
	* The MouseEvent corresponding to an onPress that
	* has not yet been completed by corresponding onMouseUp
	* @property _flCurPressEvent
	* @private
	* @type MouseEvent
	**/
	p._flCurPressEvent = null;

	/**
	* @property _flCanvas
	* @internal
	* @type CanvasFl
	**/
	p._flCanvas = null;


	// Flushes since stage init
	p._flFlushCount = 0;


	/**
	* Send all queued commands to Flash
	* @internal
	**/
	p._flFlush = function() {		
		if(this.flReady){

			var inst = this._flInstance,
			index = this._flItemIndex, 
			item;

			//-- Create Flash counterparts of EaselJS and asset classes
			if(this._flCreate.length){
				
				//step through items, replacing actual items with id, and recording in index
				var creates = this._flCreate;

				for(var i=0, l=creates.length; i<l; ++i) {    
					 item = creates[i][1];         
					 creates[i][1] = item._flId;
					 index[item._flId] = item;	
				}
				
				//-- notify flash to create these
				inst.sendCreate(this._flCreate);    
				
				//-- clean create queue
				this._flCreate = [];
			}         

			//-- Adjust state of Flash counterparts
			if(this._flChange.length){
				inst.sendChange(this._flChange);
				this._flChange = [];
			}

			this._flFlushCount ++;

			//check if it's time to check reference counts and clear
			//unreferenced elements from flash
			if(this._flFlushCount%CanvasFl.FL_GC_INTERVAL===0) {
				this._flCollectGarbage();
			}
		} 
	};

	p._flCollectGarbage = function() {
		var destroys, prop, index, inst, item;
		destroys = [];

		index = this._flItemIndex;
		
		for(prop in index) {
			if(index[prop]._flRefs<1) {
				item = index[prop];
				destroys.push([item._flType, item._flId]);
				delete index[prop];
				item._flResetProps();
			}
		}

		if(destroys.length) {
			this._flInstance.sendDestroy(destroys);
		}
	};

	/**
	* Synchronously invoke a method in Flash
	* @method flInvoke
	* @internal
	* @param Dynamic
	* @return Dynamic
	**/
	p.flInvoke = function(id, methodId, args) {	 
		if(this._flInstance){
			return this._flInstance.sendInvoke([id, methodId, args]);
		}
		return null;
	};   

	/**
	* Triggered when associated Flash Movie is ready for interaction
	* @method _flOnReady
	* @protected
	**/
	p._flOnReady = function() {
		this._flInstance = ContextFl._flGetInstance( this._flInstanceID );
		this.flReady = true;
		this._flFlush();

		if(this._flCanvas._stage && this._flCanvas._stage.flOnReady){
			 this._flCanvas._stage.flReady = true;
			 this._flCanvas._stage.flOnReady(this._flCanvas._stage);
		}
	};

	/**
	* Initialize the CanvasFl with an HTML element
	* @private
	* @param HTML element
	**/ 
	p.initialize = function(thecanvas){
		var myID, self = this;
		var cnvID = thecanvas.getAttribute('id'),
		fl_swf_url = thecanvas.getAttribute('fl_swf_url') || CanvasFl.FL_URL;
		
		//-- Handle dispatches from Flash
		function handleEvents(obj) {
			var evt, item, target, evtKeyVal;
			
			//-- Mouse events
			evtKeyVal = ContextFl._flEventMap[obj.type];

			if(evtKeyVal){
				
				//-- Continuation/Completion of mousedown session event
				if(obj.type==='mousemove' || obj.type==='mouseup'){
					item = self._flCurPressEvent;
					target = item.target;

					if(obj.type==='mouseup') {
						self._flCurPressEvent = null;
					}
				} else {
					item = target = self._flItemIndex[obj.id];
				}

				//-- Dispatch the event
				if(item && (item[evtKeyVal] || item.hasEventListener(obj.type))){
					evt = new createjs.MouseEvent(obj.type, obj.stageX, obj.stageY, target, null);
					
					//dispatch to deprecated handler
					item[evtKeyVal] &&  item[evtKeyVal](evt);
					
					//dispatch to event listener
					item.dispatchEvent(evt);
					
					//-- Set as current press event and dispatch mousemove and mouseup to this event
					if(obj.type==='mousedown'){
						self._flCurPressEvent = evt;
					}
				}
			}
		}         
		
			
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
		ContextFl._flLoadInstance(myID, thecanvas.width, thecanvas.height, thecanvas.transparent, this._flInstanceID, fl_swf_url);
	};

	/**
	* Map new event names to old event names and
	* a list of valid values.
	* @private
	* @property
	* @type {Object}
	**/
	ContextFl._flEventMap = {
		dblclick: 'onDblClick',
		click: 'onClick',
		mousemove: 'onMouseMove',
		mouseout: 'onMouseOut',
		mouseover: 'onMouseOver',
		mousedown: 'onPress',
		mouseup: 'onMouseUp'
	};

	/**
	* Increment of number of contexts created.
	* @private
	* @property
	* @type Integer
	**/
	ContextFl._flCount = 0;

	/**
	* @method _flLoadInstance
	* @protected
	* @param {int} id             ID of the container
	* @param {int} width          Width of the container to load the swf into
	* @param {int} height         Height of the container to load the swf into
	* @param {bool} transparent   If the rendering context should be transparent
	* @param {String} elementId   Unique instance ID of this CanvasFl
	* @param {String} swfUrl      The name and location of the EaselFl.swf file.
	**/
	ContextFl._flLoadInstance = function(id, width, height, transparent, elementId, swfUrl) {

		var flashvars = {
			id : id
		};

		var params = {
			scale : 'noscale',
			salign : 'TL',
			wmode : (transparent?'transparent':'opaque')
		};

	 	swfobject.embedSWF(swfUrl, elementId, width.toString(), height.toString(), '9.0.0', false, flashvars, params);
	};   

	//-- Get the movie object by id
	ContextFl._flGetInstance = function(id){
		return document.getElementById(id);
	};

	/*-------------------*/

	/***** CanvasFl ******/

	/**
	* Create a new CanvasFl instance. This is handled internally
	* by the EaselFL Stage class.
	* @constructor
	* @param HTML element
	*/
	function CanvasFl(thecanvas){
		var trans;
		
		thecanvas.width = parseFloat(thecanvas.getAttribute('width') || CanvasFl.FL_WIDTH);
		thecanvas.height = parseFloat(thecanvas.getAttribute('height') || CanvasFl.FL_HEIGHT);
		
		trans = thecanvas.getAttribute('transparent');
		thecanvas.transparent = !trans || trans===true || trans.toLowerCase()==='true';

		this._ctx = new ContextFl(thecanvas);
		this._ctx._flCanvas = this;
		this.width = thecanvas.width;
		this.height = thecanvas.height;
	}

	p = CanvasFl.prototype;

	/**
	* @internal
	* @property _ctx
	* @type ContextFl
	**/
	p._ctx = null;

	/**
	* @private
	* @property _stage
	* @type Stage
	**/
	p._stage = null;

	/**
	* @READ-ONLY The width of the CanvasFl
	* @property width
	* @type Number
	**/
	p.width = 0;

	/**
	* @READ-ONLY The height of the CanvasFl
	* @property height
	* @type Number
	**/
	p.height = 0;

	/**
	* @READ-ONLY If the CanvasFl context is transparent
	* @property transparent
	* @type Boolean
	**/
	p.transparent = true;

	/**
	* READ-ONLY Used for testing type in Stage.js
	* @property isFl
	* @type Boolean
	**/
	p.isFl = true;

	p.getContext = function(type) {
		if(type==='2d'){
			return this._ctx;
		}
		return null;
	};

	//-- Static	
	//-- Defaults
	CanvasFl.FL_URL = 'EaselFl.swf';
	CanvasFl.FL_WIDTH = '400';
	CanvasFl.FL_HEIGHT= '400';
	CanvasFl.FL_GC_INTERVAL = 360; // every 15 secs at 24 fps

	//-- Object on which 'ready' callback is exposed to Flash Movie
	CanvasFl._flHooks = {};

	createjs.CanvasFl = CanvasFl;
			
}());