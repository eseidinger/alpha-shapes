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

describe('Arc', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('calculates the middle of the arc', function() {
        var center = new geom.Vector(0,0);
        var point1 = new geom.Vector(1,0);
        var point2 = new geom.Vector(0,1);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point1, point2, false);

        var expMiddle1 = new geom.Vector(Math.sqrt(2)/2, Math.sqrt(2)/2);
        var expMiddle2 = new geom.Vector(-Math.sqrt(2)/2, -Math.sqrt(2)/2);

        var middle1 = arc1.arcMiddle();
        var middle2 = arc2.arcMiddle();

        expect(middle1.equals(expMiddle1)).toBe(true);
        expect(middle2.equals(expMiddle2)).toBe(true);
    });

    it('determines whether it lies in a given rectangle or not', function() {
        var center = new geom.Vector(0,0);
        var point1 = new geom.Vector(0,1);
        var point2 = new geom.Vector(1,0);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point1, point2, false);

        expect(arc1.liesInRectangle(new geom.Rectangle(0, 0, 2, 2))).toBe(false);
        expect(arc2.liesInRectangle(new geom.Rectangle(0, 0, 2, 2))).toBe(true);
    });

    it('compares two arcs for equality', function() {
        var point1 = new geom.Vector(1,1);
        var point2 = new geom.Vector(1,-1);
        var center = new geom.Vector(0,0);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point1, point2, true);
        var arc3 = new geom.Arc(center, point2, point1, false);
        var arc4 = new geom.Arc(center, point2, point1, true);

        expect(arc1.equals(arc2)).toBe(true);
        expect(arc1.equals(arc3)).toBe(true);
        expect(arc1.equals(arc4)).toBe(false);
    });

    it('determines its start angle', function() {
        var center = new geom.Vector(0,0);
        var point1 = new geom.Vector(1,0);
        var point2 = new geom.Vector(0,1);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point2, point1, false);

        expect(util.comparator.compareWithTolerance(arc1.startAngle, 0)).toBe(0);
        expect(util.comparator.compareWithTolerance(arc2.startAngle, Math.PI/2)).toBe(0);
    });

    it('determines its end angle', function() {
        var center = new geom.Vector(0,0);
        var point1 = new geom.Vector(1,0);
        var point2 = new geom.Vector(0,1);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point2, point1, false);

        expect(util.comparator.compareWithTolerance(arc2.endAngle, 0)).toBe(0);
        expect(util.comparator.compareWithTolerance(arc1.endAngle, Math.PI/2)).toBe(0);
    });

    it('determines its radius', function() {
        var center = new geom.Vector(0,0);
        var point1 = new geom.Vector(1,0);
        var point2 = new geom.Vector(0,1);

        var arc1 = new geom.Arc(center, point1, point2, true);
        var arc2 = new geom.Arc(center, point2, point1, false);

        expect(util.comparator.compareWithTolerance(arc1.radius, 1)).toBe(0);
        expect(util.comparator.compareWithTolerance(arc2.radius, 1)).toBe(0);
    });
});
