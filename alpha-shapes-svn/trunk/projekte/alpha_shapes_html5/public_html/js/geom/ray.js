'use strict';

(function(Vector, Line, ComparatorFunctions) {
    /**
     * A semi infinite line.
     *
     * @constructor
     * @param {alphashape.geom.Vector} origin
     * @param {alphashape.geom.Vector} direction
     */
    alphashape.geom.Ray = function(origin, direction) {
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
    var Ray = alphashape.geom.Ray;

    alphashape.geom.Ray.prototype = {
        constructor: Ray,

        /**
         * Projection of a point on this ray.
         *
         * @param {alphashape.geom.Vector} point vector
         * @returns {alphashape.geom.Vector} projection of point on this line
         */
        pointProjection: function(point) {
            var line = new Line(this.origin, this.direction);
            var projection = line.pointProjection(point);
            if (this.containsPoint(projection)) {
                return projection;
            } else {
                return null;
            }
        },

        /**
         * Checks whether a point is contained on this ray.
         *
         * @param {alphashape.geom.Vector} point to be checked
         * @returns {boolean} true if point is contained, false otherwise
         */
        containsPoint: function(point) {
            var line = new Line(this.origin, this.direction);
            var lambda = line.calculateLambda(point);
            if (lambda === null) {
                return false;
            } else {
                return ComparatorFunctions.compareWithTolerance(lambda, 0) !== -1;
            }
        },

        /**
         * Calculates intersection with another line, ray or line segment.
         *
         * @param {(alphashape.geom.Line|alphashape.geom.Ray|alphashape.geom.LineSegment)} ray
         * @returns {?alphashape.geom.Vector} intersection with this ray or null if not existent
         */
        getIntersection: function(ray) {
            var line1 = new Line(this.origin, this.direction);
            var line2 = new Line(ray.origin, ray.direction);

            var intersection = line1.getIntersection(line2);
            if (intersection !== null) {
                if (this.containsPoint(intersection) &&
                    ray.containsPoint(intersection)) {
                    return intersection;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
})(alphashape.geom.Vector, alphashape.geom.Line, alphashape.util.ComparatorFunctions);
