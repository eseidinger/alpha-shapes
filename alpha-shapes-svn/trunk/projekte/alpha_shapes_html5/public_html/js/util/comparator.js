'use strict';

(function(Constants) {

    /**
     * Comparator functions.
     *
     * @constructor
     */
    alphashape.util.ComparatorFunctions = function() {};
    var ComparatorFunctions = alphashape.util.ComparatorFunctions;

    /**
     * Give the sign of a numeric value.
     *
     * @param {number} value to check sign
     * @returns {number} -1 if negative, 0 if 0, 1 if positive
     */
    alphashape.util.ComparatorFunctions.sign = function(value) {
        if (value < 0) {
            return -1;
        } else if (value === 0) {
            return 0;
        } else {
            return 1;
        }
    };

    /**
     * Compare two numeric values. Values are considered equal if their difference
     * is less than a certain tolerance.
     *
     * @param {number} x first value for comparison
     * @param {number} y second value for comparison
     * @param {number=} tolerance tolerable difference
     * @returns {number} 0 if |diff| < tolerance, -1 if x < y, 1 if x > y
     */
    alphashape.util.ComparatorFunctions.compareWithTolerance = function(x, y, tolerance) {
        if (tolerance === undefined) {
            tolerance = Constants.TOLERANCE;
        }
        var diff = x - y;
        if (Math.abs(diff) < tolerance) {
            return 0;
        } else if (diff < 0) {
            return -1;
        } else {
            return 1;
        }
    };

    /**
     * Standard comparator for numerical values.
     *
     * @param {number} x first value for comparison
     * @param {number} y second value for comparison
     * @returns {number} 0 if x == y, -1 if x < y, 1 if x > y
     */
    alphashape.util.ComparatorFunctions.compare = function(x, y) {
        if (x === y) {
            return 0;
        } else if (x < y) {
            return -1;
        } else {
            return 1;
        }
    };
})(alphashape.util.Constants);
