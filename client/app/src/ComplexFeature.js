var ComplexFeatureFactory = function($http, $q) {
    /**
     * Constructor function for comple features.
     * subunits = subunits_detected
     * number of subunits = n_subunits_detected
     * completeness = completeness
     * apex=apex
     * apex apparent MW = apex_mw
     * left boundary = left_pp
     * right boundary = right_pp
     * estimated stoichiometry = stoichiometry_estimated
     * peak correlation = peak_corr
     */
    function ComplexFeature(subunits, n_subunits, completeness, apex, apex_mw,
                            left_pp, right_pp, stoichiometry_estimated, peak_corr, sec_estimated)
    {
        this.subunits = subunits;
        this.n_subunits = n_subunits;
        this.completeness = completeness;
        this.apex = apex;
        this.apex_mw = apex_mw;
        this.left_pp = left_pp;
        this.right_pp = right_pp;
        this.stoichiometry_estimated = stoichiometry_estimated;
        this.peak_corr = peak_corr;
        this.sec_estimated = sec_estimated;
    }

    /**
     * Get a list of subgroup features for a list of protein ids.
     * @param {Array<string>} proteinIds - A list of protein identifiers.
     * @param {string} idType - A string like "UNIPROTKB"
     * @returns {Array.<ComplexFeature>} A list of complex features.
     */
    ComplexFeature.query = function(proteinIds, idType) {
        return $http.put('/api/complexfeatures', {
            'ids': proteinIds,
            'id_type': idType
        })
        .then(function(resp) {
            var features = resp.data.features;
            return features.map(function(f) {
                return new ComplexFeature(
                    f.subunits_detected,
                    f.n_subunits_detected,
                    f.completeness,
                    f.apex,
                    f.apex_mw,
                    f.left_pp,
                    f.right_pp,
                    f.stoichiometry_estimated,
                    f.peak_corr,
                    f.complex_sec_estimated
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
