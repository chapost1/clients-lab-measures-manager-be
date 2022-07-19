const { okResponse, errorHandler } = require('../response-utils')

module.exports = function makeGetClient ({ getClient }) {
  return function getClientById (httpRequest, callback) {
    const { id } = httpRequest.params

    getClient(id, postFindClient)

    function postFindClient (err, clientInfo) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, okResponse(clientInfo))
    }
  }
}
