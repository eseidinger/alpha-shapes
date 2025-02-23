'use strict';

var Constants = alphashape.util.Constants;

/**
 * Controls the slider for the variation of alpha.
 * 
 * @constructor
 */
function SliderController() {
}

/**
 * Initialize slider.
 */
SliderController.init = function() {
    SliderController.initJQueryUI();
    SliderController.initApplicationControl();
};

/**
 * JQueryUI slider initialization.
 */
SliderController.initJQueryUI = function() {
    $('#alphaSlider').slider();
    var mq = window.matchMedia('(orientation:landscape)');
    if (mq.matches) {
        $('#alphaSlider').slider('option', 'orientation', 'vertical');
    } else {
        $('#alphaSlider').slider('option', 'orientation', 'horizontal');
    }
};

/**
 * Set the event handlers for the slider.
 */
SliderController.initApplicationControl = function() {
    $('#alphaSlider').slider('option', 'slide', function() {
        UserData.setAlpha($(this).slider('value'));
        Application.refresh();
    });
    $('#alphaSlider').slider('option', 'stop', function() {
        UserData.setAlpha($(this).slider('value'));
        Application.refresh();
    });
};

/**
 * Set the width and height for the slider and its ticks.
 */
SliderController.setSliderAndTicksGeometry = function() {
    $('#alphaSlider').height(window.innerHeight - 5);
    $('#alphaTickCanvas1')[0].height = window.innerHeight - 20;
    $('#alphaTickCanvas1')[0].width = 10;
    $('#alphaTickCanvas2')[0].height = window.innerHeight - 20;
    $('#alphaTickCanvas2')[0].width = 10;
};


/**
 * Set the width and height for the slider and its ticks.
 */
SliderController.setUpperSliderAndTicksGeometry = function() {
    $('#alphaSlider').width(window.innerWidth - 20);
    $('#alphaTickCanvas1')[0].width = window.innerWidth - 20;
    $('#alphaTickCanvas1')[0].height = 10;
    $('#alphaTickCanvas2')[0].width = window.innerWidth - 20;
    $('#alphaTickCanvas2')[0].height = 10;
};

/**
 * Draw the left slider's ticks given an array of numbers.
 * 
 * @param {Array.<number>} values
 */
SliderController.drawSliderTicks = function(values) {
    var alphaCanvasDrawer = new CanvasDrawer($('#alphaTickCanvas1')[0]);
    var zeroCanvasDrawer = new CanvasDrawer($('#alphaTickCanvas2')[0]);

    values = values.filter(function(val) {
        return (val > UserData.alphaMin) && (val < UserData.alphaMax);
    });
    values.sort();

    var points = [];
    var spacing = UserData.alphaMax / (UserData.alphaMax - UserData.alphaMin);
    var y = spacing * $('#alphaTickCanvas1')[0].height;
    points[0] = new Vector(0, y);
    points[1] = new Vector(10, y);
    zeroCanvasDrawer.drawPolygon(points, 2, 'black', 1);
    for (var i = 0; i < values.length; i++) {
        spacing = (-values[i] + UserData.alphaMax) / (UserData.alphaMax -
                UserData.alphaMin);
        y = spacing * $('#alphaTickCanvas1')[0].height;
        points[0] = new Vector(0, y);
        points[1] = new Vector(10, y);
        alphaCanvasDrawer.drawPolygon(points, 1, 'black', 1);
    }
};

/**
 * Draw the left slider's ticks given an array of numbers.
 * 
 * @param {Array.<number>} values
 */
SliderController.drawUpperSliderTicks = function(values) {
    var alphaCanvasDrawer = new CanvasDrawer($('#alphaTickCanvas1')[0]);
    var zeroCanvasDrawer = new CanvasDrawer($('#alphaTickCanvas2')[0]);

    values = values.filter(function(val) {
        return (val > UserData.alphaMin) && (val < UserData.alphaMax);
    });
    values.sort();

    var points = [];
    var spacing = -UserData.alphaMin / (UserData.alphaMax - UserData.alphaMin);
    var x = spacing * $('#alphaTickCanvas1')[0].width;
    points[0] = new Vector(x, 0);
    points[1] = new Vector(x, 10);
    zeroCanvasDrawer.drawPolygon(points, 2, 'black', 1);
    for (var i = 0; i < values.length; i++) {
        spacing = (values[i] - UserData.alphaMin) / (UserData.alphaMax -
                UserData.alphaMin);
        x = spacing * $('#alphaTickCanvas1')[0].width;
        points[0] = new Vector(x, 0);
        points[1] = new Vector(x, 10);
        alphaCanvasDrawer.drawPolygon(points, 1, 'black', 1);
    }
};

/**
 * Update the slider values and the text value of alpha.
 */
SliderController.updateSliderValues = function() {
    $('#alphaSlider').each(function() {
        $(this).slider('option', 'value', UserData.alpha);
        $(this).slider('option', 'min', UserData.alphaMin);
        $(this).slider('option', 'max', UserData.alphaMax);
    });
    if (UserData.alpha === -Constants.INFINITY) {
        $('#alphaValue').each(function() {
            $(this).html('-&infin;');
        });
    } else if (UserData.alpha === Constants.INFINITY) {
        $('#alphaValue').each(function() {
            $(this).html('+&infin;');
        });
    } else {
        $('#alphaValue').each(function() {
            $(this).html(UserData.alpha);
        });
    }
};

/**
 * Update everything concerning the slider.
 */
SliderController.update = function() {
    SliderController.updateSliderValues();
    var mq = window.matchMedia('(orientation:landscape)');
    if (mq.matches) {
        SliderController.setSliderAndTicksGeometry();
        SliderController.drawSliderTicks(Computations.significantAlphas);
    } else {
        SliderController.setUpperSliderAndTicksGeometry();
        SliderController.drawUpperSliderTicks(Computations.significantAlphas);        
    }
};
