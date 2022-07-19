const makeMeasureCategory = require('../../entities/measure-category/index')

module.exports = function makeAddMeasureCategory ({ measuresCategoriesDb, EntityConstructionError }) {
  return function addMeasureCategory (measureCategoryInfo, callback) {
    const { error, data: measureCategory } = makeMeasureCategory(measureCategoryInfo)
    if (error) {
      return callback(new EntityConstructionError(error.message))
    }

    measuresCategoriesDb.insert(measureCategory, postAddMeasureCategory)

    function postAddMeasureCategory (err, addedMeasureCategoryId) {
      callback(err, addedMeasureCategoryId)
    }
  }
}
