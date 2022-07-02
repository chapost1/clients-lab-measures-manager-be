const { validatePositiveInteger } = require('../../models/validators')
const measuresDb = require('../../data-access/sqlite/measure/index')
const measuresCategoriesDb = require('../../data-access/sqlite/measure-category/index')
const measuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/index')
const makeAddMeasure = require('./add-measure')
const makeDeleteMeasure = require('./delete-measure')
const makeGetMeasure = require('./get-measure')
const makeListMeasures = require('./list-measures')

const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb })
const deleteMeasure = makeDeleteMeasure({ measuresDb, validatePositiveInteger })
const getMeasure = makeGetMeasure({ measuresDb, validatePositiveInteger, parseDbMeasure })
const listMeasures = makeListMeasures({ measuresDb, parseDbMeasure })

function parseDbMeasure (source) {
  const measure = {}
  if (source.id) {
    measure.id = source.id
  }
  if (source.name) {
    measure.name = source.name
  }
  if (source.category_name) {
    measure.categoryName = source.category_name
  }
  if (source.value_type_name) {
    measure.valueTypeName = source.value_type_name
  }
  return measure
}

module.exports = Object.freeze({
  addMeasure,
  deleteMeasure,
  getMeasure,
  listMeasures
})
