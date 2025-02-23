'use strict';

var Vector = alphashape.geom.Vector;
var LineSegment = alphashape.geom.LineSegment;
var ComparatorFunctions = alphashape.util.ComparatorFunctions;

describe('Line segment', function() {

    it('constructs a line segment given two points', function() {
        var start = new Vector(0,0);
        var end = new Vector(1,0);
        
        var ls = LineSegment.createFromPoints(start, end);
        expect(ls.origin.equals(start)).toBe(true);
        expect(ls.direction.equals(end)).toBe(true);
    });
    
    it('gives its end point', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        
        var ls = new LineSegment(origin, direction);
        expect(ls.getEndpoint().equals(direction)).toBe(true);
    });

    it('gives its center', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        var center = new Vector(0.5,0);
        
        var ls = new LineSegment(origin, direction);
        expect(ls.getCenter().equals(center)).toBe(true);
    });

    it('gives its length', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        
        var ls = new LineSegment(origin, direction);
        expect(ComparatorFunctions.compareWithTolerance(ls.getLength(), 1)).toBe(0);
    });
    
    it('projects a point on itself', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        var line = new LineSegment(origin, direction);
        
        var point = new Vector(0.5, 1);
        var expected = new Vector(0.5, 0);        
        var projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new Vector(0.5, 0);
        expected = new Vector(0.5, 0);        
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new Vector(-1, 1);
        projection = line.pointProjection(point);
        expect(projection).toBe(null);

        point = new Vector(1.5, 1);
        projection = line.pointProjection(point);
        expect(projection).toBe(null);
    });

    it('checks if it contains a point', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(0,0);
        var ls = new LineSegment(origin, direction);
        
        var start = new Vector(0,0);
        var out = new Vector(0.1,0.1);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
        
        direction = new Vector(1,1);
        ls = new LineSegment(origin, direction);
        var end = new Vector(1,1);
        out = new Vector(2,2);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);

        direction = new Vector(0,1);
        ls = new LineSegment(origin, direction);
        end = new Vector(0,1);
        out = new Vector(0,2);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
        
        direction = new Vector(1,0);
        ls = new LineSegment(origin, direction);
        end = new Vector(1,0);
        out = new Vector(2,0);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
    });
    
    it('calculates intersection with another line segment', function() {
        var nullVect = new Vector(0,0);
        var xAxis = new Vector(1,0);
        var yAxis = new Vector(0,1);
        var middleIntOrigin = new Vector(0.5, 0.5);
        var noIntOrigin = new Vector(1.5, 1.5);
        var int1 = new Vector(0.5, 0);
        var int2 = new Vector(0, 0.5);
        
        var ls1 = new LineSegment(nullVect, xAxis);
        
        var int = ls1.getIntersection(new LineSegment(yAxis, xAxis));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new LineSegment(yAxis, nullVect));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new LineSegment(middleIntOrigin,
                    yAxis.multiplyScalar(-1)));
        expect(int.equals(int1)).toBe(true);

        int = ls1.getIntersection(new LineSegment(middleIntOrigin, yAxis));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new LineSegment(noIntOrigin,
                yAxis.multiplyScalar(-1)));
        expect(int).toBe(null);
        
        var ls2 = new LineSegment(nullVect, yAxis);
                
        int = ls2.getIntersection(new LineSegment(middleIntOrigin,
            xAxis.multiplyScalar(-1)));
        expect(int.equals(int2)).toBe(true);

        int = ls2.getIntersection(new LineSegment(middleIntOrigin, xAxis));
        expect(int).toBe(null);
        
        int = ls2.getIntersection(new LineSegment(noIntOrigin,
            xAxis.multiplyScalar(-1)));
        expect(int).toBe(null);
    });

    it('checks another line segment for equality', function() {
        var nullVect = new Vector(0,0);
        var xAxis = new Vector(1,0);
        var yAxis = new Vector(0,1);
        
        var ls1 = new LineSegment(nullVect, xAxis);
        var ls2 = new LineSegment(xAxis, xAxis.multiplyScalar(-1));
        var ls3 = new LineSegment(yAxis, xAxis);
        
        expect(ls1.equals(ls1)).toBe(true);
        expect(ls1.equals(ls2)).toBe(true);
        expect(ls1.equals(ls3)).toBe(false);
    });
    
});
