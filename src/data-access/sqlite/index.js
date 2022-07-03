const sqlite3 = require('sqlite3').verbose()
const series = require('async/series')

const connections = {}

function closeDbConnections (mainCallback) {
  const dbCloseConnectionEvents = []

  for (const dbPath in connections) {
    const db = connections[dbPath]
    if (!db) {
      continue
    }
    dbCloseConnectionEvents.push(
      callback => {
        if (db && db.open) {
          console.log(`sqlite connection with ${dbPath} is about to disconnect through app termination`)
          db.close(err => {
            if (err) {
              console.log(`WARNING: failed to close db connection, err: ${err.message}`)
            } else {
              console.log('INFO: db connection has been closed')
            }
            connections[dbPath] = null
            return callback(null)
          })
        } else {
          return callback(null)
        }
      }
    )
  }
  series(dbCloseConnectionEvents, () => {
    mainCallback(null)
  })
}

const makeDbConnector = ({ dbPath }) => {
  const dbConnector = Object.freeze({
    insert,
    getSingle,
    getMulti,
    execute,
    connectDb
  })

  return dbConnector

  function insert (sql, params, callback) {
    execute(sql, params, callback)
  }

  function execute (sql, params, callback) {
    console.log('execute')
    connectDb(function (err, db) {
      if (err) {
        return callback(err)
      }

      db.run(sql, params, function (err) {
        // bind this, so caller can use this.lastID and similar.
        callback.bind(this, err)()
      })
    })
  }

  function getSingle (sql, params, callback) {
    connectDb((err, db) => {
      if (err) {
        return callback(err)
      }

      db.get(sql, params, function (err, row) {
        if (err) {
          return callback(err, null)
        }
        return callback(null, row || null)
      })
    })
  }

  function getMulti (sql, params, callback) {
    connectDb((err, db) => {
      if (err) {
        return callback(err)
      }
      db.all(sql, params, function (err, rows) {
        if (err) {
          return callback(err, null)
        }
        return callback(null, rows || [])
      })
    })
  }

  function connectDb (callback) {
    if (connections[dbPath] && connections[dbPath].open) {
      return callback(null, connections[dbPath])
    }
    const db = new sqlite3.Database(dbPath, err => {
      if (err) {
        console.log(`Could not connect to database: ${dbPath}`, err)
        return callback(err, null)
      }
    })
    connections[dbPath] = db
    callback(null, db)
  }
}

module.exports = {
  makeDbConnector,
  closeDbConnections
}
