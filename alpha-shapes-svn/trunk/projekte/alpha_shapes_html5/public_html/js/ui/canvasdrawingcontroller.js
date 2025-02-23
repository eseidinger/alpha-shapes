'use strict';

var Constants = alphashape.util.Constants;

/**
 * Draw diagrams on canvas or SVG.
 * 
 * @constructor
 */
function CanvasDrawingController() {
}

// Constants to control appearance of the diagrams.
/** @const */ CanvasDrawingController.convexHullLineWidth = 2;
/** @const */ CanvasDrawingController.convexHullColor = '#000000';
/** @const */ CanvasDrawingController.convexHullOpacity = 1;
/** @const */ CanvasDrawingController.smallestCircleLineWidth = 2;
/** @const */ CanvasDrawingController.smallestCircleColor = '#000000';
/** @const */ CanvasDrawingController.smallestCircleOpacity = 1;
/** @const */ CanvasDrawingController.voronoiLineWidth = 2;
/** @const */ CanvasDrawingController.voronoiColor = '#0000ff';
/** @const */ CanvasDrawingController.voronoiOpacity = 0.5;
/** @const */ CanvasDrawingController.delaunayLineWidth = 2;
/** @const */ CanvasDrawingController.delaunayColor = '#ff0000';
/** @const */ CanvasDrawingController.delaunayOpacity = 0.5;
/** @const */ CanvasDrawingController.alphaShapeLineWidth = 10;
/** @const */ CanvasDrawingController.alphaShapePointSize = 12;
/** @const */ CanvasDrawingController.alphaShapeColor = '#ff0000';
/** @const */ CanvasDrawingController.alphaShapeOpacity = 0.2;
/** @const */ CanvasDrawingController.alphaHullColor = '#008000';
/** @const */ CanvasDrawingController.alphaHullOpacity = 0.2;

// Variables to control which diagrams are displayed. Set by ButtonController. 
CanvasDrawingController.displayAlphaShape = true;
CanvasDrawingController.displayAlphaHull = true;
CanvasDrawingController.displayAlphaDisc = false;
CanvasDrawingController.displayDelaunayMin = false;
CanvasDrawingController.displayVoronoiMin = false;
CanvasDrawingController.displayDelaunayMax = false;
CanvasDrawingController.displayDelaunayMin = false;
CanvasDrawingController.displayVoronoiMax = false;

// Paper to draw SVG on.
CanvasDrawingController.paper = null;

/**
 * Draw diagrams using the given canvas drawer.
 * 
 * @private
 * @param {(CanvasDrawer|SvgDrawer)} canvasDrawer
 */
CanvasDrawingController.draw = function(canvasDrawer) {
    if (CanvasDrawingController.displayAlphaHull) {
        CanvasDrawingController.drawAlphaHull(canvasDrawer);
    }
    if (CanvasDrawingController.displayDelaunayMin) {
        canvasDrawer.drawLines(Computations.delaunayMin,
            CanvasDrawingController.delaunayLineWidth,
            CanvasDrawingController.delaunayColor,
            CanvasDrawingController.delaunayOpacity);
    }
    if (CanvasDrawingController.displayVoronoiMin) {
        canvasDrawer.drawLines(Computations.voronoiMin,
            CanvasDrawingController.voronoiLineWidth,
            CanvasDrawingController.voronoiColor,
            CanvasDrawingController.voronoiOpacity);
    }
    if (CanvasDrawingController.displayDelaunayMax) {
        canvasDrawer.drawLines(Computations.delaunayMax,
            CanvasDrawingController.delaunayLineWidth,
            CanvasDrawingController.delaunayColor,
            CanvasDrawingController.delaunayOpacity);
    }
    if (CanvasDrawingController.displayVoronoiMax) {
        canvasDrawer.drawLines(Computations.voronoiMax,
            CanvasDrawingController.voronoiLineWidth,
            CanvasDrawingController.voronoiColor,
            CanvasDrawingController.voronoiOpacity);
    }
    if (CanvasDrawingController.displayAlphaShape) {
        CanvasDrawingController.drawAlphaShape(canvasDrawer);
    }
    canvasDrawer.drawPoints(UserData.points, 5, 'black', 1);
    if (CanvasDrawingController.displayAlphaDisc) {
        CanvasDrawingController.drawAlphaDisc(canvasDrawer);
    }
};

/**
 * Draw alpha shape using the given canvas drawer.
 * 
 * @private
 * @param {(CanvasDrawer|SvgDrawer)} canvasDrawer
 */
CanvasDrawingController.drawAlphaShape = function(canvasDrawer) {
    canvasDrawer.drawLines(Computations.alphaShapeEdges,
        CanvasDrawingController.alphaShapeLineWidth,
        CanvasDrawingController.alphaShapeColor,
        CanvasDrawingController.alphaShapeOpacity);
    canvasDrawer.drawPoints(Computations.alphaShapeVertices,
         CanvasDrawingController.alphaShapePointSize,
         CanvasDrawingController.alphaShapeColor,
         CanvasDrawingController.alphaShapeOpacity);
};

/**
 * Draw alpha hull using the given canvas drawer.
 * 
 * @private
 * @param {(CanvasDrawer|SvgDrawer)} canvasDrawer
 */
CanvasDrawingController.drawAlphaHull = function(canvasDrawer) {
    if (Math.abs(UserData.alpha) === Constants.INFINITY) {
        canvasDrawer.fillPolygon(Computations.convexHull,
            CanvasDrawingController.alphaHullColor,
            CanvasDrawingController.alphaHullOpacity);        
    } else if (UserData.alpha < 0) {
        if (UserData.points.length > 1) {
            canvasDrawer.fillCanvas(CanvasDrawingController.alphaHullColor,
                CanvasDrawingController.alphaHullOpacity);
            Computations.alphaHull.forEach(function(disc) {
                canvasDrawer.drawInverseDisc(disc, 'white', 1);
            });
        }
    } else if (UserData.alpha > 0) { 
        if (UserData.points.length > 2) {
            canvasDrawer.fillPolygon(Computations.convexHull,
                CanvasDrawingController.alphaHullColor,
                CanvasDrawingController.alphaHullOpacity);        
            Computations.alphaHull.forEach(function(disc) {
                canvasDrawer.drawDisc(disc, 'white', 1);
            });
        }
    }
};

/**
 * Draw alpha disc using the given canvas drawer.
 * 
 * @private
 * @param {(CanvasDrawer|SvgDrawer)} canvasDrawer
 */
CanvasDrawingController.drawAlphaDisc = function(canvasDrawer) {
    var alphaDisc = new Circle(UserData.alphaDiscCenter,
        Math.abs(UserData.alpha));
    var alphaCenterDisc = new Circle(UserData.alphaDiscCenter, 5);
    var color = 'green';
    if (UserData.alpha < 0) {
        UserData.points.forEach(function(point) {
            if (!alphaDisc.containsPoint(point)) {
                color = 'red';
            }
        });
    } else {
        UserData.points.forEach(function(point) {
            if (!alphaDisc.inverseContainsPoint(point)) {
                color = 'red';
            }
        });
    }
    canvasDrawer.drawDisc(alphaCenterDisc, color, 0.2);
    if (UserData.alpha !== 0) {
        canvasDrawer.drawDisc(alphaDisc, color, 0.2);
    }
};

/**
 * Update diagram drawings.
 */
CanvasDrawingController.update = function() {
    var mq = window.matchMedia('(orientation:landscape)');
    if (mq.matches) {
        $('#canvas')[0].width = window.innerWidth - 200;
        $('#canvas')[0].height = window.innerHeight - 5;
    } else {
        $('#canvas')[0].width = window.innerWidth - 20;
        $('#canvas')[0].height = window.innerHeight - 50;
    }
    CanvasDrawingController.draw(new CanvasDrawer($('#canvas')[0]));
};

/**
 * Draw diagrams as SVG using Raphael.
 */
CanvasDrawingController.drawSvg = function() {
    if (CanvasDrawingController.paper) {
        CanvasDrawingController.paper.remove();
    }
    CanvasDrawingController.paper = Raphael($('#svgDiv')[0],
        $('#canvas')[0].width, $('#canvas')[0].height);
    CanvasDrawingController.draw(new SvgDrawer(CanvasDrawingController.paper));
};
