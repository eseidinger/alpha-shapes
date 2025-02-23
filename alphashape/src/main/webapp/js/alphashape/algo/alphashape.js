'use strict';

(function(util, geom, algo) {
    /**
     * Calculation of the alpha shape, inverse alpha hull and significant values for
     * alpha.
     *
     * @constructor
     */
    alphashape.algo.AlphaShape = function() {};
    var AlphaShape = alphashape.algo.AlphaShape;

    /**
     * Compute the shape spectra from given Voronoi diagrams.
     *
     * @param {alphashape.ds.EdgeList} closestPointVoronoiDiagram
     * @param {alphashape.ds.EdgeList} farthestPointVoronoiDiagram
     * @returns {{vertexSpectrum: Array.<alphashape.algo.VoronoiCell>,
 *              edgeSpectrum: Array.<alphashape.algo.VoronoiNeighbours>,
 *              significantAlphas: Array.<number>}}
     */
    alphashape.algo.AlphaShape.computeShapeSpectra = function(closestPointVoronoiDiagram,
                                              farthestPointVoronoiDiagram) {
        var farthestVoronoiNeighbours = algo.VoronoiDelaunay.computeVoronoiNeighbours(
            farthestPointVoronoiDiagram);
        var farthestVoronoiRegions = algo.VoronoiDelaunay.computeVoronoiCells(
            farthestPointVoronoiDiagram);
        var closestVoronoiNeighbours = algo.VoronoiDelaunay.computeVoronoiNeighbours(
            closestPointVoronoiDiagram);
        var closestVoronoiRegions = algo.VoronoiDelaunay.computeVoronoiCells(
            closestPointVoronoiDiagram);

        var significantAlphas = [];

        closestVoronoiNeighbours.forEach(function(neighbour) {
            var alphaMin = neighbour.getMinDist();
            var alphaMax = neighbour.getMaxDist();
            neighbour.alphaMin = alphaMin;
            if (alphaMax < util.constant.INFINITY / 2) {
                significantAlphas.push(alphaMax);
                neighbour.alphaMax = alphaMax;
            } else {
                neighbour.alphaMax = util.constant.INFINITY;
            }
            significantAlphas.push(alphaMin);
        });
        farthestVoronoiNeighbours.forEach(function(neighbour) {
            var alphaMin = -1 * neighbour.getMaxDist();
            var alphaMax = -1 * neighbour.getMinDist();
            neighbour.alphaMax = alphaMax;
            if (alphaMin > -1 * util.constant.INFINITY / 2) {
                neighbour.alphaMin = alphaMin;
                significantAlphas.push(alphaMin);
            } else {
                neighbour.alphaMin = -1 * util.constant.INFINITY;
            }
            significantAlphas.push(alphaMax);
        });
        closestVoronoiRegions.forEach(function(region) {
            var alphaMin = region.getMinDist();
            var alphaMax = region.getMaxDist();
            region.alphaMin = alphaMin;
            if (alphaMax < util.constant.INFINITY / 2) {
                significantAlphas.push(alphaMax);
                region.alphaMax = alphaMax;
            } else {
                region.alphaMax = util.constant.INFINITY;
            }
            significantAlphas.push(alphaMin);
        });
        farthestVoronoiRegions.forEach(function(region) {
            var alphaMin = -1 * region.getMaxDist();
            var alphaMax = -1 * region.getMinDist();
            region.alphaMax = alphaMax;
            if (alphaMin > -1 * util.constant.INFINITY / 2) {
                region.alphaMin = alphaMin;
                significantAlphas.push(alphaMin);
            } else {
                region.alphaMin = -1 * util.constant.INFINITY;
            }
            significantAlphas.push(alphaMax);
        });

        var voronoiNeighbours = farthestVoronoiNeighbours.concat(closestVoronoiNeighbours);
        var voronoiCells = farthestVoronoiRegions.concat(closestVoronoiRegions);

        significantAlphas = util.array.makeElementsUnique(significantAlphas,
            function(el1, el2) {return util.comparator.compareWithTolerance(el1, el2) === 0});

        return {'vertexSpectrum': voronoiCells, 'edgeSpectrum': voronoiNeighbours,
            'significantAlphas': significantAlphas};
    };

    /**
     * Compute the alpha shape from given alpha and shape spectra.
     *
     * @param {number} alpha
     * @param {Array.<alphashape.algo.VoronoiCell>} vertexSpectrum
     * @param {Array.<alphashape.algo.VoronoiNeighbours>} edgeSpectrum
     * @returns {{edges: Array.<alphashape.geom.LineSegment>, vertices: Array.<alphashape.geom.Vector>}}
     */
    alphashape.algo.AlphaShape.computeAlphaShape = function(alpha, vertexSpectrum, edgeSpectrum) {

        var edges = [];
        var vertices = [];

        edgeSpectrum.forEach(function(edgeSpectrum) {
            if ((util.comparator.compareWithTolerance(alpha, edgeSpectrum.alphaMin) !== -1) &&
                (util.comparator.compareWithTolerance(alpha, edgeSpectrum.alphaMax) !== 1)) {
                edges.push(edgeSpectrum.delaunayEdge);
            }
        });
        vertexSpectrum.forEach(function(vertexSpectrum) {
            if (util.comparator.compareWithTolerance(alpha, vertexSpectrum.alphaMax) !== 1) {
                vertices.push(vertexSpectrum.center);
            }
        });

        return {'edges': edges, 'vertices': vertices};
    };

    /**
     * Compute the alpha hull from given alpha and edge spectra.
     *
     * @param {number} alpha
     * @param {Array.<alphashape.algo.VoronoiNeighbours>} edgeSpectrum
     * @returns {Array.<{alphashape.geom.Circle}|{alphashape.geom.HalfPlane}>} alpha discs
     */
    alphashape.algo.AlphaShape.computeAlphaHull = function(alpha, edgeSpectrum) {

        var alphaDiscs = [];

        edgeSpectrum.forEach(function(neighbourPair) {
            if ((util.comparator.compareWithTolerance(alpha, neighbourPair.alphaMin) !== -1) &&
                (util.comparator.compareWithTolerance(alpha, neighbourPair.alphaMax) !== 1)) {
                var discs = AlphaShape.computeAlphaDiscs(alpha, neighbourPair);
                alphaDiscs = alphaDiscs.concat(discs);
            }
            if ((alpha > 0) && (neighbourPair.alphaMax > 0)) {
                discs = AlphaShape.computeBiggestDiscs(alpha, neighbourPair);
                alphaDiscs = alphaDiscs.concat(discs);
            }
        });

        return alphaDiscs;
    };

    /**
     * Compute the biggest possible alpha discs on Voronoi edge with a radius
     * greater or equal to alpha.
     *
     * @private
     * @param {number} alpha
     * @param {alphashape.algo.VoronoiNeighbours} neighbourPair
     * @returns {Array.<{alphashape.geom.Circle}|{alphashape.geom.HalfPlane}>}
     */
    alphashape.algo.AlphaShape.computeBiggestDiscs = function(alpha, neighbourPair) {
        var discs = [];

        var point1 = neighbourPair.delaunayEdge.start;
        var point2 = neighbourPair.delaunayEdge.end;
        var center1 = neighbourPair.commonBorder.start;
        var center2 = neighbourPair.commonBorder.end;
        var circle1 = geom.Circle.createWithPointAndCenter(point1, center1);
        var circle2 = geom.Circle.createWithPointAndCenter(point1, center2);
        var circles = [circle1, circle2];
        circles.forEach(function(circle) {
            if (util.comparator.compareWithTolerance(alpha, circle.radius) !== 1) {
                if (circle.radius < util.constant.INFINITY / 2) {
                    discs.push(circle);
                } else {
                    var halfPlaneBorder = point2.sub(point1).normalize();
                    var normal = halfPlaneBorder.rotate(Math.PI/2);
                    var orientation = circle.center.sub(point1).normalize();
                    var product = normal.multiplyVector(orientation);
                    if (product < 0) {
                        halfPlaneBorder = halfPlaneBorder.multiplyScalar(-1);
                    }
                    var halfPlane = new geom.HalfPlane(point1, halfPlaneBorder);
                    discs.push(halfPlane);
                }
            }
        });
        return discs;
    };

    /**
     * Compute the alpha discs with the centers of the Voronoi neighbours on their
     * border.
     *
     * @private
     * @param {number} alpha
     * @param {alphashape.algo.VoronoiNeighbours} neighbourPair
     * @returns {Array.<alphashape.geom.Circle>}
     */
    alphashape.algo.AlphaShape.computeAlphaDiscs = function(alpha, neighbourPair) {
        var discs = [];

        var alphaAbs = Math.abs(alpha);
        var point1 = neighbourPair.delaunayEdge.start;
        var point2 = neighbourPair.delaunayEdge.end;

        var circles = geom.Circle.createWith2PointsAndRadius(point1, point2, alphaAbs);
        if (circles.length === 1) {
            discs.push(circles[0]);
        } else if (circles.length === 2) {
            circles.forEach(function(circle) {
                if (neighbourPair.commonBorder.containsPoint(circle.center)) {
                    discs.push(circle);
                }
            });
        }
        return discs;
    };
})(alphashape.util, alphashape.geom, alphashape.algo);
