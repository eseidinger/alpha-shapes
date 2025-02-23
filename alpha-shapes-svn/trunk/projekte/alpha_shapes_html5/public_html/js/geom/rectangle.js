'use strict';

(function(Vector, LineSegment, ArrayFunctions) {
    /**
     * A rectangle.
     *
     * @constructor
     * @param {number} xMin minimum x coordinate
     * @param {number} yMin minimum y coordinate
     * @param {number} xMax maximum x coordinate
     * @param {number} yMax maximum y coordinate
     */
    alphashape.geom.Rectangle = function(xMin, yMin, xMax, yMax) {
        /**
         * @const
         * @type Array.<alphashape.geom.Vector>
         */
        this.points = [];
        this.points[0] = new Vector(xMin, yMin);
        this.points[1] = new Vector(xMin, yMax);
        this.points[2] = new Vector(xMax, yMax);
        this.points[3] = new Vector(xMax, yMin);

        /**
         * @const
         * @type Array.<alphashape.geom.LineSegment>
         */
        this.ls = [];
        this.ls[0] = LineSegment.createFromPoints(this.points[0], this.points[1]);
        this.ls[1] = LineSegment.createFromPoints(this.points[1], this.points[2]);
        this.ls[2] = LineSegment.createFromPoints(this.points[2], this.points[3]);
        this.ls[3] = LineSegment.createFromPoints(this.points[3], this.points[0]);
    };
    var Rectangle = alphashape.geom.Rectangle;

    alphashape.geom.Rectangle.prototype = {
        constructor: Rectangle,

        /**
         * Calculate intersecting points of a line, ray or line segment with
         * this rectangle.
         *
         * @param {alphashape.geom.Line|alphashape.geom.Ray|alphashape.geom.LineSegment} line
         * @returns {Array.<alphashape.geom.Vector>} intersecting points with rectangle
         */
        getIntersections: function(line) {
            var ints = [];

            for (var i = 0; i < 4; i++) {
                var inter = this.ls[i].getIntersection(line);
                if (inter !== null) {
                    ints.push(inter);
                }
            }

            ints = ArrayFunctions.removeDoublesFromArray(ints, Vector.compareByXThenY);

            return ints;
        }
    };
})(alphashape.geom.Vector, alphashape.geom.LineSegment, alphashape.util.ArrayFunctions);
