const clientsRoutes = require('express').Router()
const { expressCallback } = require('../../express-utils/index')
const { postClient, deleteClientById, getClientById, getClientsList, editClient } = require('../../controllers/client/index')
const makeClientsRouter = require('./clients')

const clientsRouter = makeClientsRouter({ postClient, deleteClientById, getClientById, getClientsList, editClient, expressCallback })
clientsRoutes.use('', clientsRouter)

module.exports = clientsRoutes
