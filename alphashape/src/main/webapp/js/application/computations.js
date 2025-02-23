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

(function(algo, geom, application, drawing) {

    alphashape.application.Computations = {};

    /**
     * An array of points on the border of the convex hull in clockwise (screen coordinates) direction.
     *
     * @type {Array.<alphashape.geom.Polygon>}
     */
    alphashape.application.Computations.convexHull = [];

    /**
     * An array of line segments describing the closest point Voronoi diagram.
     *
     * @type {Array.<alphashape.geom.LineSegment>}
     */
    alphashape.application.Computations.voronoiMin = [];

    /**
     * An array of line segments describing the beach line and partial Voronoi diagram.
     *
     * @type {Array.<alphashape.geom.Bezier>}
     */
    alphashape.application.Computations.voronoiMinBeachLine = [];

    /**
     * An array of line segments describing the closest point Delaunay diagram.
     *
     * @type {Array.<alphashape.geom.LineSegment>}
     */
    alphashape.application.Computations.delaunayMin = [];

    /**
     * An array of line segments describing the farthest point Voronoi diagram.
     *
     * @type {Array.<alphashape.geom.LineSegment>}
     */
    alphashape.application.Computations.voronoiMax = [];

    /**
     * An array of line segments describing the triangles from which the farthest point Voronoi diagram is constructed.
     *
     * @type {Array.<Array.<alphashape.geom.LineSegment>>}
     */
    alphashape.application.Computations.voronoiMaxTriangles = [];

    /**
     *
     * @type {Array.<alphashape.geom.Vector>}
     */
    alphashape.application.Computations.voronoiMaxCenters = [];

    /**
     *
     * @type {Array.<Array.<alphashape.geom.PathElement>>}
     */
    alphashape.application.Computations.voronoiMaxCircles = [];

    /**
     *
     * @type {Array.<alphashape.geom.PathElement>}
     */
    alphashape.application.Computations.smallestCircle = [];

    /**
     * An array of line segments describing the farthest point Delaunay diagram.
     *
     * @type {Array.<alphashape.geom.LineSegment>}
     */
    alphashape.application.Computations.delaunayMax = [];

    /**
     * An array of alpha values for which the alpha shape changes.
     *
     * @type {Array.<number>}
     */
    alphashape.application.Computations.significantAlphas = [];

    /**
     * An array of line segments describing the edges of the alpha shape.
     *
     * @type {Array.<alphashape.geom.LineSegment>}
     */
    alphashape.application.Computations.alphaShapeEdges = [];


    /**
     * An array of points describing the vertices of the alpha shape.
     *
     * @type {Array.<alphashape.geom.Vector>}
     */
    alphashape.application.Computations.alphaShapeVertices = [];

    /**
     * An array of paths describing areas. For positive alpha, the union of these areas is the inverse alpha hull. For
     * negative alpha, the intersection of these areas is the alpha hull.
     *
     * @type {Array.<Array.<alphashape.geom.PathElement>>}
     */
    alphashape.application.Computations.alphaHull = [];

    /**
     * Initialize the computation result arrays.
     */
    alphashape.application.Computations.init = function() {
        application.Computations.convexHull = [];
        application.Computations.voronoiMin = [];
        application.Computations.voronoiMinBeachLine = [];
        application.Computations.delaunayMin = [];
        application.Computations.voronoiMax = [];
        application.Computations.voronoiMaxTriangles = [];
        application.Computations.voronoiMaxCenters = [];
        application.Computations.voronoiMaxCircles = [];
        application.Computations.smallestCircle = [];
        application.Computations.delaunayMax = [];
        application.Computations.significantAlphas = [];
        application.Computations.alphaShapeEdges = [];
        application.Computations.alphaShapeVertices = [];
        application.Computations.alphaHull = [];
    };

    /**
     * Compute alpha shape and hull including diagrams they are based on. That is the convex hull, Voronoi and
     * Delaunay diagram.
     *
     * @param {Array.<alphashape.geom.Vector>} points to compute geometry from
     * @param {number} alpha value to compute alpha shape for
     * @param {number} minX minimum x coordinate of view port
     * @param {number} minY minimum y coordinate of view port
     * @param {number} maxX maximum x coordinate of view port
     * @param {number} maxY maximum y coordinate of view port
     * @param {number} ly sweep line position
     */
    alphashape.application.Computations.compute = function(points, alpha, minX, minY, maxX, maxY, ly) {

        application.Computations.init();

        var rect = new geom.Rectangle(minX, minY, maxX, maxY);

        var convexHull =  algo.convexhull.compute(points);
        application.Computations.convexHull.push(new geom.Polygon(convexHull, true));

        if (drawing.DrawingController.displayAlphaHull || drawing.DrawingController.displayAlphaShape ||
            drawing.DrawingController.displayBeachLine || drawing.DrawingController.displayDelaunayMin ||
            drawing.DrawingController.displayVoronoiMin) {

            var fortuneResults = algo.fortune.computeVoronoiDiagram(points, ly);
            var voronoiMin = fortuneResults.voronoiDiagram;
            voronoiMin.getLineSegments().forEach(function(lineSegment) {
                var cropped = lineSegment.crop(rect);
                if (cropped !== null) {
                    application.Computations.voronoiMin.push(cropped);
                }
            });

            if (fortuneResults.constructionBeachLine.length === 1 &&
                fortuneResults.constructionBeachLine[0].constructor === algo.FortuneArc) {
                application.Computations.voronoiMinBeachLine.push(fortuneResults.constructionBeachLine[0].
                    toBezier(minX, maxX, ly));
            } else {
                var lastX = minX;
                fortuneResults.constructionBeachLine.forEach(function(bp, i, arr) {
                    var bpLocation = bp.getLocation(ly);
                    var xMin = lastX;
                    if (bpLocation.x > maxX) {
                        var xMax = maxX;
                    } else {
                        xMax = bpLocation.x;
                    }
                    lastX = xMax;
                    var bezier = bp.leftArc.toBezier(xMin, xMax, ly);
                    if (bezier !== null) {
                        application.Computations.voronoiMinBeachLine.push(bezier);
                    }
                    if (i === (arr.length - 1)) {
                        xMin = lastX;
                        xMax = maxX;
                        bezier = bp.rightArc.toBezier(xMin, xMax, ly);
                        if (bezier !== null) {
                            application.Computations.voronoiMinBeachLine.push(bezier);
                        }
                    }
                });
            }
            application.Computations.delaunayMin = algo.VoronoiDelaunay.computeDelaunay(voronoiMin).getLineSegments();
        }

        if (drawing.DrawingController.displayAlphaHull || drawing.DrawingController.displayAlphaShape ||
            drawing.DrawingController.displayTriangles || drawing.DrawingController.displayDelaunayMax ||
            drawing.DrawingController.displayVoronoiMax || drawing.DrawingController.displaySmallestCircle) {

            var skyumResults = algo.skyum.computeVoronoiDiagram(convexHull);
            application.Computations.voronoiMaxTriangles =
                skyumResults.voronoiTriangles.map(function (triangle) {
                    return triangle.getLineSegments();
                });
            application.Computations.voronoiMaxCircles =
                skyumResults.voronoiTriangles.map(function (triangle) {
                    return triangle.getCircumcircle().crop(rect);
                });
            application.Computations.voronoiMaxCenters =
                skyumResults.voronoiTriangles.map(function (triangle) {
                    var center = triangle.getCircumcircle().center;
                    if (rect.containsPoint(center)) {
                        return center;
                    } else {
                        return null;
                    }
                });
            if (skyumResults.smallestCircle !== null) {
                application.Computations.smallestCircle = skyumResults.smallestCircle.crop(rect);
            }
            var voronoiMax = skyumResults.voronoiDiagram;
            voronoiMax.getLineSegments().forEach(function (lineSegment) {
                var cropped = lineSegment.crop(rect);
                if (cropped !== null) {
                    application.Computations.voronoiMax.push(cropped);
                }
            });
            application.Computations.delaunayMax = algo.VoronoiDelaunay.computeDelaunay(voronoiMax).getLineSegments();
        }

        if (drawing.DrawingController.displayAlphaHull || drawing.DrawingController.displayAlphaShape) {
            var spectra = algo.AlphaShape.computeShapeSpectra(voronoiMin, voronoiMax);
            application.Computations.significantAlphas = spectra.significantAlphas;

            var alphaShape = algo.AlphaShape.computeAlphaShape(alpha, spectra.vertexSpectrum, spectra.edgeSpectrum);
            application.Computations.alphaShapeEdges = alphaShape.edges;
            application.Computations.alphaShapeVertices = alphaShape.vertices;

            var alphaHull = algo.AlphaShape.computeAlphaHull(alpha, spectra.edgeSpectrum);

            alphaHull.forEach(function (hullElement) {
                var path = hullElement.crop(rect);
                if (hullElement.constructor === geom.Circle) {
                    application.Computations.alphaHull.push(path);
                } else if (hullElement.constructor === geom.HalfPlane) {
                    application.Computations.alphaHull.push([path]);
                }
            });
        }
    }

})(alphashape.algo, alphashape.geom, alphashape.application, alphashape.canvas);
