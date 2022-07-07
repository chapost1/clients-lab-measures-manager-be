const SQLite3 = require('better-sqlite3')

module.exports = function makeMakeDbConnector ({ connections }) {
  return function makeDbConnector ({ dbPath }) {
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

        const stmt = db.prepare(sql)
        try {
          const info = stmt.run(...params)
          return callback(null, info)
        } catch (err) {
          return callback(err)
        }
      })
    }

    function getSingle (sql, params, callback) {
      connectDb((err, db) => {
        if (err) {
          return callback(err)
        }

        const stmt = db.prepare(sql)
        try {
          const row = stmt.get(...params)
          return callback(null, row || undefined)
        } catch (err) {
          return callback(err)
        }
      })
    }

    function getMulti (sql, params, callback) {
      connectDb((err, db) => {
        if (err) {
          return callback(err)
        }

        const stmt = db.prepare(sql)
        try {
          const rows = stmt.all(...params)
          return callback(null, rows || [])
        } catch (err) {
          return callback(err)
        }
      })
    }

    function connectDb (callback) {
      if (connections[dbPath] && connections[dbPath].open) {
        return callback(null, connections[dbPath])
      }
      let db = null
      try {
        db = new SQLite3(dbPath, { })
      } catch (err) {
        console.log(`Could not connect to database: ${dbPath}`, err)
        return callback(err, undefined)
      }
      connections[dbPath] = db
      callback(null, db)
    }
  }
}
