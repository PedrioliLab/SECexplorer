module.exports = ['$scope', '$http', function($scope, $http) {
    var self = this;

    this.sendMessage = function(message) {
        $http.get('/api/echo/' + message).then(function(resp) {
            $scope.response = resp.data.message;
        });
    }
}];

