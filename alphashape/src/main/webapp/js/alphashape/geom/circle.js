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

(function(geom, util, algo) {
    /**
     * A Circle.
     *
     * @param {alphashape.geom.Vector} center
     * @param {number} radius
     * @constructor
     * @extends {alphashape.geom.PathElement}
     */
    alphashape.geom.Circle = function(center, radius) {
        /**
         * @const
         * @type alphashape.geom.Vector
         */
        this.center = center;
        /**
         * @const
         * @type number
         */
        this.radius = radius;
        /**
         * @const
         * @type {alphashape.geom.Vector}
         */
        this.start = new geom.Vector(center.x + radius, center.y);
        /**
         * @const
         * @type string
         */
        this.pathType = 'circle';
    };

    /**
     * Create possible circles given 2 points on it and a radius.
     *
     * @param {alphashape.geom.Vector} point1 first point on circle
     * @param {alphashape.geom.Vector} point2 second point on circle
     * @param {number} radius radius of circle
     * @returns {Array.<alphashape.geom.Circle>} array containing possible circles, max 2, min 0
     */
    alphashape.geom.Circle.createWith2PointsAndRadius = function(point1, point2, radius) {
        var result = [];

        var circle1 = new geom.Circle(point1, radius);
        var circle2 = new geom.Circle(point2, radius);

        var inters = circle1.getIntersctions(circle2);
        inters.forEach(function(inter) {
            var circle = new geom.Circle(inter, radius);
            result.push(circle);
        });
        return result;
    };

    /**
     * Create circle given point on it and its center.
     *
     * @param {alphashape.geom.Vector} point on circle
     * @param {alphashape.geom.Vector} center of circle
     * @returns {alphashape.geom.Circle} circles
     */
    alphashape.geom.Circle.createWithPointAndCenter = function(point, center) {
        return new geom.Circle(center, point.dist(center));
    };

    alphashape.geom.Circle.prototype = {
        constructor: geom.Circle,

        /**
         * Checks if circle is equal to another circle.
         *
         * @param {alphashape.geom.Circle} circle
         * @returns {boolean} true if circles are equal, false otherwise
         */
        equals: function(circle) {
            return this.center.equals(circle.center) &&
                (util.comparator.compareWithTolerance(this.radius, circle.radius) === 0);
        },

        /**
         * Defines an order on circles. Compares circles first by radius then by center.
         *
         * @param {alphashape.geom.Circle} other
         * @returns {number} 0 if circles are equal, 1 if other is less than this, -1 if this is less than other
         */
        compareTo: function(other) {
            var radComp = util.comparator.compareWithTolerance(this.radius, other.radius);
            if (radComp !== 0) {
                return radComp;
            }
            return this.center.compareTo(other.center);
        },

        /**
         * Calculate the intersections of this circle and a given circle.
         *
         * @param {alphashape.geom.Circle} circle to intersect
         * @returns {Array.<alphashape.geom.Vector>} array containing intersections, max 2, min 0
         */
        getIntersctions: function(circle) {
            var result = [];

            if (this.center.x < circle.center.x) {
                var circle1 = this;
                var circle2 = circle;
            } else {
                circle1 = circle;
                circle2 = this;
            }

            var trans = circle1.center;

            circle1 = circle1.translate(trans.multiplyScalar(-1));
            circle2 = circle2.translate(trans.multiplyScalar(-1));
            var angle = circle2.center.getAngle();
            circle2 = circle2.rotateAroundOrigin(-1 * angle);

            var R = circle1.radius;
            var r = circle2.radius;
            var d = circle1.center.sub(circle2.center).abs();
            var ySquared = (Math.pow(2*d*R,2) - Math.pow((d*d - r*r + R*R),2)) /
                (4*d*d);
            var x = (d*d - r*r + R*R) / (2 * d);

            if (util.comparator.compareWithTolerance(ySquared, 0) === -1) {
                return result;
            } else if (util.comparator.compareWithTolerance(ySquared, 0) === 0) {
                var onlyInt = new geom.Vector(x,0);
                onlyInt = onlyInt.rotate(angle).add(trans);
                result.push(onlyInt);
                return result;
            }
            var y1 = Math.sqrt(ySquared);
            var y2 = -1 * y1;

            var int1 = new geom.Vector(x, y1);
            var int2 = new geom.Vector(x, y2);

            int1 = int1.rotate(angle).add(trans);
            int2 = int2.rotate(angle).add(trans);

            result.push(int1);
            result.push(int2);

            return result;
        },

        /**
         * Translate circle's center given a vector.
         *
         * @param {alphashape.geom.Vector} vector offset
         * @returns {alphashape.geom.Circle} translated circle
         */
        translate: function(vector) {
            return new geom.Circle(this.center.add(vector), this.radius);
        },

        /**
         * Rotate circle clockwise (screen coordinates) around origin.
         *
         * @param {number} angle in radians
         * @returns {alphashape.geom.Circle} rotated circle
         */
        rotateAroundOrigin: function(angle) {
            return new geom.Circle(this.center.rotate(angle), this.radius);
        },

        /**
         * Checks whether circle contains a point.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {boolean} true if point is contained
         */
        containsPoint: function(point) {
            return util.comparator.compareWithTolerance(this.center.dist(point), this.radius) !== 1;
        },

        /**
         * Calculates the intersections of this circle with a rectangle.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {Array.<{alphashape.geom.Vector}>} string representing path
         */
        getIntersectionsWithRectangle: function(rect) {
            var ints = [];

            function sqrtArg(r, coord, offset) {
                return r * r - (coord - offset) * (coord - offset);
            }
            function calcInt(r, coord, offsetCoord, offsetOther, min, max) {
                var result = [];
                var sqrtArgVal = sqrtArg(r, coord, offsetCoord);
                if (sqrtArgVal > 0) {
                    var sqrt = Math.sqrt(sqrtArgVal);
                    var res1 = sqrt + offsetOther;
                    var res2 = -sqrt + offsetOther;
                    if ((util.comparator.compareWithTolerance(res1, max) !== 1) &&
                        (util.comparator.compareWithTolerance(res1, min) !== -1)) {
                        result.push(res1);
                    }
                    if ((util.comparator.compareWithTolerance(res2, max) !== 1) &&
                        (util.comparator.compareWithTolerance(res2, min) !== -1)) {
                        result.push(res2);
                    }
                }
                return result;
            }
            var result = calcInt(this.radius, rect.xMin, this.center.x, this.center.y, rect.yMin, rect.yMax);
            result.forEach(function(y) {
                ints.push(new geom.Vector(rect.xMin, y));
            });
            result = calcInt(this.radius, rect.xMax, this.center.x, this.center.y, rect.yMin, rect.yMax);
            result.forEach(function(y) {
                ints.push(new geom.Vector(rect.xMax, y));
            });
            result = calcInt(this.radius, rect.yMin, this.center.y, this.center.x, rect.xMin, rect.xMax);
            result.forEach(function(x) {
                ints.push(new geom.Vector(x, rect.yMin));
            });
            result = calcInt(this.radius, rect.yMax, this.center.y, this.center.x, rect.xMin, rect.xMax);
            result.forEach(function(x) {
                ints.push(new geom.Vector(x, rect.yMax));
            });
            return ints;
        },

        /**
         * Checks whether this circle lies in a rectangle.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {boolean} true if this circle lies in rectangle, false otherwise
         */
        liesInRectangle: function(rect) {
            if (rect.containsPoint(this.center)) {
                return util.comparator.compareWithTolerance(this.radius,
                    rect.getMinimumDistanceFromBorder(this.center)) !== 1;
            } else {
                return false;
            }
        },

        /**
         * Checks whether this circle contains a rectangle.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {boolean} true if this circle contains rectangle, false otherwise
         */
        containsRectangle: function(rect) {
            if (rect.containsPoint(this.center)) {
                return util.comparator.compareWithTolerance(this.radius,
                    rect.getMaximumDistanceFromBorder(this.center)) === 1;
            } else {
                return false;
            }
        },

        /**
         * Crops a circle to fit a rectangle. Returns array of path elements in clockwise (screen coordinates) direction.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {Array.<alphashape.geom.Circle|alphashape.geom.Arc|alphashape.geom.LineSegment>} array representing path
         */
        crop: function(rect) {
            var path = [];
            var ints = this.getIntersectionsWithRectangle(rect);
            ints = util.array.removeDuplicates(ints);
            var intsClockwise = algo.convexhull.compute(ints);
            if (intsClockwise.length === 0) {
                if (this.liesInRectangle(rect)) {
                    path.push(this);
                } else if (this.containsRectangle(rect)) {
                    path = path.concat(rect.lineSegments);
                } else {
                    return null;
                }
            } else if (intsClockwise.length === 2) {
                var arc1 = new geom.Arc(this.center, intsClockwise[0], intsClockwise[1], true);
                var arc2 = new geom.Arc(this.center, intsClockwise[1], intsClockwise[0], true);
                if (arc1.liesInRectangle(rect)) {
                    if (arc1.radius > util.constant.INFINITY / 2) {
                        path.push(new geom.LineSegment(intsClockwise[0], intsClockwise[1]));
                    } else {
                        path.push(arc1);
                    }
                    var rectPath = rect.getPathOnBorder(intsClockwise[1], intsClockwise[0]);
                    for (var i = 0; i < rectPath.length - 1; i++) {
                        path.push(new geom.LineSegment(rectPath[i], rectPath[i+1]));
                    }
                } else if (arc2.liesInRectangle(rect)) {
                    if (arc2.radius > util.constant.INFINITY / 2) {
                        path.push(new geom.LineSegment(intsClockwise[1], intsClockwise[0]));
                    } else {
                        path.push(arc2);
                    }
                    rectPath = rect.getPathOnBorder(intsClockwise[0], intsClockwise[1]);
                    for ( i = 0; i < rectPath.length - 1; i++) {
                        path.push(new geom.LineSegment(rectPath[i], rectPath[i+1]));
                    }
                }
            } else {
                for (i = 0; i < intsClockwise.length; i++) {
                    arc1 = new geom.Arc(this.center, intsClockwise[i], intsClockwise[(i + 1) % intsClockwise.length],
                        true);
                    if (arc1.liesInRectangle(rect)) {
                        path.push(arc1);
                    } else {
                        rectPath = rect.getPathOnBorder(intsClockwise[i], intsClockwise[(i + 1) % intsClockwise.length]);
                        for (var j = 0; j < rectPath.length - 1; j++) {
                            path.push(new geom.LineSegment(rectPath[j], rectPath[j+1]));
                        }
                    }
                }
            }
            return path;
        }
    };

})(alphashape.geom, alphashape.util, alphashape.algo);
