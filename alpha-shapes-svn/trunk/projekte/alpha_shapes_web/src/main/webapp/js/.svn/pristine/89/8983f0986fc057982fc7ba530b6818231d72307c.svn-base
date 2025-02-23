'use strict';

/**
 * A semi infinite line.
 * 
 * @constructor
 * @param {Vector} origin
 * @param {Vector} direction
 */
function Ray(origin, direction) {
    /**
     * @const
     * @type Vector
     */
    this.origin = origin;
    /**
     * @const
     * @type Vector
     */
    this.direction = direction;
};

Ray.prototype = {
    constructor: Ray,
    
    /**
     * Projection of a point on this ray.
     * 
     * @param {Vector} point vector
     * @returns {Vector} projection of point on this line
     */
    pointProjection: function(point) {
        var line = new Line(this.origin, this.direction);
        var projection = line.pointProjection(point);
        if (this.containsPoint(projection)) {
            return projection;
        } else {
            return null;
        }
    },

    /**
     * Checks whether a point is contained on this ray.
     * 
     * @param {Vector} point to be checked
     * @returns {boolean} true if point is contained, false otherwise
     */
    containsPoint: function(point) {
        var line = new Line(this.origin, this.direction);
        var lambda = line.calculateLambda(point);
        if (lambda === null) {
            return false;
        } else {
            return Misc.compareWithTolerance(lambda, 0) !== -1;
        }
    },
    
    /**
     * Calculates intersection with another line, ray or line segment.
     * 
     * @param {(Line|Ray|LineSegment)} ray
     * @returns {?Vector} intersection with this ray or null if not existent
     */
    getIntersection: function(ray) {
        var line1 = new Line(this.origin, this.direction);
        var line2 = new Line(ray.origin, ray.direction);
        
        var intersection = line1.getIntersection(line2);
        if (intersection !== null) {
            if (this.containsPoint(intersection) &&
                    ray.containsPoint(intersection)) {
                return intersection;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
};
