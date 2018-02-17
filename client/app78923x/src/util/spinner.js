function Spinner() {
    return {
        restrict: 'E',
        scope: {
            loading: '='
        },
        template: '<i class="spinner fa fa-spinner fa-spin" ng-show="loading"></i>'
    };
}

angular.module('app').directive('spinner', Spinner);

module.exports = Spinner;
