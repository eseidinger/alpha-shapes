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

(function(application, geom, util) {
    /**
     * Data store for shared data.
     */
    alphashape.application.SharedData = {};

    /**
     * Point set to compute diagrams from.
     *
     * @type Array.<alphashape.geom.Vector>
     */
    alphashape.application.SharedData.points = [];
    alphashape.application.SharedData.alphaDiscCenter = new geom.Vector(10, 10);

    alphashape.application.SharedData.alpha = 75;
    alphashape.application.SharedData.alphaMin = -100;
    alphashape.application.SharedData.alphaMax = 100;

    alphashape.application.SharedData.sweepLine = 0;

    alphashape.application.SharedData.selectedTriangle = 0;

    /**
     * Load point set from file if available.
     * @suppress {missingProperties}
     */
    alphashape.application.SharedData.init = function() {
        jQuery.ajaxSetup({
            async: false
        });
        if (util.Misc.isResourceAvailable('data/simple_point_set.json', 'GET')) {
            jQuery.getJSON('data/simple_point_set.json', function(data) {
                application.SharedData.points = data.map(function(point){return new geom.Vector(point.x, point.y);});
            });
        }
    };

    /**
     * Calculate minimum and maximum alpha from significant alphas if available.
     * If no significant alphas are available sets default value.
     */
    alphashape.application.SharedData.update = function() {
        var rect = new geom.Rectangle(0, 0, $('#canvas')[0].width, $('#canvas')[0].height);

        application.SharedData.points =
            application.SharedData.points.filter(function(point) {return rect.containsPoint(point);});

        application.Computations.compute(application.SharedData.points, application.SharedData.alpha,
            0, 0, $('#main').width(), $('#main').height(), application.SharedData.sweepLine);

        if (application.Computations.significantAlphas.length === 0) {
            application.SharedData.alphaMin = -100;
            application.SharedData.alphaMax = 100;
        } else {
            var alphaMin = util.constant.INFINITY;
            var alphaMax = -util.constant.INFINITY;
            application.Computations.significantAlphas.forEach(function(val) {
                if (val > alphaMax) {
                    alphaMax = Math.round(val);
                }
                if (val < alphaMin) {
                    alphaMin = Math.round(val);
                }
            });
            application.SharedData.alphaMin = alphaMin - 10;
            application.SharedData.alphaMax = alphaMax + 10;
        }
        application.SharedData.setAlpha(application.SharedData.alpha);
    };

    /**
     * Sets alpha value from slider value.
     *
     * @param {number} sliderValue
     */
    alphashape.application.SharedData.setAlpha = function(sliderValue) {
        if (sliderValue <= application.SharedData.alphaMin) {
            application.SharedData.alpha = -util.constant.INFINITY;
        } else if (sliderValue >= application.SharedData.alphaMax) {
            application.SharedData.alpha = util.constant.INFINITY;
        } else {
            application.SharedData.alpha = sliderValue;
        }
    };


    /**
     * Add a point to the point set given coordinates.
     *
     * @param {number} x coordinate of the new point
     * @param {number} y coordinate of the new point
     */
    alphashape.application.SharedData.addPoint = function(x, y) {
        application.SharedData.points.push(new geom.Vector(x, y));
    };

    /**
     * Remove the closest point with maximum distance to the given coordinate.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} maxDist
     */
    alphashape.application.SharedData.removePoint = function(x, y, maxDist) {
        var pointIndex = util.array.indexOfElementWithMinimalDistance(application.SharedData.points,
            new geom.Vector(x,y), function(p1, p2) {return p1.dist(p2);}, maxDist);

        if (pointIndex >= 0) {
            application.SharedData.points.splice(pointIndex, 1);
        }
    };
})(alphashape.application, alphashape.geom, alphashape.util);

