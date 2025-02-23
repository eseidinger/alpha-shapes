'use strict';

/**
 * Various helpful functions.
 * 
 * @constructor
 */
function Misc() {
    
}

/**
 * Default tolerance for comparisons.
 * 
 * @const
 * @type number
 */
Misc.TOLERANCE = 0.000001;

/**
 * Large value considered as infinity for computations.
 * 
 * @const
 * @type number
 */
Misc.INFINITY = 1e6;


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
Misc.getIndexOfElementWithMinimalDistance = function(array, element, distFct,
        maxDist) {
    var index = -1;
    var minDist = null;
    
    if (maxDist === undefined) {
        maxDist = Misc.INFINITY;
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
Misc.getIndexInArray = function(array, element, comparator) {
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
Misc.getIndexInArrayWithPredicate = function(array, predicate) {
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
Misc.removeDoublesFromArray = function(array, comparator) {
    var newArray = [];
    
    for (var i = 0; i < array.length; i++) {
        var curElement = array[i];
        var index = Misc.getIndexInArray(newArray, curElement, comparator);
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
Misc.compareArrays = function(array1, array2, comparator) {
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

/**
 * Give the sign of a numeric value.
 * 
 * @param {number} value to check sign
 * @returns {number} -1 if negative, 0 if 0, 1 if positive
 */
Misc.sign = function(value) {
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
Misc.compareWithTolerance = function(x, y, tolerance) {
    if (tolerance === undefined) {
        tolerance = Misc.TOLERANCE;
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
Misc.compare = function(x, y) {
    if (x === y) {
        return 0;
    } else if (x < y) {
        return -1;
    } else {
        return 1;
    }
};

/**
 * Measures execution time for a given function.
 * 
 * @param {function()} fct function under test
 * @param {...?} args arguments for function under test
 * @returns {{time: number, result:?}} time for execution in milliseconds and
 *      result of function under test
 */
Misc.doWithStopWatch = function(fct, args) {
    var fctargs = Array.prototype.slice.call(arguments, 1);
    var start = Date.now();
    var result = fct.apply(null, fctargs);
    var finish = Date.now();
    var time = finish - start;
    return {'time': time, 'result': result};
};

/**
 * Checks if web resource is available.
 * 
 * @param {string} url of the resource
 * @param {string} verb http action
 * @returns {boolean} true if available, false otherwise
 */
Misc.isResourceAvailable = function(url, verb) {
    var client = new XMLHttpRequest();
    client.open(verb, url, false);
    try {
        client.send(null);        
    } catch(e) {
        return false;
    }
    if (client.response === null) {
        return false;
    } else if (client.status !== 200) {
        return false;
    } else {
    	return true;
    }
};

/**
 * Convert hex RGB-string to object contatining RGB values.
 * 
 * @param {string} hex RGB-String
 * @returns {?{r: number, g: number, b: number}} RGB-Object
 */
Misc.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Convert hex RGB-string and opacity to RGBA-string.
 * 
 * @param {string} hex RGB-String
 * @param {number} opacity
 * @returns {string} RGBA-String
 */
Misc.hexToRgba = function(hex, opacity) {
    var rgb = Misc.hexToRgb(hex);
    var rgba = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')';
    return rgba;
};
