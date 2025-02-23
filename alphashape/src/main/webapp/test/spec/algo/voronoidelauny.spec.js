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

describe('Voronoi neighbours', function() {

    var geom = alphashape.geom;
    var algo = alphashape.algo;

    it('calculates minimum distances of Voronoi centers to separating border',
            function() {
        var delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1), new geom.Vector(0, -1));
        var voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0), new geom.Vector(-1, 0));
        var voronoiNeighbours = new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);
        var minDist = voronoiNeighbours.getMinDist();
        
        expect(minDist).toBe(1.0);

        delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1),
                new geom.Vector(0, -1));
        voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0),
                new geom.Vector(2, 0));
        voronoiNeighbours =
                new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);
        minDist = voronoiNeighbours.getMinDist();
        
        expect(minDist).toBe(Math.SQRT2);
    });

    it('calculates minimum distances of Voronoi centers to separating border',
            function() {
        var delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1),
                new geom.Vector(0, -1));
        var voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0),
                new geom.Vector(-1, 0));
        var voronoiNeighbours =
                new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);
        var maxDist = voronoiNeighbours.getMaxDist();
        
        expect(maxDist).toBe(Math.SQRT2);

        delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1),
                new geom.Vector(0, -1));
        voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0),
                new geom.Vector(2, 0));
        voronoiNeighbours =
                new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);
        maxDist = voronoiNeighbours.getMaxDist();
        
        expect(maxDist).toBe(Math.sqrt(5));
    });

    it('checks Voronoi neighbours for equality', function() {
        var delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1),
                new geom.Vector(0, -1));
        var voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0),
                new geom.Vector(-1, 0));
        var voronoiNeighbours =
                new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);

        delaunayEdge = new geom.LineSegment(new geom.Vector(0, 1),
                new geom.Vector(0, -1));
        voronoiEdge = new geom.LineSegment(new geom.Vector(1, 0),
                new geom.Vector(2, 0));
        var voronoiNeighbours2 =
                new algo.VoronoiNeighbours(delaunayEdge, voronoiEdge);
        
        expect(voronoiNeighbours.equals(voronoiNeighbours)).toBe(true);
        expect(voronoiNeighbours.equals(voronoiNeighbours2)).toBe(false);
    });
});
