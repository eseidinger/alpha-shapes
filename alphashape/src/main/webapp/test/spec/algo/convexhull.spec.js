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

describe('convex hull', function() {

    var algo = alphashape.algo;
    var geom = alphashape.geom;
    var util = alphashape.util;

    it('determines if three points make a right turn', function() {
        var p1 = new geom.Vector(0,0);
        var p2 = new geom.Vector(1,0);
        var p3 = new geom.Vector(1,1);
        var p4 = new geom.Vector(1,-1);
        var p5 = new geom.Vector(2,0);

        expect(algo.convexhull.makeRightTurn([p1, p2, p3])).toBe(true);
        expect(algo.convexhull.makeRightTurn([p1, p2, p4])).toBe(false);
        expect(algo.convexhull.makeRightTurn([p1, p2, p5])).toBe(false);
    });

    it('computes the convex hull', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        var convexHull = algo.convexhull.compute(points);

        var expConvexHull = [];
        expConvexHull.push(new geom.Vector(20,120));
        expConvexHull.push(new geom.Vector(120,20));
        expConvexHull.push(new geom.Vector(220,120));
        expConvexHull.push(new geom.Vector(120,220));

        expect(util.array.equals(convexHull, expConvexHull)).toBe(true);

        points = [];
        points.push(new geom.Vector(0,0));
        points.push(new geom.Vector(10,0));
        points.push(new geom.Vector(10,10));
        points.push(new geom.Vector(0,10));
        points.push(new geom.Vector(5,5));

        convexHull = algo.convexhull.compute(points);

        expConvexHull = [];
        expConvexHull.push(new geom.Vector(0,0));
        expConvexHull.push(new geom.Vector(10,0));
        expConvexHull.push(new geom.Vector(10,10));
        expConvexHull.push(new geom.Vector(0,10));

        expect(util.array.equals(convexHull, expConvexHull)).toBe(true);
    });

});
