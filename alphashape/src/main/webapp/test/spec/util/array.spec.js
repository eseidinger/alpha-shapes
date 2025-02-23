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

describe('array and comparator functions', function() {

    var util = alphashape.util;

    it('counts number of occurences of an element in an array', function() {
        var array1 = [1, 2, 2];
        var array2 = [{val: 1}, {val: 2}, {val: 2}];

        for (var i = 0; i < 3; i++) {
            expect(util.array.count(array1, i)).toBe(i);
            expect(util.array.count(array2, {val: i, equals: function(v) {return this.val === v.val}})).toBe(i);
            expect(util.array.count(array2, {val: i}, function(v1, v2) {return v1.val === v2.val})).toBe(i);
        }
    });

    it('determines the index of an element in an array', function() {
        var array1 = [0, 1, 2];
        var array2 = [{val: 0}, {val: 1}, {val: 2}];

        for (var i = 0; i < 3; i++) {
            expect(util.array.indexOf(array1, i)).toBe(i);
            expect(util.array.indexOf(array2, {val: i, equals: function(v) {return this.val === v.val}})).toBe(i);
            expect(util.array.indexOf(array2, {val: i}, function(v1, v2) {return v1.val === v2.val})).toBe(i);
        }
    });

    it('checks if elements in two arrays are equal', function() {
        var array1 = [0, 1, 2];
        var array2 = [0, 1, 2];
        var array3 = [0, 2, 1];
        var array4 = [{val: 0}, {val: 1}, {val: 2}];
        var array5 = [{val: 0}, {val: 1}, {val: 2}];
        var array6 = [{val: 0}, {val: 2}, {val: 1}];

        array4.forEach(function(el) { el.equals = function(v) {return this.val === v.val}});

        expect(util.array.equals(array1, array2)).toBe(true);
        expect(util.array.equals(array1, array3)).toBe(false);
        expect(util.array.equals(array4, array5)).toBe(true);
        expect(util.array.equals(array4, array6)).toBe(false);
        expect(util.array.equals(array5, array4, function(v1, v2){return v1.val === v2.val})).toBe(true);
        expect(util.array.equals(array5, array6, function(v1, v2){return v1.val === v2.val})).toBe(false);
    });

    it('sorts an array', function() {
        var array1 = [0, 2, 1];
        var array2 = [{val: 0}, {val: 2}, {val: 1}];
        array2.forEach(function(el) { el.compareTo = function(v) {return util.comparator.compare(this.val, v.val)}});
        array2.forEach(function(el) { el.equals = function(v) {return util.comparator.compare(this.val, v.val) === 0}});

        var sorted1 = util.array.sort(array1, util.comparator.compare);
        var sorted2 = util.array.sort(array2);
        var sorted3 = util.array.sort(array2, function(v1, v2) {return util.comparator.compare(v1.val, v2.val)});
        var exp1 = [0, 1, 2];
        var exp2 = [{val: 0}, {val: 1}, {val: 2}];

        expect(util.array.equals(sorted1, exp1)).toBe(true);
        expect(util.array.equals(sorted2, exp2)).toBe(true);
        expect(util.array.equals(sorted3, exp2)).toBe(true);
    });

    it('compares two arrays', function() {
        var array1 = [0, 1, 2];
        var array2 = [0, 1, 2];
        var array3 = [0, 2, 1];
        var array4 = [0, 1, 2, 3];
        var array5 = [{val: 0}, {val: 1}, {val: 2}];
        var array6 = [{val: 0}, {val: 1}, {val: 2}];
        var array7 = [{val: 0}, {val: 2}, {val: 1}];
        var array8 = [{val: 0}, {val: 1}, {val: 2}, {val: 3}];

        array5.forEach(function(el) { el.compareTo = function(v) {return util.comparator.compare(this.val, v.val)}});
        array7.forEach(function(el) { el.compareTo = function(v) {return util.comparator.compare(this.val, v.val)}});
        array8.forEach(function(el) { el.compareTo = function(v) {return util.comparator.compare(this.val, v.val)}});

        expect(util.array.compare(array1, array2, true, util.comparator.compare)).toBe(0);
        expect(util.array.compare(array1, array3, true, util.comparator.compare)).toBe(-1);
        expect(util.array.compare(array1, array3, false, util.comparator.compare)).toBe(0);
        expect(util.array.compare(array3, array1, true, util.comparator.compare)).toBe(1);
        expect(util.array.compare(array3, array1, false, util.comparator.compare)).toBe(0);
        expect(util.array.compare(array1, array4, true, util.comparator.compare)).toBe(-1);
        expect(util.array.compare(array4, array1, true, util.comparator.compare)).toBe(1);

        expect(util.array.compare(array5, array6, true)).toBe(0);
        expect(util.array.compare(array5, array7, true)).toBe(-1);
        expect(util.array.compare(array5, array7, false)).toBe(0);
        expect(util.array.compare(array7, array5, true)).toBe(1);
        expect(util.array.compare(array7, array5, false)).toBe(0);
        expect(util.array.compare(array5, array8, true)).toBe(-1);
        expect(util.array.compare(array8, array5, true)).toBe(1);
    });

    it('determines the index of an element in an array with minimal distance to a given element', function() {
        var array = [0, 1, 2, 3, 4, 5];
        var element = 1.2;
        var distFct = function(x, y) { return Math.abs(x - y) };
        var index = util.array.indexOfElementWithMinimalDistance(array, element, distFct);
        expect(index).toBe(1);

        var maxDist = 0.1;
        index = util.array.indexOfElementWithMinimalDistance(array, element, distFct, maxDist);
        expect(index).toBe(-1);
    });


    it('creates an array with unique elements', function() {
        var array1 = [0, 1, 2, 3];
        var array2 = [0, 1, 1, 2, 3];
        var array3 = [{val: 0}, {val: 1}, {val: 2}, {val: 3}];
        var array4 = [{val: 0}, {val: 1}, {val: 1}, {val: 2}, {val: 3}];

        array4.forEach(function(el) {el.equals = function(v) { return this.val === v.val}});
        var eqFct = function(v1, v2) {return v1.val === v2.val};

        expect(util.array.equals(util.array.makeElementsUnique(array2), array1)).toBe(true);
        expect(util.array.equals(util.array.makeElementsUnique(array4), array3)).toBe(true);
        expect(util.array.equals(util.array.makeElementsUnique(array4, eqFct), array3, eqFct)).toBe(true);
    });

    it('remove duplicates and original element from an array', function() {
        var array1 = [0, 2, 3];
        var array2 = [0, 1, 1, 2, 3];
        var array3 = [{val: 0}, {val: 2}, {val: 3}];
        var array4 = [{val: 0}, {val: 1}, {val: 1}, {val: 2}, {val: 3}];

        array4.forEach(function(el) {el.equals = function(v) { return this.val === v.val}});
        var eqFct = function(v1, v2) {return v1.val === v2.val};

        expect(util.array.equals(util.array.removeDuplicates(array2), array1)).toBe(true);
        expect(util.array.equals(util.array.removeDuplicates(array4), array3)).toBe(true);
        expect(util.array.equals(util.array.removeDuplicates(array4, eqFct), array3, eqFct)).toBe(true);
    });
 });
