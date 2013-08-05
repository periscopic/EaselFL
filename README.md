##EaselFL

Flash based fallback for EaselJS that allows for backwards compatibility
with older browsers that do not support canvas, but have Flash Player 9
or greater installed. It has specifically been tested for use with IE8.

When deployed, the application loads and uses EaselJS (if canvas is available) 
or EaselFL (if Flash9 is available and canvas is not). You can see it in use
in these applications that we at <a href="http://periscopic.com">Periscopic</a> 
have recently built.

<http://visualization.geblogs.com/visualization/jobs/> <br> <http://hewlett.org/grants-tool/index>

EaselFL is distributed under the terms of the MIT license.

<http://www.opensource.org/licenses/mit-license.html>

##Getting Started

The <a href="https://github.com/periscopic/EaselFL/blob/master/examples/setup.html">example setup</a> uses the FLSetup util to get up and running quickly. If you are interested in using EaselFL with the createjs toolkit, start with <a href ="https://github.com/periscopic/EaselFL/blob/master/examples/toolkit/toolkit_easelFL.html">this example</a>. There are also a series of <a href="https://github.com/periscopic/EaselFL/tree/master/test">tests</a> that demonstrate various features and their consistency with EaselJS.

##Key shortcomings, inconsistencies, and notes:
**Dependencies**

* SWFObject (tested with 2.2) is the only dependency of EaseFL (other than Flash9). 
It must be loaded prior to a createjs.Stage being constructed.

**Events**

* Event handlers are not applied in Flash synchronously
* EaselFL currently does not handle multi-touch events
* MouseOver, MouseOut, MouseClick (etc) are tested using the shape of a
displayobject, not alpha of pixel as in EaselJS (partially or fully transparent
areas may behave differently).
* Flash does not receive mouse events through overlayed html objects
(although the stage.onMouseMove handler will fire, and stage.mouseX, and
stage.mouseY are updated).
* Both children and parents are able to receive the same mouseevent
(in EaselJS, mouse events are currently captured by the outermost parent).
* DisplayObject hitArea is not yet implemented.

**Rendering**

* When using system fonts with createjs.Text class, rotation hides text - this is 
how Flash handles system fonts. If you need rotated text consider 
dynamically loading a font or using DOMElement for text.
* For all createjs.Text the only reliable vertical alignment method is 'alphabetic'
(this is true both in EaselJS and EaselFL)
* Videos and displayobject caches cannot yet be used to render either
bitmaps or fills.
* AlphaMask and AlphaMap filters are not yet implemented. BoxBlur filter
is implemented using flash.filters.BlurFilter, and may vary in
pattern and clear color from EaselJS.
* DisplayObject compositeOperation is not implemented.
* DisplayObject getCacheDataURL is not implemented.
* SpriteSheetUtils cannot extract a specific frame as an image (although they
can flip frames for use in BitmapAnimations).

**Graphics**

* Strokes scale properly when x and y scale transformations are equal. However, 
if they are not equal, the greater is used. This is different from EaselJS where
the horizontal and vertical stroke thicknesses are scaled independently. 
Graphics.setStrokeStyle parameter ignoreStrokeScale works identically in EaselFL and EaselJS.
* Radial gradient fills and strokes do not interpolate identically to EaselJS 
if the origins of the circular guides are different (x0!==x1 || y0!==y1) 
and both have radiuses greater than 0 (r0>0 && r1>0).
* Graphics.beginBitmapFill implements repeat, no-repeat, but not repeat-x, or repeat-y
* There is 1/2 pixel difference in the placement of some lines compared
to EaselJS
* Graphics.drawAsPath is not implemented (the primary use, masking, is implemented)

**Memory Management**

* Garbage Collection is implemented via a reference count solution. Frequency 
of the JS side sweep can be adjusted using createjs.CanvasFl.FL_GC_INTERVAL 
(in number of frames from sweep to sweep).

**IE8**

* Note that when preloading images (i.e. for use with graphics.bitmapfill) IE8 images will fire onload synchronously when the img.src attribute is set if the image is in cache. The onload handler should be set afterward to prevent issues. This is not an EaselFL issue.

**Miscellaneous**

* Cloning of Shapes are only recursive, since shared graphics are not yet supported.
* Use of multiple stages although working is not fully tested. Using DisplayObjects
in one stage and then transitioning them to another will cause issues.


##Road Map
* Complete migration to 0.6
	- Cloning does not work properly (IE8) 
	- DOMElement is sometimes hidden (IE8) 
	- Testing in IE 8
* Implement canvas cache proxy (allow drawing one display object into another)
* Implement graphics sharing (allow non-recursive shape cloning)
* Implement display object abstraction (allow shape masks in combination with alpha masks)