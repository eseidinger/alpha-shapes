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

describe('Skyums algorithm', function() {

    var geom = alphashape.geom;
    var algo = alphashape.algo;
    var util = alphashape.util;

    it('computes the farthest point voronoi diagram', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        var convexHull = algo.convexhull.compute(points);

        var skyumResults = algo.skyum.computeVoronoiDiagram(convexHull);
        var voronoiLines = skyumResults.voronoiDiagram.getLineSegments();

        var rect = new geom.Rectangle(0, 0, 240, 240);
        var voronoiLinesCropped = voronoiLines.map(function(ls) {return rect.cropLineSegment(ls).sortedEndpoints()});

        var expVoronoiMax = [];
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(120,120)).sortedEndpoints());
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(240,0), new geom.Vector(120,120)).sortedEndpoints());
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(0,240), new geom.Vector(120,120)).sortedEndpoints());
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(240,240), new geom.Vector(120,120)).sortedEndpoints());

        expect(util.array.compare(voronoiLinesCropped, expVoronoiMax, false)).toBe(0);
    });
});
