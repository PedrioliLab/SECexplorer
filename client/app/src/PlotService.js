var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');

var PlotService = function() {
    /**
     * Plot traces for multiple protein chromatograms.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.plotProteinTraces = function(proteins) {
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
    };
};

angular.module('app').service('plotService', PlotService);

module.exports = PlotService;
