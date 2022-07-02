const { makeDbConnector } = require('../index')
const makeMeasuresDb = require('./measures-db')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const measuresDb = makeMeasuresDb({ dbConnector })

module.exports = measuresDb
