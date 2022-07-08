const { operationSuccessResponse, errorHandler } = require('../response-utils')

module.exports = function makeDeleteMeasure ({ deleteMeasure }) {
  return function deleteMeasureById (httpRequest, callback) {
    const { id } = httpRequest.params

    deleteMeasure(id, postDeleteMeasure)

    function postDeleteMeasure (err) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, operationSuccessResponse())
    }
  }
}
