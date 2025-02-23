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

(function(util) {
    /**
     * Represents a 2D vector.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @constructor
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
         * Checks vector coordinates for equality.
         *
         * @param {alphashape.geom.Vector} v vector to check for equality
         * @returns {boolean} true if coordinates are equal, false otherwise
         */
        equals: function(v) {
            return Vector.compare(this, v) === 0;
        },

        /**
         * Defines an order on Vectors. Two vectors are considered equal if their coordinates are equal. Vectors are
         * first compared by their x, then by their y coordinate.
         *
         * @param {alphashape.geom.Vector} other vector to compare with
         * @returns {number} 0 if vectors are equal, -1 if this is less than the other, 1 if the other is less than this
         */
        compareTo: function(other) {
            return Vector.compare(this, other);
        },

        /**
         * Rotate clockwise in screen coordinates.
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
            return Math.sqrt(this.multiplyVector(this));
        },

        /**
         * Square of absolute value.
         *
         * @returns {number} square of this vector's absolute value
         */
        abssquare : function() {
            return this.multiplyVector(this);
        },

        /**
         * Calculate the distance between this and another point vector.
         *
         * @param {alphashape.geom.Vector} v point vector
         * @returns {number} distance between the two points
         */
        dist: function(v) {
            return this.sub(v).abs();
        },

        /**
         * Calculate the square distance between this and another point vector.
         *
         * @param {alphashape.geom.Vector} v point vector
         * @returns {number} square distance between the two points
         */
        distSquare: function(v) {
            return this.sub(v).abssquare();
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
         * Calculate clockwise angle (screen coordinates) with x axis.
         *
         * @returns {number} cw angle with x axis
         */
        getAngle: function() {
            return Math.atan2(this.y, this.x);
        }
    };

    /**
     * Defines an order on Vectors. Two vectors are considered equal if their coordinates are equal. Vectors are
     * first compared by their x, then by their y coordinate.
     *
     * @param {alphashape.geom.Vector} vector1 vector
     * @param {alphashape.geom.Vector} vector2 vector
     * @returns {number} 0 if vectors are equal, -1 if vector1 is less than the vector2, 1 if vector2 is less than vector1
     */
    alphashape.geom.Vector.compare = function(vector1, vector2) {
        var comp = util.comparator.compareWithTolerance(vector1.x, vector2.x);
        if (comp === 0) {
            return util.comparator.compareWithTolerance(vector1.y, vector2.y);
        } else {
            return comp;
        }
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

})(alphashape.util);
