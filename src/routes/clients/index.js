const clientsRoutes = require('express').Router()
const { expressCallback } = require('../../express-utils/index')
const makeClientsRouter = require('./clients')

const postClient = (httpRequest, callback) => { callback(null) }

const clientsRouter = makeClientsRouter({ postClient, expressCallback })
clientsRoutes.use('', clientsRouter)

module.exports = clientsRoutes
