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

describe('Rectangle', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('calculates intersection points with line', function() {
        var rect = new geom.Rectangle(0,0,1,1);
        var start1 = new geom.Vector(0,0.5);
        var start2 = new geom.Vector(0.5,0);
        var end1 = new geom.Vector(1,0.5);
        var end2 = new geom.Vector(0.5,1);
        var line1 = new geom.LineSegment(start1, end1);
        var line2 = new geom.LineSegment(start2, end2);

        var ints = rect.getIntersections(line1);
        var expInts = [new geom.Vector(0,0.5), new geom.Vector(1,0.5)];
        expect(util.array.compare(ints, expInts, false)).toBe(0);

        ints = rect.getIntersections(line2);
        expInts = [new geom.Vector(0.5,0), new geom.Vector(0.5,1)];
        expect(util.array.compare(ints, expInts, false)).toBe(0);
    });

    it('calculates the minimum distance of a point to the rectangle', function() {
        var point = new geom.Vector(1,1);
        var rect = new geom.Rectangle(0,0,3,3);
        expect(rect.getMinimumDistanceFromBorder(point)).toBe(1);
    });

    it('calculates the maximum distance of a point to the rectangle', function() {
        var point = new geom.Vector(0,0);
        var rect = new geom.Rectangle(0,0,1,1);
        var maxDist = rect.getMaximumDistanceFromBorder(point);
        expect(util.comparator.compareWithTolerance(maxDist, Math.sqrt(2))).toBe(0);
    });

    it('determines if a point lies inside', function() {
        var rect = new geom.Rectangle(0, 0, 1, 1);
        var point1 = new geom.Vector(0,0);
        var point2 = new geom.Vector(0.5, 0.5);
        var point3 = new geom.Vector(-1,0);

        expect(rect.containsPoint(point1)).toBe(true);
        expect(rect.containsPoint(point2)).toBe(true);
        expect(rect.containsPoint(point3)).toBe(false);
    });

    it('determines if a point lies on the border', function() {
        var rect = new geom.Rectangle(0, 0, 1, 1);
        var point1 = new geom.Vector(0,0);
        var point2 = new geom.Vector(0.5, 0.5);
        var point3 = new geom.Vector(-1,0);

        expect(rect.liesOnBorder(point1)).toBe(true);
        expect(rect.liesOnBorder(point2)).toBe(false);
        expect(rect.liesOnBorder(point3)).toBe(false);
    });

    it('determines a path on its border from a starting to a endpoint in clockwise direction (screen coordinates)',
    function() {
        var rect = new geom.Rectangle(0,0,10,10);

        var start = new geom.Vector(0,1);
        var end = new geom.Vector(0,2);
        var expPath = [start, rect.points[0], rect.points[1], rect.points[2], rect.points[3], end];

        var path = rect.getPathOnBorder(start, end);
        expect(util.array.equals(path, expPath)).toBe(true);

        start = new geom.Vector(2,0);
        end = new geom.Vector(1,0);
        expPath = [start, rect.points[1], rect.points[2], rect.points[3], rect.points[0], end];

        path = rect.getPathOnBorder(start, end, true);
        expect(util.array.equals(path, expPath)).toBe(true);

        start = new geom.Vector(10, 2);
        end = new geom.Vector(10,1);
        expPath = [start, rect.points[2], rect.points[3], rect.points[0], rect.points[1], end];

        path = rect.getPathOnBorder(start, end, true);
        expect(util.array.equals(path, expPath)).toBe(true);

        start = new geom.Vector(1, 10);
        end = new geom.Vector(2, 10);
        expPath = [start, rect.points[3], rect.points[0], rect.points[1], rect.points[2], end];

        path = rect.getPathOnBorder(start, end, true);
        expect(util.array.equals(path, expPath)).toBe(true);
    });
});
