var ProteinChromatogramFactory = function($http, $q) {
    /**
     * Constructor function for protein chromatograms.
     * @param {string} uniprotId - The uniprot identifier for this
     * protein.
     * @param {Array.<number>} intensity - An array of intensity values.
     * @param {Array.<number>} sec - An array of SEC fractions at which
     * the intensities were measured.
     * @class
     * @classdesc The representation of a protein chromatogram.
     */
    function ProteinChromatogram(uniprotId, intensity, sec) {
        this.uniprotId = uniprotId;
        this.intensity = intensity;
        this.sec = sec;
    }

    /**
     * Get a list of protein chromatograms.
     * @param {Array<string>} proteinIds - A list of Uniprot identifiers.
     * @returns {Array.<ProteinChromatogram>} A list of protein
     * chromatograms.
     */
    ProteinChromatogram.get = function(proteinIds) {
        var query = '/api/proteins?uniprot_ids=' + proteinIds.join(',');
        return $http.get(query).then(function(resp) {
            return resp.data.proteins.map(function(p) {
                return new ProteinChromatogram(
                    p.uniprot_id,
                    p.intensity,
                    p.sec
                );
            });
        })
        .catch(function(resp) {
            return $q.reject(resp.data.error);
        })
    };

    return ProteinChromatogram;
};

angular.module('app').factory('ProteinChromatogram', [
    '$http', '$q', ProteinChromatogramFactory
]);

module.exports = ProteinChromatogramFactory;
