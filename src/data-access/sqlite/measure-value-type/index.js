const { makeDbConnector } = require('../index')
const makeMeasuresValuesTypesDb = require('./measures-values-types-db')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector })

module.exports = measuresValuesTypesDb
