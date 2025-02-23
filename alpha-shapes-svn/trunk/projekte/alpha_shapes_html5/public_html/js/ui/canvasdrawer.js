'use strict';

var Circle = alphashape.geom.Circle;

/**
 * Draw using canvas methods.
 * 
 * @constructor
 * @param {Object} canvas
 */
function CanvasDrawer(canvas) {
    this.canvas = canvas;
}

CanvasDrawer.prototype = {
    constructor: CanvasDrawer,
    drawPoint: function(point, radius, color, alpha) {
        var disc = new Circle(point, radius);
        this.drawDisc(disc, color, alpha);
    },
    drawPoints: function(points, radius, color, alpha) {
        for (var i = 0; i < points.length; i++) {
            this.drawPoint(points[i], radius, color, alpha);
        }
    },
    drawPolygon: function(points, lineWidth, color, alpha) {
        if (points.length > 1) {
            if (this.canvas.getContext) {
                var ctx = this.canvas.getContext('2d');
                ctx.strokeStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (var i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    },
    drawCircle: function(circle, lineWidth, color, alpha) {
        if (this.canvas.getContext) {
            var ctx = this.canvas.getContext('2d');
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(circle.center.x, circle.center.y, circle.radius, 0,
                    2 * Math.PI, false);
            ctx.stroke();
        }
    },
    drawLine: function(line, lineWidth, color, alpha) {
        if (this.canvas.getContext) {
            var ctx = this.canvas.getContext('2d');
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(line.origin.x, line.origin.y);
            ctx.lineTo(line.getEndpoint().x, line.getEndpoint().y);
            ctx.stroke();
        }
    },
    drawLines: function(lines, lineWidth, color, alpha) {
        for (var i = 0; i < lines.length; i++) {
            this.drawLine(lines[i], lineWidth, color, alpha);
        }
    },
    fillCanvas: function(color, alpha) {
        var ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.canvas.width, 0);
            ctx.lineTo(this.canvas.width, this.canvas.height);
            ctx.lineTo(0, this.canvas.height);
            ctx.closePath();
            ctx.fill();
        }
    },
    fillPolygon: function(polygon, color, alpha) {
        if (polygon.length > 1) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(polygon[0].x, polygon[0].y);
                for (var i = 1; i < polygon.length; i++) {
                    ctx.lineTo(polygon[i].x, polygon[i].y);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
    },
    fillInversePolygon: function(polygon, color, alpha) {
        if (polygon.length > 1) {
            var ctx = this.canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, this.canvas.height);
                ctx.lineTo(this.canvas.width, this.canvas.height);
                ctx.lineTo(this.canvas.width, 0);
                ctx.closePath();
                ctx.moveTo(polygon[0].x, polygon[0].y);
                for (var i = 1; i < polygon.length; i++) {
                    ctx.lineTo(polygon[i].x, polygon[i].y);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
    },
    drawDisc: function(disc, color, alpha) {
        var ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(disc.center.x, disc.center.y, disc.radius,
                    0, 2 * Math.PI, true);
            ctx.fill();
        }
    },
    drawInverseDisc: function(disc, color, alpha) {
        var ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.canvas.width, 0);
            ctx.lineTo(this.canvas.width, this.canvas.height);
            ctx.lineTo(0, this.canvas.height);
            ctx.closePath();
            ctx.arc(disc.center.x, disc.center.y, disc.radius,
                    0, 2 * Math.PI, true);
            ctx.fill();
        }
    }
};

