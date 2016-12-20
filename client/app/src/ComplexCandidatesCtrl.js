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
        $scope.selectedRow = index;
        console.log('Click:', complexFeatures.features[index]);
        var highlightIds = complexFeatures.features[index].subunits.split(";");
        var leftSEC = complexFeatures.features[index].left_pp;
        var rightSEC = complexFeatures.features[index].right_pp;
        var apex = complexFeatures.features[index].apex;
        var sec_estimated = complexFeatures.features[index].sec_estimated;
        plotService.plotProteinTraces(proteinTraces, labels, highlightIds, leftSEC, rightSEC, apex, sec_estimated);
    };

    /**
     * Callback for a mouse-leave event on the complex feature table.
     */
    this.showAllTraces = function() {
        plotService.plotProteinTraces(proteinTraces, labels);
    };
}];

angular.module('app').controller('ComplexCandidatesCtrl', ComplexCandidatesCtrl);

module.exports = ComplexCandidatesCtrl; 

