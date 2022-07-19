const { createdResponse, errorHandler } = require('../response-utils')

module.exports = function makeAddMeasure ({ addMeasure }) {
  return function postMeasure (httpRequest, callback) {
    const { name, category, valueType } = httpRequest.body

    const measure = {
      name,
      category,
      valueType
    }

    addMeasure(measure, postAddMeasure)

    function postAddMeasure (err, addedMeasureId) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, createdResponse({ id: addedMeasureId }))
    }
  }
}
