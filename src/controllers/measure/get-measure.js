const { okResponse, errorHandler } = require('../utils')

module.exports = function makeGetMeasure ({ getMeasure }) {
  return function getMeasureById (httpRequest, callback) {
    const { id } = httpRequest.params

    getMeasure(id, postFindMeasure)

    function postFindMeasure (err, measureInfo) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(measureInfo))
    }
  }
}
