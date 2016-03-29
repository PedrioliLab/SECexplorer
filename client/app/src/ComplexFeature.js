var ComplexFeatureFactory = function($http) {
    function ComplexFeature(args) {
        args = args || {};
        this.leftSec = args.leftSec;
        this.rightSec = args.rightSec;
        this.subunits = args.subunits;
    }

    /**
     * Get a list of subgroup features for a list of protein ids.
     * @param {Array<string>} proteinIds - A list of Uniprot identifiers.
     * @returns {Array.<ComplexFeature>} A list of complex features.
     */
    ComplexFeature.getUsingProteinIds = function(proteinIds) {
        return $http.put('/api/complexfeatures', {
            'uniprot_ids': proteinIds
        })
        .then(function(resp) {
            var features = resp.data.features;
            return features.map(function(f) {
                return new ComplexFeature({
                    leftSec: f['left_sec'],
                    rightSec: f['right_sec'],
                    subunits: f['subgroup'].split(';')
                });
            });
        }, function() {
            return [];
        });
    };

    return ComplexFeature;
};

angular.module('app').factory('ComplexFeature', ['$http', ComplexFeatureFactory]);

module.exports = ComplexFeatureFactory;
