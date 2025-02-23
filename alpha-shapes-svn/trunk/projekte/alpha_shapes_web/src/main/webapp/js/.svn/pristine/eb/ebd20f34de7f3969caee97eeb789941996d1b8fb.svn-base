'use strict';

/**
 * Calculation of the alpha shape, inverse alpha hull and significant values for
 * alpha.
 * 
 * @constructor
 */
function AlphaShape() { 
};

/**
 * Compute the shape spectra from given Voronoi diagrams.
 * 
 * @param {EdgeList} closestPointVoronoiDiagram
 * @param {EdgeList} farthestPointVoronoiDiagram
 * @returns {{vertexSpectra: Array.<VoronoiCell>,
 *              edgeSpectra: Array.<VoronoiNeighbours>,
 *              significantAlphas: Array.<number>}}
 */
AlphaShape.computeShapeSpectra = function(closestPointVoronoiDiagram,
            farthestPointVoronoiDiagram) {
    var farthestVoronoiNeighbours = VoronoiDelaunay.computeVoronoiNeighbours(
            farthestPointVoronoiDiagram);
    var farthestVoronoiRegions = VoronoiDelaunay.computeVoronoiCells(
            farthestPointVoronoiDiagram);
    var closestVoronoiNeighbours = VoronoiDelaunay.computeVoronoiNeighbours(
            closestPointVoronoiDiagram);
    var closestVoronoiRegions = VoronoiDelaunay.computeVoronoiCells(
            closestPointVoronoiDiagram);
    
    var significantAlphas = [];
        
    closestVoronoiNeighbours.forEach(function(neighbour) {
        var alphaMin = neighbour.getMinDist();
        var alphaMax = neighbour.getMaxDist();
        neighbour.alphaMin = alphaMin;
        if (alphaMax < Misc.INFINITY) {
            significantAlphas.push(alphaMax);
            neighbour.alphaMax = alphaMax;
        } else {
            neighbour.alphaMax = Misc.INFINITY;            
        }
        significantAlphas.push(alphaMin);
    });
    farthestVoronoiNeighbours.forEach(function(neighbour) {
        var alphaMin = -1 * neighbour.getMaxDist();
        var alphaMax = -1 * neighbour.getMinDist();
        neighbour.alphaMax = alphaMax;
        if (alphaMin > -1 * Misc.INFINITY) {
            neighbour.alphaMin = alphaMin;
            significantAlphas.push(alphaMin);            
        } else {
            neighbour.alphaMin = -1 * Misc.INFINITY;
        }
        significantAlphas.push(alphaMax);
    });
    closestVoronoiRegions.forEach(function(region) {
        var alphaMin = region.getMinDist();
        var alphaMax = region.getMaxDist();
        region.alphaMin = alphaMin;
        if (alphaMax < Misc.INFINITY) {
            significantAlphas.push(alphaMax);
            region.alphaMax = alphaMax;
        } else {
            region.alphaMax = Misc.INFINITY;            
        }
        significantAlphas.push(alphaMin);
    });
    farthestVoronoiRegions.forEach(function(region) {
        var alphaMin = -1 * region.getMaxDist();
        var alphaMax = -1 * region.getMinDist();
        region.alphaMax = alphaMax;
        if (alphaMin > -1 * Misc.INFINITY) {
            region.alphaMin = alphaMin;
            significantAlphas.push(alphaMin);            
        } else {
            region.alphaMin = -1 * Misc.INFINITY;
        }
        significantAlphas.push(alphaMax);
    });
    
    var voronoiNeighbours =
            farthestVoronoiNeighbours.concat(closestVoronoiNeighbours);
    var voronoiCells =
            farthestVoronoiRegions.concat(closestVoronoiRegions);
    
    return {'vertexSpectra': voronoiCells, 'edgeSpectra': voronoiNeighbours,
        'significantAlphas': significantAlphas};
};

/**
 * Compute the alpha shape from given alpha and shape spectra.
 * 
 * @param {number} alpha
 * @param {Array.<VoronoiCell>} vertexSpectra
 * @param {Array.<VoronoiNeighbours>} edgeSpectra
 * @returns {{edges: Array.<LineSegment>, vertices: Array.<Vector>}}
 */
AlphaShape.computeAlphaShape = function(alpha, vertexSpectra, edgeSpectra) {
    
    var edges = [];
    var vertices = [];
    
    edgeSpectra.forEach(function(edgeSpectrum) {
        if ((Misc.compareWithTolerance(alpha, edgeSpectrum.alphaMin) !== -1) &&
                (Misc.compareWithTolerance(alpha, edgeSpectrum.alphaMax) !== 1)) {
            edges.push(edgeSpectrum.delaunayEdge);
        }
    });
    vertexSpectra.forEach(function(vertexSpectrum) {
        if (Misc.compareWithTolerance(alpha, vertexSpectrum.alphaMax) !== 1) {
            vertices.push(vertexSpectrum.center);
        }        
    });
    
    return {'edges': edges, 'vertices': vertices};
};

/**
 * Compute the alpha hull from given alpha and edge spectra.
 * 
 * @param {number} alpha
 * @param {Array.<VoronoiNeighbours>} edgeSpectra
 * @returns {Array.<Circle>} alpha discs
 */
AlphaShape.computeAlphaHull = function(alpha, edgeSpectra) {
    
    var alphaDiscs = [];
    
    edgeSpectra.forEach(function(edgeSpectrum) {
        if ((Misc.compareWithTolerance(alpha, edgeSpectrum.alphaMin) !== -1) &&
                (Misc.compareWithTolerance(alpha, edgeSpectrum.alphaMax) !== 1)) {
            var discs = AlphaShape.computeAlphaDiscs(alpha, edgeSpectrum);
            alphaDiscs = alphaDiscs.concat(discs);
        }
        if ((alpha > 0) && (edgeSpectrum.alphaMax > 0)) {
            discs = AlphaShape.computeBiggestDiscs(alpha, edgeSpectrum);
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
 * @param {VoronoiNeighbours} edgeSpectrum
 * @returns {Array.<Circle>}
 */
AlphaShape.computeBiggestDiscs = function(alpha, edgeSpectrum) {    
    var discs = [];
       
    var point = edgeSpectrum.delaunayEdge.origin;
    var center1 = edgeSpectrum.commonBorder.origin;
    var center2 = edgeSpectrum.commonBorder.getEndpoint();
    var circle1 = Circle.createWithPointAndCenter(point, center1);
    var circle2 = Circle.createWithPointAndCenter(point, center2);
    if ((Misc.compareWithTolerance(alpha, circle1.radius) !== 1) &&
        (circle1.radius < Misc.INFINITY)) {
        discs.push(circle1);
    }
   if ((Misc.compareWithTolerance(alpha, circle2.radius) !== 1) &&
       (circle2.radius < Misc.INFINITY)) {
        discs.push(circle2);
    }
    return discs;
};

/**
 * Compute the alpha discs with the centers of the Voronoi neighbours on their
 * border.
 * 
 * @private
 * @param {number} alpha
 * @param {VoronoiNeighbours} edgeSpectrum
 * @returns {Array.<Circle>}
 */
AlphaShape.computeAlphaDiscs = function(alpha, edgeSpectrum) {
    var discs = [];
    
    var alphaAbs = Math.abs(alpha);
    var point1 = edgeSpectrum.delaunayEdge.origin;
    var point2 = edgeSpectrum.delaunayEdge.getEndpoint();

    var circles = Circle.createWith2PointsAndRadius(point1, point2,
                    alphaAbs);
    if (circles.length === 1) {
        discs.push(circles[0]);
    } else if (circles.length === 2) {
        circles.forEach(function(circle) {
            if (edgeSpectrum.commonBorder.containsPoint(circle.center)) {
                discs.push(circle);
            }             
        });
    }
    
    return discs;
};
