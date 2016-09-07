var ProteinChromatogramFactory = function($http, $q) {
    /**
     * Constructor function for protein chromatograms.
     * @param {string} id - The protein id identifier for this
     * protein.
     * @param {Array.<number>} intensity - An array of intensity values.
     * @param {Array.<number>} sec - An array of SEC fractions at which
     * the intensities were measured.
     * @class
     * @classdesc The representation of a protein chromatogram.
     */
    function ProteinChromatogram(id, intensity, sec) {
        this.id = id;
        this.intensity = intensity;
        this.sec = sec;
    }

    /**
     * Get a list of protein chromatograms.
     * @param {Array<string>} proteinIds - A list of id identifiers.
     * @param {string} idType - A string describing the id types, eg UNIPROTKB
     * @returns {Array.<ProteinChromatogram>} A list of protein
     * chromatograms.
     */
    ProteinChromatogram.get = function(proteinIds, idType) {
        var query = '/api/proteins?ids=' + proteinIds.join(',');
        query = query + "&id_type=" + idType
        return $http.get(query).then(function(resp) {
            return resp.data.proteins.map(function(p) {
                return new ProteinChromatogram(
                    p.id,
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
