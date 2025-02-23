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

(function(drawing, geom, application) {
    /**
     * Draw diagrams on canvas or SVG.
     */
    alphashape.canvas.DrawingController = {};

// constant to control appearance of the diagrams.
    /** @const */ alphashape.canvas.DrawingController.convexHullLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.convexHullColor = '#000000';
    /** @const */ alphashape.canvas.DrawingController.convexHullOpacity = 1;
    /** @const */ alphashape.canvas.DrawingController.smallestCircleLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.smallestCircleColor = '#000000';
    /** @const */ alphashape.canvas.DrawingController.smallestCircleOpacity = 1;
    /** @const */ alphashape.canvas.DrawingController.voronoiLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.voronoiColor = '#0000ff';
    /** @const */ alphashape.canvas.DrawingController.voronoiOpacity = 0.5;
    /** @const */ alphashape.canvas.DrawingController.beachLineLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.beachLineColor = '#008000';
    /** @const */ alphashape.canvas.DrawingController.beachLineOpacity = 0.5;
    /** @const */ alphashape.canvas.DrawingController.trianglesLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.trianglesColor = '#008000';
    /** @const */ alphashape.canvas.DrawingController.trianglesOpacity = 0.5;
    /** @const */ alphashape.canvas.DrawingController.delaunayLineWidth = 2;
    /** @const */ alphashape.canvas.DrawingController.delaunayColor = '#ff0000';
    /** @const */ alphashape.canvas.DrawingController.delaunayOpacity = 0.5;
    /** @const */ alphashape.canvas.DrawingController.alphaShapeLineWidth = 10;
    /** @const */ alphashape.canvas.DrawingController.alphaShapePointSize = 12;
    /** @const */ alphashape.canvas.DrawingController.alphaShapeColor = '#ff0000';
    /** @const */ alphashape.canvas.DrawingController.alphaShapeOpacity = 0.2;
    /** @const */ alphashape.canvas.DrawingController.alphaHullColor = '#008000';
    /** @const */ alphashape.canvas.DrawingController.alphaHullOpacity = 0.2;

// Variables to control which diagrams are displayed. Set by FileMenu.
    alphashape.canvas.DrawingController.displayAlphaShape = true;
    alphashape.canvas.DrawingController.displayAlphaHull = true;
    alphashape.canvas.DrawingController.displayAlphaDisc = false;
    alphashape.canvas.DrawingController.displayDelaunayMin = false;
    alphashape.canvas.DrawingController.displayVoronoiMin = false;
    alphashape.canvas.DrawingController.displayBeachLine = false;
    alphashape.canvas.DrawingController.displayTriangles = false;
    alphashape.canvas.DrawingController.displaySmallestCircle = false;
    alphashape.canvas.DrawingController.displayConvexHull = false;
    alphashape.canvas.DrawingController.displayDelaunayMax = false;
    alphashape.canvas.DrawingController.displayDelaunayMin = false;
    alphashape.canvas.DrawingController.displayVoronoiMax = false;

// Paper to drawDiagrams SVG on.
    alphashape.canvas.DrawingController.paper = null;

    /**
     * Draw diagrams using the given canvas drawer.
     *
     * @private
     * @param {alphashape.canvas.Drawer} canvasDrawer
     */
    alphashape.canvas.DrawingController.drawDiagrams = function(canvasDrawer) {
        if (drawing.DrawingController.displayAlphaHull) {
            drawing.DrawingController.drawAlphaHull(canvasDrawer);
        }
        if (drawing.DrawingController.displayDelaunayMin) {
            canvasDrawer.drawPathElements(application.Computations.delaunayMin,
                drawing.DrawingController.delaunayLineWidth,
                drawing.DrawingController.delaunayColor,
                drawing.DrawingController.delaunayOpacity);
        }
        if (drawing.DrawingController.displayVoronoiMin) {
            canvasDrawer.drawPathElements(application.Computations.voronoiMin,
                drawing.DrawingController.voronoiLineWidth,
                drawing.DrawingController.voronoiColor,
                drawing.DrawingController.voronoiOpacity);
        }
        if (drawing.DrawingController.displayBeachLine) {
            var sweepLine = new geom.LineSegment(new geom.Vector(0, application.SharedData.sweepLine),
                new geom.Vector($('canvas')[0].width, application.SharedData.sweepLine));
            canvasDrawer.drawPathElements([sweepLine],
                drawing.DrawingController.beachLineLineWidth,
                drawing.DrawingController.beachLineColor,
                drawing.DrawingController.beachLineOpacity);
            canvasDrawer.drawPath(application.Computations.voronoiMinBeachLine,
                drawing.DrawingController.beachLineLineWidth,
                drawing.DrawingController.beachLineColor,
                drawing.DrawingController.beachLineOpacity);
        }
        if (drawing.DrawingController.displayDelaunayMax) {
            canvasDrawer.drawPathElements(application.Computations.delaunayMax,
                drawing.DrawingController.delaunayLineWidth,
                drawing.DrawingController.delaunayColor,
                drawing.DrawingController.delaunayOpacity);
        }
        if (drawing.DrawingController.displayVoronoiMax) {
            canvasDrawer.drawPathElements(application.Computations.voronoiMax,
                drawing.DrawingController.voronoiLineWidth,
                drawing.DrawingController.voronoiColor,
                drawing.DrawingController.voronoiOpacity);
        }
        if (drawing.DrawingController.displayTriangles) {
            if (application.SharedData.selectedTriangle > -1) {
                canvasDrawer.drawPathElements(application.Computations.voronoiMaxTriangles[application.SharedData.selectedTriangle],
                    drawing.DrawingController.trianglesLineWidth,
                    drawing.DrawingController.trianglesColor,
                    drawing.DrawingController.trianglesOpacity);
                if (application.Computations.voronoiMaxCenters[application.SharedData.selectedTriangle] !== null) {
                    canvasDrawer.drawPoints([application.Computations.voronoiMaxCenters[application.SharedData.selectedTriangle]],
                        10, drawing.DrawingController.trianglesColor, 0.5);
                }
                canvasDrawer.drawPathElements(application.Computations.voronoiMaxCircles[application.SharedData.selectedTriangle],
                    drawing.DrawingController.trianglesLineWidth,
                    drawing.DrawingController.trianglesColor,
                    drawing.DrawingController.trianglesOpacity);
            }
        }
        if (drawing.DrawingController.displaySmallestCircle) {
            canvasDrawer.drawPathElements(application.Computations.smallestCircle, 1, 'black', 1);
        }
        if (drawing.DrawingController.displayConvexHull) {
            canvasDrawer.drawPathElements(application.Computations.convexHull, 1, 'black', 1);
        }
        if (drawing.DrawingController.displayAlphaShape) {
            drawing.DrawingController.drawAlphaShape(canvasDrawer);
        }
        canvasDrawer.drawPoints(application.SharedData.points, 5, 'black', 1);
        if (drawing.DrawingController.displayAlphaDisc) {
            drawing.DrawingController.drawAlphaDisc(canvasDrawer);
        }
    };

    /**
     * Draw alpha shape using the given canvas drawer.
     *
     * @private
     * @param {alphashape.canvas.Drawer} canvasDrawer
     */
    alphashape.canvas.DrawingController.drawAlphaShape = function(canvasDrawer) {
        canvasDrawer.drawPathElements(application.Computations.alphaShapeEdges,
            drawing.DrawingController.alphaShapeLineWidth,
            drawing.DrawingController.alphaShapeColor,
            drawing.DrawingController.alphaShapeOpacity);
        canvasDrawer.drawPoints(application.Computations.alphaShapeVertices,
            drawing.DrawingController.alphaShapePointSize,
            drawing.DrawingController.alphaShapeColor,
            drawing.DrawingController.alphaShapeOpacity);
    };

    /**
     * Draw alpha hull using the given canvas drawer.
     *
     * @private
     * @param {alphashape.canvas.Drawer} canvasDrawer
     */
    alphashape.canvas.DrawingController.drawAlphaHull = function(canvasDrawer) {
        if (application.SharedData.points.length > 1) {
            canvasDrawer.fillCanvas(drawing.DrawingController.alphaHullColor,
                drawing.DrawingController.alphaHullOpacity);
            if (application.SharedData.alpha < 0) {
                application.Computations.alphaHull.forEach(function (path) {
                    canvasDrawer.fillPathInverted(path, 'white', 1);
                });
            } else if (application.SharedData.alpha > 0) {
                application.Computations.alphaHull.forEach(function (path) {
                    canvasDrawer.fillPath(path, 'white', 1);
                });
            }
        }
    };

    /**
     * Draw alpha disc using the given canvas drawer.
     *
     * @private
     * @param {alphashape.canvas.Drawer} canvasDrawer
     */
    alphashape.canvas.DrawingController.drawAlphaDisc = function(canvasDrawer) {
        var color = 'green';
        if (application.SharedData.alpha < 0) {
            application.SharedData.points.forEach(function(point) {
                if (application.SharedData.alphaDiscCenter.dist(point) >
                    -application.SharedData.alpha) {
                    color = 'red';
                }
            });
        } else {
            application.SharedData.points.forEach(function(point) {
                if (application.SharedData.alphaDiscCenter.dist(point) <
                    application.SharedData.alpha) {
                    color = 'red';
                }
            });
        }
        canvasDrawer.drawPoints([application.SharedData.alphaDiscCenter], 5, color, 0.2);
        if (application.SharedData.alpha !== 0) {
            canvasDrawer.drawPoints([application.SharedData.alphaDiscCenter], Math.abs(application.SharedData.alpha),
                color, 0.2);
        }
    };

    /**
     * Update diagram drawings.
     */
    alphashape.canvas.DrawingController.update = function() {
        $('#canvas')[0].width = $('#main').width();
        $('#canvas')[0].height = $('#main').height();
        drawing.DrawingController.drawDiagrams(new drawing.CanvasDrawer($('#canvas')[0]));
    };

    /**
     * Draw diagrams as SVG using Raphael.
     */
    alphashape.canvas.DrawingController.drawSvg = function() {
        if (drawing.DrawingController.paper) {
            drawing.DrawingController.paper.remove();
        }
        drawing.DrawingController.paper = Raphael($('#svgDiv')[0],
            $('#canvas')[0].width, $('#canvas')[0].height);
        drawing.DrawingController.drawDiagrams(new drawing.SvgDrawer(drawing.DrawingController.paper));
    };
})(alphashape.canvas, alphashape.geom, alphashape.application);
