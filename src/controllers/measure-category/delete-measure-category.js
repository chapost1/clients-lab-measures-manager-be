const { operationSuccessResponse, errorHandler } = require('../response-utils')

module.exports = function makeDeleteMeasureCategory ({ deleteMeasureCategory }) {
  return function deleteMeasureCategoryById (httpRequest, callback) {
    const { id } = httpRequest.params

    deleteMeasureCategory(id, postDeleteMeasureCategory)

    function postDeleteMeasureCategory (err) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, operationSuccessResponse())
    }
  }
}
