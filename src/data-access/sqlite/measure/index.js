const { makeDbConnector } = require('../index')
const makeMeasuresDb = require('./measures-db')
const parseDbMeasure = require('./parse-db-measure')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const measuresDb = makeMeasuresDb({ dbConnector, parseDbMeasure })

module.exports = measuresDb
