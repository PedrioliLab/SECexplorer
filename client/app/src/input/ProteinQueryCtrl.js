module.exports = ['$scope', '$http', function($scope, $http) {
    // Proteasome 26S (CORUM ID: 181)
    var defaultProteinIDs = [
        'P25786', 'P25787', 'P25788', 'P25789', 'P28066', 'P60900', 'O14818',
        'P20618', 'P49721', 'P49720', 'P28070', 'P28074', 'P28072', 'Q99436',
        'P62191', 'P35998', 'P17980', 'P43686', 'P62195', 'P62333', 'Q9UNM6',
        'P55036'
    ];
    this.inputProteinIDs = defaultProteinIDs.join('\n');
    
    this.queryUsingProteinIDs = function() {
        var query = '/api/proteins?uniprot_ids=' + this.inputProteinIDs.split('\n').join(',');
        $http.get(query).then(function(resp) {
            console.log(resp);
        }, function(resp) {
            console.log(resp.data);
        });
    };
}];

