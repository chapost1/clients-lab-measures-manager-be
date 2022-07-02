const measuresCategoriesRouter = require('express').Router()

module.exports = function makeMeasuresCategoriesRouter ({ makeCallback, postMeasureCategory, getMeasureCategoryById, getMeasuresCategoriesList, deleteMeasureCategoryById }) {
  measuresCategoriesRouter.post('', makeCallback(postMeasureCategory))
  measuresCategoriesRouter.get('', makeCallback(getMeasuresCategoriesList))
  measuresCategoriesRouter.get('/:id(\\d+)', makeCallback(getMeasureCategoryById))
  measuresCategoriesRouter.delete('/:id(\\d+)', makeCallback(deleteMeasureCategoryById))
  return measuresCategoriesRouter
}
