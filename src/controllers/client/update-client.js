const { operationSuccessResponse, errorHandler } = require('../response-utils')

module.exports = function makeUpdateClient ({ updateClient }) {
  return function editClient (httpRequest, callback) {
    const { id } = httpRequest.params
    const { name, birthDate, isActive, sex, contact } = httpRequest.body

    const client = {
      id,
      name,
      birthDate,
      isActive,
      sex,
      contact
    }

    updateClient(client, postUpdateClient)

    function postUpdateClient (err) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, operationSuccessResponse())
    }
  }
}
