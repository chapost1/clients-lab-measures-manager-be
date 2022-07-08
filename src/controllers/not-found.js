const { notFoundResponse } = require('./response-utils')

module.exports = function notFound (httpRequest, callback) {
  callback(null, notFoundResponse())
}
