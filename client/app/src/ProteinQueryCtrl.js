var Plotly = require('plotly.js');
var $ = require('jquery');
var _ = require('underscore');

var ProteinQueryCtrl = ['$scope', '$http', 'ComplexFeature',
                        function($scope, $http, ComplexFeature) {
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
    
    this.queryUsingProteinIds = function(ids) {
        this.isQueryRunning = true;
        getProteinTraces(ids).then(function(proteins) {
            self.isQueryRunning = false;
            plotTraces(proteins);
            var proteinIds = _(proteins).pluck('uniprot_id');
            self.isFeatureQueryRunning = true;
            return ComplexFeature.getUsingProteinIds(proteinIds);
        }).then(function(features) {
            self.isFeatureQueryRunning = false;
            self.complexFeatures = features;
        })
        .catch(function() {
            self.isFeatureQueryRunning = false;
            self.isQueryRunning = false;
        });
    };
}];

angular.module('app').controller('ProteinQueryCtrl', ProteinQueryCtrl);

module.exports = ProteinQueryCtrl; 

