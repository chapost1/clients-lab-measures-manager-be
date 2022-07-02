const { okResponse, errorHandler } = require('../utils')

module.exports = function makeGetMeasuresCategoriesList ({ listMeasuresCategories }) {
  return function getMeasuresCategoriesList (httpRequest, callback) {
    listMeasuresCategories(postListMeasuresCategories)

    function postListMeasuresCategories (err, measuresCategories) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(measuresCategories))
    }
  }
}
