'use strict';

/**
 * Controller for all events concerning the drawing canvas.
 * 
 * @constructor
 */
function CanvasEventController() {
}

// Constants controlling drag and drop events.
/** @const */ CanvasEventController.minMoveDist = 3;
/** @const */ CanvasEventController.minMoveDistTouch = 15;
/** @const */ CanvasEventController.maxPointDist = 5;
/** @const */ CanvasEventController.maxPointDistTouch = 25;

CanvasEventController.dragState = {startX: 0, startY: 0, x: 0, y: 0,
            selected: false, move: false};

/**
 * Bind event handler functions.
 */
CanvasEventController.init = function() {
    $('#canvas')[0].oncontextmenu = function() {
        return false;
    };
    
    $('#canvas').mousedown(CanvasEventController.handleDragStart);
    $('#canvas').mousemove(CanvasEventController.handleDragMove);
    $('#canvas').mouseup(CanvasEventController.handleDragEnd);

    $('#canvas').bind('touchstart', CanvasEventController.handleTouchDragStart);
    $('#canvas').bind('touchmove', CanvasEventController.handleTouchDragMove);
    $('#canvas').bind('touchend', CanvasEventController.handleTouchDragEnd);
};

/**
 * Mouse drag start event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleDragStart = function(event) {
    if (!CanvasEventController.dragState.selected) {
        var x = event.pageX - $('#canvas').offset().left;
        var y = event.pageY - $('#canvas').offset().top;
        if ($('#checkAlphaDisc').is(':checked')) {
            CanvasEventController.dragStartAlphaDisc(x, y);
        } else {
            CanvasEventController.dragStartPoint(x, y,
                CanvasEventController.maxPointDist);
        }
    }
    return false;
};

/**
 * Touch drag start event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleTouchDragStart = function(event) {
    if (!CanvasEventController.dragState.selected) {
        var x = event.originalEvent.targetTouches[0].pageX - 
                $('#canvas').offset().left;
        var y = event.originalEvent.targetTouches[0].pageY - 
                $('#canvas').offset().top;
        if ($('#checkAlphaDisc').is(':checked')) {
            CanvasEventController.dragStartAlphaDisc();
        } else {
            CanvasEventController.dragStartPoint(x, y,
                CanvasEventController.maxPointDistTouch);
        }
    }
    return false;
};

/**
 * Handle mouse and touch drag start event for point.
 * 
 * @private
 * @param {number} x coordinate of event
 * @param {number} y coordinate of event
 * @param {number} maxDist of point in point set
 */
CanvasEventController.dragStartPoint = function(x, y, maxDist) {
    var pointIndex = Misc.getIndexOfElementWithMinimalDistance(UserData.points,
            new Vector(x, y), Vector.calcDist, maxDist);
            
    if (pointIndex >= 0) {
        CanvasEventController.dragState.startX = UserData.points[pointIndex].x;
        CanvasEventController.dragState.startY = UserData.points[pointIndex].y;

        CanvasEventController.dragState.x = UserData.points[pointIndex].x;
        CanvasEventController.dragState.y = UserData.points[pointIndex].y;
        
        CanvasEventController.dragState.selected = true;
    } else {
        CanvasEventController.dragState.startX = x;
        CanvasEventController.dragState.startY = y;        
    }
};

/**
 * Handle mouse and touch drag start event for alpha disc.
 * 
 * @private
 */
CanvasEventController.dragStartAlphaDisc = function() {
    CanvasEventController.dragState.selected = true;
};

/**
 * Mouse drag move event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleDragMove = function(event) {
    if (CanvasEventController.dragState.selected) {
        var x = event.pageX - $('#canvas').offset().left;
        var y = event.pageY - $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            CanvasEventController.dragMoveAlphaDisc(x, y);
        } else {
            CanvasEventController.dragMovePoint(x, y);
        }
    }
};

/**
 * Touch drag move event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleTouchDragMove = function(event) {
    if (CanvasEventController.dragState.selected) {
        var x = event.originalEvent.changedTouches[0].pageX -
                $('#canvas').offset().left;
        var y = event.originalEvent.changedTouches[0].pageY -
                $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked')) {
            CanvasEventController.dragMoveAlphaDisc(x, y);
        } else {
            CanvasEventController.dragMovePoint(x, y);
        }
    }
};

/**
 * Handle mouse and touch drag move event for point.
 * 
 * @private
 * @param {number} x coordinate of event
 * @param {number} y coordinate of event
 */
CanvasEventController.dragMovePoint = function(x, y) {
    CanvasEventController.dragState.move = true;
    UserData.removePoint(CanvasEventController.dragState.x,
        CanvasEventController.dragState.y, 1);
    UserData.addPoint(x, y);
    CanvasEventController.dragState.x = x;
    CanvasEventController.dragState.y = y;
    Application.refresh();    
};

/**
 * Handle mouse and touch drag move event for alpha disc.
 * 
 * @private
 * @param {number} x coordinate of event
 * @param {number} y coordinate of event
 */
CanvasEventController.dragMoveAlphaDisc = function(x, y) {
    UserData.alphaDiscCenter = new Vector(x, y);
    Application.refresh();
};

/**
 * Mouse drag end event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleDragEnd = function(event) {
    var x = event.pageX - $('#canvas').offset().left;
    var y = event.pageY - $('#canvas').offset().top;
    x = Math.round(x);
    y = Math.round(y);
    if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
        CanvasEventController.dragEndAlphaDisc(x, y);
    } else {
        CanvasEventController.dragEndPoint(x, y,
            CanvasEventController.minMoveDist);
    }
};

/**
 * Touch drag end event handler.
 * 
 * @private
 * @param {Event} event
 */
CanvasEventController.handleTouchDragEnd = function(event) {
    var x = event.originalEvent.changedTouches[0].pageX - 
            $('#canvas').offset().left;
    var y = event.originalEvent.changedTouches[0].pageY - 
            $('#canvas').offset().top;
    x = Math.round(x);
    y = Math.round(y);
    if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
        CanvasEventController.dragEndAlphaDisc(x, y);
    } else {
        CanvasEventController.dragEndPoint(x, y,
            CanvasEventController.minMoveDistTouch);
    }
};

/**
 * Handle drag end event for point.
 * 
 * @private
 * @param {number} x coordinate of event
 * @param {number} y coordinate of event
 * @param {number} minMoveDist for point
 */
CanvasEventController.dragEndPoint = function(x, y, minMoveDist) {
    var startVector = new Vector(CanvasEventController.dragState.startX,
        CanvasEventController.dragState.startY);
    var endVector = new Vector(x, y);
    var dist = Vector.calcDist(startVector, endVector);
    if (CanvasEventController.dragState.selected) {
        if (!CanvasEventController.dragState.move || (dist < minMoveDist)) {
            UserData.removePoint(CanvasEventController.dragState.x,
                CanvasEventController.dragState.y, 1);
        } else {
            
        }
    } else if (dist < minMoveDist) {
        UserData.addPoint(x, y);        
    }
    CanvasEventController.dragState.selected = false;
    CanvasEventController.dragState.move = false;
    Application.refresh();            
};

/**
 * Handle drag end event for alpha disc.
 * 
 * @private
 * @param {number} x coordinate of event
 * @param {number} y coordinate of event
 */
CanvasEventController.dragEndAlphaDisc = function(x, y) {
    UserData.alphaDiscCenter = new Vector(x, y);
    CanvasEventController.dragState.selected = false;
    Application.refresh();
};
