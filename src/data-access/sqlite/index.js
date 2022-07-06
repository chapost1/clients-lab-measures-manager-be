const { closeDbConnections, makeDbConnector } = require('./connection/index')

module.exports = {
  makeDbConnector,
  closeDbConnections
}
