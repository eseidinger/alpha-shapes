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

describe('HalfEdge', function() {

    var ds = alphashape.ds;
    var geom = alphashape.geom;

    it('sets a successor', function() {
        var edge1 = new ds.HalfEdge();
        var edge2 = new ds.HalfEdge();

        edge1.setNext(edge2);
        expect(edge1.next).toBe(edge2);
        expect(edge2.prev).toBe(edge1);
    });

    it('sets a predecessor', function() {
        var edge1 = new ds.HalfEdge();
        var edge2 = new ds.HalfEdge();

        edge1.setPrev(edge2);
        expect(edge1.prev).toBe(edge2);
        expect(edge2.next).toBe(edge1);
    });

    it('returns the first in a chain of half edges', function() {
        var edge1 = new ds.HalfEdge();
        var edge2 = new ds.HalfEdge();
        var edge3 = new ds.HalfEdge();

        edge1.setNext(edge2);
        edge2.setNext(edge3);

        expect(edge2.getStart()).toBe(edge1);

        edge3.setNext(edge1);
        expect(edge2.getStart()).toBe(edge3);
    });

    it('returns the last in a chain of half edges', function() {
        var edge1 = new ds.HalfEdge();
        var edge2 = new ds.HalfEdge();
        var edge3 = new ds.HalfEdge();

        edge1.setNext(edge2);
        edge2.setNext(edge3);

        expect(edge2.getEnd()).toBe(edge3);
        edge3.setNext(edge1);
        expect(edge2.getEnd()).toBe(edge1);
    });

    it('returns a line segment created from a half edge and its twin', function() {
        var edge = new ds.HalfEdge();
        edge.origin = new ds.Vertex();
        edge.origin.coordinates = new geom.Vector(0, 0);
        var twin = new ds.HalfEdge();
        edge.twin = twin;
        twin.origin = new ds.Vertex();
        twin.origin.coordinates = new geom.Vector(1, 1);

        var ls = edge.getLineSegment();
        var expectedLs = new geom.LineSegment(new geom.Vector(0, 0), new geom.Vector(1, 1));
        expect(ls.sortedEndpoints().equals(expectedLs.sortedEndpoints())).toBe(true);
    });

    it('removes all references to itself from previous and next edge as well as incident face', function() {
        var edge1 = new ds.HalfEdge();
        var edge2 = new ds.HalfEdge();
        var edge3 = new ds.HalfEdge();
        var face = new ds.Face();

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

    var ds = alphashape.ds;
    var geom = alphashape.geom;
    var util = alphashape.util;

    it('returns a face given its center', function() {
        var edgeList = new ds.EdgeList();
        var face1 = edgeList.getNewFace();
        var face2 = edgeList.getNewFace();

        face1.center = new geom.Vector(0,0);
        face2.center = new geom.Vector(1,1);

        var result1 = edgeList.getFace(new geom.Vector(0,0));
        var result2 = edgeList.getFace(new geom.Vector(1,1));

        expect(result1).toBe(face1);
        expect(result2).toBe(face2);
    });

    it('returns a vertex given its coordinates', function() {
        var edgeList = new ds.EdgeList();
        var vertex1 = edgeList.getNewVertex();
        var vertex2 = edgeList.getNewVertex();

        vertex1.coordinates = new geom.Vector(0,0);
        vertex2.coordinates = new geom.Vector(1,1);

        var result1 = edgeList.getVertex(new geom.Vector(0,0));
        var result2 = edgeList.getVertex(new geom.Vector(1,1));

        expect(result1).toBe(vertex1);
        expect(result2).toBe(vertex2);
    });

    it('returns a half edge whose origin and its twins origin matches given coordinates', function() {
        var edgeList = new ds.EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();

        edge1.origin = new ds.Vertex();
        edge1.origin.coordinates = new geom.Vector(0,0);
        edge1.twin.origin = new ds.Vertex();
        edge1.twin.origin.coordinates = new geom.Vector(1,0);

        edge2.origin = new ds.Vertex();
        edge2.origin.coordinates = new geom.Vector(0,1);
        edge2.twin.origin = new ds.Vertex();
        edge2.twin.origin.coordinates = new geom.Vector(1,1);

        var result1_1 = edgeList.getHalfEdge(new geom.Vector(0,0), new geom.Vector(1,0));
        var result1_2 = edgeList.getHalfEdge(new geom.Vector(1,0), new geom.Vector(0,0));
        var result2_1 = edgeList.getHalfEdge(new geom.Vector(0,1), new geom.Vector(1,1));
        var result2_2 = edgeList.getHalfEdge(new geom.Vector(1,1), new geom.Vector(0,1));

        expect(result1_1 === edge1).toBe(true);
        expect(result1_2 == edge1.twin).toBe(true);
        expect(result2_1 === edge2).toBe(true);
        expect(result2_2 == edge2.twin).toBe(true);
    });

    it('returns a list of line segments corresponding to the edges', function() {
        var edgeList = new ds.EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();

        edge1.origin = new ds.Vertex();
        edge1.origin.coordinates = new geom.Vector(0,0);
        edge1.twin.origin = new ds.Vertex();
        edge1.twin.origin.coordinates = new geom.Vector(1,0);

        edge2.origin = new ds.Vertex();
        edge2.origin.coordinates = new geom.Vector(0,1);
        edge2.twin.origin = new ds.Vertex();
        edge2.twin.origin.coordinates = new geom.Vector(1,1);

        var lineSegments = edgeList.getLineSegments();
        var expectedLineSegments = [];
        expectedLineSegments[0] = new geom.LineSegment(new geom.Vector(0,0), new geom.Vector(1,0));
        expectedLineSegments[1] = new geom.LineSegment(new geom.Vector(0,1), new geom.Vector(1,1));

        expect(util.array.compare(lineSegments, expectedLineSegments, false)).toBe(0);
    });

    it('removes edges with zero length from list of edges', function() {
        var edgeList = new ds.EdgeList();
        var edge1 = edgeList.getNewHalfEdgePair();
        var edge2 = edgeList.getNewHalfEdgePair();
        var edge3 = edgeList.getNewHalfEdgePair();

        edge1.origin = new ds.Vertex();
        edge1.origin.coordinates = new geom.Vector(0,0);
        edge1.twin.origin = new ds.Vertex();
        edge1.twin.origin.coordinates = new geom.Vector(1,0);

        edge2.origin = new ds.Vertex();
        edge2.origin.coordinates = new geom.Vector(0,1);
        edge2.twin.origin = new ds.Vertex();
        edge2.twin.origin.coordinates = new geom.Vector(1,1);

        edge3.origin = new ds.Vertex();
        edge3.origin.coordinates = new geom.Vector(2,2);
        edge3.twin.origin = new ds.Vertex();
        edge3.twin.origin.coordinates = new geom.Vector(2,2);

        edgeList.removeZeroLengthEdges();
        expect(edgeList.halfEdges.length).toBe(4);
        expect(edgeList.getHalfEdge(new geom.Vector(2,2), new geom.Vector(2,2))).toBeNull();
    });
});
