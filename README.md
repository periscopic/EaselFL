EaselFL
=======

Flash based fallback for EaselJS that allows for backwards compatibility
with older browsers that do not support canvas, but have Flash Player 9
or greater installed.

Key shortcomings & inconsistencies:

---- Events ----
-Event handlers are not applied in Flash synchronously

-MouseOver, MouseOut, MouseClick (etc) are tested using shape of
displayobject, not alpha of pixel as in EaselJS (partially transparent
will behave differntly).

-Flash will not capture mouse events on areas of its stage
that are completely transparent.

-Both children and parents are able to receive the same mouseevent
(in EaselJS, mouseevents are currently captured by the outermost parent).


---- Rendering ----
-Only system fonts are currently available in Flash, this could
be rendered by implementing dynamic font loading.

-Videos and displayobject caches cannot be used to render either
bitmaps or fills.

-Masking is not implemented.

-Filters are not fully implemented.

-DisplayObject compositeOperation is not implemented.

-DisplayObject getCacheDataURL is not implemented.

-SpriteSheetUtils cannot extract a specific frame as an image
or flip a frame.


---- Graphics ----
-Flash lineScaleMode is set to 'none' which prevents issue of lines
scaling when only scaling horizontal or vertical, but causes lines not
to scale proportionately to container transformations, as they would
in EaselJS.

-gradient fills and strokes are not implemented.

-beginBitmapFill implements repeat, no-repeat, but not repeat-x, or repeat-y

-setLineStyle does not implement caps, joints, or miterLimits

-there is 1/2 pixel difference in the placement of some lines compared
to EaselJS


---- Memory Management ----
-Garbage collection will not remove EaselFl objects either from
Flash or JS due to stage level index of items. This could be
remedied by storing all commands passed to Flash for a specific
object, removing it from Flash and from the index whenever it is
removed from the display list. A new instance would then be created
again in Flash when added to the display list. Alternatively,
objects could be explicitly destroyed and removed from display lists
and indexes in both JS and Flash. -- In current implementation,
if large numbers of objects will be created, object reuse (pooling)
is suggested.
