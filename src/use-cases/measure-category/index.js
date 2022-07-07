const { validatePositiveInteger } = require('../../models/validators')
const measuresCategoriesDb = require('../../data-access/sqlite/measure-category/index')
const makeAddMeasureCategory = require('./add-measure-category')
const makeGetMeasureCategory = require('./get-measure-category')
const makeListMeasuresCategories = require('./list-measures-categories')
const makeDeleteMeasureCategory = require('./delete-measure-category')
const { ModelConstructionError, NotFoundError, ValueError } = require('../../common/custom-error-types')

const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, ModelConstructionError })
const getMeasureCategory = makeGetMeasureCategory({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError })
const listMeasuresCategories = makeListMeasuresCategories({ measuresCategoriesDb })
const deleteMeasureCategory = makeDeleteMeasureCategory({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError })

module.exports = Object.freeze({
  addMeasureCategory,
  getMeasureCategory,
  listMeasuresCategories,
  deleteMeasureCategory
})
