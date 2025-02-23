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

(function(algo, geom, util) {

    /**
     * Algorithm to construct the convex hull of a given set of points.
     *
     * @namespace
     */
    alphashape.algo.convexhull = {};

    /**
     * Determine whether a sequence of points makes a right turn given screen
     * coordinates (y coordinate mirrored).
     *
     * @private
     * @param {Array.<alphashape.geom.Vector>} points point vectors
     * @returns {boolean} true if points make a right turn, false otherwise
     */
    alphashape.algo.convexhull.makeRightTurn = function(points) {
        var det = geom.Vector.calcDet(points[0], points[1], points[2]);
        return det > 0;
    };

    /**
     * Calculate half convex hull polygon of an sorted array of points.
     *
     * @private
     * @param {Array.<alphashape.geom.Vector>} points sorted first by x and then by y coordinate
     * @returns {Array.<alphashape.geom.Vector>} point vectors of half convex hull polygon
     */
    alphashape.algo.convexhull.computeHalfConvexHull = function (points) {
        if (points.length > 1) {
            // start with first two elements in point array
            var hull = points.slice(0, 2);
            for (var i = 2; i < points.length; i++) {
                hull.push(points[i]);
                // check last three points for right turn
                while (hull.length > 2 && !algo.convexhull.makeRightTurn(hull.slice(-3)))
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
     * Compute convex hull points of an array of points on a plane. Points are returned in clockwise
     * (screen coordinates) order. The first point is the left and top most point of the convex hull.
     *
     * @param {Array.<alphashape.geom.Vector>} points on a plane
     * @returns {Array.<alphashape.geom.Vector>} corners of contour polygon
     */
    alphashape.algo.convexhull.compute = function(points) {
        var convexHull = [];

        if (points.length > 1) {

            var sorted = util.array.sort(points);
            var L_upper = algo.convexhull.computeHalfConvexHull(sorted);

            sorted = util.array.sort(points, function(p1, p2) {return -1 * geom.Vector.compare(p1, p2)});
            var L_lower = algo.convexhull.computeHalfConvexHull(sorted);

            convexHull = L_upper.concat(L_lower);
            convexHull = util.array.makeElementsUnique(convexHull);

        } else {
            convexHull = points.slice(0);
        }

        return convexHull;
    };
})(alphashape.algo, alphashape.geom, alphashape.util);
