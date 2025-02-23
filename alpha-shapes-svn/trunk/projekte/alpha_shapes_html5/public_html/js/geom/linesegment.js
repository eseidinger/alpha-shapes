'use strict';

(function(Vector, Line, ComparatorFunctions) {
    /**
     * A finite line.
     *
     * @constructor
     * @param {alphashape.geom.Vector} r origin
     * @param {alphashape.geom.Vector} u direction
     */
    alphashape.geom.LineSegment = function(r, u) {
        /**
         * @const
         * @type  alphashape.geom.Vector
         */
        this.origin = r;
        /**
         * @const
         * @type  alphashape.geom.Vector
         */
        this.direction = u;
    };
    var LineSegment = alphashape.geom.LineSegment;

    /**
     * Creates a line segment from start end end point.
     *
     * @param {alphashape.geom.Vector} start point
     * @param {alphashape.geom.Vector} end point
     * @returns {alphashape.geom.LineSegment} line segment with origin and direction calculated from
     *                          given points
     */
    alphashape.geom.LineSegment.createFromPoints = function(start, end) {
        return new LineSegment(start, end.sub(start));
    };

    alphashape.geom.LineSegment.prototype = {
        constructor: LineSegment,

        /**
         * Endpoint of this line segment.
         *
         * @returns {alphashape.geom.Vector} point vector of endpoint
         */
        getEndpoint: function() {
            return this.origin.add(this.direction);
        },

        /**
         * Center of this line segment.
         *
         * @returns {alphashape.geom.Vector} point vector of center
         */
        getCenter: function() {
            return this.origin.add(this.direction.multiplyScalar(0.5));
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
            var line = new Line(this.origin, this.direction);
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
            var line = new Line(this.origin, this.direction);
            var lambda = line.calculateLambda(point);
            if (lambda === null) {
                return false;
            } else {
                return (ComparatorFunctions.compareWithTolerance(lambda, 0) !== -1) &&
                    (ComparatorFunctions.compareWithTolerance(lambda, 1) !== 1);
            }
        },
        /**
         * Calculates the intersection with another line, ray or line segment.
         *
         * @param {(alphashape.geom.Line|alphashape.geom.Ray|alphashape.geom.LineSegment)} line to intersect with
         * @returns {?alphashape.geom.Vector} point vector of intersection, if existing
         */
        getIntersection: function(line) {
            var line1 = new Line(this.origin, this.direction);
            var line2 = new Line(line.origin, line.direction);

            var intersection = line1.getIntersection(line2);
            if (intersection !== null) {
                if (this.containsPoint(intersection) &&
                    line.containsPoint(intersection)) {
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
            var dist1 = this.origin.sub(point).abs();
            var dist2 = this.getEndpoint().sub(point).abs();
            return Math.min(dist1, dist2);
        },
        /**
         * Calculate the maximum distance of a point to this line segment.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {number}
         */
        getMaxDist: function(point) {
            var dist1 = this.origin.sub(point).abs();
            var dist2 = this.getEndpoint().sub(point).abs();
            return Math.max(dist1, dist2);
        },
        /**
         * Checks if a given line segment is equal to this line segment.
         *
         * @param {alphashape.geom.LineSegment} lineSegment to compare with
         * @returns {boolean} true if line segments are equal, false otherwise
         */
        equals: function(lineSegment) {
            if (this.origin.equals(lineSegment.origin) &&
                this.getEndpoint().equals(lineSegment.getEndpoint())) {
                return true;
            }
            if (this.origin.equals(lineSegment.getEndpoint()) &&
                this.getEndpoint().equals(lineSegment.origin)) {
                return true;
            }
            return false;
        }
    };
})(alphashape.geom.Vector, alphashape.geom.Line, alphashape.util.ComparatorFunctions);
