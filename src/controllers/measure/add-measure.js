const { createdResponse, errorHandler } = require('../utils')

module.exports = function makeAddMeasure ({ addMeasure }) {
  return function postMeasure (httpRequest, callback) {
    const { name, categoryId, valueTypeId } = httpRequest.body

    const measure = {
      name,
      categoryId,
      valueTypeId
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
