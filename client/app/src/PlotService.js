var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');

var PlotService = function() {
    /**
     * Plot traces for multiple protein chromatograms.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.plotProteinTraces = function(proteins, highlightIds) {
        var plotElement = $('#protein-trace-plot').get(0);
        var data = _(proteins).map(function(p) {
            var trace =  {
                name: p.uniprotId,
                y: p.intensity,
                x: p.sec,
                type: 'scatter'
            };

            if (highlightIds !== undefined) {
                var shouldHighlightTrace = highlightIds.indexOf(p.uniprotId) !== -1;
                trace.line = {};
                if (!shouldHighlightTrace) {
                    trace.line.color = 'rgba(150, 150, 150, 0.25)';
                }
            }

            return trace;
        });
        var layout = {
            margin: { t: 0 }
        };
        Plotly.newPlot(plotElement, data, layout);
    };
};

angular.module('app').service('plotService', PlotService);

module.exports = PlotService;
