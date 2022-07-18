const clients = require('express').Router()

module.exports = function makeClientsRouter ({ expressCallback, postClient, deleteClientById, getClientById, getClientsList }) {
  clients.post('', expressCallback(postClient))
  clients.get('', expressCallback(getClientsList))
  clients.get('/:id(\\d+)', expressCallback(getClientById))
  clients.delete('/:id(\\d+)', expressCallback(deleteClientById))
  return clients
}
