const { createdResponse, errorHandler } = require('../response-utils')

module.exports = function makeAddMeasureCategory ({ addMeasureCategory }) {
  return function postMeasureCategory (httpRequest, callback) {
    const { name } = httpRequest.body

    const measureCategory = { name }

    addMeasureCategory(measureCategory, postAddMeasureCategory)

    function postAddMeasureCategory (err, addedMeasureCategoryId) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, createdResponse({ id: addedMeasureCategoryId }))
    }
  }
}
