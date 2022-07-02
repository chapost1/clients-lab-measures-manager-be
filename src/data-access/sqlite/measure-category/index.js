const { makeDbConnector } = require('../index')
const makeMeasuresCategoriesDb = require('./measures-categories-db')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

module.exports = measuresCategoriesDb
