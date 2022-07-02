const { validatePositiveInteger } = require('../../models/validators')
const measuresCategoriesDb = require('../../data-access/sqlite/measure-category/index')
const makeAddMeasureCategory = require('./add-measure-category')
const makeGetMeasureCategory = require('./get-measure-category')
const makeListMeasuresCategories = require('./list-measures-categories')
const makeDeleteMeasureCategory = require('./delete-measure-category')

const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb })
const getMeasureCategory = makeGetMeasureCategory({ measuresCategoriesDb, validatePositiveInteger })
const listMeasuresCategories = makeListMeasuresCategories({ measuresCategoriesDb })
const deleteMeasureCategory = makeDeleteMeasureCategory({ measuresCategoriesDb, validatePositiveInteger })

module.exports = Object.freeze({
  addMeasureCategory,
  getMeasureCategory,
  listMeasuresCategories,
  deleteMeasureCategory
})
