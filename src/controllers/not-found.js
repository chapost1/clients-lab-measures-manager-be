const { notFoundResponse } = require('./utils')

module.exports = function notFound (httpRequest, callback) {
  callback(null, notFoundResponse())
}
