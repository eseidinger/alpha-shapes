'use strict';

var ComparatorFunctions = alphashape.util.ComparatorFunctions;
var FortuneArc = alphashape.algo.FortuneArc;
var FortuneBreakpoint = alphashape.algo.FortuneBreakpoint;
var Fortune = alphashape.algo.Fortune;
var Vector = alphashape.geom.Vector;
var Face = alphashape.ds.Face;

describe('FortuneArc', function () {
    it('represents an parabolic arc in the beach line', function () {
        var face = new Face();
        face.center = new Vector(1, 2);
        var arc = new FortuneArc(face);
        var y = arc.getY(1, 2);
        expect(y).toBe(2);

        face = new Face();
        face.center = new Vector(0, 0.25);
        arc = new FortuneArc(face);
        y = arc.getY(0, -0.25);
        expect(ComparatorFunctions.compareWithTolerance(y, 0)).toBe(0);
        y = arc.getY(1, -0.25);
        expect(ComparatorFunctions.compareWithTolerance(y, 1)).toBe(0);
        y = arc.getY(-1, -0.25);
        expect(ComparatorFunctions.compareWithTolerance(y, 1)).toBe(0);
        y = arc.getY(2, -0.25);
        expect(ComparatorFunctions.compareWithTolerance(y, 4)).toBe(0);
    });
});

describe('FortuneBreakpoint', function () {

    it('represents an only breakpoint of two arcs with same y coordinate',
        function () {
            var face = new Face();
            face.center = new Vector(-1, 0.25);
            var leftArc = new FortuneArc(face);
            face = new Face();
            face.center = new Vector(1, 0.25);
            var rightArc = new FortuneArc(face);
            var onlyBreakpoint = new FortuneBreakpoint(leftArc, rightArc);

            var location = onlyBreakpoint.getLocation(-0.25);
            expect(ComparatorFunctions.compareWithTolerance(location.x, 0)).
                toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(location.y, 1)).
                toBe(0);

            expect(onlyBreakpoint.isOnlyBreakpoint()).toBe(true);
            expect(onlyBreakpoint.isLeftBreakpoint()).toBe(true);
            expect(onlyBreakpoint.isRightBreakpoint()).toBe(false);

            var origin = onlyBreakpoint.getOrigin();
            expect(ComparatorFunctions.compareWithTolerance(origin.x, 0)).
                toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(origin.y, 0.25)).
                toBe(0);

            var direction = onlyBreakpoint.getDirection();
            expect(ComparatorFunctions.compareWithTolerance(direction.x, 0)).
                toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(direction.y, -1)).
                toBe(0);
        });

    it('represents a breakpoint of two arcs with two breakpoints and same x ' +
        'coordinate', function () {
        var face = new Face();
        face.center = new Vector(0,1);
        var upperArc = new FortuneArc(face);
        face = new Face();
        face.center = new Vector(0,2);
        var lowerArc = new FortuneArc(face);
        var rightBreakpoint = new FortuneBreakpoint(upperArc, lowerArc);
        var leftBreakpoint = new FortuneBreakpoint(lowerArc, upperArc);

        var location1 = rightBreakpoint.getLocation(0);
        var location2 = leftBreakpoint.getLocation(0);
        var diff = location1.sub(location2).normalize();
        expect(ComparatorFunctions.compareWithTolerance(diff.x, 1)).toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(diff.y, 0)).toBe(0);

        expect(rightBreakpoint.isOnlyBreakpoint()).toBe(false);
        expect(rightBreakpoint.isLeftBreakpoint()).toBe(false);
        expect(rightBreakpoint.isRightBreakpoint()).toBe(true);

        expect(leftBreakpoint.isOnlyBreakpoint()).toBe(false);
        expect(leftBreakpoint.isLeftBreakpoint()).toBe(true);
        expect(leftBreakpoint.isRightBreakpoint()).toBe(false);

        var leftOrigin = leftBreakpoint.getOrigin();
        expect(ComparatorFunctions.compareWithTolerance(leftOrigin.x, 0)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(leftOrigin.y, 1.5)).
            toBe(0);
        var rightOrigin = rightBreakpoint.getOrigin();
        expect(ComparatorFunctions.compareWithTolerance(rightOrigin.x, 0)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(rightOrigin.y, 1.5)).
            toBe(0);

        var leftDirection = leftBreakpoint.getDirection();
        expect(ComparatorFunctions.compareWithTolerance(leftDirection.x, -1)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(leftDirection.y, 0)).
            toBe(0);
        var rightDirection = rightBreakpoint.getDirection();
        expect(ComparatorFunctions.compareWithTolerance(rightDirection.x, 1)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(rightDirection.y, 0)).
            toBe(0);
    });

    it('represents a breakpoint of two parabolic arcs in the beach line',
        function () {
            var face = new Face();
            face.center = new Vector(-1,2);
            var leftArc = new FortuneArc(face);
            face = new Face();
            face.center = new Vector(1,1);
            var rightArc = new FortuneArc(face);
            var leftBreakpoint = new FortuneBreakpoint(leftArc, rightArc);
            var rightBreakpoint = new FortuneBreakpoint(rightArc, leftArc);

            var leftLocation = leftBreakpoint.getLocation(0);
            var rightLocation = rightBreakpoint.getLocation(0);
            expect(leftLocation.x < rightLocation.x).toBe(true);

            expect(leftBreakpoint.isOnlyBreakpoint()).toBe(false);
            expect(leftBreakpoint.isLeftBreakpoint()).toBe(true);
            expect(leftBreakpoint.isRightBreakpoint()).toBe(false);

            expect(rightBreakpoint.isOnlyBreakpoint()).toBe(false);
            expect(rightBreakpoint.isLeftBreakpoint()).toBe(false);
            expect(rightBreakpoint.isRightBreakpoint()).toBe(true);

            var leftOrigin = leftBreakpoint.getOrigin();
            expect(ComparatorFunctions.compareWithTolerance(leftOrigin.x, 0)).
                toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(leftOrigin.y, 1.5)).
                toBe(0);
            var rightOrigin = rightBreakpoint.getOrigin();
            expect(ComparatorFunctions.compareWithTolerance(rightOrigin.x, 0)).
                toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(rightOrigin.y, 1.5)).
                toBe(0);

            var leftDirectionEstimate = new Vector(-1, -2);
            leftDirectionEstimate = leftDirectionEstimate.normalize();
            var rightDirectionEstimate = new Vector(1, 2);
            rightDirectionEstimate = rightDirectionEstimate.normalize();
            var leftDirection = leftBreakpoint.getDirection();
            expect(ComparatorFunctions.compareWithTolerance(leftDirection.x,
                leftDirectionEstimate.x)).toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(leftDirection.y,
                leftDirectionEstimate.y)).toBe(0);
            var rightDirection = rightBreakpoint.getDirection();
            expect(ComparatorFunctions.compareWithTolerance(rightDirection.x,
                rightDirectionEstimate.x)).toBe(0);
            expect(ComparatorFunctions.compareWithTolerance(rightDirection.y,
                rightDirectionEstimate.y)).toBe(0);
        });

    it('represents a breakpoint of two parabolic arcs in the beach line ' +
        'with switched y coordinate', function () {
        var face = new Face();
        face.center = new Vector(-1,1);
        var leftArc = new FortuneArc(face);
        face = new Face();
        face.center = new Vector(1,2);
        var rightArc = new FortuneArc(face);
        var rightBreakpoint = new FortuneBreakpoint(leftArc, rightArc);
        var leftBreakpoint = new FortuneBreakpoint(rightArc, leftArc);

        var leftLocation = leftBreakpoint.getLocation(0);
        var rightLocation = rightBreakpoint.getLocation(0);
        expect(leftLocation.x < rightLocation.x).toBe(true);

        expect(leftBreakpoint.isOnlyBreakpoint()).toBe(false);
        expect(leftBreakpoint.isLeftBreakpoint()).toBe(true);
        expect(leftBreakpoint.isRightBreakpoint()).toBe(false);

        expect(rightBreakpoint.isOnlyBreakpoint()).toBe(false);
        expect(rightBreakpoint.isLeftBreakpoint()).toBe(false);
        expect(rightBreakpoint.isRightBreakpoint()).toBe(true);

        var leftOrigin = leftBreakpoint.getOrigin();
        expect(ComparatorFunctions.compareWithTolerance(leftOrigin.x, 0)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(leftOrigin.y, 1.5)).
            toBe(0);
        var rightOrigin = rightBreakpoint.getOrigin();
        expect(ComparatorFunctions.compareWithTolerance(rightOrigin.x, 0)).
            toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(rightOrigin.y, 1.5)).
            toBe(0);

        var leftDirectionEstimate = new Vector(-1, 2);
        leftDirectionEstimate = leftDirectionEstimate.normalize();
        var rightDirectionEstimate = new Vector(1, -2);
        rightDirectionEstimate = rightDirectionEstimate.normalize();
        var leftDirection = leftBreakpoint.getDirection();
        expect(ComparatorFunctions.compareWithTolerance(leftDirection.x,
            leftDirectionEstimate.x)).toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(leftDirection.y,
            leftDirectionEstimate.y)).toBe(0);
        var rightDirection = rightBreakpoint.getDirection();
        expect(ComparatorFunctions.compareWithTolerance(rightDirection.x,
            rightDirectionEstimate.x)).toBe(0);
        expect(ComparatorFunctions.compareWithTolerance(rightDirection.y,
            rightDirectionEstimate.y)).toBe(0);
    });

});

describe('Fortunes algorithm', function () {

    it('calculates a voronoi diagram of 2 points', function () {
        var points = [];
        points.push(new Vector(100, 100));
        points.push(new Vector(200, 100));
        Fortune.computeVoronoiDiagram(points);
    });

    it('calculates a voronoi diagram of 3 points', function () {
        var points = [];
        points.push(new Vector(100, 100));
        points.push(new Vector(200, 100));
        points.push(new Vector(200, 200));
        Fortune.computeVoronoiDiagram(points);
    });

    it('calculates a Voronoi diagram', function () {
        var points = [];
        points.push(new Vector(200, 100));
        points.push(new Vector(100, 200));
        points.push(new Vector(200, 200));
        points.push(new Vector(300, 200));
        points.push(new Vector(200, 300));
        Fortune.computeVoronoiDiagram(points);
    });
});
