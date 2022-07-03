const measuresCategoriesRouter = require('express').Router()

module.exports = function makeMeasuresCategoriesRouter ({ expressCallback, postMeasureCategory, getMeasureCategoryById, getMeasuresCategoriesList, deleteMeasureCategoryById }) {
  measuresCategoriesRouter.post('', expressCallback(postMeasureCategory))
  measuresCategoriesRouter.get('', expressCallback(getMeasuresCategoriesList))
  measuresCategoriesRouter.get('/:id(\\d+)', expressCallback(getMeasureCategoryById))
  measuresCategoriesRouter.delete('/:id(\\d+)', expressCallback(deleteMeasureCategoryById))
  return measuresCategoriesRouter
}
