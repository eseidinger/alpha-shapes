'use strict';

var VoronoiNeighbours = alphashape.algo.VoronoiNeighbours;

describe('Voronoi neighbours', function() {
    it('calculates minimum distances of Voronoi centers to separating border',
            function() {
        var delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        var voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(-1, 0));
        var voronoiNeighbours =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);
        var minDist = voronoiNeighbours.getMinDist();
        
        expect(minDist).toBe(1.0);

        delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(2, 0));
        voronoiNeighbours =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);
        minDist = voronoiNeighbours.getMinDist();
        
        expect(minDist).toBe(Math.SQRT2);
    });

    it('calculates minimum distances of Voronoi centers to separating border',
            function() {
        var delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        var voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(-1, 0));
        var voronoiNeighbours =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);
        var maxDist = voronoiNeighbours.getMaxDist();
        
        expect(maxDist).toBe(Math.SQRT2);

        delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(2, 0));
        voronoiNeighbours =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);
        maxDist = voronoiNeighbours.getMaxDist();
        
        expect(maxDist).toBe(Math.sqrt(5));
    });

    it('checks Voronoi neighbours for equality', function() {
        var delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        var voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(-1, 0));
        var voronoiNeighbours =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);

        delaunayEdge = LineSegment.createFromPoints(new Vector(0, 1),
                new Vector(0, -1));
        voronoiEdge = LineSegment.createFromPoints(new Vector(1, 0),
                new Vector(2, 0));
        var voronoiNeighbours2 =
                new VoronoiNeighbours(delaunayEdge, voronoiEdge);
        
        expect(voronoiNeighbours.equals(voronoiNeighbours)).toBe(true);
        expect(voronoiNeighbours.equals(voronoiNeighbours2)).toBe(false);
    });
});
