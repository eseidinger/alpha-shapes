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

(function(events, application, drawing, geom, util) {

    /**
     * Controller for buttons and visibility of controls.
     */
    alphashape.ui.FileMenu = {};

    /**
     * Initialize the button controller.
     *
     * @suppress {missingProperties}
     */
    alphashape.ui.FileMenu.init = function() {
        $('#clearButton').click(function() {
            application.SharedData.points = [];
            application.Application.refresh();
        });
        if (util.Misc.isResourceAvailable('resources/points.json','GET')) {
            events.FileMenu.initFileButtons();
        } else {
            $('#fileButtons').css('display', 'none');
        }
    };

    /**
     * Bind event handler functions for file buttons and show them if web services
     * are available.
     *
     * @suppress {missingProperties}
     * @private
     */
    alphashape.ui.FileMenu.initFileButtons = function() {
        $('#svgButton').click(function() {
            alphashape.canvas.DrawingController.drawSvg();
            var client = new XMLHttpRequest();
            client.open('PUT', 'resources/alphashape.svg', false);
            client.setRequestHeader('Content-Type', 'application/svg+xml');
            client.send($('#svgDiv').html());
        });
        $('#pointsDownloadButton').click(function() {
            var client = new XMLHttpRequest();
            client.open('PUT', 'resources/points.json', false);
            client.setRequestHeader('Content-Type', 'application/json');
            client.send(JSON.stringify(application.SharedData.points));
        });
        $('#pointsUploadButton').click(function() {
            $('#pointsChooseButton').click();
        });
        $('#pointsChooseButton').change(function() {
            $('#pointsUploadForm').submit();
            $('#pointsChooseButton').val('');
            window.setTimeout(function() {
                application.SharedData.points = [];
                jQuery.getJSON('resources/points.json', function(data) {
                    application.SharedData.points =
                        data.map(function(point) {return new geom.Vector(point.x, point.y);});
                    alphashape.application.Application.refresh();
                });
            }, 1000);
        });
    };
})(alphashape.ui, alphashape.application, alphashape.canvas, alphashape.geom, alphashape.util);
