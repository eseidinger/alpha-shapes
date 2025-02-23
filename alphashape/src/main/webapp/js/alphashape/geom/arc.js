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

(function(geom) {

    /**
     * A circular arc.
     *
     * @param {alphashape.geom.Vector} center
     * @param {alphashape.geom.Vector} start
     * @param {alphashape.geom.Vector} end
     * @param {boolean} clockwise (screen coordinates)
     * @constructor
     * @extends {alphashape.geom.PathElement}
     */
    alphashape.geom.Arc = function(center, start, end, clockwise) {
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.center = center;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.start = start;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.end = end;
        /**
         * @const
         * @type {number}
         */
        this.startAngle = geom.Arc.calcAngle(center, start);
        /**
         * @const
         * @type {number}
         */
        this.endAngle = geom.Arc.calcAngle(center, end);
        /**
         * @const
         * @type {boolean}
         */
        this.clockwise = clockwise;
        /**
         * @const
         * @type {string}
         */
        this.pathType = 'arc';
        /**
         * @const
         * @type {number}
         */
        this.radius = this.center.sub(this.start).abs();
    };

    /**
     * Calculate the clockwise angle of a point on the arc to the leftmost point on the arc's circle.
     *
     * @param center of the arc
     * @param point on the arc
     * @returns {number}
     */
    alphashape.geom.Arc.calcAngle = function(center, point) {
        var angle = point.sub(center).getAngle();
        if (angle < 0) {
            angle = 2*Math.PI + angle;
        }
        return angle;
    };

    alphashape.geom.Arc.prototype = {
        constructor: geom.Arc,

        /**
         * Determines the middle of the arc.
         * @returns {alphashape.geom.Vector} middle of arc
         */
        arcMiddle: function() {
            if (this.clockwise) {
                var angleDiff = this.endAngle - this.startAngle;
            } else {
                angleDiff = this.startAngle - this.endAngle;
            }
            if (angleDiff < 0) {
                angleDiff = angleDiff + 2*Math.PI;
            }
            if (this.clockwise) {
                var vector = this.start.sub(this.center);
                var middleVector = vector.rotate(angleDiff / 2);
            } else {
                vector = this.end.sub(this.center);
                middleVector = vector.rotate(angleDiff / 2);
            }
            return middleVector.add(this.center);
        },

        /**
         * Determines whether this arc lies in a given rectangle.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {boolean}
         */
        liesInRectangle: function(rect) {
            return rect.containsPoint(this.start) && rect.containsPoint(this.end) &&
                rect.containsPoint(this.arcMiddle());
        },

        /**
         * Checks two arcs for equality.
         *
         * @param {alphashape.geom.Arc} arc
         * @returns {boolean} true if arcs are equal, false otherwise
         */
        equals: function(arc) {
            if (this.center.equals(arc.center)) {
                if (this.start.equals(arc.start) && this.end.equals(arc.end)) {
                    return this.clockwise === arc.clockwise;
                } else if (this.start.equals(arc.end) && this.end.equals(arc.start)) {
                    return this.clockwise !== arc.clockwise;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    };

})(alphashape.geom);
