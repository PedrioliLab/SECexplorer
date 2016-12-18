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
    this.plotProteinTraces = function(proteins, highlightIds, leftSEC, rightSEC, apex, sec_estimated) {
        var plotElement = $('#protein-trace-plot').get(0);
        console.log('plot');

        var data = _(proteins).map(function(p, index) {

            var trace =  {
                name: p.id,
                x: p.sec,
                y: p.intensity,
                type: 'scatter',
                hoverinfo: 'x',
                line: {
                    width: 2,
                    color: colors[index]
                },
                mode: 'lines',
                opacity: 1.0,
            };

            if (highlightIds !== undefined) {
                var shouldHighlightTrace = highlightIds.indexOf(p.id) !== -1;
                if (!shouldHighlightTrace) {
                    trace.line.color = 'rgba(150, 150, 150, 0.7)';
                }
            }

            return trace;
        });

        var data = data.concat(_(proteins).map(function(p, index) {

            var trace =  {
                name: p.id,
                x: [p.monomer_sec],
                y: [p.monomer_intensity],
                type: 'scatter',
                mode: 'symbols',
                opacity: 0.5,
                showlegend: false,
                marker: {
                    color: colors[index],
                    size: 10 
                },
            };
            console.log(data[index]);
            return trace;
        }));

        var intensities = _(proteins).map(function(p) {
            return Math.max.apply(null, p.intensity);
        });

        var max_secs = _(proteins).map(function(p) {
            return Math.max.apply(null, p.sec);
        });

        var min_secs = _(proteins).map(function(p) {
            return Math.min.apply(null, p.sec);
        });

        var max_intensity = Math.max.apply(null, intensities);

        var max_sec = Math.max.apply(null, max_secs);
        var min_sec = Math.min.apply(null, min_secs);

        var min_x_tic = Math.floor(min_sec / 10) * 10;
        var n_x_tic = Math.ceil(max_sec / 10) - Math.floor(min_sec / 10) + 1;

        var tictext = [];
        var ticvals = [];
        var a = proteins[0].a;
        var b = proteins[0].b;

        for (var i = 0; i < n_x_tic; i++) {
            ticvals.push(i * 10);
            var mw = Math.exp(a + b * i * 10);
            tictext.push(min_x_tic + i * 10 + "<br>(" + Math.round(mw) + " Da)");
        };

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
            xaxis: {tickvals : ticvals,
                    ticktext : tictext}
        };

        if (leftSEC !== undefined) {
            layout['shapes'] = shapes;
            data = data.concat(
               [{
                x: [sec_estimated],
                y: [0],
                type: 'scatter',
                mode: 'symbols',
                opacity: 0.6,
                showlegend: false,
                marker: {
                    color: "#000000",
                    size: 10
                },
            }]);
        }

        Plotly.newPlot(plotElement, data, layout);
    };
};

angular.module('app').service('plotService', PlotService);

module.exports = PlotService;
