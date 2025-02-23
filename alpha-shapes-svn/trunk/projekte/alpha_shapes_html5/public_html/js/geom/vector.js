'use strict';

(function(ComparatorFunctions) {
    /**
     * Represents a 2D vector.
     *
     * @constructor
     * @param {number} x coordinate
     * @param {number} y coordinate
     */
    alphashape.geom.Vector = function(x, y) {
        /**
         * @const
         * @type number
         */
        this.x = x;
        /**
         * @const
         * @type number
         */
        this.y = y;
    };

    var Vector = alphashape.geom.Vector;


    alphashape.geom.Vector.prototype = {
        constructor: Vector,

        /**
         * Rotate vector clockwise in cartesian coordinate system. Counter
         * clockwise in screen coordinates.
         *
         * @param {number} angle in radians
         * @returns {alphashape.geom.Vector} rotated copy of this vector
         */
        rotate: function(angle) {
            var newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
            var newY = this.y * Math.cos(angle) + this.x * Math.sin(angle);
            return new Vector(newX, newY);
        },

        /**
         * Exchange x and y coordinates.
         *
         * @returns {alphashape.geom.Vector} copy of this vectory with switched coordinates
         */
        switchCoordinates: function() {
            var newX = this.y;
            var newY = this.x;
            return new Vector(newX, newY);
        },

        /**
         * Invert y coordinate.
         *
         * @returns {alphashape.geom.Vector} copy of this vector with inverted y coordinate
         */
        mirrorY: function() {
            var newX = this.x;
            var newY = -1 * this.y;
            return new Vector(newX, newY);
        },

        /**
         * Comma seperated string representation of the vector.
         *
         * @returns {string} comma seperated coordinates
         */
        toString: function() {
            return '' + this.x + ',' + this.y + '';
        },

        /**
         * Scale vector.
         *
         * @param {number} a scaling factor
         * @returns {alphashape.geom.Vector} scaled copy of this vector
         */
        multiplyScalar : function(a) {
            return new Vector(a*this.x, a*this.y);
        },

        /**
         * Dot product.
         *
         * @param {alphashape.geom.Vector} v 2nd factor for dot product
         * @returns {number} dot product of this vector and v
         */
        multiplyVector : function(v) {
            return v.x * this.x + v.y * this.y;
        },

        /**
         * Vector subtraction.
         *
         * @param {alphashape.geom.Vector} v subtrahend
         * @returns {alphashape.geom.Vector} difference of this vector and v
         */
        sub : function(v) {
            return new Vector(this.x - v.x, this.y - v.y);
        },

        /**
         * Vector addition
         *
         * @param {alphashape.geom.Vector} v 2nd summand
         * @returns {alphashape.geom.Vector} sum of this vector and v
         */
        add : function(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        },

        /**
         * Absolute value.
         *
         * @returns {number} absolute value of this vector
         */
        abs : function() {
            return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
        },

        /**
         * Square of absolute value.
         *
         * @returns {number} square of this vector's absolute value
         */
        abssquare : function() {
            return Math.pow(this.x,2) + Math.pow(this.y,2);
        },
        /**
         * Vector normalization.
         *
         * @returns {alphashape.geom.Vector} normalized copy of this vector
         */
        normalize : function() {
            return this.multiplyScalar(1/this.abs());
        },
        /**
         * Checks vector coordinates for numerical equality.
         *
         * @param {alphashape.geom.Vector} v vector to check for numerical equality
         * @returns {boolean} true if coordinates are equal, false otherwise
         */
        equals: function(v) {
            return Vector.compareByXThenY(this, v) === 0;
        },

        /**
         * Calculate counterclockwise angle with x axis.
         *
         * @returns {number} ccw angle with x axis
         */
        getAngle: function() {
            return Math.atan2(this.y, this.x);
        }
    };

    /**
     * Compare x coordinates of two vectors.
     *
     * @param {alphashape.geom.Vector} v1 vector
     * @param {alphashape.geom.Vector} v2 vector
     * @returns {number} 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
     */
    alphashape.geom.Vector.compareByX = function(v1, v2) {
        return ComparatorFunctions.compareWithTolerance(v1.x, v2.x);
    };

    /**
     * Compare y coordinates of two vectors.
     *
     * @param {alphashape.geom.Vector} v1 vector
     * @param {alphashape.geom.Vector} v2 vector
     * @returns {number} 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
     */
    alphashape.geom.Vector.compareByY = function(v1, v2) {
        return ComparatorFunctions.compareWithTolerance(v1.y, v2.y);
    };

    /**
     * Compare two vectors first by x coordinate, then by y coordinate.
     *
     * @param {alphashape.geom.Vector} v1 vector
     * @param {alphashape.geom.Vector} v2 vector
     * @returns {number} 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
     */
    alphashape.geom.Vector.compareByXThenY = function(v1, v2) {
        var comp = Vector.compareByX(v1, v2);
        if (comp === 0)
            return Vector.compareByY(v1, v2);
        else
            return comp;
    };

    /**
     * Compare two vectors first by y coordinate, then by x coordinate.
     *
     * @param {alphashape.geom.Vector} v1 vector
     * @param {alphashape.geom.Vector} v2 vector
     * @returns {number} 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
     */
    alphashape.geom.Vector.compareByYThenX = function(v1, v2) {
        var comp = Vector.compareByY(v1, v2);
        if (comp === 0)
            return Vector.compareByX(v1, v2);
        else
            return comp;
    };

    /**
     * Calculate the distance between two points.
     *
     * @param {alphashape.geom.Vector} v1 point vector
     * @param {alphashape.geom.Vector} v2 point vector
     * @returns {number} distance between the two points
     */
    alphashape.geom.Vector.calcDist = function(v1, v2) {
        var dist = v1.sub(v2).abs();
        return dist;
    };

    /**
     * Calculate the square of the distance between two points.
     *
     * @param {alphashape.geom.Vector} v1 point vector
     * @param {alphashape.geom.Vector} v2 point vector
     * @returns {number} squared distance between the two points
     */
    alphashape.geom.Vector.calcDistSquare = function(v1, v2) {
        return v1.sub(v2).abssquare();
    };

    /**
     * Calculate the determinant<br>
     * | 1 p.x p.y |<br>
     * | 1 q.x q.y |<br>
     * | 1 r.x r.y |
     *
     * @param {alphashape.geom.Vector} p vector
     * @param {alphashape.geom.Vector} q vector
     * @param {alphashape.geom.Vector} r vector
     * @returns {number} determinant
     */
    alphashape.geom.Vector.calcDet = function(p, q, r) {
        return q.x * r.y + p.x * q.y + p.y * r.x
            - q.y * r.x - p.x * r.y - p.y * q.x;
    };

})(alphashape.util.ComparatorFunctions);

