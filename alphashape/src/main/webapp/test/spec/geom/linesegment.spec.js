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

describe('Line segment', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('checks another line segment for equality', function() {
        var nullVect = new geom.Vector(0,0);
        var xAxis = new geom.Vector(1,0);
        var yAxis = new geom.Vector(0,1);

        var ls1 = new geom.LineSegment(nullVect, xAxis);
        var ls2 = new geom.LineSegment(xAxis, nullVect);
        var ls3 = new geom.LineSegment(yAxis, yAxis.add(xAxis));

        expect(ls1.equals(ls1)).toBe(true);
        expect(ls1.equals(ls2)).toBe(false);
        expect(ls1.equals(ls3)).toBe(false);
    });

    it('defines an order', function() {
        var nullVect = new geom.Vector(0,0);
        var xAxis = new geom.Vector(1,0);
        var yAxis = new geom.Vector(0,1);

        var ls1 = new geom.LineSegment(nullVect, xAxis);
        var ls2 = new geom.LineSegment(xAxis, yAxis);
        var ls3 = new geom.LineSegment(yAxis, xAxis);

        expect(ls1.compareTo(ls1)).toBe(0);
        expect(ls1.compareTo(ls2)).toBe(-1);
        expect(ls2.compareTo(ls1)).toBe(1);
        expect(ls2.compareTo(ls3)).toBe(1);
        expect(ls3.compareTo(ls2)).toBe(-1);
    });

    it('gives its center', function() {
        var start = new geom.Vector(0,0);
        var end = new geom.Vector(1,0);
        var center = new geom.Vector(0.5,0);
        
        var ls = new geom.LineSegment(start, end);
        expect(ls.getCenter().equals(center)).toBe(true);
    });

    it('gives its length', function() {
        var start = new geom.Vector(0,0);
        var end = new geom.Vector(1,0);
        
        var ls = new geom.LineSegment(start, end);
        expect(util.comparator.compareWithTolerance(ls.getLength(), 1)).toBe(0);
    });
    
    it('projects a point on itself', function() {
        var start = new geom.Vector(0,0);
        var end = new geom.Vector(1,0);
        var line = new geom.LineSegment(start, end);
        
        var point = new geom.Vector(0.5, 1);
        var expected = new geom.Vector(0.5, 0);
        var projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new geom.Vector(0.5, 0);
        expected = new geom.Vector(0.5, 0);
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new geom.Vector(-1, 1);
        projection = line.pointProjection(point);
        expect(projection).toBe(null);

        point = new geom.Vector(1.5, 1);
        projection = line.pointProjection(point);
        expect(projection).toBe(null);
    });

    it('checks if it contains a point', function() {
        var start = new geom.Vector(0,0);
        var end = new geom.Vector(0,0);
        var ls = new geom.LineSegment(start, end);
        
        var out = new geom.Vector(0.1,0.1);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
        
        end = new geom.Vector(1,1);
        ls = new geom.LineSegment(start, end);
        out = new geom.Vector(2,2);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);

        end = new geom.Vector(0,1);
        ls = new geom.LineSegment(start, end);
        out = new geom.Vector(0,2);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
        
        end = new geom.Vector(1,0);
        ls = new geom.LineSegment(start, end);
        out = new geom.Vector(2,0);
        expect(ls.containsPoint(start)).toBe(true);
        expect(ls.containsPoint(end)).toBe(true);
        expect(ls.containsPoint(out)).toBe(false);
    });
    
    it('calculates intersection with another line segment', function() {
        var nullVect = new geom.Vector(0,0);
        var xAxis = new geom.Vector(1,0);
        var yAxis = new geom.Vector(0,1);
        var middleIntOrigin = new geom.Vector(0.5, 0.5);
        var noIntOrigin = new geom.Vector(1.5, 1.5);
        var int1 = new geom.Vector(0.5, 0);
        var int2 = new geom.Vector(0, 0.5);
        
        var ls1 = new geom.LineSegment(nullVect, xAxis);
        
        var int = ls1.getIntersection(new geom.LineSegment(yAxis, yAxis.add(xAxis)));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new geom.LineSegment(yAxis, yAxis));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new geom.LineSegment(middleIntOrigin, middleIntOrigin.add(yAxis.multiplyScalar(-1))));
        expect(int.equals(int1)).toBe(true);

        int = ls1.getIntersection(new geom.LineSegment(middleIntOrigin, middleIntOrigin.add(yAxis)));
        expect(int).toBe(null);
        
        int = ls1.getIntersection(new geom.LineSegment(noIntOrigin, noIntOrigin.add(yAxis.multiplyScalar(-1))));
        expect(int).toBe(null);
        
        var ls2 = new geom.LineSegment(nullVect, yAxis);
                
        int = ls2.getIntersection(new geom.LineSegment(middleIntOrigin, middleIntOrigin.add(xAxis.multiplyScalar(-1))));
        expect(int.equals(int2)).toBe(true);

        int = ls2.getIntersection(new geom.LineSegment(middleIntOrigin, middleIntOrigin.add(xAxis)));
        expect(int).toBe(null);
        
        int = ls2.getIntersection(new geom.LineSegment(noIntOrigin, noIntOrigin.add(xAxis.multiplyScalar(-1))));
        expect(int).toBe(null);
    });

    it('creates a new line segment with sorted endpoints', function() {
        var nullVect = new geom.Vector(0,0);
        var xAxis = new geom.Vector(1,0);
        var yAxis = new geom.Vector(0,1);
        
        var ls1 = new geom.LineSegment(nullVect, xAxis);
        var ls2 = new geom.LineSegment(xAxis, nullVect);

        expect(ls1.equals(ls2)).toBe(false);
        expect(ls1.sortedEndpoints().equals(ls2.sortedEndpoints())).toBe(true);
    });

    it('creates a line segment which fits in a rectangle', function() {
        var rect = new geom.Rectangle(0,0,1,1);
        var lineSegment = new geom.LineSegment(new geom.Vector(-1,0.5), new geom.Vector(2,0.5));
        var cropExpect = new geom.LineSegment(new geom.Vector(0,0.5), new geom.Vector(1,0.5));
        var cropped = lineSegment.crop(rect);
        expect(cropped.sortedEndpoints().equals(cropExpect.sortedEndpoints())).toBe(true);
    });

});
