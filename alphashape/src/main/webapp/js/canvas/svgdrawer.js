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
     * Draw SVG using Raphael.
     *
     * @param {Object} paper
     * @constructor
     * @implements {alphashape.canvas.Drawer}
     */
    alphashape.canvas.SvgDrawer = function(paper) {
        this.paper = paper;
    };

    alphashape.canvas.SvgDrawer.prototype = {
        constructor: alphashape.canvas.SvgDrawer,

        /**
         *
         * @param {Array.<alphashape.geom.Vector>} points
         * @param {number} radius
         * @param {string} color
         * @param {number} alpha
         */
        drawPoints: function(points, radius, color, alpha) {
            var drawPoints = points.map(function (pt) {
                return new geom.Circle(pt, radius);
            });
            this.fillPathElements(drawPoints, color, alpha);
        },
        /**
         *
         * @param {string} color
         * @param {number} alpha
         * @suppress {missingProperties}
         */
        fillCanvas: function(color, alpha) {
            var element = this.paper.rect(0,0,this.paper.width,this.paper.height);
            element.attr('fill', color);
            element.attr('fill-opacity', alpha);
        },
        createPathString: function(element) {
            if (element.pathType === 'line') {
                var pathString = 'L' + element.end.x + ',' + element.end.y;
            } else if (element.pathType === 'arc') {
                if (element.clockwise) {
                    var angleDiff = element.endAngle - element.startAngle;
                    var sweepFlag = 1;
                } else {
                    angleDiff = element.startAngle - element.endAngle;
                    sweepFlag = 0;
                }
                if (angleDiff < 0) {
                    angleDiff = 2*Math.PI + angleDiff;
                }
                if (angleDiff > Math.PI) {
                    var largeArcFlag = 1;
                } else {
                    largeArcFlag = 0;
                }
                pathString = 'A' + element.radius + ',' + element.radius + ',0,' + largeArcFlag + ',' +
                    sweepFlag + ',' + element.end.x + ',' + element.end.y;
            } else if (element.pathType === 'circle') {
                pathString = 'a' + element.radius + ',' + element.radius + ',0,1,1,0,-1';
            } else if (element.pathType === 'bezier') {
                pathString = 'Q' + element.controlPoints[0].x + ',' + element.controlPoints[0].y + ',' + element.end.x +
                    ',' + element.end.y;
            } else if (element.pathType === 'polygon') {
                pathString = '';
                element.points.forEach(function(point) {
                    pathString = pathString + 'L' + point.x + ',' + point.y;
                });
                if (element.closed) {
                    pathString = pathString + 'L' + element.start.x + ',' + element.start.y;
                }
            }
            return pathString;
        },
        /**
         *
         * @param {string}  pathString
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         * @suppress {missingProperties}
         */
        drawPathString: function(pathString, lineWidth, color, alpha) {
            var element = this.paper.path(pathString);
            element.attr('stroke', color);
            element.attr('stroke-width', lineWidth);
            element.attr('stroke-opacity', alpha);
        },
        /**
         *
         * @param {string} pathString
         * @param {string} color
         * @param {number} alpha
         * @suppress {missingProperties}
         */
        fillPathString: function(pathString, color, alpha) {
            var element = this.paper.path(pathString);
            element.attr('stroke', color);
            element.attr('stroke-opacity', alpha);
            element.attr('fill', color);
            element.attr('fill-opacity', alpha);
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPathElements: function(path, lineWidth, color, alpha) {
            var drawer = this;
            path.forEach(function(element) {
                var pathString = 'M' + element.start.x + ',' + element.start.y;
                pathString = pathString + drawer.createPathString(element);
                drawer.drawPathString(pathString, lineWidth, color, alpha);
            });
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathElements: function(path, color, alpha) {
            var drawer = this;
            path.forEach(function(element) {
                var pathString = 'M' + element.start.x + ',' + element.start.y;
                pathString = pathString + drawer.createPathString(element) + 'Z';
                drawer.fillPathString(pathString, color, alpha);
            });
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPath: function(path, lineWidth, color, alpha) {
            if (path.length > 0) {
                var pathString = 'M' + path[0].start.x + ',' + path[0].start.y;
                var drawer = this;
                path.forEach(function(element) {
                    pathString = pathString + drawer.createPathString(element);
                });
                this.drawPathString(pathString, lineWidth, color, alpha);
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPath: function(path, color, alpha) {
            if (path.length > 0) {
                var pathString = 'M' + path[0].start.x + ',' + path[0].start.y;
                var drawer = this;
                path.forEach(function(element) {
                    pathString = pathString + drawer.createPathString(element);
                });
                pathString = pathString + 'Z';
                this.fillPathString(pathString, color, alpha);
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathInverted: function(path, color, alpha) {
            if (path.length > 0) {
                var h = this.paper.height;
                var w = this.paper.width;
                var pathString = 'M0,0';
                pathString = pathString + 'L0,' + h;
                pathString = pathString + 'L' + w + ',' + h;
                pathString = pathString + 'L' + w + ',0';
                pathString = pathString + 'Z';
                pathString = pathString + 'M' + path[0].start.x + ',' + path[0].start.y;
                var drawer = this;
                path.forEach(function(element) {
                    pathString = pathString + drawer.createPathString(element);
                });
                pathString = pathString + 'Z';
                this.fillPathString(pathString, color, alpha);
            }
        }
    };
})(alphashape.canvas, alphashape.geom);
