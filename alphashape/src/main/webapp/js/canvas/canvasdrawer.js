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
     * Draw using canvas methods.
     *
     * @param {Object} canvas
     * @constructor
     * @implements {alphashape.canvas.Drawer}
     */
    alphashape.canvas.CanvasDrawer = function(canvas) {
        this.canvas = canvas;
    };

    alphashape.canvas.CanvasDrawer.prototype = {

        constructor: alphashape.canvas.CanvasDrawer,

        /**
         *
         * @param {Array.<alphashape.geom.Vector>} points
         * @param {number} radius
         * @param {string} color
         * @param {number} alpha
         */
        drawPoints: function (points, radius, color, alpha) {
            var drawPoints = points.map(function (pt) {
                return new geom.Circle(pt, radius);
            });
            this.fillPathElements(drawPoints, color, alpha);
        },
        /**
         *
         * @param {string} color
         * @param {number} alpha
         */
        fillCanvas: function (color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.canvas.width, 0);
                ctx.lineTo(this.canvas.width, this.canvas.height);
                ctx.lineTo(0, this.canvas.height);
                ctx.closePath();
                ctx.fill();
            }
        },
        /**
         *
         * @param {alphashape.geom.PathElement} pathElement
         * @param {Object} ctx
         */
        drawPathElement: function (pathElement, ctx) {
            if (pathElement.pathType === 'line') {
                ctx.lineTo(pathElement.end.x, pathElement.end.y);
            } else if (pathElement.pathType === 'arc') {
                ctx.arc(pathElement.center.x, pathElement.center.y, pathElement.radius,
                    pathElement.startAngle, pathElement.endAngle, !pathElement.clockwise);
            } else if (pathElement.pathType === 'circle') {
                ctx.arc(pathElement.center.x, pathElement.center.y, pathElement.radius,
                    0, 2 * Math.PI, false);
            } else if (pathElement.pathType === 'bezier') {
                ctx.quadraticCurveTo(pathElement.controlPoints[0].x, pathElement.controlPoints[0].y,
                    pathElement.end.x, pathElement.end.y);
            } else if (pathElement.pathType === 'polygon') {
                pathElement.points.forEach(
                    /**
                     * @param {?alphashape.geom.Vector} point
                     */
                    function(point) {
                    ctx.lineTo(point.x, point.y);
                });
                if (pathElement.closed) {
                    ctx.lineTo(pathElement.start.x, pathElement.start.y);
                }
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPathElements: function (path, lineWidth, color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = lineWidth;
                var drawer = this;
                path.forEach(
                    function (element) {
                        ctx.beginPath();
                        ctx.moveTo(element.start.x, element.start.y);
                        drawer.drawPathElement(element, ctx);
                        ctx.stroke();
                });
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathElements: function (path, color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                var drawer = this;
                path.forEach(
                    function (element) {
                    ctx.beginPath();
                    ctx.moveTo(element.start.x, element.start.y);
                    drawer.drawPathElement(element, ctx);
                    ctx.fill();
                });
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {number} lineWidth
         * @param {string} color
         * @param {number} alpha
         */
        drawPath: function (path, lineWidth, color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                if (path.length > 0) {
                    ctx.moveTo(path[0].start.x, path[0].start.y);
                }
                var drawer = this;
                path.forEach(
                    function (element) {
                    drawer.drawPathElement(element, ctx);
                });
                ctx.stroke();
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPath: function (path, color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (path.length > 0) {
                    ctx.moveTo(path[0].start.x, path[0].start.y);
                }
                var drawer = this;
                path.forEach(function (element) {
                    drawer.drawPathElement(element, ctx);
                });
                ctx.fill();
            }
        },
        /**
         *
         * @param {Array.<alphashape.geom.PathElement>} path
         * @param {string} color
         * @param {number} alpha
         */
        fillPathInverted: function (path, color, alpha) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, this.canvas.height);
                ctx.lineTo(this.canvas.width, this.canvas.height);
                ctx.lineTo(this.canvas.width, 0);
                ctx.closePath();
                if (path.length > 0) {
                    ctx.moveTo(path[0].start.x, path[0].start.y);
                }
                var drawer = this;
                path.forEach(function (element) {
                    drawer.drawPathElement(element, ctx);
                });
                ctx.fill();
            }
        }
    };
})(alphashape.canvas, alphashape.geom);

