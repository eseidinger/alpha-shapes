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
     * Array utility functions.
     *
     * @namespace
     */
    alphashape.util.array = {};

    /**
     * Count the number of occurences of an element in an array. The equality is determined by an optional equality
     * function. If no such function is provided, the element's equals method is used. If no such method is available,
     * equality is determined by the strict equality operator.
     *
     * @param {Array} array to scan for element occurences
     * @param {?} element occurences to count in array
     * @param {(function(?, ?): boolean)=} equalityFunction used to determine equality
     * @returns {number} number of occurences of element in array
     */
    alphashape.util.array.count = function(array, element, equalityFunction) {
        if (equalityFunction === undefined) {
            if (element.equals === undefined) {
                return array.reduce(function(count, el) {
                    return (element === el) ? (count + 1) : count;
                }, 0);
            } else {
                return array.reduce(function(count, el) {
                    return (element.equals(el)) ? (count + 1) : count;
                }, 0);
            }
        } else {
            return array.reduce(function(count, el) {
                return (equalityFunction(element,el)) ? (count + 1) : count;
            }, 0);
        }
    };

    /**
     * Determine the index of an element in an array. The equality is determined by an optional equality
     * function. If no such function is provided, the element's equals method is used. If no such method is available,
     * equality is determined by the strict equality operator.
     *
     * @param {Array} array to scan for element occurences
     * @param {?} element to find index of in array
     * @param {(function(?, ?): boolean)=} equalityFunction used to determine equality
     * @returns {number} index of element in array, if no such element exists -1
     */
    alphashape.util.array.indexOf = function(array, element, equalityFunction) {
        if (equalityFunction === undefined) {
            if (element.equals === undefined) {
                return array.indexOf(element);
            } else {
                for (var i = 0; i < array.length; i++) {
                    if (element.equals(array[i])) {
                        return i;
                    }
                }
            }
        } else {
            for (i = 0; i < array.length; i++) {
                if (equalityFunction(element, array[i])) {
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * Check if all elements of two arrays are equal. The equality of elements is determined by an optional equality
     * function. If no such function is provided, the element's equals method is used. If no such method is available,
     * equality is determined by the strict equality operator.
     *
     * @param {Array} array1 1st array to compare
     * @param {Array} array2 2nd array to compare
     * @param {(function(?, ?): boolean)=} equalityFunction used to determine equality
     * @returns {boolean} true if arrays are equal, false if not
     */
    alphashape.util.array.equals = function(array1, array2, equalityFunction) {
        if (array1.length !== array2.length) {
            return false;
        }
        if (array1.length === 0) {
            return true;
        }
        if (equalityFunction === undefined) {
            for (var i = 0; i < array1.length; i++) {
                if (array1[i].equals === undefined) {
                    if (array1[i] !== array2[i]) {
                        return false;
                    }
                } else {
                    if (!array1[i].equals(array2[i])) {
                        return false;
                    }
                }
            }
        } else {
            for (i = 0; i < array1.length; i++) {
                if (!equalityFunction(array1[i], array2[i])) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Sorts an array without side effect. A comparator function may be specified. If no such function is given,
     * the element's compareTo method is used.
     *
     * @param {Array} array to sort
     * @param {(function(?, ?): number)=} compareFunction function to use for comparison
     * @returns {Array} sorted array
     */
    alphashape.util.array.sort = function(array, compareFunction) {
        var sortArray = array.map(function(el) {return el});
        if (compareFunction === undefined) {
            sortArray.sort(function(el1, el2) {return el1.compareTo(el2)});
        } else {
            sortArray.sort(compareFunction);
        }
        return sortArray;
    };

    /**
     * Compare two arrays. Arrays are first compared in length. The longer array is considered bigger. Then all
     * elements in the array are compared using a given compare function. If no such function is provided,
     * the element's compare Method is used. The arrays' elements are compared from start to end. The first array
     * which has a bigger element is considered bigger.
     * Arrays are either compared in the order they are provided or sorted before comparison. The compare function is
     * used for sorting. If not provided, the elements compare method is used.
     *
     * @param {Array} array1 1st array to compare
     * @param {Array} array2 2nd array to compare
     * @param {boolean} respectOrder true leave order, false sort
     * @param {(function(?, ?): number)=} compareFunction function to use for comparison
     * @returns {number} 1 if array1 is bigger than array2, -1 if array2 is bigger than array1, 0 if arrays are equal
     */
    alphashape.util.array.compare = function(array1, array2, respectOrder, compareFunction) {
        if (array1.length < array2.length) {
            return -1;
        } else if (array1.length > array2.length) {
            return 1;
        } else if (array1.length === 0) {
            return 0;
        } else {
            if (compareFunction === undefined) {
                if (respectOrder) {
                    var compArray1 = array1;
                    var compArray2 = array2;
                } else {
                    compArray1 = util.array.sort(array1);
                    compArray2 = util.array.sort(array2);
                }
                for (var i = 0; i < array1.length; i++) {
                    var comp = compArray1[i]['compareTo'](compArray2[i]);
                    if (comp !== 0) {
                        return comp;
                    }
                }
                return 0;
            } else {
                if (respectOrder) {
                    compArray1 = array1;
                    compArray2 = array2;
                } else {
                    compArray1 = util.array.sort(array1, compareFunction);
                    compArray2 = util.array.sort(array2, compareFunction);
                }
                for (i = 0; i < array1.length; i++) {
                    comp = compareFunction(compArray1[i],compArray2[i]);
                    if (comp !== 0) {
                        return comp;
                    }
                }
                return 0;
            }
        }
    };

    /**
     * Find index of an element in an array having a minimal distance smaller than a given maximum to a given
     * element according to a given distance function.
     *
     * @param {Array} array to scan for element
     * @param {?} element to compare array elements with
     * @param {function(?, ?): number} distFct distance function
     * @param {number=} maxDist of elements to consider
     * @returns {number} index of first element with minimum distance smaller than maximum or -1 if no
     *                      such element exists
     */
    alphashape.util.array.indexOfElementWithMinimalDistance = function(array, element, distFct, maxDist) {
        var index = -1;
        var minDist = null;

        if (maxDist === undefined) {
            maxDist = util.constant.INFINITY;
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
     * Creates an array with unique values from a given array. The elements are compared using a given equality
     * function. If no such function is provided, the elements equals method is used. If no such method is available,
     * the elements are compared using the strict equality operator.
     *
     * @param {Array} array with elements to make unique
     * @param {(function(?, ?): boolean)=} equalityFunction for array elements
     * @returns {Array} array with unique elements
     */
    alphashape.util.array.makeElementsUnique = function(array, equalityFunction) {
        var newArray = [];

        for (var i = 0; i < array.length; i++) {
            var curElement = array[i];
            var index = util.array.indexOf(newArray, curElement, equalityFunction);
            if (index === -1) {
                newArray.push(curElement);
            }
        }
        return newArray;
    };

    /**
     * Creates an array where the original element and its duplicates are removed from a given array. The elements are
     * compared using a given equality function. If no such function is provided, the elements equals method is used.
     * If no such method is available, the elements are compared using the strict equality operator.
     *
     * @param {Array} array to remove duplicates from
     * @param {(function(?, ?): boolean)=} equalityFunction for array elements
     * @returns {Array} array with unique elements
     */
    alphashape.util.array.removeDuplicates = function(array, equalityFunction) {
        var newArray = [];

        array.forEach(function(el) {
            if (util.array.count(array, el, equalityFunction) === 1) {
                newArray.push(el);
            }
        });

        return newArray;
    };

})(alphashape.util);
