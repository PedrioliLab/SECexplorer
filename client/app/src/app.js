angular = require('angular');

require('angular-ui-router');
require('angular-ui-bootstrap');

/**
 * All module declarations go here.
 */

/**
 * Declaration of the main module
 */
var app = angular.module('app', [
    /**
     * All modules on which this application depends have to be listed here.
     */
    'ui.router',
    'ui.bootstrap',
]);

require('./PlotService');
require('./complexFeatures');
require('./proteinTraces');
require('./ComplexFeature');
require('./ProteinChromatogram');
require('./ProteinQueryCtrl');
require('./ComplexCandidatesCtrl');

require('./input');
require('./util');
