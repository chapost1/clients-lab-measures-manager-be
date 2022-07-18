const { addClient, deleteClient, getClient, listClients } = require('../../use-cases/client/index')

const makeAddClient = require('./add-client')
const makeDeleteClient = require('./delete-client')
const makeGetClient = require('./get-client')
const makeGetClientsList = require('./list-clients')

const postClient = makeAddClient({ addClient })
const deleteClientById = makeDeleteClient({ deleteClient })
const getClientById = makeGetClient({ getClient })
const getClientsList = makeGetClientsList({ listClients })

module.exports = Object.freeze({
  postClient,
  deleteClientById,
  getClientById,
  getClientsList
})
