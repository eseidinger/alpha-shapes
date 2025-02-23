'use strict';

var ComparatorFunctions = alphashape.util.ComparatorFunctions;
var Vector = alphashape.geom.Vector;

describe('Vector', function() {

    it('rotates a vector', function() {
        var vector0 = new Vector(1,0);
        var vector90 = new Vector(0,1);
        var vector180 = new Vector(-1,0);
        var vector270 = new Vector(0,-1);
        var vector360 = new Vector(1,0);
        
        var vector = vector0.rotate(Math.PI/2);
        expect(vector.equals(vector90)).toBe(true);
        vector = vector0.rotate(Math.PI);
        expect(vector.equals(vector180)).toBe(true);
        vector = vector0.rotate(3*Math.PI/2);
        expect(vector.equals(vector270)).toBe(true);
        vector = vector0.rotate(2*Math.PI);
        expect(vector.equals(vector360)).toBe(true);
    });
    
    it('switches coordinates', function() {
        var vector1 = new Vector(-2,1);
        var vector2 = new Vector(1,-2);
        
        var newVector = vector1.switchCoordinates();
        expect(newVector.equals(vector2)).toBe(true);
    });

    it('inverts the y coordinate', function() {
        var vector1 = new Vector(-2,1);
        var vector2 = new Vector(-2,-1);
        
        var newVector = vector1.mirrorY();
        expect(newVector.equals(vector2)).toBe(true);
    });

    it('converts to a string', function() {
        var vector = new Vector(-2,1);
        var vectorString = '-2,1';
        
        expect(vector.toString()).toBe(vectorString);
    });

    it('multiplies vector with scalar', function() {
        var vector = new Vector(-2,1);
        var newVector = new Vector(4,-2);
        
        expect(vector.multiplyScalar(-2).equals(newVector)).toBe(true);
    });
    
    it('calculates the dot product', function() {
        var vector1 = new Vector(-2,1);
        var vector2 = new Vector(3,-2);
        var result = vector1.multiplyVector(vector2);
        
        expect(ComparatorFunctions.compareWithTolerance(result, -8)).toBe(0);
    });

    it('subtracts vectors', function() {
        var vector1 = new Vector(5,7);
        var vector2 = new Vector(1,2);
        var expected = new Vector(4,5);
        var result = vector1.sub(vector2);
        
        expect(expected.equals(result)).toBe(true);
    });

    it('adds vectors', function() {
        var vector1 = new Vector(5,7);
        var vector2 = new Vector(1,2);
        var expected = new Vector(6,9);
        var result = vector1.add(vector2);
        
        expect(expected.equals(result)).toBe(true);
    });

    it('calculates the absolute value', function() {
        var vector = new Vector(2,-2);
        var expected = Math.sqrt(8);
        var result = vector.abs();
        
        expect(ComparatorFunctions.compareWithTolerance(expected, result)).toBe(0);
    });

    it('calculates the square of the absolute value', function() {
        var vector = new Vector(2,-2);
        var expected = 8;
        var result = vector.abssquare();
        
        expect(ComparatorFunctions.compareWithTolerance(expected, result)).toBe(0);
    });

    it('normalizes a vector', function() {
        var vector = new Vector(2,0);
        var expected = new Vector(1,0);
        var result = vector.normalize();
        
        expect(expected.equals(result)).toBe(true);
    });

    it('checks vectors for equlity', function() {
        var vector1 = new Vector(2,0);
        var vector2 = new Vector(2,0);
        var vector3 = new Vector(2,1);
        
        expect(vector1.equals(vector2)).toBe(true);
        expect(vector1.equals(vector3)).toBe(false);
    });

    it('calculates ccw angle of vector to x axis', function() {
        var vector = [];
        vector[0] = new Vector(1,0);
        vector[1] = new Vector(1,1);
        vector[2] = new Vector(0,1);
        vector[3] = new Vector(-1,1);
        vector[4] = new Vector(-1,0);
        vector[5] = new Vector(-1,-1);
        vector[6] = new Vector(0,-1);
        vector[7] = new Vector(1,-1);
        
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
            expect(ComparatorFunctions.compareWithTolerance(vector[i].getAngle(), angle[i])).toBe(0);
        }
    });

    it('compares two vectors by x coordinate', function() {
        var vector1 = new Vector(2,0);
        var vector2 = new Vector(2,1);
        var vector3 = new Vector(1,1);
        
        expect(Vector.compareByX(vector1, vector2)).toBe(0);
        expect(Vector.compareByX(vector1, vector3)).toBe(1);
        expect(Vector.compareByX(vector3, vector1)).toBe(-1);
    });

    it('compares two vectors by y coordinate', function() {
        var vector1 = new Vector(0,2);
        var vector2 = new Vector(1,2);
        var vector3 = new Vector(1,1);
        
        expect(Vector.compareByY(vector1, vector2)).toBe(0);
        expect(Vector.compareByY(vector1, vector3)).toBe(1);
        expect(Vector.compareByY(vector3, vector1)).toBe(-1);
    });

    it('compares two vectors first by x then by y coordinate', function() {
        var vector1 = new Vector(2,0);
        var vector2 = new Vector(2,1);
        var vector3 = new Vector(2,1);
        var vector4 = new Vector(1,1);
        
        expect(Vector.compareByXThenY(vector1, vector2)).toBe(-1);
        expect(Vector.compareByXThenY(vector2, vector1)).toBe(1);
        expect(Vector.compareByXThenY(vector2, vector3)).toBe(0);
        expect(Vector.compareByXThenY(vector3, vector4)).toBe(1);
        expect(Vector.compareByXThenY(vector4, vector3)).toBe(-1);
    });

    it('compares two vectors first by y then by x coordinate', function() {
        var vector1 = new Vector(0,2);
        var vector2 = new Vector(1,2);
        var vector3 = new Vector(1,2);
        var vector4 = new Vector(1,1);
        
        expect(Vector.compareByYThenX(vector1, vector2)).toBe(-1);
        expect(Vector.compareByYThenX(vector2, vector1)).toBe(1);
        expect(Vector.compareByYThenX(vector2, vector3)).toBe(0);
        expect(Vector.compareByYThenX(vector3, vector4)).toBe(1);
        expect(Vector.compareByYThenX(vector4, vector3)).toBe(-1);
    });
    
    it('calculates the distance between two point vectors', function() {
        var vector1 = new Vector(0,0);
        var vector2 = new Vector(2,2);
        
        var dist = Vector.calcDist(vector1, vector2);
        expect(ComparatorFunctions.compareWithTolerance(dist, Math.sqrt(8))).toBe(0);
    });

    it('calculates the square of the distance between two point vectors',
            function() {
        var vector1 = new Vector(0,0);
        var vector2 = new Vector(2,2);
        
        var dist = Vector.calcDistSquare(vector1, vector2);
        expect(ComparatorFunctions.compareWithTolerance(dist, 8)).toBe(0);
    });

    it('calculates the determinant', function() {
        var vector1 = new Vector(0,0);
        var vector2 = new Vector(0,1);
        var vector3 = new Vector(1,0);
        
        var det = Vector.calcDet(vector1, vector2, vector3);
        expect(ComparatorFunctions.compareWithTolerance(det, -1)).toBe(0);
        
        vector3 = new Vector(-1,0);
        det = Vector.calcDet(vector1, vector2, vector3);
        expect(ComparatorFunctions.compareWithTolerance(det, 1)).toBe(0);

        vector3 = new Vector(0,2);
        det = Vector.calcDet(vector1, vector2, vector3);
        expect(ComparatorFunctions.compareWithTolerance(det, 0)).toBe(0);
    });
});
