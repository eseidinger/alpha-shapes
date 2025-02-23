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

describe('comparator functions', function() {

    var util = alphashape.util;

    it('gives the sign of a numeric value', function() {
        expect(util.comparator.sign(0)).toBe(0);
        expect(util.comparator.sign(-10)).toBe(-1);
        expect(util.comparator.sign(10)).toBe(1);
    });
    
    it('compares two numeric values given a certain tolerance', function() {
        expect(util.comparator.compareWithTolerance(1.0, 1.01, 0.001)).toBe(-1);
        expect(util.comparator.compareWithTolerance(1.01, 1.0, 0.001)).toBe(1);

        expect(util.comparator.compareWithTolerance(1.0, 1.01, 0.1)).toBe(0);
        expect(util.comparator.compareWithTolerance(1.01, 1.0, 0.1)).toBe(0);

        expect(util.comparator.compareWithTolerance(1.0, 1.0 + util.constant.TOLERANCE * 2)).toBe(-1);
        expect(util.comparator.compareWithTolerance(1.0 + util.constant.TOLERANCE * 2, 1.0)).toBe(1);

        expect(util.comparator.compareWithTolerance(1.0, 1.0 + util.constant.TOLERANCE / 2)).toBe(0);
        expect(util.comparator.compareWithTolerance(1.0 + util.constant.TOLERANCE / 2, 1.0)).toBe(0);
    });
    
    it('compares two numeric values', function() {
        expect(util.comparator.compare(1, 1)).toBe(0);
        expect(util.comparator.compare(1, 2)).toBe(-1);
        expect(util.comparator.compare(2, 1)).toBe(1);
    });
 });
