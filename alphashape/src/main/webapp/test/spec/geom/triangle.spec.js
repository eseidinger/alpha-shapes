/**
 Copyright 2013-2014 Emanuel Seidinger

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

'use strict';

describe('Triangle', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('calculates its circumcircle', function() {
        var p1 = new geom.Vector(0,0);
        var p2 = new geom.Vector(0,1);
        var p3 = new geom.Vector(1,1);
        
        var triangle = new geom.Triangle(p1, p2, p3);
        
        var circle = triangle.getCircumcircle();
        var expected = new geom.Circle(new geom.Vector(0.5,0.5), Math.SQRT2 / 2);
        expect(circle.equals(expected)).toBe(true);

        p1 = new geom.Vector(0,0);
        p2 = new geom.Vector(0,1);
        p3 = new geom.Vector(0,2);

        triangle = new geom.Triangle(p1, p2, p3);
        
        circle = triangle.getCircumcircle();
        expected = new geom.Circle(new geom.Vector(0,1), 1);
        expect(circle.equals(expected)).toBe(true);

        triangle = new geom.Triangle(p1, p2, p1);
        
        circle = triangle.getCircumcircle();
        expected = new geom.Circle(new geom.Vector(0,0.5), 0.5);
        expect(circle.equals(expected)).toBe(true);

        triangle = new geom.Triangle(p1, p2, p2);
        
        circle = triangle.getCircumcircle();
        expected = new geom.Circle(new geom.Vector(0,0.5), 0.5);
        expect(circle.equals(expected)).toBe(true);
    });

    it('calculates its middle angle', function() {
        var p1 = new geom.Vector(0,0);
        var p2 = new geom.Vector(0,1);
        var p3 = new geom.Vector(1,1);
        var p4 = new geom.Vector(1,0);
        var p5 = new geom.Vector(0,2);

        var triangle = new geom.Triangle(p1, p2, p3);
        
        var angle = triangle.getMiddleAngle();
        expect(util.comparator.compareWithTolerance(angle, Math.PI / 2)).toBe(0);
        
        triangle = new geom.Triangle(p1, p2, p5);
        angle = triangle.getMiddleAngle();
        expect(util.comparator.compareWithTolerance(angle, Math.PI)).toBe(0);

        triangle = new geom.Triangle(p1, p2, p1);
        angle = triangle.getMiddleAngle();
        expect(util.comparator.compareWithTolerance(angle, 0)).toBe(0);
        
        triangle = new geom.Triangle(p1, p2, p2);
        angle = triangle.getMiddleAngle();
        expect(util.comparator.compareWithTolerance(angle, Math.PI)).toBe(0);

        triangle = new geom.Triangle(p3, p2, p1);
        angle = triangle.getMiddleAngle();
        expect(util.comparator.compareWithTolerance(angle, Math.PI / 2)).toBe(0);
    });
    

    it('checks whether a point is a corner of the triangle', function() {
        var p1 = new geom.Vector(0,0);
        var p2 = new geom.Vector(0,1);
        var p3 = new geom.Vector(1,1);
        
        var inPoint = new geom.Vector(1,1);
        var outPoint = new geom.Vector(1,0);
        
        var triangle = new geom.Triangle(p1, p2, p3);
        expect(triangle.isCorner(inPoint)).toBe(true);
        expect(triangle.isCorner(outPoint)).toBe(false);
    });

    it('compares two triangles by radius and angle', function() {
        var p1 = new geom.Vector(0,0);
        var p2 = new geom.Vector(0,1);
        var p3 = new geom.Vector(1,1);
        var p4 = new geom.Vector(-1,1);
        var p5 = new geom.Vector(0.5,0.5);
        
        var triangle1 = new geom.Triangle(p1, p2, p3);
        var triangle2 = new geom.Triangle(p1, p2, p4);
        var triangle3 = new geom.Triangle(p1, p5, p3);
        var triangle4 = new geom.Triangle(p1, p5, p1);
        
        expect(geom.Triangle.compare(triangle1, triangle2)).toBe(0);
        expect(geom.Triangle.compare(triangle1, triangle3)).toBe(-1);
        expect(geom.Triangle.compare(triangle1, triangle4)).toBe(1);
    });
});
