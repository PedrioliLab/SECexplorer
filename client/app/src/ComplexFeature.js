var ComplexFeatureFactory = function($http, $q) {
    /**
     * Constructor function for comple features.
     * @param {number} leftSEC - The SEC fraction that forms the left boundary
     * of this feature.
     * @param {number} rightSEC - The SEC fraction that forms the right
     * boundary of this feature.
     * @param {Array.<string>} subunits - An array of Uniprot Ids of the
     * subunit of this feature.
     * @param {number} score - The intra-group correlation score.
     * @class
     * @classdesc The representation of a complex/subgroup feature detected
     * server-side using the sliding window clustering algorithm.
     */
    function ComplexFeature(leftSEC, rightSEC, subunits, score) {
        this.leftSEC = leftSEC;
        this.rightSEC = rightSEC;
        this.subunits = subunits;
        this.score = score;
    }

    /**
     * Get a list of subgroup features for a list of protein ids.
     * @param {Array<string>} proteinIds - A list of Uniprot identifiers.
     * @returns {Array.<ComplexFeature>} A list of complex features.
     */
    ComplexFeature.query = function(proteinIds) {
        return $http.put('/api/complexfeatures', {
            'uniprot_ids': proteinIds
        })
        .then(function(resp) {
            var features = resp.data.features;
            return features.map(function(f) {
                return new ComplexFeature(
                    f.left_sec,
                    f.right_sec,
                    f.subgroup.split(';'),
                    f.score
                );
            });
        })
        .catch(function(resp) {
            return $q.reject(resp.data.error);
        });
    };

    return ComplexFeature;
};

angular.module('app').factory('ComplexFeature', ['$http', '$q', ComplexFeatureFactory]);

module.exports = ComplexFeatureFactory;
