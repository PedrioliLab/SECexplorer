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
        .then(function(proteins) {
            proteinTraces.traces = proteins;
            plotService.plotProteinTraces(proteins);
            var ids = _(proteins).pluck('id');

            self.isTraceQueryRunning = false;
            self.isFeatureQueryRunning = true;

            // After having received the chromatograms, query
            // the server for potential complex features.
            return ComplexFeature.query(ids, idType);
        }).then(function(features) {
            self.isFeatureQueryRunning = false;
            self.complexFeatures.features = features;
        })
        .catch(function(err) {
            console.log(err);
            self.isFeatureQueryRunning = false;
            self.isTraceQueryRunning = false;
        });
    };

    /**
     * Round a number to `digits` after the decimal point.
     * @param {number} num - The number to round.
     * @param {number} digits - The precision. Default is 3.
     * @returns {number}
     */
    this.roundFloat = function(num, digits) {
        digits = digits !== undefined ? digits : 3;
        return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
    };
}];

angular.module('app').controller('ProteinQueryCtrl', ProteinQueryCtrl);

module.exports = ProteinQueryCtrl; 

