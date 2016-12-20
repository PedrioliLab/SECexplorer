var _ = require('underscore');

/**
 * A controller that retreives and plots protein chromatograms and
 * queries the server for complex features.
 */
var ProteinQueryCtrl = ['$scope', '$http', 'ComplexFeature', 'ProteinChromatogram',
                        'complexFeatures', 'plotService', 'proteinTraces',
                        function($scope, $http, ComplexFeature, ProteinChromatogram,
                                 complexFeatures, plotService, proteinTraces) {
    var self = this;

    this.isTraceQueryRunning = false;
    this.isFeatureQueryRunning = false;
    this.complexFeatures = complexFeatures;

    /**
     * Get multiple protein chromatograms from the server, plot them in
     * the interface and query the server for potential complex
     * features.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.queryUsingProteinIds = function(ids, idType) {
        this.isTraceQueryRunning = true;
        // First get the protein chromatograms.
        ProteinChromatogram.get(ids, idType)
        .then(function(result) {
            proteinTraces.proteins = result.proteins;
            proteinTraces.calibration_parameters = result.calibration_parameters;
            plotService.plotProteinTraces(proteinTraces);
            /* var ids = _(result.proteins).pluck('id'); */

            self.isTraceQueryRunning = false;
            self.isFeatureQueryRunning = true;

            // After having received the chromatograms, query
            // the server for potential complex features.
            return ComplexFeature.query(ids, idType);
        }).then(function(result) {
            self.isFeatureQueryRunning = false;
            self.complexFeatures.features = result.features;
            self.complexFeatures.mappings = result.mappings;
            self.complexFeatures.mapping_names = result.mapping_names;
            self.complexFeatures.failed_conversion = result.failed_conversion;
            self.complexFeatures.no_ms_signal = result.no_ms_signal;
            console.log(self);
        })
        .catch(function(err) {
            console.log(err);
            self.isFeatureQueryRunning = false;
            self.isTraceQueryRunning = false;
        });
    };

}];

angular.module('app').controller('ProteinQueryCtrl', ProteinQueryCtrl);

module.exports = ProteinQueryCtrl; 

