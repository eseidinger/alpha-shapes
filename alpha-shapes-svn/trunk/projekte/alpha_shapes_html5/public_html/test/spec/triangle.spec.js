'use strict';

var Triangle = alphashape.geom.Triangle;
var Circle = alphashape.geom.Circle;
var ComparatorFunctions = alphashape.util.ComparatorFunctions;

describe('Triangle', function() {

    it('calculates its circumcircle', function() {
        var p1 = new Vector(0,0);
        var p2 = new Vector(0,1);
        var p3 = new Vector(1,1);
        
        var triangle = new Triangle(p1, p2, p3);
        
        var circle = triangle.getCircumcircle();
        var center = new Vector(0.5,0.5);
        expect(circle.center.equals(center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circle.radius, Math.SQRT2 / 2)).
                toBe(0);
        
        p1 = new Vector(0,0);
        p2 = new Vector(0,1);
        p3 = new Vector(0,2);

        triangle = new Triangle(p1, p2, p3);
        
        circle = triangle.getCircumcircle();
        center = new Vector(0,1);
        expect(circle.center.equals(center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circle.radius, 1)).
                toBe(0);

        triangle = new Triangle(p1, p2, p1);
        
        circle = triangle.getCircumcircle();
        center = new Vector(0,0.5);
        expect(circle.center.equals(center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circle.radius, 0.5)).
                toBe(0);

        triangle = new Triangle(p1, p2, p2);
        
        circle = triangle.getCircumcircle();
        center = new Vector(0,0.5);
        expect(circle.center.equals(center)).toBe(true);
        expect(ComparatorFunctions.compareWithTolerance(circle.radius, 0.5)).
                toBe(0);
    });

    it('calculates its middle angle', function() {
        var p1 = new Vector(0,0);
        var p2 = new Vector(0,1);
        var p3 = new Vector(1,1);
        
        var triangle = new Triangle(p1, p2, p3);
        
        var angle = triangle.getMiddleAngle();
        expect(ComparatorFunctions.compareWithTolerance(angle, Math.PI / 2)).toBe(0);
        
        p1 = new Vector(0,0);
        p2 = new Vector(0,1);
        p3 = new Vector(0,2);

        triangle = new Triangle(p1, p2, p3);
        
        angle = triangle.getMiddleAngle();
        expect(ComparatorFunctions.compareWithTolerance(angle, Math.PI)).toBe(0);

        triangle = new Triangle(p1, p2, p1);
        
        angle = triangle.getMiddleAngle();
        expect(ComparatorFunctions.compareWithTolerance(angle, 0)).toBe(0);
        
        triangle = new Triangle(p1, p2, p2);
        
        angle = triangle.getMiddleAngle();
        expect(ComparatorFunctions.compareWithTolerance(angle, Math.PI)).toBe(0);
    });
    

    it('checks a point if it is corner', function() {
        var p1 = new Vector(0,0);
        var p2 = new Vector(0,1);
        var p3 = new Vector(1,1);
        
        var inPoint = new Vector(1,1);
        var outPoint = new Vector(1,0);
        
        var triangle = new Triangle(p1, p2, p3);
        expect(triangle.isCorner(inPoint)).toBe(true);
        expect(triangle.isCorner(outPoint)).toBe(false);
    });

    it('compares two triangles by radius and angle', function() {
        var p1 = new Vector(0,0);
        var p2 = new Vector(0,1);
        var p3 = new Vector(1,1);
        var p4 = new Vector(-1,1);
        var p5 = new Vector(0.5,0.5);
        
        var triangle1 = new Triangle(p1, p2, p3);
        var triangle2 = new Triangle(p1, p2, p4);
        var triangle3 = new Triangle(p1, p5, p3);
        var triangle4 = new Triangle(p1, p5, p1);
        
        expect(Triangle.compareByRadiusThenAngle(triangle1, triangle2)).toBe(0);
        expect(Triangle.compareByRadiusThenAngle(triangle1, triangle3)).toBe(-1);
        expect(Triangle.compareByRadiusThenAngle(triangle1, triangle4)).toBe(1);
    });
});
