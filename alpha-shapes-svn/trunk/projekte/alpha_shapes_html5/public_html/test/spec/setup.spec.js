'use strict';

var testCases;

function readTestFileList(fileContents) {
    var contents = fileContents.split('\n');
    contents.forEach(function(line) {
        if (line && line.trim() && line.trim().charAt(0) !== '#') {
            jQuery.get('./data/' + line, readTestFile);
        }
    });
}

function readTestFile(fileContents) {
    var contents = fileContents.split('\n');
    var lineCount = 0;
    var testCase = new Object();
    testCase.expected = [];
    contents.forEach(function(line) {
        if (line && line.trim() && line.trim().charAt(0) !== '#') {
            lineCount++;
            if (lineCount === 1) {
                testCase.testName = line.split('.')[0];
                testCase.points = readPointsFile(line);
            } else if (lineCount === 2) {
                testCase.exactness = parseFloat(line.split(' ')[1]);
            } else if (lineCount === 3) {
                var coords = line.split(' ');
                testCase.center = new Vector(parseFloat(coords[0]),
                        parseFloat(coords[1]));
                testCase.radius = parseFloat(coords[2]);
            } else {
                var coords = line.split(' ');
                testCase.expected.push(new Vector(parseInt(coords[0]),
                        parseInt(coords[1])));
            }
        }
    });
    testCases.push(testCase);
}

function readPointsFile(fileName) {
    var points = [];
    jQuery.get('./data/' + fileName, function(pointStrings) {
        var pointStringArray = pointStrings.split('\n');
        pointStringArray.forEach(function(pointString) {
            if (pointString && pointString.trim() &&
                    pointString.trim().charAt(0) !== '#') {
                var coords = pointString.split(' ');
                var x = parseInt(coords[0]);
                var y = parseInt(coords[1]);
                if (((x === 0) || x) && ((y === 0) || y)) {
                    points.push(new Vector(x, y));
                }
            }
        });
    });
    return points;
}

beforeEach(function() {
    if (!testCases) {
        jQuery.ajaxSetup({async: false});
        testCases = [];
        jQuery.get('./data/Test.test', readTestFileList);
    }
});
