const makeMeasureCategory = require('../../models/measure-category/index')

module.exports = function makeAddMeasureCategory ({ measuresCategoriesDb, ModelConstructionError }) {
  return function addMeasureCategory (measureCategoryInfo, callback) {
    const { error, data: measureCategory } = makeMeasureCategory(measureCategoryInfo)
    if (error) {
      return callback(new ModelConstructionError(error.message))
    }

    measuresCategoriesDb.insert(measureCategory, postAddMeasureCategory)

    function postAddMeasureCategory (err, addedMeasureCategoryId) {
      callback(err, addedMeasureCategoryId)
    }
  }
}
