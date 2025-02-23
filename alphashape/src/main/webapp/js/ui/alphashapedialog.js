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

(function(events, drawing, application, util, geom) {

    alphashape.ui.AlphaShapeDialog = {};

    /**
     * Init the alpha shape dialog
     * @suppress {missingProperties}
     */
    alphashape.ui.AlphaShapeDialog.init = function() {
        $('.alphaButton').button();

        $('#alphaShapeDialogButton').click(function() {
            $('#alphaShapeDialog').dialog('open');
            application.Application.refresh();
        });
        $('#checkAlphaShape').change(function() {
            drawing.DrawingController.displayAlphaShape = $(this).is(':checked');
            if ($(this).is(':checked') || $('#checkAlphaHull').is(':checked')) {
                $('.alphaSlider').slider('enable');
                $('#checkAlphaDisc').button('option', 'disabled', false);
            } else {
                $('.alphaSlider').slider('disable');
                $('#checkAlphaDisc').button('option', 'disabled', true);
                $('#checkAlphaDisc').attr('checked', false);
                $('#checkAlphaDisc').change();
            }
            application.Application.refresh();
        });
        $('#checkAlphaHull').change(function() {
            drawing.DrawingController.displayAlphaHull = $(this).is(':checked');
            if ($(this).is(':checked') || $('#checkAlphaShape').is(':checked')) {
                $('.alphaSlider').slider('enable');
                $('#checkAlphaDisc').button('option', 'disabled', false);
            } else {
                $('.alphaSlider').slider('disable');
                $('#checkAlphaDisc').button('option', 'disabled', true);
                $('#checkAlphaDisc').attr('checked', false);
                $('#checkAlphaDisc').change();
            }
            application.Application.refresh();
        });
        $('#checkAlphaDisc').change(function() {
            drawing.DrawingController.displayAlphaDisc = $(this).is(':checked');
            application.Application.refresh();
        });

        $('#checkDGc').change(function() {
            drawing.DrawingController.displayDelaunayMin = $(this).is(':checked');
            application.Application.refresh();
        });
        $('#checkDGf').change(function() {
            drawing.DrawingController.displayDelaunayMax = $(this).is(':checked');
            application.Application.refresh();
        });

        $('#alphaShapeDialog').dialog({autoOpen: false});

        $('.alphaSlider').slider();

        $('#verticalAlphaSlider').slider('option', 'orientation', 'vertical');
        $('#horizontalAlphaSlider').slider('option', 'orientation', 'horizontal');

        $('.alphaSlider').slider('option', 'slide', function() {
            application.SharedData.setAlpha($(this).slider('value'));
            application.Application.refresh();
        });
        $('.alphaSlider').slider('option', 'stop', function() {
            application.SharedData.setAlpha($(this).slider('value'));
            application.Application.refresh();
        });
    };

    /**
     * Set the width and height for the slider and its ticks.
     * @suppress {missingProperties}
     */
    alphashape.ui.AlphaShapeDialog.setVerticalSliderAndTicksGeometry = function() {
        $('#verticalAlphaSlider').height($('#alphaSliderAndTicks').height());
        $('#alphaTickCanvas1')[0].height = $('#alphaSliderAndTicks').height();
        $('#alphaTickCanvas1')[0].width = 10;
        $('#alphaTickCanvas2')[0].height = $('#alphaSliderAndTicks').height();
        $('#alphaTickCanvas2')[0].width = 10;
    };

    /**
     * Set the width and height for the slider and its ticks.
     * @suppress {missingProperties}
     */
    alphashape.ui.AlphaShapeDialog.setHorizontalSliderAndTicksGeometry = function() {
        $('#horizontalAlphaSlider').width($('#alphaSliderAndTicks').width());
        $('#alphaTickCanvas1')[0].width = $('#alphaSliderAndTicks').width();
        $('#alphaTickCanvas1')[0].height = 10;
        $('#alphaTickCanvas2')[0].width = $('#alphaSliderAndTicks').width();
        $('#alphaTickCanvas2')[0].height = 10;
    };

    /**
     * Draw the horizontal slider's ticks given an array of numbers.
     *
     * @param {Array.<number>} values
     */
    alphashape.ui.AlphaShapeDialog.drawHorizontalSliderTicks = function(values) {
        var alphaCanvasDrawer = new drawing.CanvasDrawer($('#alphaTickCanvas1')[0]);
        var zeroCanvasDrawer = new drawing.CanvasDrawer($('#alphaTickCanvas2')[0]);

        values = values.filter(function(val) {
            return (val > application.SharedData.alphaMin) && (val < application.SharedData.alphaMax);
        });
        values.sort();

        var spacing = -application.SharedData.alphaMin /
            (application.SharedData.alphaMax - application.SharedData.alphaMin);
        var x = spacing * $('#alphaTickCanvas1')[0].width;
        var points = [new geom.Vector(x, 0), new geom.Vector(x, 10)];
        var path = [];
        path.push(new geom.Polygon(points, false));
        zeroCanvasDrawer.drawPathElements(path, 2, 'black', 1);
        path = [];
        for (var i = 0; i < values.length; i++) {
            spacing = (values[i] - application.SharedData.alphaMin) /
                (application.SharedData.alphaMax - application.SharedData.alphaMin);
            x = spacing * $('#alphaTickCanvas1')[0].width;
            points = [new geom.Vector(x, 0), new geom.Vector(x, 10)];
            path.push(new geom.Polygon(points, false));
        }
        alphaCanvasDrawer.drawPathElements(path, 2, 'black', 1);
    };


    /**
     * Draw the vertical slider's ticks given an array of numbers.
     *
     * @param {Array.<number>} values
     */
    alphashape.ui.AlphaShapeDialog.drawVerticalSliderTicks = function(values) {
        var alphaCanvasDrawer = new drawing.CanvasDrawer($('#alphaTickCanvas1')[0]);
        var zeroCanvasDrawer = new drawing.CanvasDrawer($('#alphaTickCanvas2')[0]);

        values = values.filter(function(val) {
            return (val > application.SharedData.alphaMin) && (val < application.SharedData.alphaMax);
        });
        values.sort();

        var spacing = application.SharedData.alphaMax /
            (application.SharedData.alphaMax - application.SharedData.alphaMin);
        var y = spacing * $('#alphaTickCanvas1')[0].height;
        var points = [new geom.Vector(0, y), new geom.Vector(10, y)];
        var path = [];
        path.push(new geom.Polygon(points, false));
        zeroCanvasDrawer.drawPathElements(path, 2, 'black', 1);
        path = [];
        for (var i = 0; i < values.length; i++) {
            spacing = (-values[i] + application.SharedData.alphaMax) /
                (application.SharedData.alphaMax - application.SharedData.alphaMin);
            y = spacing * $('#alphaTickCanvas1')[0].height;
            points = [new geom.Vector(0, y), new geom.Vector(10, y)];
            path.push(new geom.Polygon(points, false));
        }
        alphaCanvasDrawer.drawPathElements(path, 2, 'black', 1);
    };

    /**
     * Update the slider values and the text value of alpha.
     * @suppress {missingProperties}
     */
    alphashape.ui.AlphaShapeDialog.updateSliderValues = function() {
        $('.alphaSlider').each(function() {
            $(this).slider('option', 'value', application.SharedData.alpha);
            $(this).slider('option', 'min', application.SharedData.alphaMin);
            $(this).slider('option', 'max', application.SharedData.alphaMax);
        });
        if (application.SharedData.alpha === -util.constant.INFINITY) {
            $('#alphaValue').each(function() {
                $(this).html('-&infin;');
            });
        } else if (application.SharedData.alpha === util.constant.INFINITY) {
            $('#alphaValue').each(function() {
                $(this).html('+&infin;');
            });
        } else {
            $('#alphaValue').each(function() {
                $(this).html(application.SharedData.alpha);
            });
        }
    };

    /**
     * Init the alpha shape dialog
     * @suppress {missingProperties}
     */
    alphashape.ui.AlphaShapeDialog.update = function() {
        if ($('#alphaShapeDialog').dialog('isOpen')) {
            events.AlphaShapeDialog.updateSliderValues();
            var mq = window.matchMedia('(orientation:landscape)');
            if (mq.matches) {
                $('#alphaShapeDialog').dialog('option', 'width', window.innerWidth - 10);
                $('#alphaShapeDialog').dialog('option', 'height', 160);
                events.AlphaShapeDialog.setHorizontalSliderAndTicksGeometry();
                events.AlphaShapeDialog.drawHorizontalSliderTicks(application.Computations.significantAlphas);
            } else {
                $('#alphaShapeDialog').dialog('option', 'width', 200);
                $('#alphaShapeDialog').dialog('option', 'height', window.innerHeight - 10);
                events.AlphaShapeDialog.setVerticalSliderAndTicksGeometry();
                events.AlphaShapeDialog.drawVerticalSliderTicks(application.Computations.significantAlphas);
            }
        }
    };

})(alphashape.ui, alphashape.canvas, alphashape.application, alphashape.util, alphashape.geom);
