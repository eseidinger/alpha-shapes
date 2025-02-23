'use strict';

var Vector = alphashape.geom.Vector;
var Line = alphashape.geom.Line;
var LineSegment = alphashape.geom.LineSegment;

describe('Line', function() {

    it('projects a point on itself', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        var line = new Line(origin, direction);
        
        var point = new Vector(0.5, 1);
        var expected = new Vector(0.5, 0);        
        var projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new Vector(0.5, 0);
        expected = new Vector(0.5, 0);        
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new Vector(-1, 1);
        expected = new Vector(-1, 0);        
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new Vector(1.5, 1);
        expected = new Vector(1.5, 0);        
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);
    });

    it('calculates lambda to reach a point', function() {
        // Points
        var origin = new Vector(0,0);
        var direction = new Vector(0,0);
        var line = new Line(origin, direction);
        var start = new Vector(0,0);
        var out = new Vector(0.1,0.1);
        expect(line.calculateLambda(start)).toBe(0);
        expect(line.calculateLambda(out)).toBe(null);
        
        // General
        direction = new Vector(1,1);
        line = new Line(origin, direction);
        var contained = new Vector(3,3);
        out = new Vector(2,3);
        expect(line.calculateLambda(start)).toBe(0);
        expect(line.calculateLambda(contained)).toBe(3);
        expect(line.calculateLambda(out)).toBe(null);

        // Parallel to y-Axis
        direction = new Vector(0,1);
        line = new Line(origin, direction);
        contained = new Vector(0,2);
        out = new Vector(1,2);
        expect(line.calculateLambda(contained)).toBe(2);
        expect(line.calculateLambda(out)).toBe(null);
        
        // Parallel to x-Axis
        direction = new Vector(1,0);
        line = new Line(origin, direction);
        contained = new Vector(2,0);
        out = new Vector(2,1);
        expect(line.calculateLambda(contained)).toBe(2);
        expect(line.calculateLambda(out)).toBe(null);
    });
    
    it('checks if it contains a point', function() {
        // Points
        var origin = new Vector(0,0);
        var direction = new Vector(0,0);
        var line = new Line(origin, direction);
        var start = new Vector(0,0);
        var out = new Vector(0.1,0.1);
        expect(line.containsPoint(start)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
        
        // General
        direction = new Vector(1,1);
        line = new Line(origin, direction);
        var contained = new Vector(3,3);
        out = new Vector(2,3);
        expect(line.containsPoint(start)).toBe(true);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);

        // Parallel to y-Axis
        direction = new Vector(0,1);
        line = new Line(origin, direction);
        contained = new Vector(0,2);
        out = new Vector(1,2);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
        
        // Parallel to x-Axis
        direction = new Vector(1,0);
        line = new Line(origin, direction);
        contained = new Vector(2,0);
        out = new Vector(2,1);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
    });
    
    it('calculates intersection with another line', function() {
        var nullVect = new Vector(0,0);
        var xAxis = new Vector(1,0);
        var yAxis = new Vector(0,1);
        var intOrigin = new Vector(0.5, 0.5);
        var int1 = new Vector(0.5, 0);
        var int2 = new Vector(0, 0.5);
        
        var line = new Line(nullVect, xAxis);
        
        // Parallels
        var inter = line.getIntersection(new Line(yAxis, xAxis));
        expect(inter).toBe(null);
        
        inter = line.getIntersection(new Line(yAxis, nullVect));
        expect(inter).toBe(null);
        
        // Points
        inter = line.getIntersection(new Line(nullVect, nullVect));
        expect(inter.equals(nullVect)).toBe(true);
        inter = line.getIntersection(new Line(xAxis, nullVect));
        expect(inter).toBe(null);
        
        line = new Line(nullVect, nullVect);
        inter = line.getIntersection(new Line(nullVect, xAxis));
        expect(inter.equals(nullVect)).toBe(true);
        inter = line.getIntersection(new Line(yAxis, xAxis));
        expect(inter).toBe(null);
        
        // General
        line = new Line(nullVect, xAxis);
        inter = line.getIntersection(new Line(intOrigin,
                    yAxis.multiplyScalar(-1)));
        expect(inter.equals(int1)).toBe(true);

        inter = line.getIntersection(new Line(intOrigin, yAxis));
        expect(inter.equals(int1)).toBe(true);
        
        line = new LineSegment(nullVect, yAxis);
                
        inter = line.getIntersection(new Line(intOrigin,
            xAxis.multiplyScalar(-1)));
        expect(inter.equals(int2)).toBe(true);

        inter = line.getIntersection(new Line(intOrigin, xAxis));
        expect(inter.equals(int2)).toBe(true);
    });
    
});
