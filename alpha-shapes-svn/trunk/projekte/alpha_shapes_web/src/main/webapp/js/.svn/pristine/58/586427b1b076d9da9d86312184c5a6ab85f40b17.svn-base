'use strict';

/**
 * Calculate the convex hull.
 * 
 * @constructor
 */
function ConvexHull() {
};

/**
 * Result of calculation. Point vectors of convex hull polygon.
 * 
 * @private
 * @type Array.<Vector>
 */
ConvexHull.convexHull;

/**
 * Determine whether a sequence of points makes a right turn given screen
 * coordinates (y coordinate mirrored).
 * 
 * @private
 * @param {Array.<Vector>} points point vectors
 * @returns {boolean} true if points make a right turn, false otherwise
 */
ConvexHull.makeRightTurn = function(points) {
    var det = Vector.calcDet(points[0], points[1], points[2]);
    return det > 0;
};

/**
 * Calculate half convex hull polygon of an sorted array of points.
 * 
 * @private
 * @param {Array.<Vector>} points sorted first by y and then by x coordinate
 * @returns {Array.<Vector>} point vectors of half convex hull polygon
 */
ConvexHull.calcHalfConvexHull = function (points) {
    if (points.length > 1) {
        // start with first two elements in point array
        var hull = points.slice(0, 2);
        for (var i = 2; i < points.length; i++) {
            hull.push(points[i]);
            // check last three points for right turn
            while (hull.length > 2 && !ConvexHull.makeRightTurn(hull.slice(-3)))
            {
                // remove middle element if no right turn detected
                hull.splice(-2, 1);
            }
        }
        return hull;
    } else {
        return points.slice(0);
    }
};

/**
 * Calculate convex hull points of an array of points on a plane.
 * 
 * @param {Array.<Vector>} points on a plane
 * @returns {Array.<Vector>} corners of contour polygon
 */
ConvexHull.calcConvexHull = function(points) {
    ConvexHull.convexHull = [];
    points = Misc.removeDoublesFromArray(points, Vector.compareByXThenY);
    
    if (points.length > 1) {
        
        points.sort(Vector.compareByXThenY);
        var L_upper = ConvexHull.calcHalfConvexHull(points);
        
        points.sort(function(p1, p2) {
            return -1 * Vector.compareByXThenY(p1, p2);
        });
        var L_lower = ConvexHull.calcHalfConvexHull(points);
        
        ConvexHull.convexHull = L_upper.concat(L_lower);
        ConvexHull.convexHull = Misc.removeDoublesFromArray(
                ConvexHull.convexHull, Vector.compareByXThenY);
        
    } else {
        ConvexHull.convexHull = points.slice(0);
    }
    
    return ConvexHull.convexHull;
};
