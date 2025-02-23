'use strict';

var ArrayFunctions = alphashape.util.ArrayFunctions;
var ComparatorFunctions = alphashape.util.ComparatorFunctions;

describe('array and comparator functions', function() {

    it('gets the index of an element in an array with minimal distance',
            function() {
        var array = [0, 1, 2, 3, 4, 5];
        var element = 1.2;
        var distFct = function(x, y) {
            return Math.abs(x - y);
        };
        var index = ArrayFunctions.getIndexOfElementWithMinimalDistance(array, element,
            distFct);
        expect(index).toBe(1);
        
        var maxDist = 0.1;
        index = ArrayFunctions.getIndexOfElementWithMinimalDistance(array, element,
            distFct, maxDist);
        expect(index).toBe(-1);
    });

    it('gets the index of an element in an array using a comparator', function() {
        var array = [0, 1, 2, 3, 4, 5];
        var element = 1.2;
        var comparator = function(x, y) {
            if (x === y) {
                return 0;
            } else if (x < y) {
                return -1;
            } else {
                return 1;
            }
        };
        var index = ArrayFunctions.getIndexInArray(array, element, comparator);
        expect(index).toBe(-1);
        
        element = 1;
        index = ArrayFunctions.getIndexInArray(array, element, comparator);
        expect(index).toBe(1);       
    });
    
    it('gets the index of an element in an array using a predicate', function() {
        var array = [0, 1, 2, 3, 4, 5];
        var element = 1.2;
        var predicate = function(x) {
            return x === element;
        };
        var index = ArrayFunctions.getIndexInArrayWithPredicate(array, predicate);
        expect(index).toBe(-1);
        
        element = 1;
        var index = ArrayFunctions.getIndexInArrayWithPredicate(array, predicate);
        expect(index).toBe(1);       
    });
    
    it('creates an array with unique values', function() {
        var array = [0, 1, 1, 2, 3];
        var newArray = ArrayFunctions.removeDoublesFromArray(array, ComparatorFunctions.compare);
        
        expect(ArrayFunctions.compareArrays(newArray, [0,1,2,3], ComparatorFunctions.compare)).toBe(true);
    });
    
    it('compares two arrays element wise for equality', function() {
        var array1 = [0, 1, 2, 3, 4];
        var array2 = [0, 1, 2, 3, 4];
        var array3 = [0, 2, 1, 3, 4];
        
        expect(ArrayFunctions.compareArrays(array1, array2, ComparatorFunctions.compare)).toBe(true);
        expect(ArrayFunctions.compareArrays(array1, array3, ComparatorFunctions.compare)).toBe(false);
    });
    
    it('gives the sign of a numeric value', function() {
        var sign = ComparatorFunctions.sign(0);
        expect(sign).toBe(0);
        
        sign = ComparatorFunctions.sign(-10);
        expect(sign).toBe(-1);
        
        sign = ComparatorFunctions.sign(10);
        expect(sign).toBe(1);
    });
    
    it('compares two numeric values given a certain tolerance', function() {
        var val1 = 1.0;
        var val2 = 1.001;
        
        var comp = ComparatorFunctions.compareWithTolerance(val1, val2);
        expect(comp).toBe(-1);
        comp = ComparatorFunctions.compareWithTolerance(val2, val1);
        expect(comp).toBe(1);
        
        var tolerance = 0.01;
        var comp = ComparatorFunctions.compareWithTolerance(val1, val2, tolerance);
        expect(comp).toBe(0);
        comp = ComparatorFunctions.compareWithTolerance(val2, val1, tolerance);
        expect(comp).toBe(0);
    });
    
    it('compares two numeric values', function() {
        expect(ComparatorFunctions.compare(1, 1)).toBe(0);
        expect(ComparatorFunctions.compare(1, 2)).toBe(-1);
        expect(ComparatorFunctions.compare(2, 1)).toBe(1);
    });
 });
