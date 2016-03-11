module.exports = function spinner() {
    return {
        restrict: 'E',
        scope: {
            loading: '='
        },
        template: '<i class="spinner fa fa-spinner fa-spin" ng-show="loading"></i>'
    };
};
