var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');


module.exports = ['$scope', '$http', function($scope, $http) {
    var self = this;


    this.isTraceQueryRunning = false;
    this.isFeatureQueryRunning = false;
    this.complexfeatures = [];


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

    function getProteinTraces(proteinIds) {
        var query = '/api/proteins?uniprot_ids=' + proteinIds.join(',');
        this.isTraceQueryRunning = true;
        return $http.get(query).then(function(resp) {
            self.isTraceQueryRunning = false;
            return resp.data.proteins;
        }, function(resp) {
            self.isTraceQueryRunning = false;
            return resp;
        });
    }

    function getComplexFeatures(proteinIds) {
        self.isFeatureQueryRunning = true;
        return $http.put('/api/complexfeatures', {
            'uniprot_ids': proteinIds
        })
        .then(function(resp) {
            self.isFeatureQueryRunning = false;
            console.log(resp.data);
            return resp.data.features;
        }, function(resp) {
            self.isFeatureQueryRunning = false;
            return {};
        });
    }
    
    this.queryUsingProteinIds = function(ids) {
        this.isQueryRunning = true;
        getProteinTraces(ids).then(function(proteins) {
            plotTraces(proteins);
            self.isQueryRunning = false;
            var proteinIds = _(proteins).pluck('uniprot_id');
            return getComplexFeatures(proteinIds);
        }).then(function(features) {
            self.complexFeatures = features;
        })
        .catch(function() {
            self.isQueryRunning = false;
        });
    };
}];

