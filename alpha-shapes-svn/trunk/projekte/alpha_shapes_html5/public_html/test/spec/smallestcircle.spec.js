'use strict';

var Skyum = alphashape.algo.Skyum;
var ComparatorFunctions = alphashape.util.ComparatorFunctions;

describe('Smallest enclosing circle', function() {
    it('calculates the smallest enclosing circle', function() {
        console.log('Smallest enclosing cirlce test:');
        console.log('Number of test cases: ' + testCases.length);
        for (var i = 0; i < testCases.length; i++) {
            console.log('Test case: ' + testCases[i].testName);
            var convexHull = ConvexHull.calcConvexHull(testCases[i].points);
            Skyum.computeVoronoiDiagram(convexHull);
            var circle = Skyum.smallestCircle;
            var result = ComparatorFunctions.compareWithTolerance(circle.center.x,
                    testCases[i].center.x, testCases[i].exactness) === 0;
            result = ComparatorFunctions.compareWithTolerance(circle.center.y,
                    testCases[i].center.y, testCases[i].exactness) === 0;
            if (!result) {
                console.log('Expected center: ' + testCases[i].center
                        + '\nActual center: ' + circle.center);
            } else {
                console.log('Center test passed');
            }
            expect(result).toBe(true);
            result = result && (ComparatorFunctions.compareWithTolerance(circle.radius,
                    testCases[i].radius, testCases[i].exactness) === 0);
            if (!result) {
                console.log('Expected radius: ' + testCases[i].radius
                        + '\nActual radius: ' + circle.radius);
            } else {
                console.log('Radius test passed');
            }
            expect(result).toBe(true);
        }
    });
});
