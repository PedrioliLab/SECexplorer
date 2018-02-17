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
    function ProteinChromatogram(id, intensity, sec, label, monomer_sec, monomer_intensity) {
        this.id = id;
        this.intensity = intensity;
        this.sec = sec;
        this.label = label;
        this.monomer_sec = monomer_sec;
        this.monomer_intensity = monomer_intensity;
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
            resp.data.proteins = resp.data.proteins.map(function(p) {
                        return new ProteinChromatogram(
                            p.id,
                            p.intensity,
                            p.sec,
                            p.label,
                            p.monomer_sec,
                            p.monomer_intensity
                        );
                    });
            return resp.data;
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
