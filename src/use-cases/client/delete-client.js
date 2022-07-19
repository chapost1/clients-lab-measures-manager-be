const { CLIENT } = require('../../entities/entities-types')

module.exports = function makeDeleteClient ({ clientsDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function deleteClient (id, callback) {
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
        clientsDb.deleteById(id, postDeleteById)
      }
    }

    function postDeleteById (err) {
      return callback(err)
    }
  }
}
