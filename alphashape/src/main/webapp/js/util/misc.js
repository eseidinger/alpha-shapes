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

(function(util) {

    /**
     * Various helpful functions.
     */
    alphashape.util.Misc = {};

    /**
     * Measures execution time for a given function.
     *
     * @param {function()} fct function under test
     * @param {...?} args arguments for function under test
     * @returns {{time: number, result:?}} time for execution in milliseconds and
     *      result of function under test
     */
    alphashape.util.Misc.doWithStopWatch = function (fct, args) {
        var fctargs = Array.prototype.slice.call(arguments, 1);
        var start = Date.now();
        var result = fct.apply(null, fctargs);
        var finish = Date.now();
        var time = finish - start;
        return {'time': time, 'result': result};
    };

    /**
     * Checks if web resource is available.
     *
     * @param {string} url of the resource
     * @param {string} verb http action
     * @returns {boolean} true if available, false otherwise
     */
    alphashape.util.Misc.isResourceAvailable = function (url, verb) {
        var client = new XMLHttpRequest();
        client.open(verb, url, false);
        try {
            client.send(null);
        } catch (e) {
            return false;
        }
        if (client.response === null) {
            return false;
        } else if (client.status !== 200) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Convert hex RGB-string to object contatining RGB values.
     *
     * @param {string} hex RGB-String
     * @returns {?{r: number, g: number, b: number}} RGB-Object
     */
    alphashape.util.Misc.hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    /**
     * Convert hex RGB-string and opacity to RGBA-string.
     *
     * @param {string} hex RGB-String
     * @param {number} opacity
     * @returns {string} RGBA-String
     */
    alphashape.util.Misc.hexToRgba = function (hex, opacity) {
        var rgb = util.Misc.hexToRgb(hex);
        var rgba = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')';
        return rgba;
    };

    alphashape.util.Misc.getInternetExplorerVersion = function ()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
    {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        else if (navigator.appName == 'Netscape') {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    };

})(alphashape.util);
