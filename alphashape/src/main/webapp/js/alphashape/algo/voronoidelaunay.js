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

(function(algo, util, geom, ds) {
    /**
     * Represents two neighbouring Voronoi cells as a geometric type.
     *
     * @constructor
     * @param {alphashape.geom.LineSegment} delaunayEdge connecting Delaunay edge
     * @param {alphashape.geom.LineSegment} commonBorder separating Voronoi edge
     */
    alphashape.algo.VoronoiNeighbours = function(delaunayEdge, commonBorder) {
        this.delaunayEdge = delaunayEdge;
        this.commonBorder = commonBorder;
    };

    alphashape.algo.VoronoiNeighbours.prototype = {
        constructor: algo.VoronoiNeighbours,
        /**
         * Calculate the minimum distance of the Voronoi cells' centers to the
         * Voronoi edge separating the centers.
         *
         * @returns {number}
         */
        getMinDist: function() {
            return this.commonBorder.getMinDist(this.delaunayEdge.start);
        },
        /**
         * Calculate the maximum distance of the Voronoi cells' centers to the
         * Voronoi edge separating the centers.
         *
         * @returns {number}
         */
        getMaxDist: function() {
            return this.commonBorder.getMaxDist(this.delaunayEdge.start);
        },
        /**
         * Check Voronoi neighbours for equality with this Voronoi neighbours.
         *
         * @param {alphashape.algo.VoronoiNeighbours} voronoiNeighbours to check for equality
         * @returns {boolean} true if Voronoi neighbours are equal, false otherwise
         */
        equals: function(voronoiNeighbours) {
            return this.delaunayEdge.sortedEndpoints().equals(voronoiNeighbours.delaunayEdge.sortedEndpoints()) &&
                this.commonBorder.sortedEndpoints().equals(voronoiNeighbours.commonBorder.sortedEndpoints());
        }
    };

    /**
     * Represents a Voronoi cell as a geometric type.
     *
     * @constructor
     * @param {alphashape.geom.Vector} center
     */
    alphashape.algo.VoronoiCell = function(center) {
        /**
         * @type {alphashape.geom.Vector}
         */
        this.center = center;
        /**
         * @type Array.<alphashape.geom.LineSegment>
         */
        this.borders = [];
    };

    alphashape.algo.VoronoiCell.prototype = {
        constructor: algo.VoronoiCell,

        /**
         * Add a border to the Voronoi cell.
         *
         * @param {alphashape.geom.LineSegment} border
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
            dists.sort(util.comparator.compare);
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
                return -1 * util.comparator.compare(a,b);
            });
            return dists[0];
        }
    };

    /**
     * Evaluation of a Voronoi diagram
     *
     * @constructor
     */
    alphashape.algo.VoronoiDelaunay = function() {};
    var VoronoiDelaunay = alphashape.algo.VoronoiDelaunay;

    /**
     * Compute the Delaunay graph from a given Voronoi diagram.
     *
     * @param {alphashape.ds.EdgeList} voronoiDiagram to compute Delaunay graph from
     * @returns {alphashape.ds.EdgeList} dual Delaunay graph
     */
    alphashape.algo.VoronoiDelaunay.computeDelaunay = function(voronoiDiagram) {
        var delaunay = new ds.EdgeList();

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
     * @param {alphashape.ds.EdgeList} voronoiDiagram
     * @returns {Array.<alphashape.algo.VoronoiNeighbours>}
     */
    alphashape.algo.VoronoiDelaunay.computeVoronoiNeighbours = function(voronoiDiagram) {
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
                var voronoiEdge = new geom.LineSegment(voronoiCoordinates1,
                    voronoiCoordinates2);
                var delaunayEdge = new geom.LineSegment(
                    delaunayCoordinates1, delaunayCoordinates2);
                var voronoiNeighbours = new algo.VoronoiNeighbours(delaunayEdge,
                    voronoiEdge);
                voronoiNeighboursArray.push(voronoiNeighbours);
            }
        });

        return voronoiNeighboursArray;
    };

    /**
     * Compute the Voronoi cells from a given Voronoi diagram
     *
     * @param {alphashape.ds.EdgeList} voronoiDiagram
     * @returns {Array.<alphashape.algo.VoronoiCell>}
     */
    alphashape.algo.VoronoiDelaunay.computeVoronoiCells = function(voronoiDiagram) {
        var voronoiCellArray = [];

        voronoiDiagram.faces.forEach(function(face) {
            if (face.outerComponent !== null) {
                var voronoiCell = new algo.VoronoiCell(face.center);
                var startingEdge = face.outerComponent.getStart();
                var curEdge = startingEdge;
                do {
                    var voronoiCoordinates1 = curEdge.origin.coordinates;
                    var voronoiCoordinates2 = curEdge.twin.origin.coordinates;
                    var voronoiEdge = new geom.LineSegment(voronoiCoordinates1,
                        voronoiCoordinates2);
                    voronoiCell.addBorder(voronoiEdge);
                    curEdge = curEdge.next;
                } while ((curEdge !== null) && (curEdge !== startingEdge));
                voronoiCellArray.push(voronoiCell);
            }
        });

        return voronoiCellArray;
    };
})(alphashape.algo, alphashape.util, alphashape.geom, alphashape.ds);
