const makeMeasure = require('../../models/measure/index')

module.exports = function makeAddMeasure ({
  measuresDb, measuresCategoriesDb, measuresValuesTypesDb, ModelConstructionError, InvalidRationalValueError
}) {
  return function addMeasure (measureInfo, callback) {
    const { error, data: measure } = makeMeasure(measureInfo)
    if (error) {
      return callback(new ModelConstructionError(error.message))
    }

    measuresValuesTypesDb.findById(measure.valueType.id, postFindValueTypeById)

    function postFindValueTypeById (err, valueType) {
      if (err) {
        return callback(err)
      }
      if (!valueType) {
        return callback(new InvalidRationalValueError('measure value type id does not exists'))
      }

      measuresCategoriesDb.findById(measure.category.id, postFindCategoryById)
    }

    function postFindCategoryById (err, category) {
      if (err) {
        return callback(err)
      }
      if (!category) {
        return callback(new InvalidRationalValueError('measure category id does not exists'))
      }

      measuresDb.insert(measure, postAddMeasure)
    }

    function postAddMeasure (err, addedMeasureId) {
      callback(err, addedMeasureId)
    }
  }
}
