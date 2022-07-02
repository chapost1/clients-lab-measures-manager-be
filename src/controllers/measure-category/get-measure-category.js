const { okResponse, errorHandler } = require('../utils')

module.exports = function makeGetMeasureCategory ({ getMeasureCategory }) {
  return function getMeasureCategoryById (httpRequest, callback) {
    const { id } = httpRequest.params

    getMeasureCategory(id, postFindMeasureCategory)

    function postFindMeasureCategory (err, measureCategoryInfo) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(measureCategoryInfo))
    }
  }
}
