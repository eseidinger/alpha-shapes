'use strict';

/**
 * Application initialization and refresh.
 * 
 * @constructor
 */
function Application() { 
}

/**
 * Refresh the application.
 */
Application.refresh = function() {
    Computations.update();
    UserData.update();
    SliderController.update();
    CanvasDrawingController.update();
};

// Initialize the application.
$(function() {
    Computations.update();
    ButtonController.init();
    SliderController.init();
    CanvasEventController.init();
    CanvasDrawingController.update();
    window.onresize = Application.refresh;
    var mqLandscape = window.matchMedia('(orientation: landscape)');
    mqLandscape.addListener(function() {
        location.reload();
    });
    var mqPortrait = window.matchMedia('(orientation: portrait)');
    mqPortrait.addListener(function() {
        location.reload();
    });
    Application.refresh();
});
