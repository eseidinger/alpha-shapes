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
     * A finite line.
     *
     * @param {alphashape.geom.Vector} start
     * @param {alphashape.geom.Vector} end
     * @constructor
     * @extends {alphashape.geom.PathElement}
     */
    alphashape.geom.LineSegment = function(start, end) {
        /**
         * @const
         * @type  {alphashape.geom.Vector}
         */
        this.start = start;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.end = end;
        /**
         * @const
         * @type  {alphashape.geom.Vector}
         */
        this.direction = end.sub(start);
        /**
         * @const
         * @type {string}
         */
        this.pathType = 'line';
    };

    alphashape.geom.LineSegment.prototype = {
        constructor: geom.LineSegment,

        /**
         * Checks if a given line segment equals this line segment including direction.
         *
         * @param {alphashape.geom.LineSegment} lineSegment to compare with
         * @returns {boolean}
         */
        equals: function(lineSegment) {
            if (this.start.equals(lineSegment.start) && this.end.equals(lineSegment.end)) {
                return true;
            }
            return false;
        },
        /**
         * Defines an order on line segments. Two line segments are considered equal, if their start and endpoints are
         * equal. Line segments are compared first by their start, then by their endpoints.
         *
         * @param {alphashape.geom.LineSegment} other line segment to compare with
         * @returns {number} 0 if line segments are equal, -1 if this is less than the other, 1 if the other is less than this
         */
        compareTo: function(other) {
            var comp = this.start.compareTo(other.start);
            if (comp !== 0) {
                return comp;
            }
            return this.end.compareTo(other.end);
        },
        /**
         * Center of this line segment.
         *
         * @returns {alphashape.geom.Vector} point vector of center
         */
        getCenter: function() {
            return this.start.add(this.direction.multiplyScalar(0.5));
        },
        /**
         * Length of this line segment.
         *
         * @returns {number} length of this line segment
         */
        getLength: function() {
            return this.direction.abs();
        },
        /**
         * Projection of a point p on this line segment.
         *
         * @param {alphashape.geom.Vector} p point vector
         * @returns {?alphashape.geom.Vector} projection of p on this line segment
         */
        pointProjection: function(p) {
            var line = new geom.Line(this.start, this.direction);
            var projection = line.pointProjection(p);
            if (projection === null) {
                return null;
            }
            if (this.containsPoint(projection)) {
                return projection;
            } else {
                return null;
            }
        },
        /**
         * Checks whether or not a point is contained in this line segment.
         *
         * @param {alphashape.geom.Vector} point point vector
         * @returns {boolean} true if p is contained, false otherwise
         */
        containsPoint: function(point) {
            var line = new geom.Line(this.start, this.direction);
            var lambda = line.calculateLambda(point);
            if (lambda === null) {
                return false;
            } else {
                return (util.comparator.compareWithTolerance(lambda, 0) !== -1) &&
                    (util.comparator.compareWithTolerance(lambda, 1) !== 1);
            }
        },
        /**
         * Calculates the intersection with another line segment.
         *
         * @param {alphashape.geom.LineSegment} line to intersect with
         * @returns {?alphashape.geom.Vector} intersection, if existing
         */
        getIntersection: function(line) {
            var line1 = new geom.Line(this.start, this.direction);
            var line2 = new geom.Line(line.start, line.direction);

            var intersection = line1.getIntersection(line2);
            if (intersection !== null) {
                if (this.containsPoint(intersection) && line.containsPoint(intersection)) {
                    return intersection;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        /**
         * Calculate the minimal distance of a point to this line segment.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {number}
         */
        getMinDist: function(point) {
            var proj = this.pointProjection(point);
            if (proj !== null) {
                return proj.sub(point).abs();
            }
            var dist1 = this.start.sub(point).abs();
            var dist2 = this.end.sub(point).abs();
            return Math.min(dist1, dist2);
        },
        /**
         * Calculate the maximum distance of a point to this line segment.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {number}
         */
        getMaxDist: function(point) {
            var dist1 = this.start.sub(point).abs();
            var dist2 = this.end.sub(point).abs();
            return Math.max(dist1, dist2);
        },
        /**
         * Creates a new line segment with a starting point which is less than the endpoint according to Vector order.
         *
         * @returns {alphashape.geom.LineSegment}
         */
        sortedEndpoints: function() {
            var endpoints = [this.start, this.end];
            endpoints = util.array.sort(endpoints);
            return new geom.LineSegment(endpoints[0], endpoints[1]);
        },
        crop: function(rect) {
            var point1 = this.start;
            var point2 = this.end;

            if (rect.containsPoint(point1) && rect.containsPoint(point2)) {
                return new geom.LineSegment(point1, point2);
            } else if (rect.containsPoint(point1) && !rect.containsPoint(point2)) {
                var ints = rect.getIntersections(this);
                return new geom.LineSegment(point1, ints[0]);
            } else if (!rect.containsPoint(point1) && rect.containsPoint(point2)) {
                ints = rect.getIntersections(this);
                return new geom.LineSegment(ints[0], point2);
            } else {
                ints = rect.getIntersections(this);
                if (ints.length === 2) {
                    return new geom.LineSegment(ints[0], ints[1]);
                } else {
                    return null;
                }
            }
        }
    };

})(alphashape.geom, alphashape.util);
