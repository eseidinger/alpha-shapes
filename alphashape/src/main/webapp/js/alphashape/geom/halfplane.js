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

(function(geom, util) {
    /**
     * A half plane. The normal to the border, pointing inside the plane, is oriented 90 degrees clockwise
     * (screen coordinates) to the border.
     *
     * @param {alphashape.geom.Vector} origin point on the border of the half plane
     * @param {alphashape.geom.Vector} border direction of the border
     * @constructor
     */
    alphashape.geom.HalfPlane = function(origin, border) {
        this.origin = origin;
        this.border = border;
    };

    alphashape.geom.HalfPlane.prototype = {
        constructor: alphashape.geom.HalfPlane,

        /**
         * Checks whether this half plane contains a rectangle.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {boolean} true if half plane contains rectangle
         */
        containsRectangle: function(rect) {
            var normal = this.border.rotate(Math.PI / 2);
            var border = this.border;
            var origin = this.origin;
            return rect.points.reduce(function(acc, point) {
                return acc &&
                    (util.comparator.compareWithTolerance(point.sub(origin).multiplyVector(normal), 0) !== -1);}, true);
        },

        /**
         * Crops a half plane to fit a rectangle. Returns path in clockwise (screen coordinates) direction.
         *
         * @param {alphashape.geom.Rectangle} rect
         * @returns {alphashape.geom.Polygon} a polygon
         */
        crop: function(rect) {
            var lineSegment = new geom.LineSegment(this.origin.add(this.border.multiplyScalar(util.constant.INFINITY)),
                this.origin.sub(this.border.multiplyScalar(util.constant.INFINITY)));
            var ints = rect.getIntersections(lineSegment);

            var path = [];
            if (ints.length === 2) {
                var intsOrientation = ints[1].sub(ints[0]).normalize();
                var halfPlaneOrientation = this.border.normalize();
                if (intsOrientation.equals(halfPlaneOrientation)) {
                    path = rect.getPathOnBorder(ints[1], ints[0]);
                } else {
                    path = rect.getPathOnBorder(ints[0], ints[1]);
                }
            }
            if (path.length > 2) {
                return new geom.Polygon(path, true);
            } else {
                return null;
            }
        }
    };
})(alphashape.geom, alphashape.util);
