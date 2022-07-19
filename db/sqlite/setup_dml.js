const { makeDbConnector, closeDbConnections } = require('../../src/data-access/sqlite/index')
const { MEASURES_VALUES_TYPES } = require('../../src/entities/measure-value-type/measures-values-types')
const { SEX_TYPES } = require('../../src/entities/sex-type/sex-types')
const async = require('async')

function setupDefaultData ({ dbPath } = { }, mainCallback) {
  if (!dbPath) {
    return mainCallback(Error('createSchema: missing dbPath'))
  }
  const postDbConnection = (err, db) => {
    if (err) {
      console.log('setupDb exits')
      return mainCallback(err)
    }

    console.log('Setting up database...')

    async.waterfall([
      callback => addMeasuresValueTypes(db, callback),
      callback => addSexTypes(db, callback)
    ], err => {
      if (err) {
        console.log('Database setup has been failed...')
        console.log(`ERR: ${err}`)
      } else {
        console.log('Database setup complete...')
      }
      closeDbConnections(() => mainCallback(err))
    })
  }

  console.log('Conntectiong to database...')
  console.log(`db path: ${dbPath}`)
  const dbConnector = makeDbConnector({ dbPath })
  dbConnector.connectDb(postDbConnection)
}

function addMeasuresValueTypes (db, callback) {
  console.log('addMeasuresValueTypes')
  const params = Object.values(MEASURES_VALUES_TYPES)
  if (params.length < 0) {
    return callback(null)
  }
  const sql =
    `INSERT INTO measures_values_types (name)
     VALUES ${Array(params.length).fill('(?)').join(', ')}`
  try {
    const stmt = db.prepare(sql)
    stmt.run.apply(stmt, params)
    return callback(null)
  } catch (err) {
    return callback(err)
  }
}

function addSexTypes (db, callback) {
  console.log('addSexTypes')
  const params = Object.values(SEX_TYPES)
  if (params.length < 0) {
    return callback(null)
  }
  const sql =
    `INSERT INTO sex_types (name)
     VALUES ${Array(params.length).fill('(?)').join(', ')}`
  try {
    const stmt = db.prepare(sql)
    stmt.run.apply(stmt, params)
    return callback(null)
  } catch (err) {
    return callback(err)
  }
}

module.exports = setupDefaultData
