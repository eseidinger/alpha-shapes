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
(function(application, canvas, events) {
    /**
     * Application initialization and refresh.
     */
    alphashape.application.Application = {};

    /**
     * Refresh the application.
     */
    alphashape.application.Application.refresh = function() {
        application.SharedData.update();
        events.AlphaShapeDialog.update();
        events.VoronoiDialog.update();
        canvas.DrawingController.update();
    };

// Initialize the application.
    $(
        /**
         * @suppress {missingProperties}
         */
        function() {
            var btn = $.fn.button.noConflict() // reverts $.fn.button to jqueryui btn
            $.fn.btn = btn // assigns bootstrap button functionality to $.fn.btn

            application.SharedData.init();
            events.FileMenu.init();
            events.AlphaShapeDialog.init();
            events.VoronoiDialog.init();
            canvas.CanvasEventController.init();
            canvas.DrawingController.update();
            window.onresize = application.Application.refresh;
            window.addEventListener('orientationchange', application.Application.refresh, false);
            application.Application.refresh();
    });

})(alphashape.application, alphashape.canvas, alphashape.ui);

