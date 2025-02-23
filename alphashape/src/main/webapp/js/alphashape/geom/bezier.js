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

/**
 * A Bezier curve.
 *
 * @param {alphashape.geom.Vector} start point of curve
 * @param {alphashape.geom.Vector} end point of curve
 * @param {Array.<alphashape.geom.Vector>} controlPoints of curve
 * @constructor
 * @extends {alphashape.geom.PathElement}
 */
alphashape.geom.Bezier = function(start, end, controlPoints) {

    this.start = start;
    this.end = end;
    this.controlPoints = controlPoints;

    this.pathType = 'bezier';
};
