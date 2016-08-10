var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');

var PlotService = function() {
    /**
     * Plot traces for multiple protein chromatograms.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.plotProteinTraces = function(proteins, highlightIds, leftSEC, rightSEC) {
        var plotElement = $('#protein-trace-plot').get(0);
        var data = _(proteins).map(function(p) {
            var trace =  {
                name: p.uniprotId,
                y: p.intensity,
                x: p.sec,
                type: 'scatter',
                hoverinfo: 'x',
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
        var intensities = _(proteins).map(function(p) {
            return Math.max.apply(null, p.intensity);
        });

        var max_intensity = Math.max.apply(null, intensities);

        var shapes = [

                {
                    type: 'rect',
                    x0: leftSEC,
                    y0: 0,
                    x1: rightSEC,
                    y1: max_intensity * 1.05,
                    fillcolor: '#f0f0ff',
                    opacity: 0.35,
                    line: {
                        width: 0
                    },
                    layer: 'below'
                }
            ];

        var layout = {
            margin: { t: 0 },
            width: 900,
            height: 500,
            paper_bgcolor: '#ffffff',
            plot_bgcolor: '#ffffff',

        };

        if (leftSEC !== undefined)
            layout['shapes'] = shapes;

        Plotly.newPlot(plotElement, data, layout);
    };
};

angular.module('app').service('plotService', PlotService);

module.exports = PlotService;
