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

(function(canvas, geom, application, util) {

    /**
     * Controller for all events concerning the canvas canvas.
     */
    alphashape.canvas.CanvasEventController = {};

// constant controlling drag and drop events.
    /** @const */ alphashape.canvas.CanvasEventController.minMoveDist = 3;
    /** @const */ alphashape.canvas.CanvasEventController.minMoveDistTouch = 15;
    /** @const */ alphashape.canvas.CanvasEventController.maxPointDist = 5;
    /** @const */ alphashape.canvas.CanvasEventController.maxPointDistTouch = 25;

    alphashape.canvas.CanvasEventController.dragState = {x: 0, y: 0, dist: 0, selected: false};

    /**
     * Bind event handler functions.
     */
    alphashape.canvas.CanvasEventController.init = function() {
        $('#canvas')[0].oncontextmenu = function() {
            return false;
        };

        if (util.Misc.getInternetExplorerVersion() === -1) {
            $('#canvas').bind('mousedown', canvas.CanvasEventController.handleDragStart);
            $('#canvas').bind('mousemove', canvas.CanvasEventController.handleDragMove);
            $('#canvas').bind('mouseup', canvas.CanvasEventController.handleDragEnd);

            $('#canvas').bind('touchstart', canvas.CanvasEventController.handleTouchDragStart);
            $('#canvas').bind('touchmove', canvas.CanvasEventController.handleTouchDragMove);
            $('#canvas').bind('touchend', canvas.CanvasEventController.handleTouchDragEnd);
        } else if (navigator.userAgent.match(/Windows Phone/i)) {
            canvas.CanvasEventController.minMoveDist = canvas.CanvasEventController.minMoveDistTouch;
            canvas.CanvasEventController.maxPointDist = canvas.CanvasEventController.maxPointDistTouch;
            $('#canvas').bind('mousedown', canvas.CanvasEventController.handleDragStart);
            $('#canvas').bind('mousemove', canvas.CanvasEventController.handleDragMove);
            $('#canvas').bind('mouseup', canvas.CanvasEventController.handleDragEnd);
        } else{
            $('#canvas').bind('pointerdown', canvas.CanvasEventController.handlePointerDragStart);
            $('#canvas').bind('pointermove', canvas.CanvasEventController.handlePointerDragMove);
            $('#canvas').bind('pointerup', canvas.CanvasEventController.handlePointerDragEnd);
        }
    };

    /**
     * Mouse drag start event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleDragStart = function(event) {
        if (!canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.pageX - $('#canvas').offset().left;
            var y = event.originalEvent.pageY - $('#canvas').offset().top;
            if ($('#checkAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragStartAlphaDisc(x, y);
            } else {
                canvas.CanvasEventController.dragStartPoint(x, y,
                    canvas.CanvasEventController.maxPointDist);
            }
        }
        event.preventDefault();
    };

    /**
     * Internet Explorer mouse or touch drag start event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handlePointerDragStart = function(event) {
        if (!canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.pageX - $('#canvas').offset().left;
            var y = event.originalEvent.pageY - $('#canvas').offset().top;
            if ($('#checkAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragStartAlphaDisc(x, y);
            } else {
                if (event.originalEvent.pointerType === "mouse") {
                    canvas.CanvasEventController.dragStartPoint(x, y,
                        canvas.CanvasEventController.maxPointDist);
                } else if (event.originalEvent.pointerType === "touch") {
                    canvas.CanvasEventController.dragStartPoint(x, y,
                        canvas.CanvasEventController.maxPointDistTouch);
                }
            }
        }
        event.preventDefault();
    };

    /**
     * Touch drag start event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleTouchDragStart = function(event) {
        if (!canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.targetTouches[0].pageX -
                $('#canvas').offset().left;
            var y = event.originalEvent.targetTouches[0].pageY -
                $('#canvas').offset().top;
            if ($('#checkAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragStartAlphaDisc();
            } else {
                canvas.CanvasEventController.dragStartPoint(x, y,
                    canvas.CanvasEventController.maxPointDistTouch);
            }
        }
        event.preventDefault();
    };

    /**
     * Handle mouse and touch drag start event for point.
     *
     * @private
     * @param {number} x coordinate of event
     * @param {number} y coordinate of event
     * @param {number} maxDist of point in point set
     */
    alphashape.canvas.CanvasEventController.dragStartPoint = function(x, y, maxDist) {
        var pointIndex = util.array.indexOfElementWithMinimalDistance(application.SharedData.points,
            new geom.Vector(x,y), function(p1, p2) {return p1.dist(p2);}, maxDist);

        if (pointIndex >= 0) {
            canvas.CanvasEventController.dragState.x = application.SharedData.points[pointIndex].x;
            canvas.CanvasEventController.dragState.y = application.SharedData.points[pointIndex].y;

            canvas.CanvasEventController.dragState.selected = true;
        } else {
            canvas.CanvasEventController.dragState.x = x;
            canvas.CanvasEventController.dragState.y = y;
        }
        canvas.CanvasEventController.dragState.dist = 0;
    };

    /**
     * Handle mouse and touch drag start event for alpha disc.
     *
     * @private
     */
    alphashape.canvas.CanvasEventController.dragStartAlphaDisc = function() {
        canvas.CanvasEventController.dragState.selected = true;
    };

    /**
     * Mouse drag move event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleDragMove = function(event) {
        if (canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.pageX - $('#canvas').offset().left;
            var y = event.originalEvent.pageY - $('#canvas').offset().top;
            x = Math.round(x);
            y = Math.round(y);
            if ($('#checkAlphaDisc').is(':checked') ||
                $('#checkInverseAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragMoveAlphaDisc(x, y);
            } else {
                canvas.CanvasEventController.dragMovePoint(x, y);
            }
        }
        event.preventDefault();
    };

    /**
     * Internet Explorer mouse or touch drag move event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handlePointerDragMove = function(event) {
        if (canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.pageX - $('#canvas').offset().left;
            var y = event.originalEvent.pageY - $('#canvas').offset().top;
            x = Math.round(x);
            y = Math.round(y);
            if ($('#checkAlphaDisc').is(':checked') ||
                $('#checkInverseAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragMoveAlphaDisc(x, y);
            } else {
                canvas.CanvasEventController.dragMovePoint(x, y);
            }
        }
        event.preventDefault();
    };

    /**
     * Touch drag move event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleTouchDragMove = function(event) {
        if (canvas.CanvasEventController.dragState.selected) {
            var x = event.originalEvent.changedTouches[0].pageX -
                $('#canvas').offset().left;
            var y = event.originalEvent.changedTouches[0].pageY -
                $('#canvas').offset().top;
            x = Math.round(x);
            y = Math.round(y);
            if ($('#checkAlphaDisc').is(':checked')) {
                canvas.CanvasEventController.dragMoveAlphaDisc(x, y);
            } else {
                canvas.CanvasEventController.dragMovePoint(x, y);
            }
        }
        event.preventDefault();
    };

    /**
     * Handle mouse and touch drag move event for point.
     *
     * @private
     * @param {number} x coordinate of event
     * @param {number} y coordinate of event
     */
    alphashape.canvas.CanvasEventController.dragMovePoint = function(x, y) {
        application.SharedData.removePoint(canvas.CanvasEventController.dragState.x,
            canvas.CanvasEventController.dragState.y, 1);
        application.SharedData.addPoint(x, y);
        var dist = new geom.Vector(x, y).dist(new geom.Vector(canvas.CanvasEventController.dragState.x,
            canvas.CanvasEventController.dragState.y));
        canvas.CanvasEventController.dragState.dist += dist;
        canvas.CanvasEventController.dragState.x = x;
        canvas.CanvasEventController.dragState.y = y;
        application.Application.refresh();
    };

    /**
     * Handle mouse and touch drag move event for alpha disc.
     *
     * @private
     * @suppress {missingProperties}
     * @param {number} x coordinate of event
     * @param {number} y coordinate of event
     */
    alphashape.canvas.CanvasEventController.dragMoveAlphaDisc = function(x, y) {
        application.SharedData.alphaDiscCenter = new geom.Vector(x,y);
        application.Application.refresh();
    };

    /**
     * Mouse drag end event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleDragEnd = function(event) {
        var x = event.originalEvent.pageX - $('#canvas').offset().left;
        var y = event.originalEvent.pageY - $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            canvas.CanvasEventController.dragEndAlphaDisc(x, y);
        } else {
            canvas.CanvasEventController.dragEndPoint(x, y,
                canvas.CanvasEventController.minMoveDist);
        }
        event.preventDefault();
    };

    /**
     * Internet Explorer mouse or touch drag end event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handlePointerDragEnd = function(event) {
        var x = event.originalEvent.pageX - $('#canvas').offset().left;
        var y = event.originalEvent.pageY - $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            canvas.CanvasEventController.dragEndAlphaDisc(x, y);
        } else {
            if (event.originalEvent.pointerType === "mouse") {
                canvas.CanvasEventController.dragEndPoint(x, y,
                    canvas.CanvasEventController.minMoveDist);
            } else if (event.originalEvent.pointerType === "touch") {
                canvas.CanvasEventController.dragEndPoint(x, y,
                    canvas.CanvasEventController.minMoveDistTouch);
            }
        }
        event.preventDefault();
    };

    /**
     * Touch drag end event handler.
     *
     * @private
     * @suppress {missingProperties}
     * @param {Event} event
     */
    alphashape.canvas.CanvasEventController.handleTouchDragEnd = function(event) {
        var x = event.originalEvent.changedTouches[0].pageX -
            $('#canvas').offset().left;
        var y = event.originalEvent.changedTouches[0].pageY -
            $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            canvas.CanvasEventController.dragEndAlphaDisc(x, y);
        } else {
            canvas.CanvasEventController.dragEndPoint(x, y,
                canvas.CanvasEventController.minMoveDistTouch);
        }
        event.preventDefault();
    };

    /**
     * Handle drag end event for point.
     *
     * @private
     * @param {number} x coordinate of event
     * @param {number} y coordinate of event
     * @param {number} minMoveDist for point
     */
    alphashape.canvas.CanvasEventController.dragEndPoint = function(x, y, minMoveDist) {
        var dist = new geom.Vector(x, y).dist(new geom.Vector(canvas.CanvasEventController.dragState.x,
            canvas.CanvasEventController.dragState.y)) + canvas.CanvasEventController.dragState.dist;
        if (canvas.CanvasEventController.dragState.selected && (dist < minMoveDist)) {
            application.SharedData.removePoint(canvas.CanvasEventController.dragState.x,
                canvas.CanvasEventController.dragState.y, 1);
        } else if (dist < minMoveDist) {
            application.SharedData.addPoint(x, y);
        }
        canvas.CanvasEventController.dragState.selected = false;
        application.Application.refresh();
    };

    /**
     * Handle drag end event for alpha disc.
     *
     * @private
     * @param {number} x coordinate of event
     * @param {number} y coordinate of event
     */
    alphashape.canvas.CanvasEventController.dragEndAlphaDisc = function(x, y) {
        application.SharedData.alphaDiscCenter = new geom.Vector(x,y);
        canvas.CanvasEventController.dragState.selected = false;
        application.Application.refresh();
    };

})(alphashape.canvas, alphashape.geom, alphashape.application, alphashape.util);

