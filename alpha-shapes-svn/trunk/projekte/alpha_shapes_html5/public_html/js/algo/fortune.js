'use strict';

(function (Constants, ComparatorFunctions, Vector, Triangle, Tree, TreeNode, EdgeList) {
    /**
     * A binary tree node for the FortuneTree.
     *
     * @constructor
     * @extends alphashape.ds.TreeNode
     * @param {?} content
     */
    alphashape.algo.FortuneTreeNode = function(content) {
        /**
         * @type alphashape.algo.FortuneTreeNode
         */
        this.parent = null;
        /**
         * @type alphashape.algo.FortuneTreeNode
         */
        this.leftChild = null;
        /**
         * @type alphashape.algo.FortuneTreeNode
         */
        this.rightChild = null;
        this.content = content;
    };

    var FortuneTreeNode = alphashape.algo.FortuneTreeNode;

    alphashape.algo.FortuneTreeNode.prototype = Object.create(TreeNode.prototype);
    alphashape.algo.FortuneTreeNode.prototype.constructor = FortuneTreeNode;

    /**
     * Get leaf left to this leaf.
     *
     * @returns {?alphashape.algo.FortuneTreeNode} leaf left of this leaf if existent, null otherwise
     */
    alphashape.algo.FortuneTreeNode.prototype.getLeftSiblingLeaf = function () {
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
     * @returns {?alphashape.algo.FortuneTreeNode} leaf right of this leaf if existent, null otherwise
     */
    alphashape.algo.FortuneTreeNode.prototype.getRightSiblingLeaf = function () {
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
     * @returns {?alphashape.algo.FortuneTreeNode} closest ancestor of sibling leaf if existent,
     *                              null otherwise
     */
    alphashape.algo.FortuneTreeNode.prototype.getLeftSiblingLeafAncestor = function () {
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
     * @returns {?alphashape.algo.FortuneTreeNode} closest ancestor of sibling leaf if existent,
     *                              null otherwise
     */
    alphashape.algo.FortuneTreeNode.prototype.getRightSiblingLeafAncestor = function () {
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
     * @returns {alphashape.algo.FortuneTreeNode} leftmost child of tree node
     */
    alphashape.algo.FortuneTreeNode.prototype.getLeftmostChild = function () {
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
     * @returns {alphashape.algo.FortuneTreeNode} rightmost child of tree node
     */
    alphashape.algo.FortuneTreeNode.prototype.getRightmostChild = function () {
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
     * @extends alphashape.ds.Tree
     */
    alphashape.algo.FortuneTree = function() {
        /**
         * @type alphashape.algo.FortuneTreeNode
         */
        this.root = null;
    };
    var FortuneTree = alphashape.algo.FortuneTree;

    alphashape.algo.FortuneTree.prototype = Object.create(Tree.prototype);
    alphashape.algo.FortuneTree.prototype.constructor = FortuneTree;

    /**
     * Get the node holding a reference to the arc above the site event.
     *
     * @private
     * @param {alphashape.geom.Vector} eventLocation
     * @returns {alphashape.algo.FortuneTreeNode}
     */
    alphashape.algo.FortuneTree.prototype.getArcNodeAboveEvent = function (eventLocation) {
        if (this.isEmpty()) {
            return null;
        }
        var currentNode = this.root;
        while (!currentNode.isLeaf()) {
            var breakpoint = currentNode.content;
            var breakpointLocation = breakpoint.getLocation(eventLocation.y);
            if (ComparatorFunctions.compareWithTolerance(
                eventLocation.x, breakpointLocation.x) !== 1) {
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
     * @param {alphashape.geom.Vector} eventLocation
     * @returns {{newArcNode: alphashape.algo.FortuneTreeNode, arcNodeAbove: ?alphashape.algo.FortuneTreeNode}}
     */
    alphashape.algo.FortuneTree.prototype.insertNewArcNode = function (eventLocation) {
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
     * @param {alphashape.algo.FortuneBreakpoint} leftBreakpoint
     * @param {alphashape.algo.FortuneBreakpoint} rightBreakpoint
     * @param {alphashape.algo.FortuneTreeNode} nodeToReplace
     * @returns {alphashape.algo.FortuneTreeNode}
     */
    alphashape.algo.FortuneTree.prototype.createSubtree = function (leftBreakpoint, rightBreakpoint, nodeToReplace) {
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
     * @param {alphashape.algo.FortuneCircleEvent} event
     * @returns {{formerLeftSibling: alphashape.algo.FortuneTreeNode, formerRightSibling: alphashape.algo.FortuneTreeNode}}
     */
    alphashape.algo.FortuneTree.prototype.deleteArcNode = function (event) {

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
     * @param {alphashape.geom.Vector} vertexLocation
     * @param {alphashape.algo.FortuneBreakpoint} leftBreakpoint
     * @param {alphashape.algo.FortuneBreakpoint} rightBreakpoint
     * @param {alphashape.algo.FortuneBreakpoint} changeBreakpoint
     */
    alphashape.algo.FortuneTree.prototype.createPartialEdgeListForCircleEvent = function (vertexLocation, leftBreakpoint, rightBreakpoint, changeBreakpoint) {
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
     * @param {alphashape.ds.Face} face in the Voronoi diagram
     */
    alphashape.algo.FortuneArc = function(face) {
        /**
         * @type alphashape.ds.Face
         */
        this.face = face;
    };
    var FortuneArc = alphashape.algo.FortuneArc;

    alphashape.algo.FortuneArc.prototype = {
        constructor: FortuneArc,
        /**
         * Get y coordinate of arc given a x coordinate and the y position of the
         * sweep line.
         *
         * @param {number} x x coordinate
         * @param {number} ly y position of the sweep line
         * @returns {number}
         */
        getY: function (x, ly) {
            var px = this.face.center.x;
            var py = this.face.center.y;
            var num = x * x - 2 * px * x + px * px + py * py - ly * ly;
            var denom = 2 * (py - ly);
            if (ComparatorFunctions.compareWithTolerance(py, ly) !== 0) {
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
     * @param {alphashape.algo.FortuneArc} leftArc
     * @param {alphashape.algo.FortuneArc} rightArc
     */
    alphashape.algo.FortuneBreakpoint = function(leftArc, rightArc) {
        this.leftArc = leftArc;
        this.rightArc = rightArc;
        /**
         * @type alphashape.ds.HalfEdge
         */
        this.halfEdge = null;
    };
    var FortuneBreakpoint = alphashape.algo.FortuneBreakpoint;

    alphashape.algo.FortuneBreakpoint.prototype = {
        constructor: FortuneBreakpoint,
        /**
         * Checks if the breakpoint is the only breakpoint of its two arcs.
         *
         * @returns {boolean}
         */
        isOnlyBreakpoint: function () {
            return ComparatorFunctions.compareWithTolerance(this.leftArc.face.center.y,
                this.rightArc.face.center.y) === 0;
        },
        /**
         * Checks if the breakpoint is the left one of two breapoints of its arcs.
         *
         * @returns {boolean}
         */
        isLeftBreakpoint: function () {
            if (this.isOnlyBreakpoint()) {
                return ComparatorFunctions.compareWithTolerance(this.leftArc.face.center.x,
                    this.rightArc.face.center.x) === -1;
            }
            return ComparatorFunctions.compareWithTolerance(this.leftArc.face.center.y,
                this.rightArc.face.center.y) === 1;
        },
        /**
         * Checks if the breakpoint is the right one of two breakpoints of its arcs.
         *
         * @returns {boolean}
         */
        isRightBreakpoint: function () {
            if (this.isOnlyBreakpoint()) {
                return ComparatorFunctions.compareWithTolerance(this.leftArc.face.center.x,
                    this.rightArc.face.center.x) === 1;
            }
            return ComparatorFunctions.compareWithTolerance(this.leftArc.face.center.y,
                this.rightArc.face.center.y) === -1;
        },
        /**
         * Returns the location of the breakpoint given the y position of the sweep
         * line.
         *
         * @param {number} ly y position of the sweep line
         * @returns {alphashape.geom.Vector} position of the breakpoint
         */
        getLocation: function (ly) {
            var pix = this.leftArc.face.center.x;
            var piy = this.leftArc.face.center.y;
            var pjx = this.rightArc.face.center.x;
            var pjy = this.rightArc.face.center.y;

            var a = pjy - piy;
            var b = 2 * (pjx * (piy - ly) - pix * (pjy - ly));
            var c = (pjy - ly) * (pix * pix + piy * piy - ly * ly) -
                (piy - ly) * (pjx * pjx + pjy * pjy - ly * ly);

            if (ComparatorFunctions.compareWithTolerance(pjy, piy) === 0) {
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
         * @returns {alphashape.geom.Vector}
         */
        getOrigin: function () {
            return this.leftArc.face.center.add(this.rightArc.face.center).
                multiplyScalar(0.5);
        },
        /**
         * Get the direction of this breakpoint with increasing sweep line y
         * position.
         *
         * @private
         * @returns {alphashape.geom.Vector} direction of breakpoint
         */
        getDirection: function () {
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
        calcHalfEdgeOrigin: function () {
            this.halfEdge.origin = Fortune.voronoiDiagram.getNewVertex();
            this.halfEdge.origin.coordinates = this.getOrigin().
                add(this.getDirection().
                    multiplyScalar(Constants.INFINITY));
        }
    };

    /**
     * An event in Fortune's algorithm.
     *
     * @constructor
     * @param {alphashape.geom.Vector} location of the event
     */
    alphashape.algo.FortuneEvent = function(location) {
        this.location = location;
    };
    var FortuneEvent = alphashape.algo.FortuneEvent;

    alphashape.algo.FortuneEvent.prototype = {
        constructor: FortuneEvent,
        /**
         * Checks if this event is a site event.
         *
         * @returns {boolean}
         */
        isSiteEvent: function () {
            return this.circle === undefined;
        },
        /**
         * Checks if this event is a circle event.
         *
         * @returns {boolean}
         */
        isCircleEvent: function () {
            return this.circle !== undefined;
        }
    };

    /**
     * Compares two Fortune events according to their location's coordinates.
     *
     * @param {alphashape.algo.FortuneEvent} e1
     * @param {alphashape.algo.FortuneEvent} e2
     * @returns {number}
     */
    alphashape.algo.FortuneEvent.compare = function (e1, e2) {
        var yComp = ComparatorFunctions.compareWithTolerance(e1.location.y, e2.location.y);
        if (yComp === 0) {
            return ComparatorFunctions.compareWithTolerance(e1.location.x, e2.location.x);
        } else {
            return -yComp;
        }
    };

    /**
     * A site event in Fortune's algorithm.
     *
     * @constructor
     * @extends alphashape.algo.FortuneEvent
     * @param {alphashape.geom.Vector} location of the event
     */
    alphashape.algo.FortuneSiteEvent = function(location) {
        this.location = location;
    };
    var FortuneSiteEvent = alphashape.algo.FortuneSiteEvent;

    alphashape.algo.FortuneSiteEvent.prototype = Object.create(FortuneEvent.prototype);
    alphashape.algo.FortuneSiteEvent.prototype.constructor = FortuneSiteEvent;

    /**
     * Handle site event.
     */
    FortuneSiteEvent.prototype.handle = function () {
        var insertionResults = Fortune.beachLine.insertNewArcNode(this.location);

        var arcNode = insertionResults.newArcNode;
        var arcNodeAbove = insertionResults.arcNodeAbove;

        if (!arcNode.isRoot()) {
            Fortune.eventQueue = Fortune.eventQueue.filter(function (event) {
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
     * @extends alphashape.algo.FortuneEvent
     * @param {alphashape.geom.Vector} location of the event
     * @param {alphashape.algo.FortuneTreeNode} leftArcNode involved in event
     * @param {alphashape.algo.FortuneTreeNode} middleArcNode involved in event
     * @param {alphashape.algo.FortuneTreeNode} rightArcNode involved in event
     * @param {alphashape.geom.Circle} circle containing three sites
     */
    alphashape.algo.FortuneCircleEvent = function(location, leftArcNode, middleArcNode, rightArcNode, circle) {
        this.location = location;
        this.leftArcNode = leftArcNode;
        this.middleArcNode = middleArcNode;
        this.rightArcNode = rightArcNode;
        this.circle = circle;
    };
    var FortuneCircleEvent = alphashape.algo.FortuneCircleEvent;

    alphashape.algo.FortuneCircleEvent.prototype = Object.create(FortuneEvent.prototype);
    alphashape.algo.FortuneCircleEvent.prototype.constructor = FortuneCircleEvent;

    /**
     * Checks if one of the arc nodes of the circle event is equal to a given node.
     *
     * @param {alphashape.algo.FortuneTreeNode} node
     * @returns {boolean}
     */
    alphashape.algo.FortuneCircleEvent.prototype.involvesArcNode = function (node) {
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
    alphashape.algo.FortuneCircleEvent.prototype.handle = function () {
        var deleteResults = Fortune.beachLine.deleteArcNode(this);
        var thisEvent = this;

        Fortune.eventQueue = Fortune.eventQueue.filter(function (event) {
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
     */
    alphashape.algo.Fortune = function() {};
    var Fortune = alphashape.algo.Fortune;

    /**
     * @private
     * @type Array.<alphashape.algo.FortuneEvent>
     */
    alphashape.algo.Fortune.eventQueue;

    /**
     * @private
     * @type alphashape.algo.FortuneTree
     */
    alphashape.algo.Fortune.beachLine;

    /**
     * @private
     * @type alphashape.ds.EdgeList
     */
    alphashape.algo.Fortune.voronoiDiagram;

    /**
     * Compute the closest point Voronoi diagram.
     *
     * @param {Array.<alphashape.geom.Vector>} points
     * @returns {alphashape.ds.EdgeList} Voronoi diagram
     */
    alphashape.algo.Fortune.computeVoronoiDiagram = function (points) {
        Fortune.eventQueue = [];
        Fortune.beachLine = new FortuneTree();
        Fortune.voronoiDiagram = new EdgeList();
        Fortune.delaunayTriangulation = new EdgeList();

        points.forEach(function (p) {
            Fortune.eventQueue.push(new FortuneSiteEvent(p));
        });
        Fortune.eventQueue.sort(function (e1, e2) {
            return FortuneEvent.compare(e1, e2);
        });
        while (!(Fortune.eventQueue.length === 0)) {
            var currentEvent = Fortune.eventQueue[0];
            Fortune.eventQueue.splice(0, 1);
            currentEvent.handle();
            Fortune.eventQueue.sort(function (e1, e2) {
                return FortuneEvent.compare(e1, e2);
            });
        }
        Fortune.beachLine.inorderDo(function (treeNode) {
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
     * @param {alphashape.algo.FortuneTreeNode} middleNode for potential circle event.
     */
    alphashape.algo.Fortune.insertNewCircleEvents = function (middleNode) {
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
     * @param {alphashape.algo.FortuneTreeNode} leftArcNode
     * @param {alphashape.algo.FortuneTreeNode} middleArcNode
     * @param {alphashape.algo.FortuneTreeNode} rightArcNode
     * @returns {alphashape.algo.FortuneCircleEvent?} circle event if existing
     */
    alphashape.algo.Fortune.checkTripleForCircleEvent = function (leftArcNode, middleArcNode, rightArcNode) {
        var v1 = leftArcNode.content.face.center;
        var v2 = middleArcNode.content.face.center;
        var v3 = rightArcNode.content.face.center;
        var det = Vector.calcDet(v1, v2, v3);

        if (ComparatorFunctions.compareWithTolerance(det, 0) >= 0) {
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
})(alphashape.util.Constants, alphashape.util.ComparatorFunctions, alphashape.geom.Vector,
        alphashape.geom.Triangle, alphashape.ds.Tree, alphashape.ds.TreeNode, alphashape.ds.EdgeList);
