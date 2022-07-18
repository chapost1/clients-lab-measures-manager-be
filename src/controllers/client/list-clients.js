const { okResponse, errorHandler } = require('../response-utils')

module.exports = function makeGetClientsList ({ listClients }) {
  return function getClientsList (httpRequest, callback) {
    listClients(postListClients)

    function postListClients (err, clients) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(clients))
    }
  }
}
