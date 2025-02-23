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

describe('Vector', function() {

    var util = alphashape.util;
    var geom = alphashape.geom;

    it('checks vectors for equality', function() {
        var vector1 = new geom.Vector(2,0);
        var vector2 = new geom.Vector(2,0);
        var vector3 = new geom.Vector(2,1);

        expect(vector1.equals(vector2)).toBe(true);
        expect(vector1.equals(vector3)).toBe(false);
    });

    it('defines an order', function() {
        var vector1 = new geom.Vector(2,0);
        var vector2 = new geom.Vector(2,1);
        var vector3 = new geom.Vector(2,1);
        var vector4 = new geom.Vector(1,1);

        expect(geom.Vector.compare(vector1, vector2)).toBe(-1);
        expect(geom.Vector.compare(vector2, vector1)).toBe(1);
        expect(geom.Vector.compare(vector2, vector3)).toBe(0);
        expect(geom.Vector.compare(vector3, vector4)).toBe(1);
        expect(geom.Vector.compare(vector4, vector3)).toBe(-1);

        expect(vector1.compareTo(vector2)).toBe(-1);
        expect(vector2.compareTo(vector1)).toBe(1);
        expect(vector2.compareTo(vector3)).toBe(0);
        expect(vector4.compareTo(vector3)).toBe(-1);
    });

    it('rotates a vector clockwise (screen coordinates)', function() {
        var vector0 = new geom.Vector(1,0);
        var vector90 = new geom.Vector(0,1);
        var vector180 = new geom.Vector(-1,0);
        var vector270 = new geom.Vector(0,-1);
        var vector360 = new geom.Vector(1,0);
        
        expect(vector0.rotate(Math.PI/2).equals(vector90)).toBe(true);
        expect(vector0.rotate(Math.PI).equals(vector180)).toBe(true);
        expect(vector0.rotate(3*Math.PI/2).equals(vector270)).toBe(true);
        expect(vector0.rotate(2*Math.PI).equals(vector360)).toBe(true);
    });

    it('multiplies vector with scalar', function() {
        var vector = new geom.Vector(-2,1);
        var newVector = new geom.Vector(4,-2);
        
        expect(vector.multiplyScalar(-2).equals(newVector)).toBe(true);
    });

    it('calculates the dot product', function() {
        var vector1 = new geom.Vector(-2,1);
        var vector2 = new geom.Vector(3,-2);
        var result = vector1.multiplyVector(vector2);

        expect(util.comparator.compareWithTolerance(result, -8)).toBe(0);
    });

    it('subtracts vectors', function() {
        var vector1 = new geom.Vector(5,7);
        var vector2 = new geom.Vector(1,2);
        var expected = new geom.Vector(4,5);
        var result = vector1.sub(vector2);
        
        expect(expected.equals(result)).toBe(true);
    });

    it('adds vectors', function() {
        var vector1 = new geom.Vector(5,7);
        var vector2 = new geom.Vector(1,2);
        var expected = new geom.Vector(6,9);
        var result = vector1.add(vector2);
        
        expect(expected.equals(result)).toBe(true);
    });

    it('calculates the absolute value', function() {
        var vector = new geom.Vector(2,-2);
        var expected = Math.sqrt(8);
        var result = vector.abs();
        
        expect(util.comparator.compareWithTolerance(expected, result)).toBe(0);
    });

    it('calculates the square of the absolute value', function() {
        var vector = new geom.Vector(2,-2);
        var expected = 8;
        var result = vector.abssquare();
        
        expect(util.comparator.compareWithTolerance(expected, result)).toBe(0);
    });

    it('calculates the distance between two point vectors', function() {
        var vector1 = new geom.Vector(0,0);
        var vector2 = new geom.Vector(2,2);

        expect(util.comparator.compareWithTolerance(vector1.dist(vector2), Math.sqrt(8))).toBe(0);
    });

    it('calculates the square of the distance between two point vectors', function() {
        var vector1 = new geom.Vector(0,0);
        var vector2 = new geom.Vector(2,2);

        expect(util.comparator.compareWithTolerance(vector1.distSquare(vector2), 8)).toBe(0);
    });

    it('normalizes a vector', function() {
        var vector = new geom.Vector(2,0);
        var expected = new geom.Vector(1,0);
        var result = vector.normalize();
        
        expect(expected.equals(result)).toBe(true);
    });

    it('calculates clockwise angle (screen coordinates) of vector to x axis', function() {
        var vector = [];
        vector[0] = new geom.Vector(1,0);
        vector[1] = new geom.Vector(1,1);
        vector[2] = new geom.Vector(0,1);
        vector[3] = new geom.Vector(-1,1);
        vector[4] = new geom.Vector(-1,0);
        vector[5] = new geom.Vector(-1,-1);
        vector[6] = new geom.Vector(0,-1);
        vector[7] = new geom.Vector(1,-1);
        
        var angle = [];
        angle[0] = 0;
        angle[1] = Math.PI / 4;
        angle[2] = Math.PI / 2;
        angle[3] = 3 * Math.PI / 4;
        angle[4] = Math.PI;
        angle[7] = -1 * Math.PI / 4;
        angle[6] = -1 * Math.PI / 2;
        angle[5] = -3 * Math.PI / 4;
        
        for (var i = 0; i < 8; i++) {
            expect(util.comparator.compareWithTolerance(vector[i].getAngle(), angle[i])).toBe(0);
        }
    });

    it('calculates the determinant', function() {
        var vector1 = new geom.Vector(0,0);
        var vector2 = new geom.Vector(0,1);
        var vector3 = new geom.Vector(1,0);
        
        var det = geom.Vector.calcDet(vector1, vector2, vector3);
        expect(util.comparator.compareWithTolerance(det, -1)).toBe(0);
        
        vector3 = new geom.Vector(-1,0);
        det = geom.Vector.calcDet(vector1, vector2, vector3);
        expect(util.comparator.compareWithTolerance(det, 1)).toBe(0);

        vector3 = new geom.Vector(0,2);
        det = geom.Vector.calcDet(vector1, vector2, vector3);
        expect(util.comparator.compareWithTolerance(det, 0)).toBe(0);
    });
});
