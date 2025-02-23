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

describe('alphashape library', function() {

    var geom = alphashape.geom;
    var util = alphashape.util;

    it('computes the convex hull', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expConvexHull = [];
        expConvexHull.push(new geom.Vector(20,120));
        expConvexHull.push(new geom.Vector(120,20));
        expConvexHull.push(new geom.Vector(220,120));
        expConvexHull.push(new geom.Vector(120,220));

        expect(util.array.equals(expConvexHull, alphashape.convexHull)).toBe(true);
    });

    it('computes the closest point voronoi diagram', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expVoronoiMin = [];
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(70,70)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(240,0), new geom.Vector(170,70)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(0,240), new geom.Vector(70,170)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(240,240), new geom.Vector(170,170)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(70,70), new geom.Vector(170,70)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(70,70), new geom.Vector(70,170)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(70,170), new geom.Vector(170,170)));
        expVoronoiMin.push(new geom.LineSegment(new geom.Vector(170,170), new geom.Vector(170,70)));

        expect(util.array.compare(alphashape.voronoiMin.map(function(el) {return el.sortedEndpoints();}),
            expVoronoiMin.map(function(el) {return el.sortedEndpoints();}), false)).toBe(0);
    });

    it('computes the farthest point voronoi diagram', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expVoronoiMax = [];
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(120,120)));
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(240,0), new geom.Vector(120,120)));
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(0,240), new geom.Vector(120,120)));
        expVoronoiMax.push(new geom.LineSegment(new geom.Vector(240,240), new geom.Vector(120,120)));

        expect(util.array.compare(alphashape.voronoiMax.map(function(el) {return el.sortedEndpoints();}),
            expVoronoiMax.map(function(el) {return el.sortedEndpoints();}), false)).toBe(0);
    });

    it('computes the closest point delaunay diagram', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expDelaunayMin = [];
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(120,20), new geom.Vector(20,120)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(20,120), new geom.Vector(120,220)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(120,220), new geom.Vector(220,120)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(220,120), new geom.Vector(120,20)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(120,20), new geom.Vector(120,120)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(20,120), new geom.Vector(120,120)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(120,220), new geom.Vector(120,120)));
        expDelaunayMin.push(new geom.LineSegment(new geom.Vector(220,120), new geom.Vector(120,120)));

        expect(util.array.compare(alphashape.delaunayMin.map(function(el) {return el.sortedEndpoints();}),
            expDelaunayMin.map(function(el) {return el.sortedEndpoints();}), false)).toBe(0);
    });

    it('computes the farthest point delaunay diagram', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expDelaunayMax = [];
        expDelaunayMax.push(new geom.LineSegment(new geom.Vector(120,20), new geom.Vector(20,120)));
        expDelaunayMax.push(new geom.LineSegment(new geom.Vector(20,120), new geom.Vector(120,220)));
        expDelaunayMax.push(new geom.LineSegment(new geom.Vector(120,220), new geom.Vector(220,120)));
        expDelaunayMax.push(new geom.LineSegment(new geom.Vector(220,120), new geom.Vector(120,20)));

        expect(util.array.compare(alphashape.delaunayMax.map(function(el) {return el.sortedEndpoints();}),
            expDelaunayMax.map(function(el) {return el.sortedEndpoints();}), false)).toBe(0);
    });

    it('computes the significant alphas', function() {
        var points = [];
        points.push(new geom.Vector(120,20));
        points.push(new geom.Vector(20,120));
        points.push(new geom.Vector(120,120));
        points.push(new geom.Vector(220,120));
        points.push(new geom.Vector(120,220));

        alphashape.compute(points, 0, 0, 0, 240, 240);

        var expSignificantAlphas = [-100, 50, Math.sqrt(2*Math.pow(50,2))];

        expect(util.array.compare(alphashape.significantAlphas, expSignificantAlphas, false, util.comparator.compare));
    });
});
