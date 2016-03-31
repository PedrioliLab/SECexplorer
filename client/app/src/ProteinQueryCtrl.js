var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');

/**
 * A controller that retreives and plots protein chromatograms and
 * queries the server for complex features.
 */
var ProteinQueryCtrl = ['$scope', '$http', 'ComplexFeature', 'ProteinChromatogram',
                        function($scope, $http, ComplexFeature, ProteinChromatogram) {
    var self = this;

    this.isTraceQueryRunning = false;
    this.isFeatureQueryRunning = false;
    this.complexfeatures = [];

    /**
     * Plot traces for multiple protein chromatograms.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    function plotTraces(proteins) {
        var plotElement = $('#protein-trace-plot').get(0);
        var data = _(proteins).map(function(p) {
            return {
                name: p.uniprot_id,
                y: p.intensity,
                x: p.sec,
                type: 'scatter'
            };
        });
        var layout = {
            margin: { t: 0 }
        };
        Plotly.newPlot(plotElement, data, layout);
    }

    /**
     * Get multiple protein chromatograms from the server, plot them in
     * the interface and query the server for potential complex
     * features.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.queryUsingProteinIds = function(ids) {
        this.isTraceQueryRunning = true;
        // First get the protein chromatograms.
        ProteinChromatogram.get(ids)
        .then(function(proteins) {
            plotTraces(proteins);
            var proteinIds = _(proteins).pluck('uniprotId');

            self.isTraceQueryRunning = false;
            self.isFeatureQueryRunning = true;

            // After having received the chromatograms, query
            // the server for potential complex features.
            return ComplexFeature.query(proteinIds);
        }).then(function(features) {
            self.isFeatureQueryRunning = false;
            self.complexFeatures = features;
        })
        .catch(function() {
            self.isFeatureQueryRunning = false;
            self.isTraceQueryRunning = true;
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

