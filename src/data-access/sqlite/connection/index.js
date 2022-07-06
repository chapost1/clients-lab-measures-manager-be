const makeMakeDbConnector = require('./db-connector')
const makeCloseDbConnections = require('./close-db-connections')

const connections = require('./connections')

const closeDbConnections = makeCloseDbConnections({ connections })
const makeDbConnector = makeMakeDbConnector({ connections })

module.exports = {
  makeDbConnector,
  closeDbConnections
}
