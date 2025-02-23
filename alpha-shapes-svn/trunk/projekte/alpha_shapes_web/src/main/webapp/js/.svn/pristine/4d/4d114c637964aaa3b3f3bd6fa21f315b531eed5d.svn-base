'use strict';

/**
 * @constructor
 */
function CanvasController() {
}

CanvasController.minMoveDist = 3;
CanvasController.minMoveDistTouch = 10;
CanvasController.maxPointDist = 5;
CanvasController.maxPointDistTouch = 15;

CanvasController.dragState = {startX: 0, startY: 0, x: 0, y: 0, selected: false,
            move: false};

CanvasController.init = function() {
    $('#canvas')[0].oncontextmenu = function() {
        return false;
    };
    
    $('#canvas').mousedown(CanvasController.handleDragStart);
    $('#canvas').mousemove(CanvasController.handleDragMove);
    $('#canvas').mouseup(CanvasController.handleDragEnd);

    $('#canvas').bind('touchstart', CanvasController.handleTouchDragStart);
    $('#canvas').bind('touchmove', CanvasController.handleTouchDragMove);
    $('#canvas').bind('touchend', CanvasController.handleTouchDragEnd);
};

CanvasController.handleDragStart = function(event) {
    if (!CanvasController.dragState.selected) {
        var x = event.pageX - $('#canvas').offset().left;
        var y = event.pageY - $('#canvas').offset().top;
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            CanvasController.dragStartAlphaDisc(x, y);
        } else {
            CanvasController.dragStartPoint(x, y,
                CanvasController.maxPointDist);
        }
    }
    return false;
};

CanvasController.handleTouchDragStart = function(event) {
    if (!CanvasController.dragState.selected) {
        var x = event.originalEvent.targetTouches[0].pageX - 
                $('#canvas').offset().left;
        var y = event.originalEvent.targetTouches[0].pageY - 
                $('#canvas').offset().top;
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            CanvasController.dragStartAlphaDisc(x, y);
        } else {
            CanvasController.dragStartPoint(x, y,
                CanvasController.maxPointDistTouch);
        }
    }
    return false;
};

CanvasController.dragStartPoint = function(x, y, maxDist) {
    var pointIndex = Misc.getIndexOfElementWithMinimalDistance(UserData.points,
            new Vector(x, y), Vector.calcDist, maxDist);
            
    if (pointIndex >= 0) {
        CanvasController.dragState.startX = UserData.points[pointIndex].x;
        CanvasController.dragState.startY = UserData.points[pointIndex].y;

        CanvasController.dragState.x = UserData.points[pointIndex].x;
        CanvasController.dragState.y = UserData.points[pointIndex].y;
        
        CanvasController.dragState.selected = true;
    } else {
        CanvasController.dragState.startX = x;
        CanvasController.dragState.startY = y;        
    }
};

CanvasController.dragStartAlphaDisc = function(x, y) {
    CanvasController.dragState.selected = true;
};

CanvasController.handleDragMove = function(event) {
    if (CanvasController.dragState.selected) {
        var x = event.pageX - $('#canvas').offset().left;
        var y = event.pageY - $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            CanvasController.dragMoveAlphaDisc(x, y);
        } else {
            CanvasController.dragMovePoint(x, y);
        }
    }
};

CanvasController.handleTouchDragMove = function(event) {
    if (CanvasController.dragState.selected) {
        var x = event.originalEvent.changedTouches[0].pageX -
                $('#canvas').offset().left;
        var y = event.originalEvent.changedTouches[0].pageY -
                $('#canvas').offset().top;
        x = Math.round(x);
        y = Math.round(y);
        if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
            CanvasController.dragMoveAlphaDisc(x, y);
        } else {
            CanvasController.dragMovePoint(x, y);
        }
    }
};

CanvasController.dragMovePoint = function(x, y) {
    CanvasController.dragState.move = true;
    UserData.removePoint(CanvasController.dragState.x,
        CanvasController.dragState.y, 1);
    UserData.addPoint(x, y);
    CanvasController.dragState.x = x;
    CanvasController.dragState.y = y;
    Application.refresh();    
};

CanvasController.dragMoveAlphaDisc = function(x, y) {
    UserData.alphaDiscCenter = new Vector(x, y);
    Application.refresh();
};

CanvasController.handleDragEnd = function(event) {
    var x = event.pageX - $('#canvas').offset().left;
    var y = event.pageY - $('#canvas').offset().top;
    x = Math.round(x);
    y = Math.round(y);
    if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
        CanvasController.dragEndAlphaDisc(x, y);
    } else {
        CanvasController.dragEndPoint(x, y, CanvasController.minMoveDist);
    }
};

CanvasController.handleTouchDragEnd = function(event) {
    var x = event.originalEvent.changedTouches[0].pageX - 
            $('#canvas').offset().left;
    var y = event.originalEvent.changedTouches[0].pageY - 
            $('#canvas').offset().top;
    x = Math.round(x);
    y = Math.round(y);
    if ($('#checkAlphaDisc').is(':checked') ||
            $('#checkInverseAlphaDisc').is(':checked')) {
        CanvasController.dragEndAlphaDisc(x, y);
    } else {
        CanvasController.dragEndPoint(x, y, CanvasController.minMoveDistTouch);
    }
};

CanvasController.dragEndPoint = function(x, y, minMoveDist) {
    var startVector = new Vector(CanvasController.dragState.startX,
        CanvasController.dragState.startY);
    var endVector = new Vector(x, y);
    var dist = Vector.calcDist(startVector, endVector);
    if (CanvasController.dragState.selected) {
        if (!CanvasController.dragState.move || (dist < minMoveDist)) {
            UserData.removePoint(CanvasController.dragState.x,
                CanvasController.dragState.y, 1);
        } else {
            
        }
    } else if (dist < minMoveDist) {
        UserData.addPoint(x, y);        
    }
    CanvasController.dragState.selected = false;
    CanvasController.dragState.move = false;
    Application.refresh();            
};

CanvasController.dragEndAlphaDisc = function(x, y) {
    UserData.alphaDiscCenter = new Vector(x, y);
    CanvasController.dragState.selected = false;
    Application.refresh();
};
