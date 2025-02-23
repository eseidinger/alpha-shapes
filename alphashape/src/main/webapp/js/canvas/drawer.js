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

(function(drawing, geom) {
    /**
     * A drawer
     *
     * @interface
     */
    alphashape.canvas.Drawer = function() {};

    alphashape.canvas.Drawer.prototype = {
        /**
         *
         * @param {Array.<alphashape.geom.Vector>} points
         * @param {number} radius
         * @param {string} color
         * @param {number} alpha
         */
        drawPoints: function (points, radius, color, alpha) {},
        /**
         *
         * @param {string} color
         * @param {number} alpha
         */
        fillCanvas: function (color, alpha) {},
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPathElements: function (path, lineWidth, color, alpha) {},
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathElements: function (path, color, alpha) {},
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPath: function (path, lineWidth, color, alpha) {},
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPath: function (path, color, alpha) {},
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathInverted: function (path, color, alpha) {}
    };
})(alphashape.canvas, alphashape.geom);
