'use strict';

/**
 * A triangle.
 * 
 * @constructor
 * @param {Vector} p1 point vector of corner
 * @param {Vector} p2 point vector of corner
 * @param {Vector} p3 point vector of corner
 */
function Triangle(p1, p2, p3) {
    /**
     * @const
     * @type Vector
     */
    this.p1 = p1;
    /**
     * @const
     * @type Vector
     */
    this.p2 = p2;
    /**
     * @const
     * @type Vector
     */
    this.p3 = p3;
    
    /**
     * @private
     * @type ?Circle
     */
    this.circumcircle = null;
    
    /**
     * @private
     * @type ?number
     */
    this.angle = null;
};

Triangle.prototype = {
    constructor: Triangle,
    /**
     * Calculate circumcircle.
     * 
     * @private
     * @returns {Circle} circumcircle
     */
    calcCircumcircle: function() {
        var center;
        var radius;
        var det = Vector.calcDet(this.p1, this.p2, this.p3);
        if (Misc.compareWithTolerance(det, 0) !== 0) {
            var numX = (Math.pow(this.p1.x, 2) + Math.pow(this.p1.y, 2)) *
                    (this.p2.y - this.p3.y) +
                    (Math.pow(this.p2.x, 2) + Math.pow(this.p2.y, 2)) *
                    (this.p3.y - this.p1.y) +
                    (Math.pow(this.p3.x, 2) + Math.pow(this.p3.y, 2)) *
                    (this.p1.y - this.p2.y);

            var numY = (Math.pow(this.p1.x, 2) + Math.pow(this.p1.y, 2)) *
                    (this.p3.x - this.p2.x) +
                    (Math.pow(this.p2.x, 2) + Math.pow(this.p2.y, 2)) *
                    (this.p1.x - this.p3.x) +
                    (Math.pow(this.p3.x, 2) + Math.pow(this.p3.y, 2)) *
                    (this.p2.x - this.p1.x);

            var denom = this.p1.y * (this.p3.x - this.p2.x) + this.p2.y *
                    (this.p1.x - this.p3.x) + this.p3.y *
                    (this.p2.x - this.p1.x);

            var x = 0.5 * numX / denom;
            var y = 0.5 * numY / denom;

            center = new Vector(x, y);
            
            radius = Vector.calcDist(this.p1, this.p2) *
                Vector.calcDist(this.p2, this.p3) *
                Vector.calcDist(this.p3, this.p1) /
                (2 * Math.abs(det));
        } else {
            var ls1 = LineSegment.createFromPoints(this.p1, this.p2);
            var ls2 = LineSegment.createFromPoints(this.p1, this.p3);
            var ls3 = LineSegment.createFromPoints(this.p2, this.p3);
            var ls = [ls1, ls2, ls3];
            ls.sort(function(ls1, ls2) {
                return Misc.compare(ls1.getLength(), ls2.getLength());
            });
            center = ls[2].getCenter();
            radius = ls[2].getLength()/2;
        }
        return new Circle(center, radius);
    },
            
    /**
     * Circumcircle.
     * 
     * @returns {Circle} circumcircle of this triangle
     */
    getCircumcircle: function() {
        if (this.circumcircle === null) {
            this.circumcircle = this.calcCircumcircle();
        }
        return this.circumcircle;
    },
            
    /**
     * Angle <p1, p2, p3>.
     * 
     * @returns {number} angle <p1, p2, p3>
     */
    getMiddleAngle: function() {
        if (this.angle === null) {
            var num = Vector.calcDistSquare(this.p1, this.p2) +
                    Vector.calcDistSquare(this.p2, this.p3) -
                    Vector.calcDistSquare(this.p1, this.p3);
            var denom = 2 * Vector.calcDist(this.p1, this.p2) *
                    Vector.calcDist(this.p2, this.p3);
            if (Misc.compareWithTolerance(denom, 0) === 0) {
                this.angle = Math.PI;
            } else {
                this.angle = Math.acos(num / denom);
            }
        }
        return this.angle;
    },
            
    /**
     * Checks whether a point is a corner of this triangle.
     * 
     * @param {Vector} p point vector
     * @returns {boolean} true if p is a corner of this triangle,
     *                      false otherwise
     */
    isCorner: function(p) {
        return this.p1.equals(p) || this.p2.equals(p) || this.p3.equals(p);
    }
};

/**
 * Compare two triangles by circumcircle radius then by angle <p1, p2, p3>.
 * 
 * @param {Triangle} t1 triangle
 * @param {Triangle} t2 triangle
 * @returns {number} 0 if t1 == t2, -1 if t1 < t2, 1 if t1 > t2
 */
Triangle.compareByRadiusThenAngle = function(t1, t2) {
    var compR = Misc.compareWithTolerance(t1.getCircumcircle().radius,
        t2.getCircumcircle().radius);
    if (compR !== 0) {
        return compR;
    } else {
        return Misc.compareWithTolerance(t1.getMiddleAngle(),
                t2.getMiddleAngle());
    }
};
