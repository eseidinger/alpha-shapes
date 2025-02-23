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

describe('Half plane', function() {

    var geom = alphashape.geom;
    var util = alphashape.util;

    it('checks whether it contains a rectangle', function() {
        var halfPlane = new geom.HalfPlane(new geom.Vector(0,0), new geom.Vector(1,0));

        var rect = new geom.Rectangle(0, 0, 1, 1);
        expect(halfPlane.containsRectangle(rect)).toBe(true);

        rect = new geom.Rectangle(0, 0, -1, -1);
        expect(halfPlane.containsRectangle(rect)).toBe(false);
    });

    it('crops a half plane to fit a rectangle', function() {
        var halfPlane = new geom.HalfPlane(new geom.Vector(0,0), new geom.Vector(1,0));
        var rect = new geom.Rectangle(-1, -1, 1, 1);
        var path = halfPlane.crop(rect);

        var expPath = [];
        expPath.push(new geom.Vector(-1,0));
        expPath.push(new geom.Vector(1,0));
        expPath.push(new geom.Vector(1,1));
        expPath.push(new geom.Vector(-1,1));

        expect(util.array.compare(path, expPath, true)).toBe(0);

        halfPlane = new geom.HalfPlane(new geom.Vector(0,0), new geom.Vector(-1,0));
        path = halfPlane.crop(rect);

        expPath = [];
        expPath.push(new geom.Vector(-1,0));
        expPath.push(new geom.Vector(-1,-1));
        expPath.push(new geom.Vector(1,-1));
        expPath.push(new geom.Vector(1,0));

        expect(util.array.compare(path, expPath, true)).toBe(0);

        halfPlane = new geom.HalfPlane(new geom.Vector(0,1), new geom.Vector(-1,0));
        path = halfPlane.crop(rect);

        expPath = [];
        expPath.push(new geom.Vector(-1,1));
        expPath.push(new geom.Vector(-1,-1));
        expPath.push(new geom.Vector(1,-1));
        expPath.push(new geom.Vector(1,-1));

        expect(util.array.compare(path, expPath, true)).toBe(0);

        halfPlane = new geom.HalfPlane(new geom.Vector(0,1), new geom.Vector(1,0));
        path = halfPlane.crop(rect);

        expect(path).toBe(null);
    });

});
