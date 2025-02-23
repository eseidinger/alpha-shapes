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
    ButtonController.update();
    SliderController.update();
    CanvasDrawingController.update();
};

// Initialize the application.
$(function() {
    UserData.init();
    Computations.update();
    ButtonController.init();
    SliderController.init();
    CanvasEventController.init();
    CanvasDrawingController.update();
    window.onresize = Application.refresh;
    Application.refresh();
});
