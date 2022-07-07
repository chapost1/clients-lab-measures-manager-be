const series = require('async/series')

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
            // console.log(`sqlite connection with ${dbPath} is about to disconnect through app termination`)
            db.close(err => {
              if (err) {
                // console.log(`WARNING: failed to close db connection, err: ${err.message}`)
              } else {
                // console.log('INFO: db connection has been closed')
              }
              return callback(null)// does not return error to keep clean everything (and logs are sent for dev knowledge)
            })
            connections[dbPath] = null
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
}
