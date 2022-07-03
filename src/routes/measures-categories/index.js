const measuresCategoriesRoutes = require('express').Router()
const { expressCallback } = require('../../express-utils/index')
const { postMeasureCategory, getMeasureCategoryById, getMeasuresCategoriesList, deleteMeasureCategoryById } = require('../../controllers/measure-category/index')
const makeMeasuresCategoriesRouter = require('./measures-categories')

const measuresCategoriesRouter = makeMeasuresCategoriesRouter({ expressCallback, postMeasureCategory, getMeasureCategoryById, getMeasuresCategoriesList, deleteMeasureCategoryById })
measuresCategoriesRoutes.use('', measuresCategoriesRouter)

module.exports = measuresCategoriesRoutes
