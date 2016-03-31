/**
 * A controller that controls interaction with the table that lists the complex 
 * candidates.
 */
var ComplexCandidatesCtrl = ['$scope', 'complexFeatures', function($scope, complexFeatures) {

    /**
     * Callback for a mouse-hover event on a row of the complex feature table.
     * @param {number} index - Index in the complex feature list.
     */
    this.hoverTableRow = function(index) {
        console.log('HOVER:', complexFeatures.features[index]);
    };
}];

angular.module('app').controller('ComplexCandidatesCtrl', ComplexCandidatesCtrl);

module.exports = ComplexCandidatesCtrl; 

