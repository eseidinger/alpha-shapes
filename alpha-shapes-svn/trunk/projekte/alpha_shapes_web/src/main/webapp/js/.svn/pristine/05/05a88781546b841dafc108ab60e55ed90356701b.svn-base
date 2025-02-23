'use strict';

/**
 * Draw SVG using Raphael.
 * 
 * @constructor
 * @param {Object} paper
 */
function SvgDrawer(paper) {
    this.paper = paper;
}

SvgDrawer.prototype = {
    constructor: SvgDrawer,
    drawPoint: function(point, radius, color, alpha) {
        var element = this.paper.circle(point.x, point.y, radius);
        element.attr('stroke', color);
        element.attr('opacity', alpha);
        element.attr('fill', color);
    },
    drawPoints: function(points, radius, color, alpha) {
        for (var i = 0; i < points.length; i++) {
            this.drawPoint(points[i], radius, color, alpha);
        }
    },
    drawPolygon: function(points, lineWidth, color, alpha) {
        if (points.length > 1) {
            var path = 'M' + points[0];
            for (var i = 1; i < points.length; i++) {
                path = path + ',L' + points[i];
            }
            path = path + 'Z';
            var element = this.paper.path(path);
            element.attr('stroke', color);
            element.attr('stroke-width', lineWidth);
            element.attr('opacity', alpha);
        }
    },
    drawCircle: function(circle, lineWidth, color, alpha) {
        var element = this.paper.circle(circle.center.x, circle.center.y,
            circle.radius);
        element.attr('stroke', color);
        element.attr('stroke-width', lineWidth);
        element.attr('stroke-opacity', alpha);
    },
    drawLine: function(line, lineWidth, color, alpha) {
        var path = 'M' + line.origin + ',L' + line.getEndpoint() + 'Z';
        var element = this.paper.path(path);
        element.attr('stroke', color);
        element.attr('stroke-width', lineWidth);
        element.attr('stroke-opacity', alpha);
    },
    drawLines: function(lines, lineWidth, color, alpha) {
        for (var i = 0; i < lines.length; i++) {
            this.drawLine(lines[i], lineWidth, color, alpha);
        }
    },
    fillCanvas: function(color, alpha) {
        var element = this.paper.rect(0,0,this.paper.width,this.paper.height);
        element.attr('fill', color);
        element.attr('fill-opacity', alpha);
    },
    fillPolygon: function(polygon, color, alpha) {
        if (polygon.length > 1) {
            var path = 'M' + polygon[0];
            for (var i = 1; i < polygon.length; i++) {
                path = path + ',L' + polygon[i];
            }
            path = path + 'Z';
            var element = this.paper.path(path);
            element.attr('stroke', color);
            element.attr('stroke-opacity', alpha);
            element.attr('fill', color);
            element.attr('fill-opacity', alpha);
        }
    },
    fillInversePolygon: function(polygon, color, alpha) {
        if (polygon.length > 1) {
            var h = '' + this.paper.height;
            var w = '' + this.paper.width;
            var path = 'M0,0';
            path = path + 'L0,' + h;
            path = path + 'L' + w + ',' + h;
            path = path + 'L' + w + ',0';
            path = path + 'Z';
            path = path + 'M' + polygon[0];
            for (var i = 1; i < polygon.length; i++) {
                path = path + ',L' + polygon[i];
            }
            path = path + 'Z';
            var element = this.paper.path(path);
            element.attr('fill', color);
            element.attr('fill-opacity', alpha);
        }
    },
    drawDisc: function(disc, color, alpha) {
        var element = this.paper.circle(disc.center.x, disc.center.y, disc.radius);
        element.attr('stroke', color);
        element.attr('stroke-opacity', alpha);
        element.attr('fill', color);
        element.attr('fill-opacity', alpha);
    },
    drawInverseDisc: function(disc, color, alpha) {
        var h = this.paper.height;
        var w = this.paper.width;
        var r = disc.radius;
        var c_x = disc.center.x;
        var c_y = disc.center.y;
        var o_x = c_x - r;
        var o_y = c_y;
        var path = 'M0,0';
        path = path + 'L0,' + h;
        path = path + 'L' + w + ',' + h;
        path = path + 'L' + w + ',0';
        path = path + 'Z';
        path = path + 'M' + o_x + ',' + o_y;
        path = path + 'a' + r + ',' + r;
        path = path + ',0,1,1,0,1,1';
        path = path + 'Z';
        var element = this.paper.path(path);
        element.attr('stroke', color);
        element.attr('stroke-opacity', alpha);
        element.attr('fill', color);
        element.attr('fill-opacity', alpha);
    }
};
