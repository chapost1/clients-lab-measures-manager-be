const clients = require('express').Router()

module.exports = function makeMeasuresRouter ({ expressCallback, postClient }) {
  clients.post('', expressCallback(postClient))
  return clients
}
