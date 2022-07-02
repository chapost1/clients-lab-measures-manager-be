module.exports = function makeListMeasuresCategories ({ measuresCategoriesDb }) {
  return function makeListMeasuresCategories (callback) {
    measuresCategoriesDb.findAll(postFindAll)

    function postFindAll (err, measures) {
      return callback(err, measures)
    }
  }
}
