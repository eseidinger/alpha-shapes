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

(function(algo, geom, ds, util) {
    /**
     * Skyum's algorithm calculates the smallest enclosing circle and the farthest
     * point Voronoi diagram of a set of points in the plane, given its convex hull.
     *
     * @namespace
     */
    alphashape.algo.skyum = {};

    /**
     * Array of triangles formed by convex hull points.
     *
     * @private
     * @type {Array.<alphashape.geom.Triangle>}
     */
    alphashape.algo.skyum.triangles;

    /**
     * Remaining points in convex hull to consider for computation.
     *
     * @private
     * @type {Array.<alphashape.geom.Vector>}
     */
    alphashape.algo.skyum.remainingPoints;

    /**
     * A reference to the input point set.
     *
     * @private
     * @type {Array.<alphashape.geom.Vector>}
     */
    alphashape.algo.skyum.originalPoints;

    /**
     * Points of the Voronoi diagram.
     *
     * @private
     * @type {Array.<alphashape.geom.Vector>}
     */
    alphashape.algo.skyum.voronoiPoints;

    /**
     * The smallest enclosing circle as a result of Skyum's algorithm
     *
     * @type {alphashape.geom.Circle}
     */
    alphashape.algo.skyum.smallestCircle;

    /**
     * A doubly connected edge list containing the Voronoi diagram as a result of Skyum's algorithm
     *
     * @private
     * @type {alphashape.ds.EdgeList}
     */
    alphashape.algo.skyum.voronoiDiagram;

    /**
     * Initilize the triangle array with triangles formed by subsequent convex hull points.
     *
     * @private
     */
    alphashape.algo.skyum.initTriangleArray = function() {
        algo.skyum.triangles = [];
        for (var i = 0; i < algo.skyum.originalPoints.length; i++) {
            var iPre = (i + algo.skyum.originalPoints.length - 1) % algo.skyum.originalPoints.length;

            var iPost = (i + 1) % algo.skyum.originalPoints.length;

            var t = new geom.Triangle(algo.skyum.originalPoints[iPre], algo.skyum.originalPoints[i],
                algo.skyum.originalPoints[iPost]);
            algo.skyum.triangles.push(t);
        }
    };

    /**
     * On removal of a point from the convex hull, two new triangles are to be considered.
     *
     * @private
     * @param {alphashape.geom.Vector} point
     */
    alphashape.algo.skyum.addNewTrianglesWithNeighboursOfPoint = function(point) {
        var i = algo.skyum.remainingPoints.indexOf(point);

        var iPre = (i + algo.skyum.remainingPoints.length - 1) % algo.skyum.remainingPoints.length;
        var iPrePre = (iPre + algo.skyum.remainingPoints.length - 1) % algo.skyum.remainingPoints.length;

        var iPost = (i + 1) % algo.skyum.remainingPoints.length;
        var iPostPost = (i + 2) % algo.skyum.remainingPoints.length;

        var t1 = new geom.Triangle(algo.skyum.remainingPoints[iPrePre], algo.skyum.remainingPoints[iPre],
            algo.skyum.remainingPoints[iPost]);
        var t2 = new geom.Triangle(algo.skyum.remainingPoints[iPre], algo.skyum.remainingPoints[iPost],
            algo.skyum.remainingPoints[iPostPost]);

        algo.skyum.triangles.push(t1);
        algo.skyum.triangles.push(t2);
    };

    /**
     * Calculate the position of the vertex of the Voronoi diagram edge separating P and Q laying in infinity.
     *
     * @private
     * @param {alphashape.geom.Vector} P center of Voronoi region
     * @param {alphashape.geom.Vector} Q center of Voronoi region
     * @returns {alphashape.geom.Vector} point of Voronoi diagram with infinite distance
     */
    alphashape.algo.skyum.calcVP = function(P, Q) {
        var e = new geom.LineSegment(P, Q);
        var C = e.getCenter();
        var v = e.direction.rotate(Math.PI / 2);

        return C.add(v.normalize().multiplyScalar(util.constant.INFINITY));
    };

    /**
     * Initialize the global variables.
     *
     * @private
     * @param {Array.<alphashape.geom.Vector>} points of convex hull
     */
    alphashape.algo.skyum.initGlobals = function(points) {
        algo.skyum.originalPoints = points;
        algo.skyum.initTriangleArray();
        algo.skyum.remainingPoints = [].concat(points);
        algo.skyum.voronoiPoints = [];

        algo.skyum.smallestCircle = null;
        algo.skyum.voronoiDiagram = new ds.EdgeList();

        for (var i = 0; i < points.length; i++) {
            var j = (i + 1) % points.length;
            var vP = algo.skyum.calcVP(points[i], points[j]);
            algo.skyum.voronoiPoints.push(vP);
        }
    };

    /**
     * Run Skyum's algorithm
     *
     * @param {Array.<alphashape.geom.Vector>} points forming a convex hull
     * @returns {{voronoiDiagram: alphashape.ds.EdgeList, smallestCircle: alphashape.geom.Circle, voronoiTriangles:
     * Array.<alphashape.geom.Triangle>}} Voronoi diagram
     */
    alphashape.algo.skyum.computeVoronoiDiagram = function(points) {
        var voronoiTriangles = [];

        algo.skyum.initGlobals(points);

        if (points.length > 2) {
            do {
                algo.skyum.triangles.sort(function(t1, t2) {
                    return -1 * geom.Triangle.compare(t1, t2);
                });
                var triangle = algo.skyum.triangles[0];
                voronoiTriangles.push(triangle);

                algo.skyum.handleTriangle(triangle);

                algo.skyum.triangles = algo.skyum.triangles.filter(function(t) {
                    return !t.isCorner(triangle.p2);
                });
                algo.skyum.addNewTrianglesWithNeighboursOfPoint(triangle.p2);
                var i = algo.skyum.remainingPoints.indexOf(triangle.p2);
                algo.skyum.remainingPoints.splice(i, 1);
            } while (algo.skyum.remainingPoints.length > 2);

            algo.skyum.handleRemainingLine();

        } else if (points.length === 2) {
            algo.skyum.handleRemainingLine();
        } else if (points.length === 1) {
            algo.skyum.smallestCircle = new geom.Circle(points[0], 0);
        }

        algo.skyum.voronoiDiagram.removeZeroLengthEdges();
        return {voronoiDiagram: algo.skyum.voronoiDiagram, smallestCircle: algo.skyum.smallestCircle,
            voronoiTriangles: voronoiTriangles};
    };

    /**
     * Check current triangle for smallest circle and add edges to Voronoi diagram.
     *
     * @private
     * @param {alphashape.geom.Triangle} triangle
     */
    alphashape.algo.skyum.handleTriangle = function(triangle) {
        if (algo.skyum.smallestCircle === null &&
            (util.comparator.compareWithTolerance(triangle.getMiddleAngle(), Math.PI / 2) !== 1)) {
            algo.skyum.smallestCircle = triangle.getCircumcircle();
        }

        var P = triangle.p2;
        var Q = triangle.p1;
        var R = triangle.p3;
        var C = triangle.getCircumcircle().center;

        var i = algo.skyum.originalPoints.indexOf(P);
        var vP = algo.skyum.voronoiPoints[i];
        var j = algo.skyum.originalPoints.indexOf(Q);
        var vQ = algo.skyum.voronoiPoints[j];
        algo.skyum.voronoiPoints[j] = C;

        algo.skyum.createPartialEdgeListForTriangle(P,Q,R,C,vP,vQ);
    };

    /**
     * Check remaining line for smallest circle and add edges to Voronoi diagram.
     *
     * @private
     */
    alphashape.algo.skyum.handleRemainingLine = function() {
        var Q = algo.skyum.remainingPoints[0];
        var R = algo.skyum.remainingPoints[1];

        var i = algo.skyum.originalPoints.indexOf(Q);
        var j = algo.skyum.originalPoints.indexOf(R);

        var vQ = algo.skyum.voronoiPoints[i];
        var vR = algo.skyum.voronoiPoints[j];

        var e = new geom.LineSegment(Q, R);
        if (algo.skyum.smallestCircle === null) {
            algo.skyum.smallestCircle = new geom.Circle(e.getCenter(), e.getLength() / 2);
        }

        algo.skyum.createPartialEdgeListForLine(Q, R, vQ, vR);
    };

    /**
     * Create the partial edge list for a triangle of convex hull points given the centers of the faces constrained
     * by the Voronoi diagram and the locations of Voronoi diagram vertices.
     *
     * @private
     * @param {alphashape.geom.Vector} P center of the face for point P
     * @param {alphashape.geom.Vector} Q center of the face for point Q
     * @param {alphashape.geom.Vector} R center of the face for point R
     * @param {alphashape.geom.Vector} C origin coordinates of a vertex of two Voronoi edges separating P, Q and R
     * @param {alphashape.geom.Vector} vP origin coordinates of a vertex of a Voronoi edge separating P and R
     * @param {alphashape.geom.Vector} vQ origin coordinates of a vertex of a Voronoi edge separating P and Q
     */
    alphashape.algo.skyum.createPartialEdgeListForTriangle = function(P, Q, R, C, vP, vQ) {
        var halfEdgeP = algo.skyum.voronoiDiagram.getNewHalfEdgePair();
        var halfEdgeQ = algo.skyum.voronoiDiagram.getNewHalfEdgePair();

        var vertexC = algo.skyum.voronoiDiagram.getVertex(C);
        if (vertexC === null) {
            vertexC = algo.skyum.voronoiDiagram.getNewVertex();
            vertexC.coordinates = C;
            vertexC.incidentEdge = halfEdgeP.twin;
        }
        var faceP = algo.skyum.configureFaceForPoint(P, halfEdgeP);
        var faceQ = algo.skyum.configureFaceForPoint(Q, halfEdgeQ);
        var faceR = algo.skyum.configureFaceForPoint(R, halfEdgeP.twin);

        var vertexP = algo.skyum.configureVertexForPoint(vP, halfEdgeP, faceP, faceR);
        var vertexQ = algo.skyum.configureVertexForPoint(vQ, halfEdgeQ, faceQ, faceP);

        halfEdgeP.setNext(halfEdgeQ.twin);
        halfEdgeP.origin = vertexP;
        halfEdgeP.incidentFace = faceP;
        halfEdgeP.twin.origin = vertexC;
        halfEdgeP.twin.incidentFace = faceR;
        halfEdgeQ.origin = vertexQ;
        halfEdgeQ.incidentFace = faceQ;
        halfEdgeQ.twin.origin = vertexC;
        halfEdgeQ.twin.incidentFace = faceP;
    };

    /**
     * Create the partial edge list for a line connecting two convex hull points.
     *
     * @private
     * @param {alphashape.geom.Vector} Q center for face of point Q
     * @param {alphashape.geom.Vector} R center for face of point R
     * @param {alphashape.geom.Vector} vQ origin coordinates of a vertex of a Voronoi edge separating Q and R
     * @param {alphashape.geom.Vector} vR origin coordinates of a vertex of a Voronoi edge separating Q and R
     */
    alphashape.algo.skyum.createPartialEdgeListForLine = function(Q, R, vQ, vR) {
        var halfEdgeR = algo.skyum.voronoiDiagram.getNewHalfEdgePair();

        var faceQ = algo.skyum.configureFaceForPoint(Q, halfEdgeR.twin);
        var faceR = algo.skyum.configureFaceForPoint(R, halfEdgeR);

        var vertexQ = algo.skyum.configureVertexForPoint(vQ, halfEdgeR.twin, faceQ, faceR);
        var vertexR = algo.skyum.configureVertexForPoint(vR, halfEdgeR, faceR, faceQ);

        halfEdgeR.origin = vertexR;
        halfEdgeR.incidentFace = faceR;
        halfEdgeR.twin.origin = vertexQ;
        halfEdgeR.twin.incidentFace = faceQ;
    };

    /**
     * Setup the face for a given center and outer component.
     *
     * @private
     * @param {alphashape.geom.Vector} center of the face
     * @param {alphashape.ds.HalfEdge} outerComponent of the face
     */
    alphashape.algo.skyum.configureFaceForPoint = function(center, outerComponent) {
        var face = algo.skyum.voronoiDiagram.getFace(center);

        if (face === null) {
            face = algo.skyum.voronoiDiagram.getNewFace();
            face.center = center;
            face.outerComponent = outerComponent;
        }
        return face;
    };

    /**
     * Set up the vertex for given coordinates, incident edge, and two faces separated by the incident edge.
     *
     * @private
     * @param {alphashape.geom.Vector} coordinates of vertex
     * @param {alphashape.ds.HalfEdge} incidentEdge of vertex
     * @param {alphashape.ds.Face} face1 separated from face2 by incident edge
     * @param {alphashape.ds.Face} face2 separated from face1 by incident edge
     */
    alphashape.algo.skyum.configureVertexForPoint = function(coordinates, incidentEdge, face1, face2) {
        var vertex = algo.skyum.voronoiDiagram.getVertex(coordinates);

        if (vertex === null) {
            vertex = algo.skyum.voronoiDiagram.getNewVertex();
            vertex.coordinates = coordinates;
            vertex.incidentEdge = incidentEdge;
        } else {
            if (face1.outerComponent.getEnd().twin.origin === vertex) {
                face1.outerComponent.getEnd().setNext(incidentEdge);
            }
            if (face2.outerComponent.getStart().origin === vertex) {
                face2.outerComponent.getStart().setPrev(incidentEdge.twin);
            }
        }
        return vertex;
    };
})(alphashape.algo, alphashape.geom, alphashape.ds, alphashape.util);

