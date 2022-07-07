const async = require('async')

module.exports = function makeCloseDbConnections ({ connections }) {
  return function closeDbConnections (mainCallback) {
    const dbCloseConnectionEvents = []

    for (const dbPath in connections) {
      const db = connections[dbPath]
      if (!db) {
        continue
      }
      dbCloseConnectionEvents.push(
        callback => {
          if (db && db.open) {
            console.log(`sqlite connection with ${dbPath} is about to disconnect`)
            try {
              db.close()
              db.open = false
              console.log('INFO: db connection has been closed')
            } catch (err) {
              console.log(`WARNING: failed to close db connection, err: ${err.message}`)
            }
            delete connections[dbPath]
            return callback(null)// does not return error to keep clean everything (and logs are sent for dev knowledge)
          } else {
            return callback(null)
          }
        }
      )
    }
    async.series(dbCloseConnectionEvents, () => {
      mainCallback(null)
    })
  }
}
