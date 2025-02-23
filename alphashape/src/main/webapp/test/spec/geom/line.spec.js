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

describe('Line', function() {

    var geom = alphashape.geom;

    it('projects a point on itself', function() {
        var origin = new geom.Vector(0,0);
        var direction = new geom.Vector(1,0);
        var line = new geom.Line(origin, direction);
        
        var point = new geom.Vector(0.5, 1);
        var expected = new geom.Vector(0.5, 0);
        var projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new geom.Vector(0.5, 0);
        expected = new geom.Vector(0.5, 0);
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new geom.Vector(-1, 1);
        expected = new geom.Vector(-1, 0);
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);

        point = new geom.Vector(1.5, 1);
        expected = new geom.Vector(1.5, 0);
        projection = line.pointProjection(point);
        expect(expected.equals(projection)).toBe(true);
    });

    it('calculates lambda to reach a point', function() {
        // Points
        var origin = new geom.Vector(0,0);
        var direction = new geom.Vector(0,0);
        var line = new geom.Line(origin, direction);
        var start = new geom.Vector(0,0);
        var out = new geom.Vector(0.1,0.1);
        expect(line.calculateLambda(start)).toBe(0);
        expect(line.calculateLambda(out)).toBe(null);
        
        // General
        direction = new geom.Vector(1,1);
        line = new geom.Line(origin, direction);
        var contained = new geom.Vector(3,3);
        out = new geom.Vector(2,3);
        expect(line.calculateLambda(start)).toBe(0);
        expect(line.calculateLambda(contained)).toBe(3);
        expect(line.calculateLambda(out)).toBe(null);

        // Parallel to y-Axis
        direction = new geom.Vector(0,1);
        line = new geom.Line(origin, direction);
        contained = new geom.Vector(0,2);
        out = new geom.Vector(1,2);
        expect(line.calculateLambda(contained)).toBe(2);
        expect(line.calculateLambda(out)).toBe(null);
        
        // Parallel to x-Axis
        direction = new geom.Vector(1,0);
        line = new geom.Line(origin, direction);
        contained = new geom.Vector(2,0);
        out = new geom.Vector(2,1);
        expect(line.calculateLambda(contained)).toBe(2);
        expect(line.calculateLambda(out)).toBe(null);
    });
    
    it('checks if it contains a point', function() {
        // Points
        var origin = new geom.Vector(0,0);
        var direction = new geom.Vector(0,0);
        var line = new geom.Line(origin, direction);
        var start = new geom.Vector(0,0);
        var out = new geom.Vector(0.1,0.1);
        expect(line.containsPoint(start)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
        
        // General
        direction = new geom.Vector(1,1);
        line = new geom.Line(origin, direction);
        var contained = new geom.Vector(3,3);
        out = new geom.Vector(2,3);
        expect(line.containsPoint(start)).toBe(true);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);

        // Parallel to y-Axis
        direction = new geom.Vector(0,1);
        line = new geom.Line(origin, direction);
        contained = new geom.Vector(0,2);
        out = new geom.Vector(1,2);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
        
        // Parallel to x-Axis
        direction = new geom.Vector(1,0);
        line = new geom.Line(origin, direction);
        contained = new geom.Vector(2,0);
        out = new geom.Vector(2,1);
        expect(line.containsPoint(contained)).toBe(true);
        expect(line.containsPoint(out)).toBe(false);
    });
    
    it('calculates intersection with another line', function() {
        var nullVect = new geom.Vector(0,0);
        var xAxis = new geom.Vector(1,0);
        var yAxis = new geom.Vector(0,1);
        var intOrigin = new geom.Vector(0.5, 0.5);
        var int1 = new geom.Vector(0.5, 0);
        var int2 = new geom.Vector(0, 0.5);
        
        var line = new geom.Line(nullVect, xAxis);
        
        // Parallels
        var inter = line.getIntersection(new geom.Line(yAxis, xAxis));
        expect(inter).toBe(null);
        
        inter = line.getIntersection(new geom.Line(yAxis, nullVect));
        expect(inter).toBe(null);
        
        // Points
        inter = line.getIntersection(new geom.Line(nullVect, nullVect));
        expect(inter.equals(nullVect)).toBe(true);
        inter = line.getIntersection(new geom.Line(xAxis, nullVect));
        expect(inter).toBe(null);
        
        line = new geom.Line(nullVect, nullVect);
        inter = line.getIntersection(new geom.Line(nullVect, xAxis));
        expect(inter.equals(nullVect)).toBe(true);
        inter = line.getIntersection(new geom.Line(yAxis, xAxis));
        expect(inter).toBe(null);
        
        // General
        line = new geom.Line(nullVect, xAxis);
        inter = line.getIntersection(new geom.Line(intOrigin,
                    yAxis.multiplyScalar(-1)));
        expect(inter.equals(int1)).toBe(true);

        inter = line.getIntersection(new geom.Line(intOrigin, yAxis));
        expect(inter.equals(int1)).toBe(true);
    });
    
});
