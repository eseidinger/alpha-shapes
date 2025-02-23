'use strict';

(function(Vector, ComparatorFunctions) {
    /**
     * A Circle.
     *
     * @constructor
     * @param {alphashape.geom.Vector} center
     * @param {number} radius
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
    };
    var Circle = alphashape.geom.Circle;

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

        var circle1 = new Circle(point1, radius);
        var circle2 = new Circle(point2, radius);

        var inters = circle1.getIntersctions(circle2);
        inters.forEach(function(inter) {
            var circle = new Circle(inter, radius);
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
        var radius = Vector.calcDist(point, center);

        return new Circle(center, radius);
    };

    alphashape.geom.Circle.prototype = {
        constructor: Circle,

        /**
         * Calculate the intersection points of this circle and a given circle.
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

            if (ComparatorFunctions.compareWithTolerance(ySquared, 0) === -1) {
                return result;
            } else if (ComparatorFunctions.compareWithTolerance(ySquared, 0) === 0) {
                var onlyInt = new Vector(x,0);
                onlyInt = onlyInt.rotate(angle).add(trans);
                result.push(onlyInt);
                return result;
            }
            var y1 = Math.sqrt(ySquared);
            var y2 = -1 * y1;

            var int1 = new Vector(x, y1);
            var int2 = new Vector(x, y2);

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
            return new Circle(this.center.add(vector), this.radius);
        },

        /**
         * Rotate circle around origin.
         *
         * @param {number} angle in radians
         * @returns {alphashape.geom.Circle} rotated circle
         */
        rotateAroundOrigin: function(angle) {
            return new Circle(this.center.rotate(angle), this.radius);
        },

        /**
         * Checks whether circle contains a point.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {boolean} true if point is contained
         */
        containsPoint: function(point) {
            var dist = Vector.calcDist(point, this.center);
            return ComparatorFunctions.compareWithTolerance(dist, this.radius) !== 1;
        },

        /**
         * Checks whether the inverse of this circle contains a point.
         *
         * @param {alphashape.geom.Vector} point
         * @returns {boolean} true if point is contained
         */
        inverseContainsPoint: function(point) {
            var dist = Vector.calcDist(point, this.center);
            return ComparatorFunctions.compareWithTolerance(dist, this.radius) !== -1;
        }
    };
})(alphashape.geom.Vector, alphashape.util.ComparatorFunctions);
