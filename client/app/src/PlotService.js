var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');


var ColorScheme = require('color-scheme');

var scheme = new ColorScheme;
scheme.from_hue(55)
      .scheme('tetrade')
      .variation('pastel')
      .web_safe(true);

var colors = scheme.colors();



var PlotService = function() {
    /**
     * Plot traces for multiple protein chromatograms.
     * @param {Array.<ProteinChromatogram>} proteins - The protein
     * chromatograms to plot.
     */
    this.plotProteinTraces = function(proteins, highlightIds, leftSEC, rightSEC, apex) {
        var plotElement = $('#protein-trace-plot').get(0);

        var data_thick = [];

        if (leftSEC !== undefined && rightSEC !== undefined) {
            data_thick = _(proteins).map(function(p, index) {

                var x = [];
                var y = [];

                for (i = 0; i < p.sec.length; i++) {
                    if ((p.sec[i] >= leftSEC) && (p.sec[i] <= rightSEC))
                    {
                        x.push(p.sec[i]);
                        y.push(p.intensity[i]);
                    }
                };

                var trace =  {
                    name: p.id,
                    x: x,
                    y: y,
                    type: 'scatter',
                    hoverinfo: 'x',
                    line: {
                        width: 2,
                        color: colors[index % colors.length]
                    },
                    mode: 'lines',
                    opacity: 1.0
                };

                var shouldHighlightTrace = highlightIds.indexOf(p.id) !== -1;
                if (!shouldHighlightTrace) {
                    trace.line.color = 'rgba(150, 150, 150, 0.7)';
                }

                return trace;
            });
        };

        var data_thin = _(proteins).map(function(p, index) {

            var trace =  {
                name: p.id,
                x: p.sec,
                y: p.intensity,
                type: 'scatter',
                hoverinfo: 'x',
                line: {
                    width: 2,
                    color: colors[index % colors.length]
                },
                mode: 'lines',
                opacity: 1.0
            };

            if (highlightIds !== undefined) {
                trace.opacity = 0.3;
                    //trace.line.color = 'rgba(150, 150, 150, 0.7)';
            }

            return trace;
        });

        var data = data_thin.concat(data_thick);

        var intensities = _(proteins).map(function(p) {
            return Math.max.apply(null, p.intensity);
        });

        var max_intensity = Math.max.apply(null, intensities);

        var shapes = [

                {
                    type: 'line',
                    x0: apex,
                    y0: 0,
                    x1: apex,
                    y1: max_intensity * 1.03,
                    fillcolor: '#3030ff',
                    opacity: 0.25,
                    line: {
                        width: 2,
                        dash: 'dot',
                    },
                    layer: 'above',
                },
                {
                    type: 'line',
                    x0: leftSEC,
                    y0: 0,
                    x1: leftSEC,
                    y1: max_intensity * 1.03,
                    fillcolor: '#3030ff',
                    opacity: 0.25,
                    line: {
                        width: 2,
                        dash: 'dot',
                    },
                    layer: 'above'
                },
                {
                    type: 'line',
                    x0: rightSEC,
                    y0: 0,
                    x1: rightSEC,
                    y1: max_intensity * 1.03,
                    fillcolor: '#3030ff',
                    opacity: 0.25,
                    line: {
                        width: 2,
                        dash: 'dot',
                    },
                    layer: 'above'
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
