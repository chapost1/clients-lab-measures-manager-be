const { makeDbConnector, closeDbConnections } = require('../../src/data-access/sqlite/index')
const { MEASURES_VALUES_TYPES } = require('../../src/models/measure/measures-values-types')
const waterfall = require('async/waterfall')

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

    waterfall([
      callback => addMeasuresValueTypes(db, callback)
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
  db.run(sql, params, callback)
}

module.exports = setupDefaultData
