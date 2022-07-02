const makeMeasureCategory = require('../../models/measure-category/index')
const { MODEL_CONSTRUCTION_ERROR } = require('../error-types')

module.exports = function makeAddMeasureCategory ({ measuresCategoriesDb }) {
  return function addMeasureCategory (measureCategoryInfo, callback) {
    const { error, data: measureCategory } = makeMeasureCategory(measureCategoryInfo)
    if (error) {
      const cbError = {
        message: error.message,
        type: MODEL_CONSTRUCTION_ERROR
      }
      return callback(cbError)
    }

    measuresCategoriesDb.insert(measureCategory, postAddMeasureCategory)

    function postAddMeasureCategory (err, addedMeasureCategoryId) {
      callback(err, addedMeasureCategoryId)
    }
  }
}
