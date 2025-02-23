'use strict';

var Vector = alphashape.geom.Vector;
var Rectangle = alphashape.geom.Rectangle;

describe('Rectangle', function() {

    it('calculates intersection points with line', function() {
        var rect = new Rectangle(0,0,1,1);
        var origin = new Vector(0.5,0.5);
        var dir1 = new Vector(1,0);
        var dir2 = new Vector(0,1);
        var line1 = new Line(origin, dir1);
        var line2 = new Line(origin, dir2);
        
        var int1 = new Vector(0,0.5);
        var int2 = new Vector(1,0.5);
        var ints = rect.getIntersections(line1);
        expect(ints.length).toBe(2);
        expect(ints.some(function(i) {
            return int1.equals(i);
        })).toBe(true);
        expect(ints.some(function(i) {
            return int2.equals(i);
        })).toBe(true);
        
        int1 = new Vector(0.5, 0);
        int2 = new Vector(0.5, 1);
        ints = rect.getIntersections(line2);
        expect(ints.length).toBe(2);
        expect(ints.some(function(i) {
            return int1.equals(i);
        })).toBe(true);
        expect(ints.some(function(i) {
            return int2.equals(i);
        })).toBe(true);
    });
    
});
