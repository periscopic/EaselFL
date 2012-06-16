package utils;

import flash.geom.Point;



typedef CubicBezier = {
	a1:Point,
	c1:Point,
	c2:Point,
	a2:Point
}

typedef CubicPair = {
	a:CubicBezier,
	b:CubicBezier
}

class Geometry {
	/** Geometry Utils **/
	
	static public function intersectLines(x1:Float, y1:Float, x2:Float, y2:Float, x3:Float, y3:Float, x4:Float, y4:Float):Point {

		var dx1:Float = x2 - x1;
		var dx2:Float = x3 - x4;
		
		//TODO : handle parallel lines and same line cases
		if (dx1==0 && dx2==0) {new Point(x1, y1);}
		
		var m1:Float = (y2 - y1) / dx1;
		var m2:Float = (y3 - y4) / dx2;
		
		if (dx1==0) {
			// infinite slope
			return new Point(x1, m2 * (x1 - x4) + y4);
		} else if (dx2==0) {
			// infinite slope
			return new Point(x4, m1 * (x4 - x1) + y1);
		} else if(m1==m2) {
			//TODO : handle parallel lines and same line cases
			return new Point(x1, y1);
		}
		var xInt = (-m2 * x4 + y4 + m1 * x1 - y1) / (m1 - m2);
		var yInt = m1 * (xInt - x1) + y1;
		return new Point(xInt, yInt);
	}

	inline static public function midpoint(a:Point, b:Point):Point {
		return Point.interpolate(a, b, 0.5);
	}

	static public function cubicBezierSplit(bz:CubicBezier):CubicPair {	
		var p01 = midpoint(bz.a1, bz.c1);
		var p12 = midpoint(bz.c1, bz.c2);
		var p23 = midpoint(bz.c2, bz.a2);
		var p02 = midpoint(p01, p12);
		var p13 = midpoint(p12, p23);
		var p03 = midpoint(p02, p13);
		
		return {
			a:{a1:bz.a1,  c1:p01, c2:p02, a2:p03},
			b:{a1:p03, c1:p13, c2:p23, a2:bz.a2 }  
		};
	}
}
