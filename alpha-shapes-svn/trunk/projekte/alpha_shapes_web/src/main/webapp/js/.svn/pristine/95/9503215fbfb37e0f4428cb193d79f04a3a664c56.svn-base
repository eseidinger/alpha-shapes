'use strict';

/**
 * Controller for buttons and visibility of controls.
 * 
 * @constructor
 */
function ButtonController() {    
}

ButtonController.controlWidth = 0;
ButtonController.upperControlHeight = 0;

/**
 * Initialize the button controller.
 */
ButtonController.init = function() {
    $('.jqueryButton').button();
    ButtonController.initApplicationControl();
    ButtonController.initFileButtons();
};

/**
 * Bind event handler functions.
 * 
 * @private
 */
ButtonController.initApplicationControl = function() {
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

    $('.checkAlphaShape').change(function() {
        CanvasDrawingController.displayAlphaShape = $(this).is(':checked');
        Application.refresh();
    });
    $('.checkAlphaHull').change(function() {
        CanvasDrawingController.displayAlphaHull = $(this).is(':checked');
        Application.refresh();
    });
    $('.checkAlphaDisc').change(function() {
        CanvasDrawingController.displayAlphaDisc = $(this).is(':checked');
        Application.refresh();        
    });
    $('.clearButton').click(function() {
        UserData.points = [];
        Application.refresh();
    });
};

/**
 * Bind event handler functions for file buttons and show them if web services
 * are available.
 * 
 * @private
 */
ButtonController.initFileButtons = function() {
    $('#svgButton').click(function() {
        CanvasDrawingController.drawSvg();
        var client = new XMLHttpRequest();
        client.open('PUT', 'resources/alphashape.svg', false);
        client.setRequestHeader('Content-Type', 'application/svg+xml');
        client.send($('#svgDiv').html());
    });
    $('#pointsDownloadButton').click(function() {
        var client = new XMLHttpRequest();
        client.open('PUT', 'resources/points.json', false);
        client.setRequestHeader('Content-Type', 'application/json');
        client.send(JSON.stringify(UserData.points));
    });
    $('#pointsUploadButton').click(function() {
        window.setTimeout(function() {
            UserData.points = [];
            jQuery.getJSON('resources/points.json', function(data) {
                for (var i = 0; i < data.length; i++) {
                    UserData.points.push(new Vector(data[i].x, data[i].y));
                }
                Application.refresh();
            });
        }, 1000);
    });
    if (!Misc.isResourceAvailable('resources/alphashape.svg', 'GET')) {
        $('#fileButtons').css('display', 'none');
    }
};

/**
 * Update the buttons according to set drawing modes.
 * 
 * @private
 */
ButtonController.updateButtons = function() {
    if (CanvasDrawingController.displayAlphaShape) {
        $('.labelCheckAlphaShape').css('background',
            Misc.hexToRgba(CanvasDrawingController.alphaShapeColor, 0.2));            
    } else {
        $('.labelCheckAlphaShape').css('background', '');
    }
    if (CanvasDrawingController.displayAlphaHull) {
        $('.labelCheckAlphaHull').css('background',
            Misc.hexToRgba(CanvasDrawingController.alphaHullColor, 0.2));            
    } else {
        $('.labelCheckAlphaHull').css('background', '');
    }
    if (CanvasDrawingController.displayDelaunayMin) {
        $('#labelCheckDGc').css('background',
            Misc.hexToRgba(CanvasDrawingController.delaunayColor, 0.5));            
    } else {
        $('#labelCheckDGc').css('background', '');
    }
    if (CanvasDrawingController.displayDelaunayMax) {
        $('#labelCheckDGf').css('background',
            Misc.hexToRgba(CanvasDrawingController.delaunayColor, 0.5));            
    } else {
        $('#labelCheckDGf').css('background', '');
    }
    if (CanvasDrawingController.displayVoronoiMin) {
        $('#labelCheckVDc').css('background',
            Misc.hexToRgba(CanvasDrawingController.voronoiColor, 0.5));            
    } else {
        $('#labelCheckVDc').css('background', '');
    }
    if (CanvasDrawingController.displayVoronoiMax) {
        $('#labelCheckVDf').css('background',
            Misc.hexToRgba(CanvasDrawingController.voronoiColor, 0.5));            
    } else {
        $('#labelCheckVDf').css('background', '');
    }
    $('.checkAlphaShape').
            prop('checked', CanvasDrawingController.displayAlphaShape);
    $('.checkAlphaShape').button('refresh');
    $('.checkAlphaHull').
            prop('checked', CanvasDrawingController.displayAlphaHull);
    $('.checkAlphaHull').button('refresh');
    $('.checkAlphaDisc').
            prop('checked', CanvasDrawingController.displayAlphaDisc);
    $('.checkAlphaDisc').button('refresh');
    $('#checkDGc').prop('checked', CanvasDrawingController.displayDelaunayMin);
    $('#checkDGc').button('refresh');
    $('#checkDGf').prop('checked', CanvasDrawingController.displayDelaunayMax);
    $('#checkDGf').button('refresh');
    $('#checkVDc').prop('checked', CanvasDrawingController.displayVoronoiMin);
    $('#checkVDc').button('refresh');
    $('#checkVDf').prop('checked', CanvasDrawingController.displayVoronoiMax);
    $('#checkVDf').button('refresh');
};

/**
 * Set the visiblity of controls according to window size and orientation.
 * 
 * @private
 */
ButtonController.updateButtonVisibility = function() {
    if (window.innerHeight < 350) {
        CanvasDrawingController.displayDelaunayMin = false;
        CanvasDrawingController.displayDelaunayMax = false;
        CanvasDrawingController.displayVoronoiMin = false;
        CanvasDrawingController.displayVoronoiMax = false;
        $('.geomButton').prop('checked', false);
        $('.geomButton').button('refresh');
        $('.geomButtonLabel').css('background','');
        $('#geomButtons').css('display', 'none');
    } else {
        $('#geomButtons').css('display', '');
    }
    if (window.innerHeight > window.innerWidth) {
        CanvasDrawingController.displayDelaunayMin = false;
        CanvasDrawingController.displayDelaunayMax = false;
        CanvasDrawingController.displayVoronoiMin = false;
        CanvasDrawingController.displayVoronoiMax = false;
        $('.geomButton').prop('checked', false);
        $('.geomButton').button('refresh');
        $('.geomButtonLabel').css('background','');
        $('#upperControls').css('display', '');
        $('#controls').css('display', 'none');
        ButtonController.upperControlHeight = $('#upperControls').
                outerHeight(true);
        ButtonController.controlWidth = 0;
    } else {
        $('#upperControls').css('display', 'none');
        $('#controls').css('display', '');        
        ButtonController.upperControlHeight = 0;
        ButtonController.controlWidth = $('#controls').outerWidth(true);
    }
};

/**
 * Update buttons.
 */
ButtonController.update = function() {
    ButtonController.updateButtons();
    ButtonController.updateButtonVisibility();
};
