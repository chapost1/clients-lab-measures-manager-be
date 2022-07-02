const { addMeasureCategory, getMeasureCategory, listMeasuresCategories, deleteMeasureCategory } = require('../../use-cases/measure-category/index')

const makeAddMeasureCategory = require('./add-measure-category')
const makeGetMeasureCategory = require('./get-measure-category')
const makeGetMeasuresCategoriesList = require('./list-measures-categories')
const makeDeleteMeasureCategory = require('./delete-measure-category')

const postMeasureCategory = makeAddMeasureCategory({ addMeasureCategory })
const getMeasureCategoryById = makeGetMeasureCategory({ getMeasureCategory })
const getMeasuresCategoriesList = makeGetMeasuresCategoriesList({ listMeasuresCategories })
const deleteMeasureCategoryById = makeDeleteMeasureCategory({ deleteMeasureCategory })

const measuresCategoriesController = Object.freeze({
  postMeasureCategory,
  getMeasureCategoryById,
  getMeasuresCategoriesList,
  deleteMeasureCategoryById
})

module.exports = measuresCategoriesController
