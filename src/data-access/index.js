const series = require('async/series')
const { closeDbConnections: closeSqliteConnections } = require('./sqlite/index')

function closeDataAccessConnections (callback = () => {}) {
  series([
    closeSqliteConnections
  ], () => callback(null))
}

module.exports = Object.freeze({
  closeDataAccessConnections
})
