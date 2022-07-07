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
const getMeasure = makeGetMeasure({ measuresDb, validatePositiveInteger })
const listMeasures = makeListMeasures({ measuresDb })

module.exports = Object.freeze({
  addMeasure,
  deleteMeasure,
  getMeasure,
  listMeasures
})
