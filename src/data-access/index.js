const series = require('async/series')
const { closeDbConnections: sqliteGracefulExit } = require('./sqlite/index')

function dataAccessGracefulExit (callback = () => {}) {
  series([
    sqliteGracefulExit
  ], () => callback(null))
}

module.exports = Object.freeze({
  dataAccessGracefulExit
})
