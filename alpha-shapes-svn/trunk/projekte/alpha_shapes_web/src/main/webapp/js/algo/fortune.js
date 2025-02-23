'use strict';

/**
 * A binary tree node for the FortuneTree.
 * 
 * @constructor
 * @extends TreeNode
 * @param {?} content
 */
function FortuneTreeNode(content) {
    /**
     * @type FortuneTreeNode
     */
    this.parent = null;
    /**
     * @type FortuneTreeNode
     */
    this.leftChild = null;
    /**
     * @type FortuneTreeNode
     */
    this.rightChild = null;
    this.content = content;
}

FortuneTreeNode.prototype = Object.create(TreeNode.prototype);
FortuneTreeNode.prototype.constructor = FortuneTreeNode;

/**
 * Get leaf left to this leaf.
 * 
 * @returns {?FortuneTreeNode} leaf left of this leaf if existent, null otherwise
 */
FortuneTreeNode.prototype.getLeftSiblingLeaf = function() {
    if (this.isRoot()) {
        return null;
    } else if (!this.isLeaf()) {
        return null;
    } else {
        if (this.isRightChild()) {
            return this.parent.leftChild.getRightmostChild();
        } else {
            var leftSiblingParent = this.getLeftSiblingLeafAncestor();
            if (leftSiblingParent !== null) {
                var leftSibling = leftSiblingParent.getRightmostChild();
                return leftSibling;
            } else {
                return null;
            }
        }
    }
};

/**
 * Get leaf right to this leaf.
 * 
 * @returns {?FortuneTreeNode} leaf right of this leaf if existent, null otherwise
 */
FortuneTreeNode.prototype.getRightSiblingLeaf = function() {
    if (this.isRoot()) {
        return null;
    } else if (!this.isLeaf()) {
        return null;
    } else {
        if (this.isLeftChild()) {
            return this.parent.rightChild.getLeftmostChild();
        } else {
            var rightSiblingParent = this.getRightSiblingLeafAncestor();
            if (rightSiblingParent !== null) {
                var leftSibling = rightSiblingParent.getLeftmostChild();
                return leftSibling;
            } else {
                return null;
            }
        }
    }
};

/**
 * Get ancestor of left sibling leaf with shortest distance to left sibling
 * leaf.
 * 
 * @private
 * @returns {?FortuneTreeNode} closest ancestor of sibling leaf if existent,
 *                              null otherwise
 */
FortuneTreeNode.prototype.getLeftSiblingLeafAncestor = function() {
    if (this.isRoot()) {
        return null;
    } else if (this.isRightChild()) {
        return this.parent.leftChild;
    } else {
        return this.parent.getLeftSiblingLeafAncestor();
    }
};

/**
 * Get ancestor of right sibling leaf with shortest distance to right
 * sibling leaf.
 * 
 * @private
 * @returns {?FortuneTreeNode} closest ancestor of sibling leaf if existent,
 *                              null otherwise
 */
FortuneTreeNode.prototype.getRightSiblingLeafAncestor = function() {
    if (this.isRoot()) {
        return null;
    } else if (this.isLeftChild()) {
        return this.parent.rightChild;
    } else {
        return this.parent.getRightSiblingLeafAncestor();
    }
};
    
/**
 * Get the leftmost child of this tree node.
 * 
 * @private
 * @returns {FortuneTreeNode} leftmost child of tree node
 */
FortuneTreeNode.prototype.getLeftmostChild = function() {
    if (this.isLeaf()) {
        return this;
    } else if (this.leftChild !== null) {
        return this.leftChild.getLeftmostChild();
    } else {
        return this;
    }
};
    
/**
 * Get the rightmost child of this tree node.
 * 
 * @private
 * @returns {FortuneTreeNode} rightmost child of tree node
 */
FortuneTreeNode.prototype.getRightmostChild = function() {
    if (this.isLeaf()) {
        return this;
    } else if (this.rightChild !== null) {
        return this.rightChild.getRightmostChild();
    } else {
        return this;
    }
};

/**
 * Balanced binary tree to hold the beach line of Fortune's algorithm.
 * 
 * @constructor
 * @extends Tree
 */
function FortuneTree() {
    /**
     * @type FortuneTreeNode
     */
    this.root = null;
};

FortuneTree.prototype = Object.create(Tree.prototype);
FortuneTree.prototype.constructor = FortuneTree;

/**
 * Get the node holding a reference to the arc above the site event.
 * 
 * @private
 * @param {Vector} eventLocation
 * @returns {FortuneTreeNode}
 */
FortuneTree.prototype.getArcNodeAboveEvent = function(eventLocation) {
    if (this.isEmpty()) {
        return null;
    }
    var currentNode = this.root;
    while (!currentNode.isLeaf()) {
        var breakpoint = currentNode.content;
        var breakpointLocation = breakpoint.getLocation(eventLocation.y);
        if (Misc.compareWithTolerance(
                eventLocation.x,breakpointLocation.x) !== 1) {
            if (breakpoint.isOnlyBreakpoint() && breakpoint.isRightBreakpoint()) {
                currentNode = currentNode.rightChild;
            } else {
                currentNode = currentNode.leftChild;
            }
        } else {
            if (breakpoint.isOnlyBreakpoint() && breakpoint.isRightBreakpoint()) {
                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;
            }
        }
    }
    return currentNode;
};

/**
 * Insert a new arc into the beach line because of a site event. Update the
 * edge list of the Voronoi diagram accordingly.
 * 
 * @param {Vector} eventLocation
 * @returns {{newArcNode: FortuneTreeNode, arcNodeAbove: ?FortuneTreeNode}}
 */
FortuneTree.prototype.insertNewArcNode = function(eventLocation) {
    var faceB = Fortune.voronoiDiagram.getNewFace();
    faceB.center = eventLocation;
    var arcB = new FortuneArc(faceB);
    if (this.isEmpty()) {
        this.root = new FortuneTreeNode(arcB);
        return { 'newArcNode': this.root, 'arcNodeAbove': null };
    }
    var nodeA = this.getArcNodeAboveEvent(eventLocation);
    var arcA = nodeA.content;
    var faceA = arcA.face;
    var halfEdge = Fortune.voronoiDiagram.getNewHalfEdgePair();

    halfEdge.incidentFace = faceB;
    faceB.outerComponent = halfEdge;

    halfEdge.twin.incidentFace = faceA;
    if (faceA.outerComponent === null) {
        faceA.outerComponent = halfEdge.twin;
    }

    var breakpoint1 = new FortuneBreakpoint(arcA, arcB);
    var breakpoint2 = new FortuneBreakpoint(arcB, arcA);
    if (breakpoint1.isLeftBreakpoint()) {
        var leftBreakpoint = breakpoint1;
        var rightBreakpoint = breakpoint2;
    } else {
        leftBreakpoint = breakpoint2;
        rightBreakpoint = breakpoint1;
    }
    var newArcNode = this.createSubtree(leftBreakpoint, rightBreakpoint,
            nodeA);

    leftBreakpoint.halfEdge = halfEdge;
    rightBreakpoint.halfEdge = halfEdge.twin;        

    return { 'newArcNode': newArcNode, 'arcNodeAbove': nodeA };
};

/**
 * Replace node holding arc with a subtree consisting of two breakpoints and
 * three arcs.
 * 
 * @private
 * @param {FortuneBreakpoint} leftBreakpoint
 * @param {FortuneBreakpoint} rightBreakpoint
 * @param {FortuneTreeNode} nodeToReplace
 * @returns {FortuneTreeNode}
 */
FortuneTree.prototype.createSubtree = function(leftBreakpoint, rightBreakpoint,
            nodeToReplace) {
    var leftLeaf = new FortuneTreeNode(leftBreakpoint.leftArc);
    var middleLeaf = new FortuneTreeNode(leftBreakpoint.rightArc);
    var rightLeaf = new FortuneTreeNode(rightBreakpoint.rightArc);

    var subtreeRoot = new FortuneTreeNode(leftBreakpoint);
    var innerNode = new FortuneTreeNode(rightBreakpoint);

    innerNode.setLeftChild(middleLeaf);
    innerNode.setRightChild(rightLeaf);
    subtreeRoot.setLeftChild(leftLeaf);
    subtreeRoot.setRightChild(innerNode);

    this.replaceNode(nodeToReplace, subtreeRoot);

    subtreeRoot.checkBalanceUpToRoot();

    return middleLeaf;
};

/**
 * Remove an arc node and one of its breakpoints because of a circle event.
 * 
 * @param {FortuneCircleEvent} event
 * @returns {{formerLeftSibling: FortuneTreeNode,
 *      formerRightSibling: FortuneTreeNode}}
 */
FortuneTree.prototype.deleteArcNode = function(event) {

    var deleteArcNode = event.middleArcNode;
    var formerLeftSibling = deleteArcNode.getLeftSiblingLeaf();
    var formerRightSibling = deleteArcNode.getRightSiblingLeaf();

    var deleteBreakpointNode = deleteArcNode.parent;
    var changeBreakpointNode = this.getCommonAncestor(formerLeftSibling,
        formerRightSibling);
        
    if (changeBreakpointNode.hasInLeftSubtree(deleteBreakpointNode)) {
        var leftBreakpointNode = deleteBreakpointNode;
        var rightBreakpointNode = changeBreakpointNode;
    } else if (changeBreakpointNode.hasInRightSubtree(deleteBreakpointNode)) {
        leftBreakpointNode = changeBreakpointNode;
        rightBreakpointNode = deleteBreakpointNode;
    }
    
    var changeBreakpoint = changeBreakpointNode.content;
    changeBreakpoint.leftArc = formerLeftSibling.content;
    changeBreakpoint.rightArc = formerRightSibling.content;
    
    if (deleteArcNode.isLeftChild()) {
        var checkNode = deleteBreakpointNode.rightChild;
        this.replaceNode(deleteBreakpointNode,
            deleteBreakpointNode.rightChild);
    } else {
        checkNode = deleteBreakpointNode.leftChild;
        this.replaceNode(deleteBreakpointNode,
            deleteBreakpointNode.leftChild);
    }

    this.createPartialEdgeListForCircleEvent(event.circle.center,
        leftBreakpointNode.content, rightBreakpointNode.content,
        changeBreakpointNode.content);
    
    checkNode.checkBalanceUpToRoot();

    return {'formerLeftSibling': formerLeftSibling,
                'formerRightSibling': formerRightSibling};
};

/**
 * Update Voronoi diagram because of a circle event.
 * 
 * @private
 * @param {Vector} vertexLocation
 * @param {FortuneBreakpoint} leftBreakpoint
 * @param {FortuneBreakpoint} rightBreakpoint
 * @param {FortuneBreakpoint} changeBreakpoint
 */
FortuneTree.prototype.createPartialEdgeListForCircleEvent = function(
        vertexLocation, leftBreakpoint, rightBreakpoint, changeBreakpoint) {
    var vertex = Fortune.voronoiDiagram.getNewVertex();
    vertex.coordinates = vertexLocation;

    var leftHalfEdge = leftBreakpoint.halfEdge;
    var rightHalfEdge = rightBreakpoint.halfEdge;
    var newHalfEdge = Fortune.voronoiDiagram.getNewHalfEdgePair();

    leftHalfEdge.origin = vertex;
    rightHalfEdge.origin = vertex;
    newHalfEdge.origin = vertex;

    vertex.incidentEdge = newHalfEdge;

    leftHalfEdge.setPrev(rightHalfEdge.twin);        
    leftHalfEdge.twin.setNext(newHalfEdge);
    rightHalfEdge.setPrev(newHalfEdge.twin);

    newHalfEdge.incidentFace = leftHalfEdge.twin.incidentFace;
    newHalfEdge.twin.incidentFace = rightHalfEdge.incidentFace;            

    changeBreakpoint.halfEdge = newHalfEdge.twin;
};

/**
 * A parabolic arc in a beach line.
 * 
 * @constructor
 * @param {Face} face in the Voronoi diagram
 */
function FortuneArc(face) {
    /**
     * @type Face
     */
    this.face = face;
};

FortuneArc.prototype = {
    constructor: FortuneArc,
    /**
     * Get y coordinate of arc given a x coordinate and the y position of the
     * sweep line.
     * 
     * @param {number} x x coordinate
     * @param {number} ly y position of the sweep line
     * @returns {number}
     */
    getY: function(x, ly) {
        var px = this.face.center.x;
        var py = this.face.center.y;
        var num = x * x - 2 * px * x + px * px + py * py - ly * ly;
        var denom = 2 * (py - ly);
        if (Misc.compareWithTolerance(py, ly) !== 0) {
            return num / denom;
        } else {
            return py;
        }
    }
};

/**
 * Breakpoint of two arcs in the beach line.
 * 
 * @constructor
 * @param {FortuneArc} leftArc
 * @param {FortuneArc} rightArc
 */
 function FortuneBreakpoint(leftArc, rightArc) {
    this.leftArc = leftArc;
    this.rightArc = rightArc;
    /**
     * @type HalfEdge
     */
    this.halfEdge = null;
};

FortuneBreakpoint.prototype = {
    constructor: FortuneBreakpoint,
    /**
     * Checks if the breakpoint is the only breakpoint of its two arcs.
     * 
     * @returns {boolean}
     */
    isOnlyBreakpoint: function() {
        return Misc.compareWithTolerance(this.leftArc.face.center.y, 
            this.rightArc.face.center.y) === 0;
    },
    /**
     * Checks if the breakpoint is the left one of two breapoints of its arcs.
     * 
     * @returns {boolean}
     */
    isLeftBreakpoint: function() {
        if (this.isOnlyBreakpoint()) {
            return Misc.compareWithTolerance(this.leftArc.face.center.x, 
                this.rightArc.face.center.x) === -1;
        }
        return Misc.compareWithTolerance(this.leftArc.face.center.y, 
            this.rightArc.face.center.y) === 1;
    },
    /**
     * Checks if the breakpoint is the right one of two breakpoints of its arcs.
     * 
     * @returns {boolean}
     */
    isRightBreakpoint: function() {
        if (this.isOnlyBreakpoint()) {
            return Misc.compareWithTolerance(this.leftArc.face.center.x, 
                this.rightArc.face.center.x) === 1;
        }
        return Misc.compareWithTolerance(this.leftArc.face.center.y, 
            this.rightArc.face.center.y) === -1;
    },
    /**
     * Returns the location of the breakpoint given the y position of the sweep
     * line.
     * 
     * @param {number} ly y position of the sweep line
     * @returns {Vector} position of the breakpoint
     */
    getLocation: function(ly) {
        var pix = this.leftArc.face.center.x;
        var piy = this.leftArc.face.center.y;
        var pjx = this.rightArc.face.center.x;
        var pjy = this.rightArc.face.center.y;

        var a = pjy - piy;
        var b = 2 * (pjx * (piy - ly) - pix * (pjy - ly));
        var c = (pjy - ly) * (pix * pix + piy * piy - ly * ly) -
                (piy - ly) * (pjx * pjx + pjy * pjy - ly * ly);

        if (Misc.compareWithTolerance(pjy, piy, Misc.TOLERANCE) === 0) {
            var x = (pix + pjx) / 2;
        } else {
            var x1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            var x2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            if (this.isLeftBreakpoint()) {
                x = Math.min(x1, x2);
            } else {
                x = Math.max(x1, x2);
            }
        }
        var y = this.leftArc.getY(x, ly);
        return new Vector(x, y);
    },
    /**
     * Get the origin of the breakpoint.
     * 
     * @private
     * @returns {Vector}
     */
    getOrigin: function() {
        return this.leftArc.face.center.add(this.rightArc.face.center).
                multiplyScalar(0.5);        
    },
    /**
     * Get the direction of this breakpoint with increasing sweep line y
     * position.
     * 
     * @private
     * @returns {Vector} direction of breakpoint
     */
    getDirection: function() {
        if (this.isOnlyBreakpoint()) {
            return this.leftArc.face.center.sub(this.rightArc.face.center).
                    rotate(Math.PI / 2).normalize();
        }
        if (this.leftArc.face.center.y >= this.rightArc.face.center.y) {
            var upperArcOrigin = this.leftArc.face.center;
            var lowerArcOrigin = this.rightArc.face.center;
        } else {
            upperArcOrigin = this.rightArc.face.center;
            lowerArcOrigin = this.leftArc.face.center;
        }
        if (this.isLeftBreakpoint()) {
            return upperArcOrigin.sub(lowerArcOrigin).
                    rotate(Math.PI / 2).normalize();
        } else {
            return lowerArcOrigin.sub(upperArcOrigin).
                    rotate(Math.PI / 2).normalize();
        }
    },
    /**
     * Calculate the origin of this breakpoint's half edge.
     */
    calcHalfEdgeOrigin: function() {
        this.halfEdge.origin = Fortune.voronoiDiagram.getNewVertex();
        this.halfEdge.origin.coordinates = this.getOrigin().
                add(this.getDirection().
                multiplyScalar(Misc.INFINITY));
    }
};

/**
 * An event in Fortune's algorithm.
 * 
 * @constructor
 * @param {Vector} location of the event
 */
function FortuneEvent(location) {
    this.location = location;
};

FortuneEvent.prototype = {
    constructor: FortuneEvent,
    /**
     * Checks if this event is a site event.
     * 
     * @returns {boolean}
     */
    isSiteEvent: function() {
        return this.circle === undefined;
    },
    /**
     * Checks if this event is a circle event.
     * 
     * @returns {boolean}
     */
    isCircleEvent: function() {
        return this.circle !== undefined;
    }
};

/**
 * Compares two Fortune events according to their location's coordinates.
 * 
 * @param {FortuneEvent} e1
 * @param {FortuneEvent} e2
 * @returns {number}
 */
FortuneEvent.compare = function(e1, e2) {
    var yComp = Misc.compareWithTolerance(e1.location.y, e2.location.y);
    if (yComp === 0) {
        return Misc.compareWithTolerance(e1.location.x, e2.location.x);
    } else {
        return -yComp;
    }
};

/**
 * A site event in Fortune's algorithm.
 * 
 * @constructor
 * @extends FortuneEvent
 * @param {Vector} location of the event
 */
function FortuneSiteEvent(location) {
    this.location = location;
};

FortuneSiteEvent.prototype = Object.create(FortuneEvent.prototype);
FortuneSiteEvent.prototype.constructor = FortuneSiteEvent;

/**
 * Handle site event.
 */
FortuneSiteEvent.prototype.handle = function() {
    var insertionResults = Fortune.beachLine.insertNewArcNode(this.location);
    
    var arcNode = insertionResults.newArcNode;
    var arcNodeAbove = insertionResults.arcNodeAbove;

    if (!arcNode.isRoot()) {
        Fortune.eventQueue = Fortune.eventQueue.filter(function(event) {
            if (event.isSiteEvent()) {
                return true;
            } else {
                return event.middleArcNode !== arcNodeAbove;
            }
        });
        
        var leftSibling = arcNode.getLeftSiblingLeaf();
        var rightSibling = arcNode.getRightSiblingLeaf();
        if (leftSibling !== null) {
            Fortune.insertNewCircleEvents(leftSibling);
        }
        if (rightSibling !== null) {
            Fortune.insertNewCircleEvents(rightSibling);
        }
    }
};

/**
 * Circle event in Fortune's algorithm.
 * 
 * @constructor
 * @extends FortuneEvent
 * @param {Vector} location of the event
 * @param {FortuneTreeNode} leftArcNode involved in event
 * @param {FortuneTreeNode} middleArcNode involved in event
 * @param {FortuneTreeNode} rightArcNode involved in event
 * @param {Circle} circle containing three sites
 */
function FortuneCircleEvent(location, leftArcNode, middleArcNode,
        rightArcNode, circle) {
    this.location = location;    
    this.leftArcNode = leftArcNode;
    this.middleArcNode = middleArcNode;
    this.rightArcNode = rightArcNode;
    this.circle = circle;
};

FortuneCircleEvent.prototype = Object.create(FortuneEvent.prototype);
FortuneCircleEvent.prototype.constructor = FortuneCircleEvent;

/**
 * Checks if one of the arc nodes of the circle event is equal to a given node.
 * 
 * @param {FortuneTreeNode} node
 * @returns {boolean}
 */
FortuneCircleEvent.prototype.involvesArcNode = function(node) {
    if (node === this.leftArcNode) {
        return true;
    }
    if (node === this.middleArcNode) {
        return true;
    }
    if (node === this.rightArcNode) {
        return true;
    }
    return false;
};

/**
 * Handle circle event.
 */
FortuneCircleEvent.prototype.handle = function() {
    var deleteResults = Fortune.beachLine.deleteArcNode(this);
    var thisEvent = this;
    
    Fortune.eventQueue = Fortune.eventQueue.filter(function(event) {
        if (event.isSiteEvent()) {
            return true;
        } else {
            return !event.involvesArcNode(thisEvent.middleArcNode);
        }
    });
       
    Fortune.insertNewCircleEvents(deleteResults.formerLeftSibling);
    Fortune.insertNewCircleEvents(deleteResults.formerRightSibling);
};

/**
 * Fortune's algorithm to compute the closest point Voronoi diagram.
 * 
 * @constructor
 * @returns {Fortune}
 */
function Fortune() {
};

/**
 * @private
 * @type Array.<FortuneEvent>
 */
Fortune.eventQueue;

/**
 * @private
 * @type FortuneTree
 */
Fortune.beachLine;

/**
 * @private
 * @type EdgeList
 */
Fortune.voronoiDiagram;

/**
 * Compute the closest point Voronoi diagram.
 * 
 * @param {Array.<Vector>} points
 * @returns {EdgeList} Voronoi diagram
 */
Fortune.computeVoronoiDiagram = function(points) {
    Fortune.eventQueue = [];
    Fortune.beachLine = new FortuneTree();
    Fortune.voronoiDiagram = new EdgeList();
    Fortune.delaunayTriangulation = new EdgeList();
    
    points.forEach(function(p) {
        Fortune.eventQueue.push(new FortuneSiteEvent(p));
    });
    Fortune.eventQueue.sort(function(e1, e2) {
        return FortuneEvent.compare(e1, e2);
    });
    while (!(Fortune.eventQueue.length === 0)) {
        var currentEvent = Fortune.eventQueue[0];
        Fortune.eventQueue.splice(0, 1);
        currentEvent.handle();
        Fortune.eventQueue.sort(function(e1, e2) {
            return FortuneEvent.compare(e1, e2);
        });
    }
    Fortune.beachLine.inorderDo(function(treeNode) {
        if (!treeNode.isLeaf()) {
            if (treeNode.content.halfEdge.origin === null) {
                treeNode.content.calcHalfEdgeOrigin();
            }
        }
    });
    Fortune.voronoiDiagram.removeZeroLengthEdges();
    return Fortune.voronoiDiagram;
};

/**
 * Check for and insert a new circle event for a given arc node.
 * 
 * @private
 * @param {FortuneTreeNode} middleNode for potential circle event.
 */
Fortune.insertNewCircleEvents = function(middleNode) {
    var leftSibling = middleNode.getLeftSiblingLeaf();
    var rightSibling = middleNode.getRightSiblingLeaf();
    if ((leftSibling !== null) && (rightSibling !== null)) {
        var circleEvent = Fortune.checkTripleForCircleEvent( 
                leftSibling, middleNode, rightSibling);
        if (circleEvent !== null) {
            Fortune.eventQueue.push(circleEvent);
        }
    }
};

/**
 * Check three sibling arc nodes for a circle event.
 * 
 * @private
 * @param {FortuneTreeNode} leftArcNode
 * @param {FortuneTreeNode} middleArcNode
 * @param {FortuneTreeNode} rightArcNode
 * @returns {FortuneCircleEvent?} circle event if existing
 */
Fortune.checkTripleForCircleEvent = function(leftArcNode, middleArcNode,
        rightArcNode) {
    var v1 = leftArcNode.content.face.center;
    var v2 = middleArcNode.content.face.center;
    var v3 = rightArcNode.content.face.center;
    var det = Vector.calcDet(v1, v2, v3);
    
    if (Misc.compareWithTolerance(det, 0) >= 0) {
        return null;
    }
    if (v1.equals(v2) || v1.equals(v3) || v2.equals(v3)) {
        return null;
    }
    var t = new Triangle(v1, v2, v3);
    var circle = t.getCircumcircle();
    var c = circle.center;
    var r = circle.radius;
    var circleEventLoc = new Vector(c.x, c.y - r);
    var circleEvent = new FortuneCircleEvent(circleEventLoc, leftArcNode,
            middleArcNode, rightArcNode, circle);
    return circleEvent;
};
