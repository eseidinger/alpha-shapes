'use strict';

/**
 * Controller for buttons and visibility of controls.
 * 
 * @constructor
 */
function ButtonController() {    
}

/**
 * Initialize the button controller.
 */
ButtonController.init = function() {
    $('.jqueryButton').button();
    ButtonController.initApplicationControl();
};

/**
 * Bind event handler functions.
 * 
 * @private
 */
ButtonController.initApplicationControl = function() {
    $('#checkAlphaShape').change(function() {
        CanvasDrawingController.displayAlphaShape = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkAlphaHull').change(function() {
        CanvasDrawingController.displayAlphaHull = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkAlphaDisc').change(function() {
        CanvasDrawingController.displayAlphaDisc = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkDGc').change(function() {
        CanvasDrawingController.displayDelaunayMin = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkDGf').change(function() {
        CanvasDrawingController.displayDelaunayMax = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkVDc').change(function() {
        CanvasDrawingController.displayVoronoiMin = $(this).is(':checked');
        Application.refresh();
    });
    $('#checkVDf').change(function() {
        CanvasDrawingController.displayVoronoiMax = $(this).is(':checked');
        Application.refresh();
    });
    $('#clearButton').click(function() {
        UserData.points = [];
        Application.refresh();
    });
};
