const { CLIENT } = require('../../models/models-types')

module.exports = function makeGetClient ({ clientsDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function getClient (id, callback) {
    const { error: idError, proper: properId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    clientsDb.findById(properId, postFindById)

    function postFindById (err, foundClient) {
      if (err) {
        return callback(err)
      } else if (!foundClient) {
        return callback(new NotFoundError(`${CLIENT} with the selected id can not be found`))
      } else {
        return callback(null, foundClient)
      }
    }
  }
}
