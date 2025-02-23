'use strict';

var Vector = alphashape.geom.Vector;
var Constants = alphashape.util.Constants;
var ArrayFunctions = alphashape.util.ArrayFunctions;

/**
 * Data store for user provided data.
 * 
 * @constructor
 */
function UserData() {
}

/**
 * Point set to compute diagrams from.
 * 
 * @type Array.<Vector>
 */
UserData.points = [];
UserData.alphaDiscCenter = new Vector(10, 10);

UserData.alpha = 75;
UserData.alphaMin = -100;
UserData.alphaMax = 100;

/**
 * Calculate minimum and maximum alpha from significant alphas if available.
 * If no significant alphas are available sets default value.
 */
UserData.update = function() {
    if (Computations.significantAlphas.length === 0) {
        UserData.alphaMin = -100;
        UserData.alphaMax = 100;
    } else {
        var alphaMin = Constants.INFINITY;
        var alphaMax = -Constants.INFINITY;
        Computations.significantAlphas.forEach(function(val) {
            if (val > alphaMax) {
                alphaMax = Math.round(val);
            }
            if (val < alphaMin) {
                alphaMin = Math.round(val);
            }
        });
        UserData.alphaMin = alphaMin - 10;
        UserData.alphaMax = alphaMax + 10;
    }
    UserData.setAlpha(UserData.alpha);
};

/**
 * Sets alpha value from slider value.
 * 
 * @param {number} sliderValue
 */
UserData.setAlpha = function(sliderValue) {
    if (sliderValue <= UserData.alphaMin) {
        UserData.alpha = -Constants.INFINITY;
    } else if (sliderValue >= UserData.alphaMax) {
        UserData.alpha = Constants.INFINITY;
    } else {
        UserData.alpha = sliderValue;
    }
};


/**
 * Add a point to the point set given coordinates.
 * 
 * @param {number} x coordinate of the new point
 * @param {number} y coordinate of the new point
 */
UserData.addPoint = function(x, y) {
    var point = new Vector(x, y);
    UserData.points.push(point);
};

/**
 * Remove the closest point with maximum distance to the given coordinate.
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} maxDist
 */
UserData.removePoint = function(x, y, maxDist) {
    var pointIndex = ArrayFunctions.getIndexOfElementWithMinimalDistance(UserData.points,
            new Vector(x, y), Vector.calcDist, maxDist);

    if (pointIndex >= 0) {
        UserData.points.splice(pointIndex, 1);
    }
};
