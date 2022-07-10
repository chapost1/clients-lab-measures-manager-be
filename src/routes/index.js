const routes = require('express').Router()

const clientsRoutes = require('./clients/index')
const measuresRoutes = require('./measures/index')
const measuresCategoriesRoutes = require('./measures-categories/index')

routes.use('/measures', measuresRoutes)

routes.use('/measures-categories', measuresCategoriesRoutes)

routes.use('clients', clientsRoutes)

module.exports = routes
