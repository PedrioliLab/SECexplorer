/**
 * A controller that controls interaction with the table that lists the complex 
 * candidates.
 */
var ComplexCandidatesCtrl =
    ['$scope', 'complexFeatures', 'plotService', 'proteinTraces',
     function($scope, complexFeatures, plotService, proteinTraces) {

    /**
     * Callback for a mouse-hover event on a row of the complex feature table.
     * @param {number} index - Index in the complex feature list.
     */
    this.hoverTableRow = function(index) {
        console.log('HOVER:', complexFeatures.features[index]);
        var highlightIds = complexFeatures.features[index].subunits;
        plotService.plotProteinTraces(proteinTraces.traces, highlightIds);
    };

    /**
     * Callback for a mouse-leave event on the complex feature table.
     */
    this.leaveTable = function() {
        plotService.plotProteinTraces(proteinTraces.traces);
    };
}];

angular.module('app').controller('ComplexCandidatesCtrl', ComplexCandidatesCtrl);

module.exports = ComplexCandidatesCtrl; 

