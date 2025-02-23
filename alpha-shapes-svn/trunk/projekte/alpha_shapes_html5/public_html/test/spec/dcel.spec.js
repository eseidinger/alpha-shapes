'use strict';

var EdgeList = alphashape.ds.EdgeList;
var Vertex = alphashape.ds.Vertex;
var Face = alphashape.ds.Face;
var HalfEdge = alphashape.ds.HalfEdge;

var Vector = alphashape.geom.Vector;
var LineSegment = alphashape.geom.LineSegment;

var ArrayFunctions = alphashape.util.ArrayFunctions;


describe('HalfEdge', function() {
    it('returns the first in a chain of half edges', function() {
        var edge1 = new HalfEdge();
        var edge2 = new HalfEdge();
        var edge3 = new HalfEdge();

        edge1.setNext(edge2);
        edge2.setNext(edge3);

        expect(edge2.getStart()).toBe(edge1);
    });

    it('returns the last in a chain of half edges', function() {
        var edge1 = new HalfEdge();
        var edge2 = new HalfEdge();
        var edge3 = new HalfEdge();

        edge1.setNext(edge2);
        edge2.setNext(edge3);

        expect(edge2.getEnd()).toBe(edge3);
    });

    it('returns a line segment created from a half edge and its twin', function() {
        var edge = new HalfEdge();
        edge.origin = new Vertex();
        edge.origin.coordinates = new Vector(0, 0);
        var twin = new HalfEdge();
        edge.twin = twin;
        twin.origin = new Vertex();
        twin.origin.coordinates = new Vector(1, 1);

        var ls = edge.getLineSegment();
        expect(ls.origin.equals(new Vector(0,0))).toBe(true);
        expect(ls.getEndpoint().equals(new Vector(1,1))).toBe(true);
    });

    it('removes all references to itself from previous and next edge as well as incident face', function() {
        var edge1 = new HalfEdge();
        var edge2 = new HalfEdge();
        var edge3 = new HalfEdge();
        var face = new Face();

        edge1.setNext(edge2);
        edge1.incidentFace = face;
        edge2.setNext(edge3);
        edge2.incidentFace = face;
        edge3.setNext(edge1);
        edge3.incidentFace = face;
        face.outerComponent = edge2;

        edge2.unchain();

        expect(edge1.next).toBe(edge3);
        expect(edge3.prev).toBe(edge1);
        expect(face.outerComponent).toBe(edge1);
    });
});

describe('EdgeList', function() {

    it('returns a face given its center', function() {
        var edgeList = new EdgeList();
        var face1 = edgeList.getNewFace();
        var face2 = edgeList.getNewFace();

        face1.center = new Vector(0,0);
        face2.center = new Vector(1,1);

        var result1 = edgeList.getFace(new Vector(0,0));
        var result2 = edgeList.getFace(new Vector(1,1));

        expect(result1).toBe(face1);
        expect(result2).toBe(face2);
    });

    it('returns a vertex given its coordinates', function() {
        var edgeList = new EdgeList();
        var vertex1 = edgeList.getNewVertex();
        var vertex2 = edgeList.getNewVertex();

        vertex1.coordinates = new Vector(0,0);
        vertex2.coordinates = new Vector(1,1);

        var result1 = edgeList.getVertex(new Vector(0,0));
        var result2 = edgeList.getVertex(new Vector(1,1));

        expect(result1).toBe(vertex1);
        expect(result2).toBe(vertex2);
    });

    it('returns a half edge whose origin and its twins origin matches given coordinates', function() {
        var edgeList = new EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();

        edge1.origin = new Vertex();
        edge1.origin.coordinates = new Vector(0,0);
        edge1.twin.origin = new Vertex();
        edge1.twin.origin.coordinates = new Vector(1,0);

        edge2.origin = new Vertex();
        edge2.origin.coordinates = new Vector(0,1);
        edge2.twin.origin = new Vertex();
        edge2.twin.origin.coordinates = new Vector(1,1);

        var result1_1 = edgeList.getHalfEdge(new Vector(0,0), new Vector(1,0));
        var result1_2 = edgeList.getHalfEdge(new Vector(1,0), new Vector(0,0));
        var result2_1 = edgeList.getHalfEdge(new Vector(0,1), new Vector(1,1));
        var result2_2 = edgeList.getHalfEdge(new Vector(1,1), new Vector(0,1));

        expect(result1_1 === edge1 || result1_1 == edge1.twin).toBe(true);
        expect(result1_2 === edge1 || result1_2 == edge1.twin).toBe(true);
        expect(result2_1 === edge2 || result2_1 == edge2.twin).toBe(true);
        expect(result2_2 === edge2 || result2_2 == edge2.twin).toBe(true);
    });

    it('returns a list of line segments corresponding to the edges', function() {
        var edgeList = new EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();

        edge1.origin = new Vertex();
        edge1.origin.coordinates = new Vector(0,0);
        edge1.twin.origin = new Vertex();
        edge1.twin.origin.coordinates = new Vector(1,0);

        edge2.origin = new Vertex();
        edge2.origin.coordinates = new Vector(0,1);
        edge2.twin.origin = new Vertex();
        edge2.twin.origin.coordinates = new Vector(1,1);

        var lineSegments = edgeList.getLineSegments();
        var expectedLineSegment1 = LineSegment.createFromPoints(new Vector(0,0), new Vector(1,0));
        var expectedLineSegment2 = LineSegment.createFromPoints(new Vector(0,1), new Vector(1,1));

        expect(lineSegments.length).toBe(2);
        expect(ArrayFunctions.getIndexInArrayWithPredicate(lineSegments, function(ls) {
            return ls.equals(expectedLineSegment1);
        }) !== -1).toBe(true);
        expect(ArrayFunctions.getIndexInArrayWithPredicate(lineSegments, function(ls) {
            return ls.equals(expectedLineSegment2);
        }) !== -1).toBe(true);
    });

    it('removes edges with zero length from list of edges', function() {
        var edgeList = new EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();
        var edge3 = edgeList.getNewHalfEdgePair();

        edge1.origin = new Vertex();
        edge1.origin.coordinates = new Vector(0,0);
        edge1.twin.origin = new Vertex();
        edge1.twin.origin.coordinates = new Vector(1,0);

        edge2.origin = new Vertex();
        edge2.origin.coordinates = new Vector(0,1);
        edge2.twin.origin = new Vertex();
        edge2.twin.origin.coordinates = new Vector(1,1);

        edge3.origin = new Vertex();
        edge3.origin.coordinates = new Vector(2,2);
        edge3.twin.origin = new Vertex();
        edge3.twin.origin.coordinates = new Vector(2,2);

        edgeList.removeZeroLengthEdges();
        expect(edgeList.halfEdges.length).toBe(4);
        expect(edgeList.getHalfEdge(new Vector(2,2), new Vector(2,2))).toBeNull();
    });
});
