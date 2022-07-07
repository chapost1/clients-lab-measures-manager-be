const async = require('async')
const { closeDbConnections: closeSqliteConnections } = require('./sqlite/index')

function closeDataAccessConnections (callback = () => {}) {
  async.series([
    closeSqliteConnections
  ], () => callback(null))
}

module.exports = Object.freeze({
  closeDataAccessConnections
})
