'use strict';

(function(Constants) {

    /**
     * Array utility functions.
     *
     * @constructor
     */
    alphashape.util.ArrayFunctions = function() {};
    var ArrayFunctions = alphashape.util.ArrayFunctions;

    /**
     * Lookup index in an array of an element having a minimal distance to a given
     * element according to a given distance function.
     *
     * @param {Array} array of elements to search
     * @param {?} element to comapre array elements with
     * @param {function(?, ?): number} distFct calculate distance of elements
     * @param {number=} maxDist of elements to consider
     * @returns {number} index of first element with minimum distance or -1 if no
     *                      such element exists
     */
    alphashape.util.ArrayFunctions.getIndexOfElementWithMinimalDistance = function(array, element, distFct,
                                                         maxDist) {
        var index = -1;
        var minDist = null;

        if (maxDist === undefined) {
            maxDist = Constants.INFINITY;
        }

        for (var i = 0; i < array.length; i++) {
            var dist = Math.abs(distFct(element, array[i]));
            if (dist < maxDist) {
                if (minDist === null) {
                    minDist = dist;
                    index = i;
                } else {
                    if (dist < minDist) {
                        minDist = dist;
                        index = i;
                    }
                }
            }
        }
        return index;
    };

    /**
     * Lookup index of an element in an array which is equal to a given element
     * according to a given comparator.
     *
     * @param {Array} array to search in
     * @param {?} element to compare with array elements
     * @param {function(?, ?): number} comparator function
     * @returns {number} index of first element equal to element or -1 if no such
     *                      element exists
     */
    alphashape.util.ArrayFunctions.getIndexInArray = function(array, element, comparator) {
        for (var i = 0; i < array.length; i++) {
            if (comparator(array[i], element) === 0) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Lookup index of an element in an array with a given predicate.
     *
     * @param {Array} array to search in
     * @param {function(?): boolean} predicate function
     * @returns {number} index of first element with predicate or -1 if no such
     *                      element exists
     */
    alphashape.util.ArrayFunctions.getIndexInArrayWithPredicate = function(array, predicate) {
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Creates an array with unique values from a given array.
     *
     * @param {Array} array with values for new array
     * @param {function(?, ?): number} comparator for array values
     * @returns {Array} array with unique values
     */
    alphashape.util.ArrayFunctions.removeDoublesFromArray = function(array, comparator) {
        var newArray = [];

        for (var i = 0; i < array.length; i++) {
            var curElement = array[i];
            var index = ArrayFunctions.getIndexInArray(newArray, curElement, comparator);
            if (index === -1) {
                newArray.push(curElement);
            }
        }
        return newArray;
    };

    /**
     * Compares two arrays element wise for equality given a comparator.
     *
     * @param {Array} array1
     * @param {Array} array2
     * @param {function(?, ?): number} comparator for array elements
     * @returns {boolean} true if array elements are equal, false otherwise
     */
    alphashape.util.ArrayFunctions.compareArrays = function(array1, array2, comparator) {
        if (array1.length !== array2.length) {
            return false;
        }

        for (var i = 0; i < array1.length; i++) {
            if (comparator(array1[i], array2[i]) !== 0) {
                return false;
            }
        }
        return true;
    };

})(alphashape.util.Constants);
