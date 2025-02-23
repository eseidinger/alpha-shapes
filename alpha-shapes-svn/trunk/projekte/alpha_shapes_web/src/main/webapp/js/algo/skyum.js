'use strict';

/**
 * Skyum's algorithm calculates the smallest enclosing circle and the farthest
 * point Voronoi diagram of a set of points in the plane, given its convex hull.
 * 
 * @constructor
 */
function Skyum() {
};

/**
 * Array of triangles formed by convex hull points.
 * 
 * @private
 * @type Array.<Triangle>
 */
Skyum.triangles;

/**
 * Remaining points in convex hull to consider for computation.
 * 
 * @private
 * @type Array.<Vector>
 */
Skyum.remainingPoints;

/**
 * All points of the convex hull are points of the Delaunay triangulation.
 * 
 * @private
 * @type Array.<Vector>
 */
Skyum.delaunayPoints;

/**
 * Points of the Voroni diagram.
 * 
 * @private
 * @type Array.<Vector>
 */
Skyum.voronoiPoints;

/**
 * The smallest enclosing circle as a result of Skyum's algorithm
 * 
 * @type Circle
 */
Skyum.smallestCircle;

/**
 * A doubly connected edge list containing the Voronoi diagram as a result of
 * Skyum's algorithm
 * 
 * @private
 * @type EdgeList
 */
Skyum.voronoiDiagram;

/**
 * Initilize the triangle array with triangles formed by subsequent convex hull
 * points.
 * 
 * @private
 * @param {Array.<Vector>} points
 */
Skyum.initTriangleArray = function(points) {
    Skyum.triangles = [];
    for (var i = 0; i < points.length; i++) {
        var iPre = (i + points.length - 1) % points.length;

        var iPost = (i + 1) % points.length;

        var t = new Triangle(points[iPre], points[i], points[iPost]);
        Skyum.triangles.push(t);
    }
};

/**
 * On removal of a point from the convex hull, two new triangles are to be
 * considered.
 * 
 * @private
 * @param {Vector} point
 */
Skyum.addNewTrianglesWithNeighboursOfPoint = function(point) {
    var i = Skyum.remainingPoints.indexOf(point);

    var iPre = (i + Skyum.remainingPoints.length - 1) %
            Skyum.remainingPoints.length;
    var iPrePre = (iPre + Skyum.remainingPoints.length - 1) %
            Skyum.remainingPoints.length;

    var iPost = (i + 1) % Skyum.remainingPoints.length;
    var iPostPost = (i + 2) % Skyum.remainingPoints.length;

    var t1 = new Triangle(Skyum.remainingPoints[iPrePre],
            Skyum.remainingPoints[iPre], Skyum.remainingPoints[iPost]);
    var t2 = new Triangle(Skyum.remainingPoints[iPre],
            Skyum.remainingPoints[iPost], Skyum.remainingPoints[iPostPost]);

    Skyum.triangles.push(t1);
    Skyum.triangles.push(t2);
};

/**
 * Calculate the position of the vertex of the Voronoi diagram edge separating
 * P and Q with infinite distance from the connecting Delaunay edge.
 * 
 * @private
 * @param {Vector} P center of Voronoi region
 * @param {Vector} Q center of Voronoi region
 * @returns {Vector} point of Voronoi diagram with infinite distance
 */
Skyum.calcVP = function(P, Q) {
    var e = LineSegment.createFromPoints(P, Q);
    var C = e.getCenter();
    var v = e.direction.rotate(Math.PI / 2);
    
    return C.add(v.normalize().multiplyScalar(Misc.INFINITY));
};

/**
 * Initialize the global variables.
 * 
 * @private
 * @param {Array.<Vector>} points of convex hull
 */
Skyum.initGlobals = function(points) {
    Skyum.initTriangleArray(points);
    Skyum.remainingPoints = [].concat(points);
    Skyum.delaunayPoints = points;
    Skyum.voronoiPoints = [];
    
    Skyum.smallestCircle = null;
    Skyum.voronoiDiagram = new EdgeList();
    Skyum.delaunayGraph = null;

    for (var i = 0; i < points.length; i++) {
        var j = (i + 1) % points.length;
        var vP = Skyum.calcVP(points[i], points[j]);
        Skyum.voronoiPoints.push(vP);
    }
};

/**
 * Run Skyum's algorithm
 * 
 * @param {Array.<Vector>} points forming a convex hull
 * @returns {EdgeList} Voronoi diagram
 */
Skyum.computeVoronoiDiagram = function(points) {
    var triangle;

    Skyum.initGlobals(points);
    
    if (points.length > 2) {
        do {
            Skyum.triangles.sort(function(t1, t2) {
                return -1 * Triangle.compareByRadiusThenAngle(t1, t2);
            });
            triangle = Skyum.triangles[0];

            Skyum.handleTriangle(triangle);

            Skyum.triangles = Skyum.triangles.filter(function(t) {
                return !t.isCorner(triangle.p2);
            });
            Skyum.addNewTrianglesWithNeighboursOfPoint(triangle.p2);
            var i = Skyum.remainingPoints.indexOf(triangle.p2);
            Skyum.remainingPoints.splice(i, 1);
        } while (Skyum.remainingPoints.length > 2);

        Skyum.handleRemainingLine();

    } else if (points.length === 2) {
        Skyum.handleRemainingLine();
    } else if (points.length === 1) {
        Skyum.smallestCircle = new Circle(points[0], 0);
    }
    
    Skyum.voronoiDiagram.removeZeroLengthEdges();
    return Skyum.voronoiDiagram;
};

/**
 * Check current triangle for smallest circle and add edges to Voronoi diagram.
 * 
 * @private
 * @param {Triangle} triangle
 */
Skyum.handleTriangle = function(triangle) {
    if (Skyum.smallestCircle === null &&
            !((Misc.compareWithTolerance(triangle.getMiddleAngle(),
                Math.PI / 2) === 1))) {
        Skyum.smallestCircle = triangle.getCircumcircle();
    }

    var P = triangle.p2;
    var Q = triangle.p1;
    var R = triangle.p3;
    var C = triangle.getCircumcircle().center;

    var i = Skyum.delaunayPoints.indexOf(P);
    var vP = Skyum.voronoiPoints[i];
    var j = Skyum.delaunayPoints.indexOf(Q);
    var vQ = Skyum.voronoiPoints[j];
    Skyum.voronoiPoints[j] = C;

    Skyum.createPartialEdgeListForTriangle(P,Q,R,C,vP,vQ);
};

/**
 * Check remaining line for smallest circle and add edges to Voronoi diagram.
 * 
 * @private
 */
Skyum.handleRemainingLine = function() {
    var Q = Skyum.remainingPoints[0];
    var R = Skyum.remainingPoints[1];
    
    var i = Skyum.delaunayPoints.indexOf(Q);
    var j = Skyum.delaunayPoints.indexOf(R);
    
    var vQ = Skyum.voronoiPoints[i];
    var vR = Skyum.voronoiPoints[j];
    
    var e = LineSegment.createFromPoints(Q, R);
    if (Skyum.smallestCircle === null) {
        Skyum.smallestCircle = new Circle(e.getCenter(), e.getLength() / 2);
    }
    
    Skyum.createPartialEdgeListForLine(Q, R, vQ, vR);
};

/**
 * Create the partial edge list for a triangle of convex hull points given
 * the centers of the faces constrained by the Voronoi diagram and the locations
 * of Voronoi diagram vertices.
 * 
 * @param {Vector} P center of the face for point P
 * @param {Vector} Q center of the face for point Q
 * @param {Vector} R center of the face for point R
 * @param {Vector} C coordinates of the vertex of the two Voronoi edges separating
 *                  P, Q and R
 * @param {Vector} vP coordinates of the vertex of the Voronoi edge separating
 *                  P and R
 * @param {Vector} vQ cooridnates of the vertex of the Voronoi edge separating
 *                  P and Q
 */
Skyum.createPartialEdgeListForTriangle = function(P, Q, R, C, vP, vQ) {
    var halfEdgeP = Skyum.voronoiDiagram.getNewHalfEdgePair();
    var halfEdgeQ = Skyum.voronoiDiagram.getNewHalfEdgePair();

    var vertexC = Skyum.voronoiDiagram.getVertex(C);
    if (vertexC === null) {
        vertexC = Skyum.voronoiDiagram.getNewVertex();
        vertexC.coordinates = C;
        vertexC.incidentEdge = halfEdgeP.twin;
    } else {
    }
    var faceP = Skyum.configureFaceForPoint(P, halfEdgeP);
    var faceQ = Skyum.configureFaceForPoint(Q, halfEdgeQ);
    var faceR = Skyum.configureFaceForPoint(R, halfEdgeP.twin);

    var vertexP = Skyum.configureVertexForPoint(vP, halfEdgeP, faceP, faceR);
    var vertexQ = Skyum.configureVertexForPoint(vQ, halfEdgeQ, faceQ, faceP);

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
 * @param {Vector} Q center for face of point Q
 * @param {Vector} R center for face of point R
 * @param {Vector} vQ coordinates of one vertex of the Voronoi edge separating
 *                  Q and R
 * @param {Vector} vR coordinates of other vertex of the Voronoi edge separating
 *                  Q and R
 */
Skyum.createPartialEdgeListForLine = function(Q, R, vQ, vR) {
    var halfEdgeR = Skyum.voronoiDiagram.getNewHalfEdgePair();
    
    var faceQ = Skyum.configureFaceForPoint(Q, halfEdgeR.twin);
    var faceR = Skyum.configureFaceForPoint(R, halfEdgeR);

    var vertexQ = Skyum.configureVertexForPoint(vQ, halfEdgeR.twin, faceQ,
            faceR);
    var vertexR = Skyum.configureVertexForPoint(vR, halfEdgeR, faceR, faceQ);
        
    halfEdgeR.origin = vertexR;
    halfEdgeR.incidentFace = faceR;
    halfEdgeR.twin.origin = vertexQ;
    halfEdgeR.twin.incidentFace = faceQ;    
};

/**
 * Setup the face for a given center and outer component.
 * 
 * @param {Vector} center of the face
 * @param {HalfEdge} outerComponent of the face
 */
Skyum.configureFaceForPoint = function(center, outerComponent) {
    var face = Skyum.voronoiDiagram.getFace(center);
    
    if (face === null) {
        face = Skyum.voronoiDiagram.getNewFace();
        face.center = center;
        face.outerComponent = outerComponent;
    }
    return face;
};

/**
 * Set up the vertex for given coordinates, incident edge, and two faces
 * separated by the incident edge.
 * 
 * @param {Vector} coordinates of vertex
 * @param {HalfEdge} incidentEdge of vertex
 * @param {Face} face1 separated from face2 by incident edge
 * @param {Face} face2 separated from face1 by incident edge
 */
Skyum.configureVertexForPoint = function(coordinates, incidentEdge, face1,
        face2) {
    var vertex = Skyum.voronoiDiagram.getVertex(coordinates);

    if (vertex === null) {
        vertex = Skyum.voronoiDiagram.getNewVertex();
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
