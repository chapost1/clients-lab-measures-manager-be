const { makeDbConnector } = require('../index')
const makeClientsDb = require('./clients-db')
const parseDbClient = require('./parse-db-client')
const errorHandler = require('../error-handler/index')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })

module.exports = clientsDb
