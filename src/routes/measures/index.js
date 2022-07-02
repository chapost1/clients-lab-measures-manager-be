const measuresRoutes = require('express').Router()
const { makeCallback } = require('../../express-utils/index')
const { postMeasure, deleteMeasureById, getMeasureById, getMeasuresList } = require('../../controllers/measure/index')
const makeMeasuresRouter = require('./measures')

const measuresRouter = makeMeasuresRouter({ postMeasure, deleteMeasureById, getMeasureById, getMeasuresList, makeCallback })
measuresRoutes.use('', measuresRouter)

module.exports = measuresRoutes
