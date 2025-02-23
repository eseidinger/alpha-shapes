'use strict';

/**
 * Perform computations and provide results.
 * 
 * @constructor
 */
function Computations() {  
}

// Computation results

/** @type Array.<Vector> */ Computations.convexHull = [];

/** @type Array.<LineSegment> */ Computations.voronoiMin = [];
/** @type Array.<LineSegment> */ Computations.voronoiMax = [];

/** @type Array.<LineSegment> */ Computations.delaunayMin = [];
/** @type Array.<LineSegment> */ Computations.delaunayMax = [];

/** @type Array.<number> */ Computations.significantAlphas = [];
/** @type Array.<LineSegment> */ Computations.alphaShapeEdges = [];
/** @type Array.<LineSegment> */ Computations.alphaShapeVertices = [];
/** @type Array.<Circle> */ Computations.alphaHull = [];

/**
 * Perform computations and update results.
 */
Computations.update = function() {
    Computations.convexHull = ConvexHull.calcConvexHull(UserData.points);
    
    var voronoiMin = Fortune.computeVoronoiDiagram(UserData.points);
    Computations.voronoiMin = voronoiMin.getLineSegments();
    
    var delaunayMin = VoronoiDelaunay.computeDelaunay(voronoiMin);
    Computations.delaunayMin = delaunayMin.getLineSegments();
    
    var voronoiMax = Skyum.computeVoronoiDiagram(Computations.convexHull);
    Computations.voronoiMax = voronoiMax.getLineSegments();
    
    var delaunayMax = VoronoiDelaunay.computeDelaunay(voronoiMax);
    Computations.delaunayMax = delaunayMax.getLineSegments();
    
    var spectra = AlphaShape.computeShapeSpectra(voronoiMin, new EdgeList());
    Computations.significantAlphas = spectra.significantAlphas;
    
    var alphaShape = AlphaShape.computeAlphaShape(UserData.alpha,
        spectra.vertexSpectra, spectra.edgeSpectra);
    Computations.alphaShapeEdges = alphaShape.edges;
    Computations.alphaShapeVertices = alphaShape.vertices;
    
    Computations.alphaHull = AlphaShape.computeAlphaHull(UserData.alpha,
        spectra.edgeSpectra);
};
