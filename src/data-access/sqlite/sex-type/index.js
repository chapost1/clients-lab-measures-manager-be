const { makeDbConnector } = require('../index')
const makeSexTypesDb = require('./sex-types-db')
const errorHandler = require('../error-handler/index')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

module.exports = sexTypesDb
