/**
 * Util for setting up EaselJS with EaselFL fallback.
 * @author  Brett Johnson, periscopic.com
 *
 * @example
 *	var options = {
 *		preferFlash: false,
 *		EaselJS_url: 'js/easeljs-0.5.0.min.js',
 *		EaselFL_url: 'js/easelfl-0.1.13.min.js',
 *		SWFObject_url: 'js/swfobject.js'
 *	}
 *
 *	createjs.FLSetup.run( onSetupSuccess, onSetupFailure, options);
 */

/**
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

// namespace
this.createjs = this.createjs||{};

(function() {
	var api;

	/**
	 * Load a script or scripts
	 * @param String||Array a script URL, or an array of script URLs
	 * @param Function callback method
	 */
	function loadScript( url, callback ){
		
		if(Object.prototype.toString.call(url) === '[object Array]') {
			//an array of urls
			loadScripts(url, callback);
		} else {

			var fired, fileref;

			fired = false;	
			fileref = document.createElement("script");
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src",url);
			
			var handleLoad = function() {
				if(!fired) {
					fired = true;
					
					if(callback) {
						callback();
					}

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
		}
	}

	function loadScripts(urls, callback) {
		var remaining;

		function checkin() {
			remaining --;
		
			if(remaining===0 && callback) {
				callback();
			}
		}

		remaining = urls.length;

		if(remaining===0) {
			remaining = 1;
			checkin();
		} else {
			for (var i = 0; i<remaining; ++i) {
			    loadScript(urls[i], checkin);
			}
		}
	}

	/**
	 * Find the Flash Player version. From the corresponding code in SWFObject 2.2
	 * @return {Array} The player's major and minor versions
	 */
	function getFlashVersion() {
		var UNDEF = "undefined",
		OBJECT = "object",
		SHOCKWAVE_FLASH = "Shockwave Flash",
		SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
		FLASH_MIME_TYPE = "application/x-shockwave-flash",
		nav = navigator,
		win = window,
		playerVersion = [0,0,0],
		d = null;
		
		if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] === OBJECT) {
			d = nav.plugins[SHOCKWAVE_FLASH].description;
			
			if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
				playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
				playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
				playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
			}
		}
		else if (typeof win.ActiveXObject != UNDEF) {
			try {
				var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
				if (a) {
					d = a.GetVariable("$version");
					if (d) {
						d = d.split(" ")[1].split(",");
						playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
					}
				}
			}
			catch(e) {}
		}
		
		return playerVersion;
	}

	function hasCanvas() {
		return !!document.createElement('canvas').getContext;
	}

	/**
	 * Tests for browser/plugin support of EaselJS / EaselFL 
	 * and loads those scripts and dependencies.
	 * @param  {Function} onSuccess Easel loaded callback
	 * @param  {Function} onFailure Easel not supported callback
	 * @param  {Object} options
	 * @return {Void}
	 */
	function run(onSuccess, onFailure, options) {
		var hasCanv, hasFlash9, isFL, isSupported, loads;
		
		function onLoaded() {
			if(onSuccess) {
				onSuccess(isFL);
			}
		}

		function onEaselLoaded() {
			if(options.MovieClip_url) {
				loadScript(options.MovieClip_url, onLoaded);
			} else {
				onLoaded();
			}
		}

		options = options || {};

		hasCanv = hasCanvas();
		hasFlash9 = getFlashVersion()[0]>=9;
		isSupported = hasCanv || hasFlash9;
		isFL = (options.preferFlash || !hasCanv);

		if(isSupported) {
			loads = [];
			
			if(isFL) {
				// load EaselFL
				if(options.SWFObject_url) {
					loads[loads.length] = options.SWFObject_url;
				}

				if(options.EaselFL_url) {
					loads[loads.length] = options.EaselFL_url;
				}
			} else {
				// load EaselJS
				if(options.EaselJS_url) {
					loads[loads.length] = options.EaselJS_url;
				}
			}

			loadScripts(loads, onEaselLoaded);
		} else if(onFailure){
			// unsupported callback
			onFailure();
		}
	}

	api = {
		loadScripts: loadScript,
		getFlashVersion: getFlashVersion,
		hasCanvas: hasCanvas,
		run: run
	};

	createjs.FLSetup = api;
	
}());
