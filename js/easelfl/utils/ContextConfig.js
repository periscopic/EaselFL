/*
 * EaselFL is EaselJS rendering to Flash
 * @author Brett Johnson, periscopic.com
 */

/** 
* Copyright (c) 2012 periscopic, inc.
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

/**
 * Setup the context to such that EaselFL will have necessary objects
 * and methods in place to function properly in targeted browsers
 * and for parity with corresponding EaselJS release build.
 */

(function() {
	
/**
 * Add methods necessary for core Easel functionality to work in Internet Explorer 8.
 */
	//-- fix Array.indexOf
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(item){
			for (var i = 0, l = this.length; i < l; i++){
				if (this[i] === item) {
					return i;
				}
			}
			return -1;
		}
	}
	
	//-- fix Date.now
	if(!Date.now){
		Date.now = function(){
			return new Date().valueOf();
		}
	}

}());

