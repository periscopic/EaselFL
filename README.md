##EaselFL

Flash based fallback for EaselJS that allows for backwards compatibility
with older browsers that do not support canvas, but have Flash Player 9
or greater installed. It has specifically been tested for use with IE8.

When deployed, the application loads and uses EaselJS (if canvas is available) 
or EaselFL (if Flash9 is available and canvas is not). You can see it in use
in these applications that we at <a href="http://periscopic.com">Periscopic</a> 
have recently built.

<http://globalhandwashing.org/ghw/> <br> <http://visualization.geblogs.com/visualization/jobs/> <br> <http://hewlett.org/grants-tool/index>

EaselFL is distributed under the terms of the MIT license.

<http://www.opensource.org/licenses/mit-license.html>

##Getting Started

The <a href="blob/master/examples/setup.html">example setup</a> uses the FLSetup util to get up and 
running quickly. There are also a series of <a href="tree/master/test">tests</a> that demonstrate
various features and their consistency with EaselJS.

##Key shortcomings, inconsistencies, and notes:
**Dependencies**

*SWFObject (tested with 2.2) is the only dependency of EaseFL (other than Flash9). 
It must be loaded prior to a createjs.Stage being constructed.

**Events**

*Event handlers are not applied in Flash synchronously

*EaselFL currently does not handle multi-touch events

*MouseOver, MouseOut, MouseClick (etc) are tested using the shape of a
displayobject, not alpha of pixel as in EaselJS (partially or fully transparent
areas may behave differently).

*Flash will not capture mouse events on areas of its stage
that are completely transparent.

*Flash does not receive mouse events through overlayed html objects
(although the stage.onMouseMove handler will fire, and stage.mouseX, and
stage.mouseY are updated).

*Both children and parents are able to receive the same mouseevent
(in EaselJS, mouse events are currently captured by the outermost parent).

*DisplayObject hitArea is not yet implemented.

**Rendering**

*Only system fonts are currently available in Flash; this could
be remedied by implementing dynamic font loading.

*Videos and displayobject caches cannot yet be used to render either
bitmaps or fills.

*AlphaMask and AlphaMap filters are not yet implemented. BoxBlur filter
is implemented using flash.filters.BlurFilter, and may vary in
pattern and clear color from EaselJS.

*DisplayObject compositeOperation is not implemented.

*DisplayObject getCacheDataURL is not implemented.

*SpriteSheetUtils cannot extract a specific frame as an image (although they
can flip frames for use in BitmapAnimations).


**Graphics**

*Flash lineScaleMode is set to 'none' which prevents issue of lines
scaling when only scaling horizontal or vertical, but causes lines not
to scale proportionately to container transformations, as they would
in EaselJS.

*radial gradient fills and strokes do not interpolate identically to EaselJS 
if the origins of the circular guides are different (x0!==x1 || y0!==y1) 
and both have radiuses greater than 0 (r0>0 && r1>0).

*beginBitmapFill implements repeat, no-repeat, but not repeat-x, or repeat-y

*setLineStyle does not implement caps, joints, or miterLimits; caps and joints 
do not yet match EaselJS defaults

*there is 1/2 pixel difference in the placement of some lines compared
to EaselJS

*drawAsPath is not implemented (the primary use, masking, is implemented)

**Memory Management**

*Garbage collection will not remove EaselFl objects either from
Flash or JS due to stage level index of items. This could be
remedied by storing all commands passed to Flash for a specific
object, removing it from Flash and from the index whenever it is
removed from the display list. A new instance would then be created
again in Flash when added to the display list. Alternatively,
objects could be explicitly destroyed and removed from display lists
and indexes in both JS and Flash. -- In current implementation,
if large numbers of objects will be created, object reuse (pooling)
is suggested.

**Miscellaneous**

*Clone methods are not implemented

*use of multiple stages is untested.
