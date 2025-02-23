'use strict';

var Ray = alphashape.geom.Ray;

describe('Ray', function() {

    it('checks whether it contains a point', function() {
        var origin = new Vector(0, 0);
        var xAxis = new Vector(1, 0);
        
        var in1 = new Vector(0.5, 0);
        var in2 = new Vector(1.5, 0);
        var out1 = new Vector(1, 1);
        var out2 = new Vector(-1, 0);
        
        var ray = new Ray(origin, xAxis);
        
        expect(ray.containsPoint(origin)).toBe(true);
        expect(ray.containsPoint(xAxis)).toBe(true);
        expect(ray.containsPoint(in1)).toBe(true);
        expect(ray.containsPoint(in2)).toBe(true);
        expect(ray.containsPoint(out1)).toBe(false);
        expect(ray.containsPoint(out2)).toBe(false);
    });

    it('projects a point on itself', function() {
        var origin = new Vector(0,0);
        var direction = new Vector(1,0);
        var line = new Ray(origin, direction);
        
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
        expected = new Vector(1.5, 0);        
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);
    });

    it('calculates intersection with another ray', function() {
        var nullVect = new Vector(0,0);
        var xAxis = new Vector(1,0);
        var yAxis = new Vector(0,1);
        var middleIntOrigin = new Vector(0.5, 0.5);
        var outerIntOrigin = new Vector(1.5, 1.5);
        var int1 = new Vector(0.5, 0);
        var int2 = new Vector(0, 0.5);
        var outerInt1 = new Vector(1.5, 0);
        var outerInt2 = new Vector(0, 1.5);
        
        var ls1 = new Ray(nullVect, xAxis);
        
        var int = ls1.getIntersection(new Ray(yAxis, xAxis));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new Ray(yAxis, nullVect));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new Ray(middleIntOrigin,
                    yAxis.multiplyScalar(-1)));
        expect(int.equals(int1)).toBe(true);

        int = ls1.getIntersection(new Ray(middleIntOrigin, yAxis));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new Ray(outerIntOrigin,
                yAxis.multiplyScalar(-1)));
        expect(int.equals(outerInt1)).toBe(true);
        
        var ls2 = new Ray(nullVect, yAxis);
                
        int = ls2.getIntersection(new Ray(middleIntOrigin,
            xAxis.multiplyScalar(-1)));
        expect(int.equals(int2)).toBe(true);

        int = ls2.getIntersection(new Ray(middleIntOrigin, xAxis));
        expect(int).toBe(null);
        
        int = ls2.getIntersection(new Ray(outerIntOrigin,
            xAxis.multiplyScalar(-1)));
        expect(int.equals(outerInt2)).toBe(true);
    });

});
