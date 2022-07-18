const { createdResponse, errorHandler } = require('../response-utils')

module.exports = function makeAddClient ({ addClient }) {
  return function postClient (httpRequest, callback) {
    const { name, birthDate, isActive, sex, contact } = httpRequest.body

    const client = {
      name,
      birthDate,
      isActive,
      sex,
      contact
    }

    addClient(client, postAddClient)

    function postAddClient (err, addedClientId) {
      if (err) {
        return errorHandler(err, callback)
      }

      callback(null, createdResponse({ id: addedClientId }))
    }
  }
}
