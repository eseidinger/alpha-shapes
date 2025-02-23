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
     * A triangle.
     *
     * @param {alphashape.geom.Vector} p1 point vector of corner
     * @param {alphashape.geom.Vector} p2 point vector of corner
     * @param {alphashape.geom.Vector} p3 point vector of corner
     * @constructor
     */
    alphashape.geom.Triangle = function(p1, p2, p3) {
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.p1 = p1;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.p2 = p2;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.p3 = p3;

        /**
         * @private
         * @type {?alphashape.geom.Circle}
         */
        this.circumcircle = null;

        /**
         * @private
         * @type {?number}
         */
        this.angle = null;
    };

    alphashape.geom.Triangle.prototype = {
        constructor: geom.Triangle,
        /**
         * Calculate circumcircle.
         *
         * @private
         * @returns {alphashape.geom.Circle} circumcircle
         */
        calcCircumcircle: function() {
            var center;
            var radius;
            var det = geom.Vector.calcDet(this.p1, this.p2, this.p3);
            if (util.comparator.compareWithTolerance(det, 0) !== 0) {
                var numX = (Math.pow(this.p1.x, 2) + Math.pow(this.p1.y, 2)) *
                    (this.p2.y - this.p3.y) +
                    (Math.pow(this.p2.x, 2) + Math.pow(this.p2.y, 2)) *
                        (this.p3.y - this.p1.y) +
                    (Math.pow(this.p3.x, 2) + Math.pow(this.p3.y, 2)) *
                        (this.p1.y - this.p2.y);

                var numY = (Math.pow(this.p1.x, 2) + Math.pow(this.p1.y, 2)) *
                    (this.p3.x - this.p2.x) +
                    (Math.pow(this.p2.x, 2) + Math.pow(this.p2.y, 2)) *
                        (this.p1.x - this.p3.x) +
                    (Math.pow(this.p3.x, 2) + Math.pow(this.p3.y, 2)) *
                        (this.p2.x - this.p1.x);

                var denom = this.p1.y * (this.p3.x - this.p2.x) + this.p2.y *
                    (this.p1.x - this.p3.x) + this.p3.y *
                    (this.p2.x - this.p1.x);

                var x = 0.5 * numX / denom;
                var y = 0.5 * numY / denom;

                center = new geom.Vector(x, y);

                radius = this.p1.dist(this.p2) * this.p2.dist(this.p3) * this.p3.dist(this.p1) /(2 * Math.abs(det));
            } else {
                var ls1 = new geom.LineSegment(this.p1, this.p2);
                var ls2 = new geom.LineSegment(this.p1, this.p3);
                var ls3 = new geom.LineSegment(this.p2, this.p3);
                var ls = [ls1, ls2, ls3];
                ls.sort(function(ls1, ls2) {
                    return util.comparator.compare(ls1.getLength(), ls2.getLength());
                });
                center = ls[2].getCenter();
                radius = ls[2].getLength()/2;
            }
            return new geom.Circle(center, radius);
        },

        /**
         * Circumcircle.
         *
         * @returns {alphashape.geom.Circle} circumcircle of this triangle
         */
        getCircumcircle: function() {
            if (this.circumcircle === null) {
                this.circumcircle = this.calcCircumcircle();
            }
            return this.circumcircle;
        },

        /**
         * Calculates the Angle <p1, p2, p3>
         *
         * @returns {number} angle <p1, p2, p3>
         */
        getMiddleAngle: function() {
            if (this.angle === null) {
                var num = this.p1.distSquare(this.p2) + this.p2.distSquare(this.p3) - this.p1.distSquare(this.p3);
                var denom = 2 * this.p1.dist(this.p2) * this.p2.dist(this.p3);
                if (util.comparator.compareWithTolerance(denom, 0) === 0) {
                    this.angle = Math.PI;
                } else {
                    this.angle = Math.acos(num / denom);
                }
            }
            return this.angle;
        },

        /**
         * Checks whether a point is a corner of this triangle.
         *
         * @param {alphashape.geom.Vector} p point vector
         * @returns {boolean} true if p is a corner of this triangle,
         *                      false otherwise
         */
        isCorner: function(p) {
            return this.p1.equals(p) || this.p2.equals(p) || this.p3.equals(p);
        },

        /**
         * Returns an array of line segments describing this triangle.
         *
         * @returns {Array.<alphashape.geom.LineSegment>}
         */
        getLineSegments: function() {
            return [new geom.LineSegment(this.p1, this.p2), new geom.LineSegment(this.p2, this.p3),
                new geom.LineSegment(this.p3, this.p1)];
        }
    };

    /**
     * Defines an order on triangles. Triangles are compared by circumcircle radius then by angle <p1, p2, p3>.
     *
     * @param {alphashape.geom.Triangle} t1 triangle
     * @param {alphashape.geom.Triangle} t2 triangle
     * @returns {number} 0 if t1 == t2, -1 if t1 < t2, 1 if t1 > t2
     */
    alphashape.geom.Triangle.compare = function(t1, t2) {
        var compR = util.comparator.compareWithTolerance(t1.getCircumcircle().radius,
            t2.getCircumcircle().radius);
        if (compR !== 0) {
            return compR;
        } else {
            return util.comparator.compareWithTolerance(t1.getMiddleAngle(),
                t2.getMiddleAngle());
        }
    };
})(alphashape.geom, alphashape.util);

