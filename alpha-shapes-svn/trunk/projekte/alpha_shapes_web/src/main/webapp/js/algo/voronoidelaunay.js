'use strict';

/**
 * Represents two neighbouring Voronoi cells as a geometric type.
 * 
 * @constructor
 * @param {LineSegment} delaunayEdge connecting Delaunay edge
 * @param {LineSegment} commonBorder separating Voronoi edge
 */
function VoronoiNeighbours(delaunayEdge, commonBorder) {
    this.delaunayEdge = delaunayEdge;
    this.commonBorder = commonBorder;
};


VoronoiNeighbours.prototype = {
    constructor: VoronoiNeighbours,
    /**
     * Calculate the minimum distance of the Voronoi cells' centers to the
     * Voronoi edge separating the centers.
     * 
     * @returns {number}
     */
    getMinDist: function() {
        return this.commonBorder.getMinDist(this.delaunayEdge.origin);
    },
    /**
     * Calculate the maximum distance of the Voronoi cells' centers to the
     * Voronoi edge separating the centers.
     * 
     * @returns {number}
     */
    getMaxDist: function() {
        return this.commonBorder.getMaxDist(this.delaunayEdge.origin);
    },
    /**
     * Check Voronoi neighbours for equality with this Voronoi neighbours.
     * 
     * @param {VoronoiNeighbours} voronoiNeighbours to check for equality
     * @returns {boolean} true if Voronoi neighbours are equal, false otherwise
     */
    equals: function(voronoiNeighbours) {
        return this.delaunayEdge.equals(voronoiNeighbours.delaunayEdge) &&
                this.commonBorder.equals(voronoiNeighbours.commonBorder);
    }
};

/**
 * Represents a Voronoi cell as a geometric type.
 * 
 * @constructor
 * @param {Vector} center
 */
function VoronoiCell(center) {
    this.center = center;
    /**
     * @type Array.<LineSegment>
     */
    this.borders = [];
};

VoronoiCell.prototype = {
    constructor: VoronoiCell,
            
    /**
     * Add a border to the Voronoi cell.
     * 
     * @param {LineSegment} border
     */
    addBorder: function(border) {
        this.borders.push(border);
    },
    /**
     * Calculate the minimum distance of the center of the cell to its borders.
     * 
     * @returns {number}
     */
    getMinDist: function() {
        var dists = [];
        var center = this.center;
        this.borders.forEach(function(border) {
            var dist = border.getMinDist(center);
            dists.push(dist);
        });
        dists.sort(Misc.compare);
        return dists[0];
    },
    /**
     * Calculate the maximum distance of the center of the cell to its borders.
     * 
     * @returns {number}
     */
    getMaxDist: function() {
        var dists = [];
        var center = this.center;
        this.borders.forEach(function(border) {
            var dist = border.getMaxDist(center);
            dists.push(dist);
        });
        dists.sort(function(a,b) {
            return -1 * Misc.compare(a,b);
        });
        return dists[0];
    }
};

/**
 * Evaluation of a Voronoi diagram
 * 
 * @constructor
 */
function VoronoiDelaunay() {
};

/**
 * Compute the Delaunay graph from a given Voronoi diagram.
 * 
 * @param {EdgeList} voronoiDiagram to compute Delaunay graph from
 * @returns {EdgeList} dual Delaunay graph
 */
VoronoiDelaunay.computeDelaunay = function(voronoiDiagram) {
    var delaunay = new EdgeList();

    voronoiDiagram.faces.forEach(function(face) {
        if (face.outerComponent !== null) {
            var startingEdge = face.outerComponent.getStart();
            var curEdge = startingEdge;
            var origin = delaunay.getVertex(curEdge.incidentFace.center);
            if (origin === null) {
                origin = delaunay.getNewVertex();
                origin.coordinates = curEdge.incidentFace.center;
            }
            do {
                var twinOriginCoordinates = curEdge.twin.incidentFace.center;
                var existingHalfEdge = delaunay.getHalfEdge(origin.coordinates,
                        twinOriginCoordinates);
                if (existingHalfEdge === null) {
                    var twinOrigin = delaunay.getVertex(twinOriginCoordinates);
                    if (twinOrigin === null) {
                        twinOrigin = delaunay.getNewVertex();
                        twinOrigin.coordinates = twinOriginCoordinates;
                    }
                    var delEdge = delaunay.getNewHalfEdgePair();
                    delEdge.origin = origin;
                    delEdge.twin.origin = twinOrigin;
                }
                curEdge = curEdge.next;
            } while ((curEdge !== null) && (curEdge !== startingEdge))
        }
    });

    return delaunay;
};

/**
 * Compute the Voronoi neighbours from a given Voronoi diagram
 * 
 * @param {EdgeList} voronoiDiagram
 * @returns {Array.<VoronoiNeighbours>}
 */
VoronoiDelaunay.computeVoronoiNeighbours = function(voronoiDiagram) {
    var voronoiNeighboursArray = [];    
    var halfEdgesHandled = [];
    
    voronoiDiagram.halfEdges.forEach(function(halfEdge) {
        if (halfEdgesHandled.indexOf(halfEdge) === -1) {
            halfEdgesHandled.push(halfEdge);
            halfEdgesHandled.push(halfEdge.twin);
            var delaunayCoordinates1 = halfEdge.incidentFace.center;
            var delaunayCoordinates2 = halfEdge.twin.incidentFace.center;
            var voronoiCoordinates1 = halfEdge.origin.coordinates;
            var voronoiCoordinates2 = halfEdge.twin.origin.coordinates;
            var voronoiEdge = LineSegment.createFromPoints(voronoiCoordinates1,
                    voronoiCoordinates2);
            var delaunayEdge = LineSegment.createFromPoints(
                    delaunayCoordinates1, delaunayCoordinates2);
            var voronoiNeighbours = new VoronoiNeighbours(delaunayEdge,
                    voronoiEdge);
            voronoiNeighboursArray.push(voronoiNeighbours);
        }
    });

    return voronoiNeighboursArray;
};

/**
 * Compute the Voronoi cells from a given Voronoi diagram
 * 
 * @param {EdgeList} voronoiDiagram
 * @returns {Array.<VoronoiCell>}
 */
VoronoiDelaunay.computeVoronoiCells = function(voronoiDiagram) {
    var voronoiCellArray = [];

    voronoiDiagram.faces.forEach(function(face) {
        if (face.outerComponent !== null) {
            var voronoiCell = new VoronoiCell(face.center);
            var startingEdge = face.outerComponent.getStart();
            var curEdge = startingEdge;
            do {
                var voronoiCoordinates1 = curEdge.origin.coordinates;
                var voronoiCoordinates2 = curEdge.twin.origin.coordinates;
                var voronoiEdge = LineSegment.createFromPoints(voronoiCoordinates1,
                        voronoiCoordinates2);
                voronoiCell.addBorder(voronoiEdge);
                curEdge = curEdge.next;
            } while ((curEdge !== null) && (curEdge !== startingEdge))
            voronoiCellArray.push(voronoiCell);
        }
    });

    return voronoiCellArray;
};
