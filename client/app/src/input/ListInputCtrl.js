/**
 * A controller that controls the list input and query submission.
 */
var ListInputCtrl = ['$scope', function($scope) {
    var self = this;

    // The default proteins whose traces should be plotted at the
    // beginning of the application.
    // Proteasome 26S (CORUM Id: 181)
    var defaultProteinIds = [
        'P25786', 'P25787', 'P25788', 'P25789', 'P28066', 'P60900', 'O14818',
        'P20618', 'P49721', 'P49720', 'P28070', 'P28074', 'P28072', 'Q99436',
        'P62191', 'P35998', 'P17980', 'P43686', 'P62195', 'P62333', 'Q9UNM6',
        'P55036'
    ];

    // The value that is to be filled into the textarea in the
    // interface. This should be a newline-separated list of protein
    // identifiers.
    this.inputProteinIds = defaultProteinIds.join('\n');
    
    /**
     * Start the query for protein chromatograms and complex features.
     */
    this.query = function() {
        // Trim the newline-separated string of protein identifiers from the left and from
        // the right and split it into a list of individual strings.
        var ids = this.inputProteinIds.replace(/^\s+|\s+$/g, '').split('\n');
        $scope.proteinQueryCtrl.queryUsingProteinIds(ids);
    };

    // When this class is created the query should already be done
    // using the default protein identifiers.
    this.query();
}];

angular.module('app').controller('ListInputCtrl', ListInputCtrl);

module.exports = ListInputCtrl;
