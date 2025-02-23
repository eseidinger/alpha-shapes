'use strict';

var ConvexHull = alphashape.algo.ConvexHull;
var ArrayFunctions = alphashape.util.ArrayFunctions;
var Vector = alphashape.geom.Vector;

describe('Calculate convex hull', function() {
    it('calculates convex hull', function() {
        console.log('Convex hull test:');
        console.log('Number of test cases: ' + testCases.length);
        for (var i = 0; i < testCases.length; i++) {
            console.log('Test case: ' + testCases[i].testName);
            var convexHull = ConvexHull.calcConvexHull(testCases[i].points);
            testCases[i].expected.sort(Vector.compareByXThenY);
            convexHull.sort(Vector.compareByXThenY);
            var result = ArrayFunctions.compareArrays(testCases[i].expected,
                convexHull, Vector.compareByXThenY);
            if (!result) {
                console.log('Expected: ' + testCases[i].expected
                        + '\nActual: ' + ConvexHull.convexHull);
            } else {
                console.log('Passed');
            }
            expect(result).toBe(true);
        }
    });
});
