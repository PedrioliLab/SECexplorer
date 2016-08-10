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
    this.clickTableRow = function(index) {
        console.log('Click:', complexFeatures.features[index]);
        var highlightIds = complexFeatures.features[index].subunits;
        var leftSEC = complexFeatures.features[index].leftSEC;
        var rightSEC = complexFeatures.features[index].rightSEC;
        plotService.plotProteinTraces(proteinTraces.traces, highlightIds, leftSEC, rightSEC);
    };

    /**
     * Callback for a mouse-leave event on the complex feature table.
     */
    this.showAllTraces = function() {
        plotService.plotProteinTraces(proteinTraces.traces);
    };
}];

angular.module('app').controller('ComplexCandidatesCtrl', ComplexCandidatesCtrl);

module.exports = ComplexCandidatesCtrl; 

