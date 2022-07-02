const { okResponse, errorHandler } = require('../utils')

module.exports = function makeGetMeasuresList ({ listMeasures }) {
  return function getMeasuresList (httpRequest, callback) {
    listMeasures(postListMeasures)

    function postListMeasures (err, measures) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(measures))
    }
  }
}
