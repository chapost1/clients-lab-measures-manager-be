const makeMeasure = require('../../models/measure/index')
const { MODEL_CONSTRUCTION_ERROR, INVALID_RATIONAL_VALUE_ERROR } = require('../error-types')

module.exports = function makeAddMeasure ({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb }) {
  return function addMeasure (measureInfo, callback) {
    const { error, data: measure } = makeMeasure(measureInfo)
    if (error) {
      const cbError = {
        message: error.message,
        type: MODEL_CONSTRUCTION_ERROR
      }
      return callback(cbError)
    }

    measuresValuesTypesDb.findById(measure.valueTypeId, postFindValueTypeById)

    function postFindValueTypeById (err, valueType) {
      if (err) {
        return callback(err)
      }
      if (!valueType) {
        const cbError = {
          message: 'measure value type id does not exists',
          type: INVALID_RATIONAL_VALUE_ERROR
        }
        return callback(cbError)
      }

      measuresCategoriesDb.findById(measure.categoryId, postFindCategoryById)
    }

    function postFindCategoryById (err, category) {
      if (err) {
        return callback(err)
      }
      if (!category) {
        const cbError = {
          message: 'measure category id does not exists',
          type: INVALID_RATIONAL_VALUE_ERROR
        }
        return callback(cbError)
      }

      measuresDb.insert(measure, postAddMeasure)
    }

    function postAddMeasure (err, addedMeasureId) {
      callback(err, addedMeasureId)
    }
  }
}
