module.exports = ['$scope', function($scope) {
    var self = this;

    // Proteasome 26S (CORUM Id: 181)
    var defaultProteinIds = [
        'P25786', 'P25787', 'P25788', 'P25789', 'P28066', 'P60900', 'O14818',
        'P20618', 'P49721', 'P49720', 'P28070', 'P28074', 'P28072', 'Q99436',
        'P62191', 'P35998', 'P17980', 'P43686', 'P62195', 'P62333', 'Q9UNM6',
        'P55036'
    ];

    this.inputProteinIds = defaultProteinIds.join('\n');
    
    this.query = function() {
        var ids = this.inputProteinIds.replace(/^\s+|\s+$/g, '').split('\n');
        $scope.proteinQueryCtrl.queryUsingProteinIds(ids);
    };

    this.query();
}];

