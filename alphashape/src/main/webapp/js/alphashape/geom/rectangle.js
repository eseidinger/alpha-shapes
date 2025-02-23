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

(function(geom, util) {
    /**
     * A rectangle.
     *
     * @constructor
     * @param {number} xMin minimum x coordinate
     * @param {number} yMin minimum y coordinate
     * @param {number} xMax maximum x coordinate
     * @param {number} yMax maximum y coordinate
     */
    alphashape.geom.Rectangle = function(xMin, yMin, xMax, yMax) {
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;

        /**
         * @const
         * @type Array.<alphashape.geom.Vector>
         */
        this.points = [];
        this.points[0] = new geom.Vector(xMin, yMin);
        this.points[1] = new geom.Vector(xMax, yMin);
        this.points[2] = new geom.Vector(xMax, yMax);
        this.points[3] = new geom.Vector(xMin, yMax);

        /**
         * @const
         * @type Array.<alphashape.geom.LineSegment>
         */
        this.lineSegments = [];
        this.lineSegments[0] = new geom.LineSegment(this.points[0], this.points[1]);
        this.lineSegments[1] = new geom.LineSegment(this.points[1], this.points[2]);
        this.lineSegments[2] = new geom.LineSegment(this.points[2], this.points[3]);
        this.lineSegments[3] = new geom.LineSegment(this.points[3], this.points[0]);
    };

    alphashape.geom.Rectangle.prototype = {
        constructor: geom.Rectangle,

        /**
         * Calculate intersecting points of a line segment with this rectangle in clockwise (screen coordinates)
         * orientation.
         *
         * @param {alphashape.geom.LineSegment} line
         * @returns {Array.<alphashape.geom.Vector>} intersecting points with rectangle
         */
        getIntersections: function(line) {
            var ints = this.lineSegments.map(function(ls) {return ls.getIntersection(line)}).
                filter(function(inter) { return inter !== null});
            ints = util.array.makeElementsUnique(ints);

            return ints;
        },

        /**
         * Determines if a point lies in this rectangle.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {boolean} true if point lies in rectangle, false otherwise
         */
        containsPoint: function(point) {
            if ((util.comparator.compareWithTolerance(point.x, this.xMin) != -1) &&
                (util.comparator.compareWithTolerance(point.x, this.xMax) != 1) &&
                (util.comparator.compareWithTolerance(point.y, this.yMin) != -1) &&
                (util.comparator.compareWithTolerance(point.y, this.yMax) != 1)) {
                return true;
            }
            return false;
        },

        /**
         * Determines the minimum distance of a point from a border of this rectangle.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {number} absolute minimum distance from border
         */
        getMinimumDistanceFromBorder: function(point) {
            var dists = [];
            dists.push(Math.abs(point.x - this.xMin));
            dists.push(Math.abs(point.x - this.xMax));
            dists.push(Math.abs(point.y - this.yMin));
            dists.push(Math.abs(point.y - this.yMax));

            dists.sort(util.comparator.compare);
            return dists[0];
        },

        /**
         * Determines the maximum distance of a point from a border of this rectangle.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {number} absolute minimum distance from border
         */
        getMaximumDistanceFromBorder: function(point) {
            var dists = this.points.map(function(p){return p.sub(point).abs();});
            dists.sort(util.comparator.compare);
            return dists[3];
        },

        /**
         * Crops a line segment to fit in rectangle.
         *
         * @param {alphashape.geom.LineSegment} lineSegment
         * @returns {alphashape.geom.LineSegment|null}
         */
        cropLineSegment: function(lineSegment) {
            var point1 = lineSegment.start;
            var point2 = lineSegment.end;

            if (this.containsPoint(point1) && this.containsPoint(point2)) {
                return lineSegment;
            } else if (this.containsPoint(point1) && !this.containsPoint(point2)) {
                var ints = this.getIntersections(lineSegment);
                return new geom.LineSegment(point1, ints[0]);
            } else if (!this.containsPoint(point1) && this.containsPoint(point2)) {
                ints = this.getIntersections(lineSegment);
                return new geom.LineSegment(ints[0], point2);
            } else {
                ints = this.getIntersections(lineSegment);
                if (ints.length === 2) {
                    return new geom.LineSegment(ints[0], ints[1]);
                } else {
                    return null;
                }
            }
        },

        /**
         * Determines whether a point lies on the border of this rectangle.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {boolean} true if point lies on border, false otherwise
         */
        liesOnBorder: function(point) {
            var result = false;
            this.lineSegments.forEach(function(border) {
                if (border.containsPoint(point)) {
                    result = true;
                }
            });
            return result;
        },

        /**
         * Determines a clockwise (screen coordinates) path on this rectangle from a given start to a given end point.
         *
         * @param {alphashape.geom.Vector} start
         * @param {alphashape.geom.Vector} end
         * @returns {Array.<alphashape.geom.Vector>} line segments representing path
         */
        getPathOnBorder: function(start, end) {
            var path = [];
            var points = [];
            if (this.liesOnBorder(start) && this.liesOnBorder(end)) {
                points.push(start);
                if (util.comparator.compareWithTolerance(start.x, this.xMin) === 0) {
                    if ((util.comparator.compareWithTolerance(end.x, this.xMin) === 0) &&
                        (util.comparator.compareWithTolerance(start.y, end.y) === 1)) {
                        points.push(end);
                    } else {
                        points.push(this.points[0]);
                        if (util.comparator.compareWithTolerance(end.y, this.yMin) === 0) {
                            points.push(end);
                        } else {
                            points.push(this.points[1]);
                            if (util.comparator.compareWithTolerance(end.x, this.xMax) === 0) {
                                points.push(end);
                            } else {
                                points.push(this.points[2]);
                                if (util.comparator.compareWithTolerance(end.y, this.yMax) === 0) {
                                    points.push(end);
                                } else {
                                    points.push(this.points[3]);
                                    points.push(end);
                                }
                            }
                        }
                    }
                } else if (util.comparator.compareWithTolerance(start.y, this.yMin) === 0) {
                    if ((util.comparator.compareWithTolerance(end.y, this.yMin) === 0) &&
                        (util.comparator.compareWithTolerance(end.x, start.x) === 1)) {
                        points.push(end);
                    } else {
                        points.push(this.points[1]);
                        if (util.comparator.compareWithTolerance(end.x, this.xMax) === 0) {
                            points.push(end);
                        } else {
                            points.push(this.points[2]);
                            if (util.comparator.compareWithTolerance(end.y, this.yMax) === 0) {
                                points.push(end);
                            } else {
                                points.push(this.points[3]);
                                if (util.comparator.compareWithTolerance(end.x, this.xMin) === 0) {
                                    points.push(end);
                                } else {
                                    points.push(this.points[0]);
                                    points.push(end);
                                }
                            }
                        }
                    }
                } else if (util.comparator.compareWithTolerance(start.x, this.xMax) === 0) {
                    if ((util.comparator.compareWithTolerance(end.x, this.xMax) === 0) &&
                        (util.comparator.compareWithTolerance(end.y, start.y) === 1)) {
                        points.push(end);
                    } else {
                        points.push(this.points[2]);
                        if (util.comparator.compareWithTolerance(end.y, this.yMax) === 0) {
                            points.push(end);
                        } else {
                            points.push(this.points[3]);
                            if (util.comparator.compareWithTolerance(end.x, this.xMin) === 0) {
                                points.push(end);
                            } else {
                                points.push(this.points[0]);
                                if (util.comparator.compareWithTolerance(end.y, this.yMin) === 0) {
                                    points.push(end);
                                } else {
                                    points.push(this.points[1]);
                                    points.push(end);
                                }
                            }
                        }
                    }
                } else if (util.comparator.compareWithTolerance(start.y, this.yMax) === 0) {
                    if ((util.comparator.compareWithTolerance(end.y, this.yMax) === 0) &&
                        (util.comparator.compareWithTolerance(start.x, end.x) === 1)) {
                        points.push(end);
                    } else {
                        points.push(this.points[3]);
                        if (util.comparator.compareWithTolerance(end.x, this.xMin) === 0) {
                            points.push(end);
                        } else {
                            points.push(this.points[0]);
                            if (util.comparator.compareWithTolerance(end.y, this.yMin) === 0) {
                                points.push(end);
                            } else {
                                points.push(this.points[1]);
                                if (util.comparator.compareWithTolerance(end.x, this.xMax) === 0) {
                                    points.push(end);
                                } else {
                                    points.push(this.points[2]);
                                    points.push(end);
                                }
                            }
                        }
                    }
                }
            }
            points = util.array.makeElementsUnique(points);
            return points;
        }
    };
})(alphashape.geom, alphashape.util);
