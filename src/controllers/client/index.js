const { addClient, deleteClient, getClient, listClients, updateClient } = require('../../use-cases/client/index')

const makeAddClient = require('./add-client')
const makeDeleteClient = require('./delete-client')
const makeGetClient = require('./get-client')
const makeGetClientsList = require('./list-clients')
const makeUpdateClient = require('./update-client')

const postClient = makeAddClient({ addClient })
const deleteClientById = makeDeleteClient({ deleteClient })
const getClientById = makeGetClient({ getClient })
const getClientsList = makeGetClientsList({ listClients })
const editClient = makeUpdateClient({ updateClient })

module.exports = Object.freeze({
  postClient,
  deleteClientById,
  getClientById,
  getClientsList,
  editClient
})
