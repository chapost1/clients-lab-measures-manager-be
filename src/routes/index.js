const routes = require('express').Router()

const measuresRoutes = require('./measures/index')
const measuresCategoriesRoutes = require('./measures-categories/index')

routes.use('/measures', measuresRoutes)

routes.use('/measures-categories', measuresCategoriesRoutes)

module.exports = routes
