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

(function(algo, util, geom, ds) {

    /**
     * A parabolic arc in a beach line.
     *
     * @param {alphashape.ds.Face} face in the Voronoi diagram
     * @constructor
     */
    alphashape.algo.FortuneArc = function(face) {
        /**
         * @type {alphashape.ds.Face}
         */
        this.face = face;

        /**
         * @type {alphashape.algo.FortuneBreakpoint}
         */
        this.leftBreakpoint = null;

        /**
         * @type {alphashape.algo.FortuneBreakpoint}
         */
        this.rightBreakpoint = null;

        /**
         * Circle events, where this arc is the middle arc.
         *
         * @type {Array.<alphashape.algo.FortuneCircleEvent>}
         */
        this.mainCircleEvents = [];

        /**
         * Circle events, where this arc is either a right or left arc.
         *
         * @type {Array.<alphashape.algo.FortuneCircleEvent>}
         */
        this.circleEvents = [];
    };

    alphashape.algo.FortuneArc.prototype = {
        constructor: algo.FortuneArc,
        /**
         * Get y coordinate of arc given a x coordinate and the y position of the sweep line.
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
            if (util.comparator.compareWithTolerance(py, ly) !== 0) {
                return num / denom;
            } else {
                return py;
            }
        },
        /**
         * Creates Bezier curve from this arc.
         *
         * @param {number} xMin x coordinate of starting point
         * @param {number} xMax x coordinate of end point
         * @param {number} ly y position of sweep line
         * @returns {?alphashape.geom.Bezier}
         */
        toBezier: function(xMin, xMax, ly) {
            var start = new geom.Vector(xMin, this.getY(xMin, ly));
            var end = new geom.Vector(xMax, this.getY(xMax, ly));

            var dir1 = new geom.Vector(1, (xMin - this.face.center.x) / (this.face.center.y - ly));
            var dir2 = new geom.Vector(1, (xMax - this.face.center.x) / (this.face.center.y - ly));

            var line1 = new geom.Line(start, dir1);
            var line2 = new geom.Line(end, dir2);

            var control = line1.getIntersection(line2);

            if (control !== null) {
                return new geom.Bezier(start, end, [control]);
            } else {
                return null;
            }
        }
    };

    /**
     * Breakpoint of two arcs in the beach line.
     *
     * @param {alphashape.algo.FortuneArc} leftArc
     * @param {alphashape.algo.FortuneArc} rightArc
     * @constructor
     */
    alphashape.algo.FortuneBreakpoint = function(leftArc, rightArc) {
        /**
         * @private
         * @type {number}
         */
        this.serial = algo.fortune.breakpointCount++;
        /**
         * @private
         * @type {alphashape.algo.FortuneArc}
         */
        this.leftArc = leftArc;
        /**
         * @private
         * @type {alphashape.algo.FortuneArc}
         */
        this.rightArc = rightArc;
        /**
         * @type alphashape.ds.HalfEdge
         */
        this.halfEdge = null;
    };

    alphashape.algo.FortuneBreakpoint.prototype = {
        constructor: algo.FortuneBreakpoint,
        /**
         * Checks if this is an only breakpoint.
         *
         * @returns {boolean}
         */
        isOnlyBreakpoint: function() {
            return util.comparator.compareWithTolerance(this.leftArc.face.center.y, this.rightArc.face.center.y) === 0;
        },
        /**
         * Returns the location of the breakpoint given the y position of the sweep line.
         *
         * @param {number} ly y position of the sweep line
         * @returns {alphashape.geom.Vector} position of the breakpoint
         */
        getLocation: function (ly) {
            var pix = this.rightArc.face.center.x;
            var piy = this.rightArc.face.center.y;
            var pjx = this.leftArc.face.center.x;
            var pjy = this.leftArc.face.center.y;

            var a = pjy - piy;
            var b = 2 * (pjx * (piy - ly) - pix * (pjy - ly));
            var c = (pjy - ly) * (pix * pix + piy * piy - ly * ly) - (piy - ly) * (pjx * pjx + pjy * pjy - ly * ly);

            if (util.comparator.compareWithTolerance(pjy, piy) === 0) {
                var x = (pix + pjx) / 2;
            } else {
                var x1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
                var x2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
                if (this.getDirection().x <= 0) {
                    x = Math.min(x1, x2);
                } else {
                    x = Math.max(x1, x2);
                }
            }
            var y = this.rightArc.getY(x, ly);
            return new geom.Vector(x, y);
        },
        /**
         * Get the origin of the breakpoint.
         *
         * @private
         * @returns {alphashape.geom.Vector}
         */
        getOrigin: function () {
            return this.rightArc.face.center.add(this.leftArc.face.center).multiplyScalar(0.5);
        },
        /**
         * Get the direction of this breakpoint with decreasing y coordinate of the sweep line.
         *
         * @private
         * @returns {alphashape.geom.Vector} direction of breakpoint
         */
        getDirection: function () {
            return this.leftArc.face.center.sub(this.rightArc.face.center).
                rotate(Math.PI / 2).normalize();
        },
        /**
         * Calculate the origin of this breakpoint's half edge.
         */
        calcHalfEdgeOrigin: function () {
            this.halfEdge.origin = algo.fortune.voronoiDiagram.getNewVertex();
            this.halfEdge.origin.coordinates = this.getOrigin().add(this.getDirection().
                multiplyScalar(util.constant.INFINITY));
            this.halfEdge.twin.origin = algo.fortune.voronoiDiagram.getNewVertex();
            this.halfEdge.twin.origin.coordinates = this.getOrigin().add(this.getDirection().
                multiplyScalar(-util.constant.INFINITY));
        },
        /**
         * Compare this breakpoint to another breakpoints x location at a given sweep line position. If the x location
         * is equal, then the breakpoints' direction is used for comparison.
         *
         * @param {alphashape.algo.FortuneBreakpoint} breakpoint
         * @param {number} ly
         * @returns {number} order of the compared breakpoints
         */
        compareTo: function(breakpoint, ly) {
            if ((this.leftArc === breakpoint.leftArc) && (this.rightArc === breakpoint.rightArc)) {
                return 0;
            }
            if (this.rightArc === breakpoint.leftArc) {
                return -1;
            }
            if (this.leftArc === breakpoint.rightArc) {
                return 1;
            }
            var comp = util.comparator.compareWithTolerance(this.getLocation(ly).x, breakpoint.getLocation(ly).x);
            if (comp === 0) {
                var dir1 = this.getDirection();
                var dir2 = breakpoint.getDirection();
                if (this.isOnlyBreakpoint()) {
                    var xSpeed1 = 0;
                } else if (util.comparator.compareWithTolerance(dir1.y, 0) === 0) {
                    xSpeed1 = util.comparator.sign(dir1.x) * util.constant.INFINITY;
                } else {
                    xSpeed1 = dir1.x / (-dir1.y);
                }
                if (breakpoint.isOnlyBreakpoint()) {
                    var xSpeed2 = 0;
                } else if (util.comparator.compareWithTolerance(dir2.y, 0) === 0) {
                    xSpeed2 = util.comparator.sign(dir2.x) * util.constant.INFINITY;
                } else {
                    xSpeed2 = dir2.x / (-dir2.y);
                }
                var speedComp = util.comparator.compareWithTolerance(xSpeed1, xSpeed2);
                var xSign1 = util.comparator.compareWithTolerance(xSpeed1, 0);
                var xSign2 = util.comparator.compareWithTolerance(xSpeed2, 0);
                if (xSign1 !== xSign2) {
                    if ((xSign1 === 1) || (xSign2 === -1)) {
                        return (-1);
                    } else if ((xSign1 === -1) || (xSign2 === 1)) {
                        return 1;
                    }
                } else if (speedComp !== 0) {
                    if (xSign1 === -1) {
                        return speedComp;
                    } else {
                        return (-1) * speedComp;
                    }
                } else {
                    return util.comparator.compare(this.serial, breakpoint.serial);
                }
            } else {
                return comp;
            }
            return 0;
        }
    };

    /**
     * An event in Fortune's algorithm.
     *
     * @param {alphashape.geom.Vector} location of the event
     * @constructor
     */
    alphashape.algo.FortuneEvent = function(location) {
        this.location = location;
        this.serial = algo.fortune.eventCount++;
    };

    alphashape.algo.FortuneEvent.prototype = {
        constructor: algo.FortuneEvent,
        /**
         * Checks if this event is a site event.
         *
         * @returns {boolean}
         */
        isSiteEvent: function () {
            return this.center === undefined;
        },
        /**
         * Checks if this event is a circle event.
         *
         * @returns {boolean}
         */
        isCircleEvent: function () {
            return this.center !== undefined;
        },
        /**
         * Compares two Fortune events according to their location's coordinates. Events are ordered from bottom to top
         * (screen coordinates) and from left to right. Circle events have priority over site events with same y
         * coordinate.
         *
         * @param event
         * @returns {number}
         */
        compareTo: function(event) {
            return algo.FortuneEvent.compare(this, event);
        }
    };

    /**
     * Compares two Fortune events according to their location's coordinates. Events are ordered from bottom to top
     * (screen coordinates) and from left to right. Circle events have priority over site events with same y coordinate.
     *
     * @param {alphashape.algo.FortuneEvent} e1
     * @param {alphashape.algo.FortuneEvent} e2
     * @returns {number}
     */
    alphashape.algo.FortuneEvent.compare = function (e1, e2) {
        if (e1 === e2) {
            return 0;
        }
        var yComp = util.comparator.compareWithTolerance(e1.location.y, e2.location.y);
        if (yComp === 0) {
            var xComp = util.comparator.compareWithTolerance(e1.location.x, e2.location.x);
            if (e1.isCircleEvent() && e2.isCircleEvent()) {
                if (xComp !== 0) {
                    return xComp;
                } else {
                    return util.comparator.compare(e1.serial, e2.serial);
                }
            } else if (e1.isCircleEvent()) {
                return -1;
            } else if (e2.isCircleEvent()) {
                return 1;
            } else if (xComp !== 0) {
                return xComp;
            } else {
                return util.comparator.compare(e1.serial, e2.serial);
            }
        } else {
            return -yComp;
        }
    };

    /**
     * A site event in Fortune's algorithm.
     *
     * @extends alphashape.algo.FortuneEvent
     * @param {alphashape.geom.Vector} location of the event
     * @constructor
     */
    alphashape.algo.FortuneSiteEvent = function(location) {
        this.location = location;
        this.serial = algo.fortune.eventCount++;
    };

    alphashape.algo.FortuneSiteEvent.prototype = Object.create(algo.FortuneEvent.prototype);
    alphashape.algo.FortuneSiteEvent.prototype.constructor = algo.FortuneSiteEvent;

    /**
     * Handle site event.
     */
    alphashape.algo.FortuneSiteEvent.prototype.handle = function () {
        var insertionResults = algo.fortune.insertArc(this.location);

        if (insertionResults.arcAbove !== null) {
            insertionResults.arcBelow.mainCircleEvents.forEach(function(circleEvent) {
                algo.fortune.eventQueue.deleteElement(circleEvent);
            });

            var circleEvent = algo.fortune.checkArcForCircleEvent(insertionResults.arcAbove.leftBreakpoint.leftArc);
            if (circleEvent !== null) {
                algo.fortune.eventQueue.insert(circleEvent);
            }
            if (insertionResults.arcAbove.rightBreakpoint !== null) {
                circleEvent = algo.fortune.checkArcForCircleEvent(insertionResults.arcAbove.rightBreakpoint.rightArc);
                if (circleEvent !== null) {
                    algo.fortune.eventQueue.insert(circleEvent);
                }
            }
        }
    };

    /**
     * Circle event in Fortune's algorithm.
     *
     * @extends alphashape.algo.FortuneEvent
     * @param {alphashape.geom.Vector} location of the event
     * @param {alphashape.algo.FortuneArc} arc middle arc involved in event
     * @param {alphashape.geom.Vector} center of the event
     * @constructor
     */
    alphashape.algo.FortuneCircleEvent = function(location, arc, center) {
        this.location = location;
        this.arc = arc;
        this.center = center;
        this.serial = algo.fortune.eventCount++;
    };

    alphashape.algo.FortuneCircleEvent.prototype = Object.create(algo.FortuneEvent.prototype);
    alphashape.algo.FortuneCircleEvent.prototype.constructor = algo.FortuneCircleEvent;

    /**
     * Handle circle event.
     */
    alphashape.algo.FortuneCircleEvent.prototype.handle = function () {
        algo.fortune.deleteArc(this);

        this.arc.mainCircleEvents.forEach(function(circleEvent) {
            algo.fortune.eventQueue.deleteElement(circleEvent);
        });
        this.arc.circleEvents.forEach(function(circleEvent) {
            algo.fortune.eventQueue.deleteElement(circleEvent);
        });

        var circleEvent = algo.fortune.checkArcForCircleEvent(this.arc.leftBreakpoint.leftArc);
        if (circleEvent !== null) {
            algo.fortune.eventQueue.insert(circleEvent);
        }
        circleEvent = algo.fortune.checkArcForCircleEvent(this.arc.rightBreakpoint.rightArc);
        if (circleEvent !== null) {
            algo.fortune.eventQueue.insert(circleEvent);
        }
    };

    /**
     * Fortune's algorithm to compute the closest point Voronoi diagram.
     *
     * @namespace
     */
    alphashape.algo.fortune = {};

    /**
     * @type {number}
     */
    alphashape.algo.fortune.eventCount;

    /**
     * The event queue containing site and circle events.
     *
     * @private
     * @type {alphashape.ds.Tree}
     */
    alphashape.algo.fortune.eventQueue;

    /**
     * @type {number}
     */
    alphashape.algo.fortune.breakpointCount;

    /**
     * The balanced binary tree containing the breakpoints in the beach line.
     *
     * @private
     * @type {alphashape.ds.Tree}
     */
    alphashape.algo.fortune.beachLine;

    /**
     * The Voronoi diagram.
     *
     * @private
     * @type {alphashape.ds.EdgeList}
     */
    alphashape.algo.fortune.voronoiDiagram;

    /**
     * Initialize variables for Fortunes algorithm
     * @private
     */
    alphashape.algo.fortune.init = function() {
        algo.fortune.eventCount = 0;
        algo.fortune.eventQueue = new ds.Tree();
        algo.fortune.breakpointCount = 0;
        algo.fortune.beachLine = new ds.Tree();
        algo.fortune.constructionBeachLine = new ds.Tree();
        algo.fortune.voronoiDiagram = new ds.EdgeList();
        algo.fortune.delaunayTriangulation = new ds.EdgeList();
    };

    /**
     * Compute the closest point Voronoi diagram.
     *
     * @param {Array.<{alphashape.geom.Vector}>} points
     * @param {number} minY minimum y position of sweep line for construction beach line
     * @returns {{voronoiDiagram: alphashape.ds.EdgeList, constructionBeachLine:
     * Array.<alphashape.algo.FortuneBreakpoint>}} Voronoi diagram and construction beach line
     */
    alphashape.algo.fortune.computeVoronoiDiagram = function (points, minY) {
        algo.fortune.init();

        points.forEach(function (p) {
            algo.fortune.eventQueue.insert(new algo.FortuneSiteEvent(p));
        });
        var constructionBeachLine = [];
        while (!algo.fortune.eventQueue.isEmpty()) {
            var currentEvent = algo.fortune.eventQueue.deleteMin();
            currentEvent.handle();
            if (util.comparator.compareWithTolerance(currentEvent.location.y, minY) === 1) {
                constructionBeachLine = algo.fortune.beachLine.inorderList();
            }
        }
        algo.fortune.voronoiDiagram.removeZeroLengthEdges();
        return { voronoiDiagram: algo.fortune.voronoiDiagram, constructionBeachLine: constructionBeachLine };
    };

    /**
     * Check an arc and its left and right neighbours for a circle event.
     *
     * @param {alphashape.algo.FortuneArc} arc
     * @returns {?alphashape.algo.FortuneCircleEvent}
     */
    alphashape.algo.fortune.checkArcForCircleEvent = function(arc) {
        if ((arc.leftBreakpoint !== null) && (arc.rightBreakpoint !== null)) {
            var det = geom.Vector.calcDet(arc.leftBreakpoint.leftArc.face.center, arc.face.center,
                arc.rightBreakpoint.rightArc.face.center);

            if (util.comparator.compareWithTolerance(det, 0) >= 0) {
                return null;
            }
            var t = new geom.Triangle(arc.leftBreakpoint.leftArc.face.center, arc.face.center,
                arc.rightBreakpoint.rightArc.face.center);
            var circle = t.getCircumcircle();
            var circleEventLoc = new geom.Vector(circle.center.x, circle.center.y - circle.radius);
            var circleEvent = new algo.FortuneCircleEvent(circleEventLoc, arc, circle.center);
            if (circleEvent !== null) {
                arc.mainCircleEvents.push(circleEvent);
                arc.leftBreakpoint.leftArc.circleEvents.push(circleEvent);
                arc.rightBreakpoint.rightArc.circleEvents.push(circleEvent);
            }
            return circleEvent;
        }
        return null;
    };

    /**
     * Get the the arc below a site event.
     *
     * @private
     * @param {alphashape.geom.Vector} eventLocation
     * @returns {alphashape.algo.FortuneArc} arc below site event
     */
    alphashape.algo.fortune.getArcBelowEvent = function (eventLocation) {
        if (algo.fortune.beachLine.root.content.constructor === algo.FortuneArc) {
            var result = algo.fortune.beachLine.root.content;
            algo.fortune.beachLine.root = null;
            return result;
        }
        var breakpoint = algo.fortune.beachLine.getClosest(eventLocation, function(loc, bp) {
            return util.comparator.compareWithTolerance(loc.x, bp.getLocation(loc.y).x);});
        if (util.comparator.compareWithTolerance(eventLocation.x, breakpoint.getLocation(eventLocation.y).x) !== 1) {
            return breakpoint.leftArc;
        } else {
            return breakpoint.rightArc;
        }
    };

    /**
     * Insert a new arc into the beach line because of a site event. Update the edge list of the Voronoi diagram
     * accordingly.
     *
     * @param {alphashape.geom.Vector} eventLocation
     * @returns {{arcBelow: ?alphashape.algo.FortuneArc, arcAbove: ?alphashape.algo.FortuneArc}} arcs to check for
     * circle event, resp. to remove from circle events
     */
    alphashape.algo.fortune.insertArc = function (eventLocation) {
        var faceAbove = algo.fortune.voronoiDiagram.getNewFace();
        faceAbove.center = eventLocation;
        var arcAbove = new algo.FortuneArc(faceAbove);
        if (algo.fortune.beachLine.isEmpty()) {
            algo.fortune.beachLine.insert(arcAbove);
            return {arcBelow: null, arcAbove: null};
        }
        var arcBelow = this.getArcBelowEvent(eventLocation);
        var faceBelow = arcBelow.face;
        var halfEdge = algo.fortune.voronoiDiagram.getNewHalfEdgePair();

        halfEdge.incidentFace = faceAbove;
        faceAbove.outerComponent = halfEdge;

        halfEdge.twin.incidentFace = faceBelow;
        if (faceBelow.outerComponent === null) {
            faceBelow.outerComponent = halfEdge.twin;
        }

        var leftArc = new algo.FortuneArc(faceBelow);
        var rightArc = new algo.FortuneArc(faceBelow);

        var leftBreakpoint = new algo.FortuneBreakpoint(leftArc, arcAbove);
        leftBreakpoint.halfEdge = halfEdge.twin;
        leftBreakpoint.calcHalfEdgeOrigin();

        arcAbove.leftBreakpoint = leftBreakpoint;
        leftArc.rightBreakpoint = leftBreakpoint;
        leftArc.leftBreakpoint = arcBelow.leftBreakpoint;

        if (arcBelow.leftBreakpoint !== null) {
            arcBelow.leftBreakpoint.rightArc = leftArc;
        }

        algo.fortune.beachLine.insert(leftBreakpoint,
            function(bp1, bp2) {return bp1.compareTo(bp2, eventLocation.y);});

        if (!leftBreakpoint.isOnlyBreakpoint()) {

            var rightBreakpoint = new algo.FortuneBreakpoint(arcAbove, rightArc);
            rightBreakpoint.halfEdge = halfEdge;
            rightBreakpoint.calcHalfEdgeOrigin();

            arcAbove.rightBreakpoint = rightBreakpoint;
            rightArc.leftBreakpoint = rightBreakpoint;
            rightArc.rightBreakpoint = arcBelow.rightBreakpoint;

            if (arcBelow.rightBreakpoint !== null) {
                arcBelow.rightBreakpoint.leftArc = rightArc;
            }

            algo.fortune.beachLine.insert(rightBreakpoint,
                function(bp1, bp2) {return bp1.compareTo(bp2, eventLocation.y);});
        }

        return { arcBelow: arcBelow, arcAbove: arcAbove };
    };

    /**
     * Remove an arc and one of its breakpoints because of a circle event.
     *
     * @param {alphashape.algo.FortuneCircleEvent} event
     */
    alphashape.algo.fortune.deleteArc = function (event) {

        algo.fortune.beachLine.deleteElement(event.arc.leftBreakpoint,
            function(bp1, bp2) {return bp1.compareTo(bp2, event.location.y);});
        algo.fortune.beachLine.deleteElement(event.arc.rightBreakpoint,
            function(bp1, bp2) {return bp1.compareTo(bp2, event.location.y);});

        var newBreakpoint = new algo.FortuneBreakpoint(event.arc.leftBreakpoint.leftArc,
            event.arc.rightBreakpoint.rightArc);
        event.arc.leftBreakpoint.leftArc.rightBreakpoint = newBreakpoint;
        event.arc.rightBreakpoint.rightArc.leftBreakpoint = newBreakpoint;

        algo.fortune.beachLine.insert(newBreakpoint,
            function(bp1, bp2) {return bp1.compareTo(bp2, event.location.y);});

        algo.fortune.createPartialEdgeListForCircleEvent(event.center, event.arc.leftBreakpoint,
            event.arc.rightBreakpoint, newBreakpoint);
    };

    /**
     * Update Voronoi diagram because of a circle event.
     *
     * @private
     * @param {alphashape.geom.Vector} vertexLocation
     * @param {alphashape.algo.FortuneBreakpoint} leftBreakpoint
     * @param {alphashape.algo.FortuneBreakpoint} rightBreakpoint
     * @param {alphashape.algo.FortuneBreakpoint} newBreakpoint
     */
    alphashape.algo.fortune.createPartialEdgeListForCircleEvent = function (vertexLocation,
                                                    leftBreakpoint, rightBreakpoint, newBreakpoint) {
        var vertex = algo.fortune.voronoiDiagram.getNewVertex();
        var newHalfEdge = algo.fortune.voronoiDiagram.getNewHalfEdgePair();
        newHalfEdge.origin = vertex;
        newBreakpoint.halfEdge = newHalfEdge.twin;
        newBreakpoint.calcHalfEdgeOrigin();

        var leftHalfEdge = leftBreakpoint.halfEdge;
        var rightHalfEdge = rightBreakpoint.halfEdge;

        leftHalfEdge.origin.coordinates = vertexLocation;
        rightHalfEdge.origin.coordinates = vertexLocation;
        newHalfEdge.origin.coordinates = vertexLocation;

        vertex.incidentEdge = newHalfEdge;

        leftHalfEdge.setPrev(newHalfEdge.twin);
        leftHalfEdge.twin.setNext(rightHalfEdge);
        rightHalfEdge.twin.setNext(newHalfEdge);

        newHalfEdge.incidentFace = rightHalfEdge.twin.incidentFace;
        newHalfEdge.twin.incidentFace = leftHalfEdge.incidentFace;
    };

})(alphashape.algo, alphashape.util, alphashape.geom, alphashape.ds);
