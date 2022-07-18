const { operationSuccessResponse, errorHandler } = require('../response-utils')

module.exports = function makeDeleteClient ({ deleteClient }) {
  return function deleteClientById (httpRequest, callback) {
    const { id } = httpRequest.params

    deleteClient(id, postDeleteClient)

    function postDeleteClient (err) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, operationSuccessResponse())
    }
  }
}
