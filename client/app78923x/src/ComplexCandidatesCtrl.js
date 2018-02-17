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
        var feature = complexFeatures.features[index];
        console.log('Click:', feature);

        // split by ";" then trim:
        var highlightIds = $.map(feature.subunits.split(";"), $.trim);
        plotService.plotProteinTraces(proteinTraces, highlightIds, feature.left_pp,
                                      feature.right_pp, feature.apex, feature.sec_estimated);
    };

    /**
     * Callback for a mouse-leave event on the complex feature table.
     */
    this.showAllTraces = function() {
        plotService.plotProteinTraces(proteinTraces);
    };
}];

angular.module('app').controller('ComplexCandidatesCtrl', ComplexCandidatesCtrl);

module.exports = ComplexCandidatesCtrl; 

