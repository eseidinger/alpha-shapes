'use strict';

var Circle = alphashape.geom.Circle;
var ComparatorFunctions = alphashape.util.ComparatorFunctions;

describe('Circle', function() {

    it('creates circles given 2 points and a radius', function() {
        var point1 = new Vector(0,0);
        var point2 = new Vector(10,0);
        var radius1 = 3;
        var radius2 = 5;
        var radius3 = 10;
        
        var circles = Circle.createWith2PointsAndRadius(point1, point2, radius1);
        expect(circles.length === 0).toBe(true);
        
        var center2 = new Vector(5,0);
        circles = Circle.createWith2PointsAndRadius(point1, point2, radius2);
        expect(circles.length === 1).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circles[0].radius, radius2)).toBe(0);
        expect(center2.equals(circles[0].center)).toBe(true);
        
        var y3_1 = Math.sqrt(Math.pow(radius3,2) -
                Math.pow(((point1.x - point2.x) / 2),2));
        var y3_2 = -1* y3_1;
        var x3 = (point1.x + point2.x) / 2;
        var center3_1 = new Vector(x3, y3_1);
        var center3_2 = new Vector(x3, y3_2);
        circles = Circle.createWith2PointsAndRadius(point1, point2, radius3);
        expect(circles.length === 2).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circles[0].radius, radius3)).toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(circles[1].radius, radius3)).toBe(0);
        
        var comb1 = center3_1.equals(circles[0].center) &&
                center3_2.equals(circles[1].center);
        var comb2 = center3_1.equals(circles[1].center) &&
                center3_2.equals(circles[0].center);
        expect((!comb1 && comb2) || (comb1 && !comb2)).toBe(true);
    });
    
    it('creates a circle given a point on it and its center', function() {
        var center = new Vector(0,0);
        var point = new Vector(10,0);
        
        var circle = Circle.createWithPointAndCenter(point, center);
        
        expect(ComparatorFunctions.compareWithTolerance(circle.radius, 10)).toBe(0);
        expect(center.equals(circle.center)).toBe(true);
    });
    
    it('calculates the intersection points of two circles', function() {
        var center1 = new Vector(0,0);
        var center2 = new Vector(10,0);
        var radius1 = 3;
        var radius2 = 5;
        var radius3 = 10;
        var circle1_1 = new Circle(center1, radius1);
        var circle1_2 = new Circle(center2, radius1);
        var circle2_1 = new Circle(center1, radius2);
        var circle2_2 = new Circle(center2, radius2);
        var circle3_1 = new Circle(center1, radius3);
        var circle3_2 = new Circle(center2, radius3);
        
        var ints = circle1_1.getIntersctions(circle1_2);
        expect(ints.length).toBe(0);
        
        ints = circle2_1.getIntersctions(circle2_2);
        expect(ints.length).toBe(1);
        var expected = new Vector(5,0);
        expect(expected.equals(ints[0])).toBe(true);
        
        ints = circle3_1.getIntersctions(circle3_2);
        expect(ints.length).toBe(2);
        var y3_1 = Math.sqrt(Math.pow(radius3,2) -
                Math.pow(((center1.x - center2.x) / 2),2));
        var y3_2 = -1* y3_1;
        var x3 = (center1.x + center2.x) / 2;
        var expected1 = new Vector(x3, y3_1);
        var expected2 = new Vector(x3, y3_2);
        
        var comb1 = expected1.equals(ints[0]) && expected2.equals(ints[1]);
        var comb2 = expected1.equals(ints[1]) && expected2.equals(ints[2]);
        expect((!comb1 && comb2) || (comb1 && !comb2)).toBe(true);
    });
    
    it('translates a circles center', function() {
        var center = new Vector(0,0);
        var trans = new Vector(1,1);
        var circle = new Circle(center, 5);
        var translated = circle.translate(trans);
        expect(trans.equals(translated.center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(translated.radius, 5)).toBe(0);
    });

    it('rotates a circle ccw around the origin', function() {
        var center1 = new Vector(0,0);
        var center2 = new Vector(1,0);
        var expected1 = new Vector(0,0);
        var expected2 = new Vector(0,1);
        var radius = 5;
        var circle1 = new Circle(center1, radius);
        var circle2 = new Circle(center2, radius);
        var rotated1 = circle1.rotateAroundOrigin(Math.PI / 2);
        var rotated2 = circle2.rotateAroundOrigin(Math.PI / 2);
        expect(expected1.equals(rotated1.center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(rotated1.radius, radius)).toBe(0);
        expect(expected2.equals(rotated2.center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(rotated2.radius, radius)).toBe(0);
    });
    
    it('checks if it contains a point', function() {
        var center = new Vector(0,0);
        var circle = new Circle(center, 5);
        var point1 = new Vector(3,0);
        var point2 = new Vector(5,0);
        var point3 = new Vector(6,0);
        
        expect(circle.containsPoint(point1)).toBe(true);
        expect(circle.containsPoint(point2)).toBe(true);
        expect(circle.containsPoint(point3)).toBe(false);
    });

    it('checks if its inverse contains a point', function() {
        var center = new Vector(0,0);
        var circle = new Circle(center, 5);
        var point1 = new Vector(3,0);
        var point2 = new Vector(5,0);
        var point3 = new Vector(6,0);
        
        expect(circle.inverseContainsPoint(point1)).toBe(false);
        expect(circle.inverseContainsPoint(point2)).toBe(true);
        expect(circle.inverseContainsPoint(point3)).toBe(true);
    });
});
