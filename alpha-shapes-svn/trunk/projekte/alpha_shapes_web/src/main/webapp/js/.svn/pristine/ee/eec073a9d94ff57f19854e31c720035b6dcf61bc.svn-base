'use strict';

/**
 * A doubly connected edge list as described in 'Computational Geometry -
 * Algorithms and Applications' by Mark de Berg et al.
 * 
 * @constructor
 */
function EdgeList() {
    /**
     * @type Array.<Vertex>
     */
    this.vertices = [];
    /**
     * @type Array.<Face>
     */
    this.faces = [];
    /**
     * @type Array.<HalfEdge>
     */
    this.halfEdges = [];
};

EdgeList.prototype = {
    constructor: EdgeList,
    /**
     * Creates a new face, adds it to the face array and returns a reference.
     * 
     * @returns {Face} the newly created face
     */
    getNewFace: function() {
        var face = new Face();
        this.faces.push(face);
        return face;
    },
    /**
     * Creates a new half edge, adds it to the array and returns a reference.
     * 
     * @returns {HalfEdge} the newly created half edge
     */
    getNewHalfEdge: function() {
        var halfEdge = new HalfEdge();
        this.halfEdges.push(halfEdge);
        return halfEdge;
    },
    /**
     * Creates a new half edge and its twin, adds them to the array and returns
     * a reference.
     * 
     * @returns {HalfEdge} the newly created half edge containing a newly
     *                      created twin
     */
    getNewHalfEdgePair: function() {
        var halfEdge = this.getNewHalfEdge();
        var twin = this.getNewHalfEdge();
        halfEdge.twin = twin;
        twin.twin = halfEdge;
        return halfEdge;
    },
    /**
     * Creates a new Vertex, adds it to the array and returns a refernce.
     * 
     * @returns {Vertex} the newly created Vertex
     */
    getNewVertex: function() {
        var vertex = new Vertex();
        this.vertices.push(vertex);
        return vertex;
    },
    /**
     * Search for a face with a given center.
     * 
     * @param {Vector} center of the face
     * @returns {?Face} face with the given origin, if existent, null otherwise
     */
    getFace: function(center) {
        var result = null;
        this.faces.forEach(function(face) {
            if (center.equals(face.center)) {
                result = face;
            }
        });
        return result;
    },
    /**
     * Search for a vertex with given coordinates.
     * 
     * @param {Vector} coord coordinates of the vertex
     * @returns {?Vertex} vertex with the given coordinates, if existent, null
     *                      otherwise
     */
    getVertex: function(coord) {
        var result = null;
        this.vertices.forEach(function(vert) {
            if (coord.equals(vert.coordinates)) {
                result = vert;
            }
        });
        return result;
    },
    /**
     * Search for a half edge and twin whose origins' coordinates match the
     * given pair of coordinates.
     * 
     * @param {Vector} coord1 coordinates to match either origin with
     * @param {Vector} coord2 coordinates to match either origin with
     * @returns {?HalfEdge} half edge matching coordinates, if existent, null
     *                      otherwise
     */
    getHalfEdge: function(coord1, coord2) {
        var result = null;
        this.halfEdges.forEach(function(halfEdge) {
            if ((coord1.equals(halfEdge.origin.coordinates)) &&
                (coord2.equals(halfEdge.twin.origin.coordinates))) {
                result = halfEdge;
            } else if ((coord2.equals(halfEdge.origin.coordinates)) &&
                (coord1.equals(halfEdge.twin.origin.coordinates))) {
                result = halfEdge;
            }
        });
        return result;
    },
    /**
     * Returns a line segment representation of the doubly connected edge list's
     * edges.
     * 
     * @returns {Array.<LineSegment>} line segments representing the edges
     */
    getLineSegments: function() {
        var ls = [];
        var halfEdgesHandled = [];
        this.halfEdges.forEach(function(halfEdge) {
            if (!halfEdgesHandled.some(function(halfEdgeInner) {
                return (halfEdge === halfEdgeInner) ||
                        (halfEdge.twin === halfEdgeInner);
            })) {
                ls.push(halfEdge.getLineSegment());
                halfEdgesHandled.push(halfEdge);
            }
        });
        return ls;
    },
    /**
     * Removes edges with a zero length from collection
     */
    removeZeroLengthEdges: function() {
        this.halfEdges.forEach(function(halfEdge) {
            if (halfEdge.origin.coordinates.
                    equals(halfEdge.twin.origin.coordinates)) {
                halfEdge.unchain();
            }
        });
        this.halfEdges = this.halfEdges.filter(function(halfEdge) {
            return !halfEdge.origin.coordinates.
                    equals(halfEdge.twin.origin.coordinates);
        });
    }
};

/**
 * Vertex according to de Berg et al.
 * 
 * @constructor
 */
function Vertex() {
    /**
     * @type Vector
     */
    this.coordinates = null;
    /**
     * Arbitrary half edge having this vertex as origin.
     * 
     * @type HalfEdge
     */
    this.incidentEdge = null;
};

/**
 * Face according to de Berg et al. Additional property center.
 * 
 * @constructor
 */
function Face() {
    /**
     * @type Vector
     */
    this.center = null;
    /**
     * Arbitrary half edge on the outer hull.
     * 
     * @type HalfEdge
     */
    this.outerComponent = null;
    /**
     * Arbitrary edges on inner hulls. One for each hole.
     * 
     * @type Array.<HalfEdge>
     */
    this.innerComponents = [];
};

Face.prototype = {
    constructor: Face
};

/**
 * Half edge according to de Berg et al.
 * 
 * @constructor
 */
function HalfEdge() {
    /**
     * @type Vertex
     */
    this.origin = null;
    /**
     * @type HalfEdge
     */
    this.twin = null;
    /**
     * Face enclosed by this half edge and its successors.
     * 
     * @type Face
     */
    this.incidentFace = null;
    /**
     * @type HalfEdge
     */
    this.next = null;
    /**
     * @type HalfEdge
     */
    this.prev = null;
};

HalfEdge.prototype = {
    constructor: HalfEdge,
    
    /**
     * Get first of consecutive half edges.
     * 
     * @returns {HalfEdge} first half edge
     */
    getStart: function() {
        var curEdge = this;
        while ((curEdge.prev !== null) && (curEdge.prev !== this)) {
            curEdge = curEdge.prev;
        }
        return curEdge;
    },
    /**
     * Get last of consecutive half edges.
     * 
     * @returns {HalfEdge} last half edge
     */
    getEnd: function() {
        var curEdge = this;
        while ((curEdge.next !== null) && (curEdge.next !== this)) {
            curEdge = curEdge.next;
        }
        return curEdge;
    },
    /**
     * Set successor of this half edge.
     * 
     * @param {HalfEdge} halfEdge new predecessor
     */
    setNext: function(halfEdge) {
        this.next = halfEdge;
        halfEdge.prev = this;
    },
    /**
     * Set predecessor of this half edge.
     * 
     * @param {HalfEdge} halfEdge new successor
     */
    setPrev: function(halfEdge) {
        this.prev = halfEdge;
        halfEdge.next = this;
    },
    /**
     * Give a line segment representation of this edge.
     * 
     * @returns {LineSegment} line segment representing this edge
     */
    getLineSegment: function() {
        return LineSegment.createFromPoints(this.origin.coordinates,
                                            this.twin.origin.coordinates);
    },
    /**
     * Removes references to this HalfEdge.
     */
    unchain: function() {
        var newOuterComponent = null;
        if ((this.prev !== null) && (this.next !== null)) {
            newOuterComponent = this.prev;
            this.prev.setNext(this.next);
        } else if (this.prev !== null) {
            newOuterComponent = this.prev;
            this.prev.next = null;
        } else if (this.next !== null) {
            newOuterComponent = this.next;
            this.next.prev = null;
        }
        if (this.incidentFace !== null) {
            this.incidentFace.outerComponent = newOuterComponent;
        }
    }
};
