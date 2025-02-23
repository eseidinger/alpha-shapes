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

(function(events, drawing, application) {

    /**
     * Controls the slider for the variation of alpha.
     */
    alphashape.ui.VoronoiDialog = {};

    /**
     * Initialize the Voronoi dialog.
     * @suppress {missingProperties}
     */
    alphashape.ui.VoronoiDialog.init = function() {
        $('#voronoiDialog').dialog({autoOpen: false});

        $('#sweepLineSlider').slider();
        $('#sweepLineSlider').slider('option', 'orientation', 'vertical');
        $('#sweepLineSlider').slider('option', 'slide', function() {
            application.SharedData.sweepLine = $(this).slider('option', 'max') - $(this).slider('value');
            application.Application.refresh();
        });
        $('#sweepLineSlider').slider('disable');

        $('#triangleSpinner').spinner();
        $('#triangleSpinner').spinner('value', 0);
        $('#triangleSpinner').on('spinchange', function(event, ui) {
            application.SharedData.selectedTriangle = $(this).spinner('value') - 1;
        });
        $('#triangleSpinner').on('spinstop', function(event, ui) {
            application.SharedData.selectedTriangle = $(this).spinner('value') - 1;
            application.Application.refresh();
        });
        $('#triangleSpinner').spinner('disable');
        $('#triangleSpinner').focus(function() {$(this).blur();});

        $('.voronoiButton').button();
        $('#voronoiDialogButton').click(function() {
            $('#voronoiDialog').dialog('open');
            application.Application.refresh();
        });
        $('#checkVDc').change(function() {
            drawing.DrawingController.displayVoronoiMin = $(this).is(':checked');
            application.Application.refresh();
        });
        $('#checkBeachLine').change(function() {
            drawing.DrawingController.displayBeachLine = $(this).is(':checked');
            if ($(this).is(':checked')) {
                $('#sweepLineSlider').slider('enable');
            } else {
                $('#sweepLineSlider').slider('disable');
            }
            application.Application.refresh();
        });
        $('#checkVDf').change(function() {
            drawing.DrawingController.displayVoronoiMax = $(this).is(':checked');
            application.Application.refresh();
        });
        $('#checkTriangles').change(function() {
            drawing.DrawingController.displayTriangles = $(this).is(':checked');
            if ($(this).is(':checked')) {
                $('#triangleSpinner').spinner('enable');
            } else {
                $('#triangleSpinner').spinner('disable');
            }
            application.Application.refresh();
        });
        $('#checkSmallestCircle').change(function() {
            drawing.DrawingController.displaySmallestCircle = $(this).is(':checked');
            application.Application.refresh();
        });
        $('#checkConvexHull').change(function() {
            drawing.DrawingController.displayConvexHull = $(this).is(':checked');
            application.Application.refresh();
        });
    };

    /**
     * Update everything concerning the slider.
     * @suppress {missingProperties}
     */
    alphashape.ui.VoronoiDialog.update = function() {
        if (application.SharedData.points.length < 3) {
            $('#triangleSpinner').spinner('option', 'min', 0);
            $('#triangleSpinner').spinner('option', 'max', 0);
        } else {
            $('#triangleSpinner').spinner('option', 'min', 1);
            $('#triangleSpinner').spinner('option', 'max', application.Computations.voronoiMaxTriangles.length);
        }
        if ($('#voronoiDialog').dialog('isOpen')) {
            $('#voronoiDialog').dialog('option', 'width', 210);
            $('#voronoiDialog').dialog('option', 'height', window.innerHeight - 10);

            $('#sweepLineSlider').height(window.innerHeight - 160);        }
            $('#sweepLineSlider').slider('option', 'min', 0);
            $('#sweepLineSlider').slider('option', 'max', $('canvas')[0].height);
            $('#sweepLineSlider').slider('option', 'value',
                    $('canvas')[0].height - application.SharedData.sweepLine);
            if ($('#voronoiDialog').dialog('isOpen')) {
        }
    };
})(alphashape.ui, alphashape.canvas, alphashape.application);

