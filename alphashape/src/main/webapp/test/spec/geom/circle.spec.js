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

describe('Circle', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('checks if two circles are equal', function() {
        var circle1 = new geom.Circle(new geom.Vector(0,0), 1);
        var circle2 = new geom.Circle(new geom.Vector(1,0), 1);
        var circle3 = new geom.Circle(new geom.Vector(0,0), 2);

        expect(circle1.equals(circle1)).toBe(true);
        expect(circle1.equals(circle2)).toBe(false);
        expect(circle1.equals(circle3)).toBe(false);
    });

    it('compares two circles', function() {
        var circle1 = new geom.Circle(new geom.Vector(0,0), 1);
        var circle2 = new geom.Circle(new geom.Vector(1,0), 1);
        var circle3 = new geom.Circle(new geom.Vector(0,0), 2);

        expect(circle1.compareTo(circle1)).toBe(0);
        expect(circle1.compareTo(circle2)).toBe(-1);
        expect(circle2.compareTo(circle1)).toBe(1);
        expect(circle1.compareTo(circle3)).toBe(-1);
        expect(circle3.compareTo(circle1)).toBe(1);
    });

    it('creates circles given 2 points and a radius', function() {
        var point1 = new geom.Vector(0,0);
        var point2 = new geom.Vector(10,0);
        var radius1 = 3;
        var radius2 = 5;
        var radius3 = 10;
        
        var circles = geom.Circle.createWith2PointsAndRadius(point1, point2, radius1);
        var expCircles = [];
        expect(util.array.compare(circles, expCircles, false)).toBe(0);

        circles = geom.Circle.createWith2PointsAndRadius(point1, point2, radius2);
        expCircles = [new geom.Circle(new geom.Vector(5, 0), radius2)];
        expect(util.array.compare(circles, expCircles, false)).toBe(0);

        var y3_1 = Math.sqrt(Math.pow(radius3,2) - Math.pow(((point1.x - point2.x) / 2),2));
        var y3_2 = -1* y3_1;
        var x3 = (point1.x + point2.x) / 2;
        var center3_1 = new geom.Vector(x3, y3_1);
        var center3_2 = new geom.Vector(x3, y3_2);
        circles = geom.Circle.createWith2PointsAndRadius(point1, point2, radius3);
        expCircles = [new geom.Circle(center3_1, radius3), new geom.Circle(center3_2, radius3)];
        expect(util.array.compare(circles, expCircles, false)).toBe(0);
    });
    
    it('creates a circle given a point on it and its center', function() {
        var center = new geom.Vector(0,0);
        var point = new geom.Vector(10,0);
        
        var circle = geom.Circle.createWithPointAndCenter(point, center);
        var expCircle = new geom.Circle(center, 10);
        
        expect(circle.equals(expCircle)).toBe(true);
    });
    
    it('calculates the intersections of two circles', function() {
        var center1 = new geom.Vector(0,0);
        var center2 = new geom.Vector(10,0);
        var radius1 = 3;
        var radius2 = 5;
        var radius3 = 10;
        var circle1_1 = new geom.Circle(center1, radius1);
        var circle1_2 = new geom.Circle(center2, radius1);
        var circle2_1 = new geom.Circle(center1, radius2);
        var circle2_2 = new geom.Circle(center2, radius2);
        var circle3_1 = new geom.Circle(center1, radius3);
        var circle3_2 = new geom.Circle(center2, radius3);
        
        var ints = circle1_1.getIntersctions(circle1_2);
        expect(ints.length).toBe(0);
        
        ints = circle2_1.getIntersctions(circle2_2);
        expect(ints.length).toBe(1);
        var expected = [new geom.Vector(5,0)];
        expect(util.array.compare(ints, expected, false)).toBe(0);
        
        ints = circle3_1.getIntersctions(circle3_2);
        expect(ints.length).toBe(2);
        var y3_1 = Math.sqrt(Math.pow(radius3,2) - Math.pow(((center1.x - center2.x) / 2),2));
        var y3_2 = -1* y3_1;
        var x3 = (center1.x + center2.x) / 2;
        expected = [new geom.Vector(x3, y3_1), new geom.Vector(x3, y3_2)];
        expect(util.array.compare(ints, expected, false)).toBe(0);
    });
    
    it('translates a circles center', function() {
        var center = new geom.Vector(0,0);
        var trans = new geom.Vector(1,1);
        var circle = new geom.Circle(center, 5);
        var translated = circle.translate(trans);
        var expected = new geom.Circle(trans, 5);
        expect(translated.equals(expected)).toBe(true);
    });

    it('rotates a circle clockwise (screen coordinates) around the origin', function() {
        var center1 = new geom.Vector(0,0);
        var center2 = new geom.Vector(1,0);
        var expected1 = new geom.Circle(new geom.Vector(0,0) , 5);
        var expected2 = new geom.Circle(new geom.Vector(0,1) , 5);
        var circle1 = new geom.Circle(new geom.Vector(0,0) , 5);
        var circle2 = new geom.Circle(new geom.Vector(1,0) , 5);
        var rotated1 = circle1.rotateAroundOrigin(Math.PI / 2);
        var rotated2 = circle2.rotateAroundOrigin(Math.PI / 2);
        expect(expected1.equals(rotated1)).toBe(true);
        expect(expected2.equals(rotated2)).toBe(true);
    });
    
    it('checks if it contains a point', function() {
        var center = new geom.Vector(0,0);
        var circle = new geom.Circle(center, 5);
        var point1 = new geom.Vector(3,0);
        var point2 = new geom.Vector(5,0);
        var point3 = new geom.Vector(6,0);
        
        expect(circle.containsPoint(point1)).toBe(true);
        expect(circle.containsPoint(point2)).toBe(true);
        expect(circle.containsPoint(point3)).toBe(false);
    });

    it('calculates the intersctions with a rectangle', function() {
        var circle = new geom.Circle(new geom.Vector(0,0), 1);
        var rect = new geom.Rectangle(-Math.sqrt(0.5),-Math.sqrt(0.5),Math.sqrt(0.5),Math.sqrt(0.5));
        var ints = circle.getIntersectionsWithRectangle(rect);

        var expInts = [];
        expInts.push(new geom.Vector(-Math.sqrt(0.5), -Math.sqrt(0.5)));
        expInts.push(new geom.Vector(-Math.sqrt(0.5), -Math.sqrt(0.5)));
        expInts.push(new geom.Vector(-Math.sqrt(0.5), Math.sqrt(0.5)));
        expInts.push(new geom.Vector(-Math.sqrt(0.5), Math.sqrt(0.5)));
        expInts.push(new geom.Vector(Math.sqrt(0.5), Math.sqrt(0.5)));
        expInts.push(new geom.Vector(Math.sqrt(0.5), Math.sqrt(0.5)));
        expInts.push(new geom.Vector(Math.sqrt(0.5), -Math.sqrt(0.5)));
        expInts.push(new geom.Vector(Math.sqrt(0.5), -Math.sqrt(0.5)));

        expect(util.array.compare(ints, expInts, false)).toBe(0);
    });

    it('determines, whether it lies in rectangle or not', function() {
        var circle = new geom.Circle(new geom.Vector(0,0), 1);
        var rect1 = new geom.Rectangle(-1,-1,1,1);
        var rect2 = new geom.Rectangle(-0.99,-0.99,0.99,0,99);
        expect(circle.liesInRectangle(rect1)).toBe(true);
        expect(circle.liesInRectangle(rect2)).toBe(false);
    });

    it('determines, whether it contains a rectangle or not', function() {
        var circle = new geom.Circle(new geom.Vector(0,0), Math.sqrt(2));
        var rect1 = new geom.Rectangle(-1,-1,1,1);
        var rect2 = new geom.Rectangle(-0.99,-0.99,0.99,0,99);
        expect(circle.containsRectangle(rect2)).toBe(true);
        expect(circle.containsRectangle(rect1)).toBe(false);
    });

    it('crops a circle to fit a rectangle', function() {
        var circle = new geom.Circle(new geom.Vector(0,0), 1);
        var rect = new geom.Rectangle(0, 0, 2, 2);
        var path = circle.crop(rect);

        var expPath = [];
        expPath.push(new geom.Arc(new geom.Vector(0,0), new geom.Vector(1,0), new geom.Vector(0,1), true));
        expPath.push(new geom.LineSegment(new geom.Vector(0,1), new geom.Vector(0,0)));
        expPath.push(new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(1,0)));

        expect(util.array.equals(path, expPath)).toBe(true);

        circle = geom.Circle.createWithPointAndCenter(new geom.Vector(1,0), new geom.Vector(0,1));
        rect = new geom.Rectangle(0,0,2,2);
        path = circle.crop(rect);

        expPath = [];
        expPath.push(new geom.Arc(new geom.Vector(0,1), new geom.Vector(1,0), new geom.Vector(1,2), true));
        expPath.push(new geom.LineSegment(new geom.Vector(1,2), new geom.Vector(0,2)));
        expPath.push(new geom.LineSegment(new geom.Vector(0,2), new geom.Vector(0,0)));
        expPath.push(new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(1,0)));

        expect(util.array.equals(path, expPath)).toBe(true);

        circle = new geom.Circle(new geom.Vector(0,0), 5);
        rect = new geom.Rectangle(-4,-4,4,4);
        path = circle.crop(rect);

        expPath = [];
        expPath.push(new geom.Arc(new geom.Vector(0,0), new geom.Vector(-4,-3), new geom.Vector(-3,-4), true));
        expPath.push(new geom.LineSegment(new geom.Vector(-3,-4), new geom.Vector(3,-4)));
        expPath.push(new geom.Arc(new geom.Vector(0,0), new geom.Vector(3,-4), new geom.Vector(4,-3), true));
        expPath.push(new geom.LineSegment(new geom.Vector(4,-3), new geom.Vector(4,3)));
        expPath.push(new geom.Arc(new geom.Vector(0,0), new geom.Vector(4,3), new geom.Vector(3,4), true));
        expPath.push(new geom.LineSegment(new geom.Vector(3,4), new geom.Vector(-3,4)));
        expPath.push(new geom.Arc(new geom.Vector(0,0), new geom.Vector(-3,4), new geom.Vector(-4,3), true));
        expPath.push(new geom.LineSegment(new geom.Vector(-4,3), new geom.Vector(-4,-3)));

        expect(util.array.equals(path, expPath)).toBe(true);

        circle = new geom.Circle(new geom.Vector(3,3), 1);
        rect = new geom.Rectangle(-1,-1,1,1);
        path = circle.crop(rect);
        expect(path).toBe(null);
    });
});
