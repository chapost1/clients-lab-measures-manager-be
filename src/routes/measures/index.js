const measuresRoutes = require('express').Router()
const { expressCallback } = require('../../express-utils/index')
const { postMeasure, deleteMeasureById, getMeasureById, getMeasuresList } = require('../../controllers/measure/index')
const makeMeasuresRouter = require('./measures')

const measuresRouter = makeMeasuresRouter({ postMeasure, deleteMeasureById, getMeasureById, getMeasuresList, expressCallback })
measuresRoutes.use('', measuresRouter)

module.exports = measuresRoutes
