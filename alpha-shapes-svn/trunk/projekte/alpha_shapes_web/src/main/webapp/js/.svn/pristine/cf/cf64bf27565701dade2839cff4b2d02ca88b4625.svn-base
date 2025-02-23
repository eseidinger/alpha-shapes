'use strict';

/**
 * A rectangle.
 * 
 * @constructor
 * @param {number} xMin minimum x coordinate
 * @param {number} yMin minimum y coordinate
 * @param {number} xMax maximum x coordinate
 * @param {number} yMax maximum y coordinate
 */
function Rectangle(xMin, yMin, xMax, yMax) {
    
    /** @const */ this.xMin = xMin;
    /** @const */ this.yMin = yMin;
    /** @const */ this.xMax = xMax;
    /** @const */ this.yMax = yMax;
    
    /**
     * @const
     * @type Array.<Vector>
     */
    this.points = [];
    this.points[0] = new Vector(xMin, yMin);
    this.points[1] = new Vector(xMin, yMax);
    this.points[2] = new Vector(xMax, yMax);
    this.points[3] = new Vector(xMax, yMin);
    
    /**
     * @const
     * @type Array.<LineSegment>
     */
    this.ls = [];
    this.ls[0] = LineSegment.createFromPoints(this.points[0], this.points[1]);
    this.ls[1] = LineSegment.createFromPoints(this.points[1], this.points[2]);
    this.ls[2] = LineSegment.createFromPoints(this.points[2], this.points[3]);
    this.ls[3] = LineSegment.createFromPoints(this.points[3], this.points[0]);
};

Rectangle.prototype = {
    constructor: Rectangle,
    
    /**
     * Calculate intersecting points of a line, ray or line segment with
     * this rectangle.
     * 
     * @param {Line|Ray|LineSegment} line
     * @returns {Array.<Vector>} intersecting points with rectangle
     */
    getIntersections: function(line) {
        var ints = [];
        
        for (var i = 0; i < 4; i++) {
            var inter = this.ls[i].getIntersection(line);
            if (inter !== null) {
                ints.push(inter);
            }
        }
        
        ints = Misc.removeDoublesFromArray(ints, Vector.compareByXThenY);
        
        return ints;
    },
    /**
     * Checks if rectangle contains a point.
     * 
     * @param {Vector} point
     * @returns {boolean}
     */
    contains: function(point) {
        return (point.x <= this.xMax) && (point.x >= this.xMin) &&
                (point.y <= this.yMax) && (point.y >= this.yMin);
    }
};
