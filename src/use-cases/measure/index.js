const { validatePositiveInteger } = require('../../entities/validators')
const measuresDb = require('../../data-access/sqlite/measure/index')
const measuresCategoriesDb = require('../../data-access/sqlite/measure-category/index')
const measuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/index')
const makeAddMeasure = require('./add-measure')
const makeDeleteMeasure = require('./delete-measure')
const makeGetMeasure = require('./get-measure')
const makeListMeasures = require('./list-measures')
const { EntityConstructionError, NotFoundError, InvalidRationalValueError, ValueError } = require('../../common/custom-error-types')

const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb, EntityConstructionError, InvalidRationalValueError })
const deleteMeasure = makeDeleteMeasure({ measuresDb, validatePositiveInteger, NotFoundError, ValueError })
const getMeasure = makeGetMeasure({ measuresDb, validatePositiveInteger, NotFoundError, ValueError })
const listMeasures = makeListMeasures({ measuresDb })

module.exports = Object.freeze({
  addMeasure,
  deleteMeasure,
  getMeasure,
  listMeasures
})
