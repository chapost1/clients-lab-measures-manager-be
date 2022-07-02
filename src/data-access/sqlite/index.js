const sqlite3 = require('sqlite3').verbose()

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
    connectDb(function (err, db) {
      if (err) {
        return callback(err)
      }

      db.run(sql, params, function (err) {
        db.close()
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
        db.close()
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
        db.close()
        if (err) {
          return callback(err, null)
        }
        return callback(null, rows || [])
      })
    })
  }

  function connectDb (callback) {
    const db = new sqlite3.Database(dbPath, err => {
      if (err) {
        console.log(`Could not connect to database: ${dbPath}`, err)
        return callback(err, null)
      }
    })
    callback(null, db)
  }
}

module.exports = {
  makeDbConnector
}
