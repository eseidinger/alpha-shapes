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
     * An infinite line.
     *
     * @param {alphashape.geom.Vector} origin point on line
     * @param {alphashape.geom.Vector} direction of line
     * @constructor
     */
    alphashape.geom.Line = function(origin, direction) {
        /**
         * @const
         * @type alphashape.geom.Vector
         */
        this.origin = origin;
        /**
         * @const
         * @type alphashape.geom.Vector
         */
        this.direction = direction;
    };
    var Line = alphashape.geom.Line;

    alphashape.geom.Line.prototype = {
        constructor: Line,

        /**
         * Projection of a point on this line.
         *
         * @param {alphashape.geom.Vector} point point vector
         * @returns {?alphashape.geom.Vector} projection of point on this line or null if not
         *                      existent
         */
        pointProjection: function(point) {
            var nullVect = new geom.Vector(0,0);
            if (this.direction.equals(nullVect)) {
                return null;
            }
            else {
                return this.origin.add(this.direction.
                    multiplyScalar(point.sub(this.origin).
                        multiplyVector(this.direction) /
                        this.direction.abssquare()));
            }
        },

        /**
         * Calculates the factor lambda needed to multiply with directional vector
         * of this line to reach point from origin of this line.
         *
         * @param {alphashape.geom.Vector} point to reach
         * @returns {?number} lambda or null if not existent
         */
        calculateLambda: function(point) {
            var nullVect = new geom.Vector(0,0);
            // Point
            if (this.direction.equals(nullVect)) {
                if (!this.origin.equals(point)) {
                    return null;
                } else {
                    return 0;
                }
                // Parallel to y-Axis
            } else if ((util.comparator.compareWithTolerance(this.direction.x, 0) === 0)) {
                if (util.comparator.compareWithTolerance(this.origin.x, point.x) !== 0) {
                    return null;
                }
                var lambda = (point.y - this.origin.y) / this.direction.y;
                return lambda;
                // Parallel to x-Axis
            } else if ((util.comparator.compareWithTolerance(this.direction.y, 0) === 0)) {
                if (util.comparator.compareWithTolerance(this.origin.y, point.y) !== 0) {
                    return null;
                }
                lambda = (point.x - this.origin.x) / this.direction.x;
                return lambda;
                // General
            } else {
                var lambda1 = (point.x - this.origin.x) / this.direction.x;
                var lambda2 = (point.y - this.origin.y) / this.direction.y;
                if (util.comparator.compareWithTolerance(lambda1, lambda2) !== 0) {
                    return null;
                } else {
                    return lambda1;
                }
            }
        },

        /**
         * Checks whether a point is contained on this line or not.
         *
         * @param {alphashape.geom.Vector} point to check if it is contained
         * @returns {boolean} true if point is contained, false otherwise
         */
        containsPoint: function(point) {
            var lambda = this.calculateLambda(point);
            if (lambda !== null) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * Determines the intersection of this line with another line.
         *
         * @param {alphashape.geom.Line} line to create intersection with
         * @returns {?alphashape.geom.Vector} intersection or null if not existent
         */
        getIntersection: function(line) {
            var directionSum = this.direction.normalize().
                add(line.direction.normalize());
            var nullVect = new geom.Vector(0,0);
            var doubleDir = this.direction.normalize().multiplyScalar(2);

            // Points
            if (line.direction.equals(nullVect) || this.direction.equals(nullVect)) {
                if (line.origin.equals(this.origin)) {
                    return line.origin;
                } else {
                    return null;
                }
            }

            // Parallels
            if (directionSum.equals(nullVect) || directionSum.equals(doubleDir)) {
                return null;
            }

            // calculate lambda
            if (util.comparator.compareWithTolerance(line.direction.x, 0) !== 0) {
                var num = line.origin.y + (this.origin.x - line.origin.x) *
                    line.direction.y / line.direction.x - this.origin.y;
                var denom = this.direction.y - this.direction.x * line.direction.y /
                    line.direction.x;
                var lambda = num / denom;
            } else {
                lambda = (line.origin.x - this.origin.x) / this.direction.x;
            }

            return this.origin.add(this.direction.multiplyScalar(lambda));
        }
    };

})(alphashape.geom, alphashape.util);
