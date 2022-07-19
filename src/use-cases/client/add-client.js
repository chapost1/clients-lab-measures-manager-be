const makeClient = require('../../entities/client/index')
const { SEX_TYPE } = require('../../entities/entities-types')

module.exports = function makeAddClient ({
  clientsDb, sexTypesDb, EntityConstructionError, InvalidRationalValueError
}) {
  return function addMeasure (clientInfo, callback) {
    const { error, data: client } = makeClient(clientInfo)
    if (error) {
      return callback(new EntityConstructionError(error.message))
    }

    sexTypesDb.findById(client.sex.id, postFindSexTypeById)

    function postFindSexTypeById (err, valueType) {
      if (err) {
        return callback(err)
      }
      if (!valueType) {
        return callback(new InvalidRationalValueError(`${SEX_TYPE} id does not exists`))
      }

      clientsDb.insert(client, postAddClient)
    }

    function postAddClient (err, addedClientId) {
      callback(err, addedClientId)
    }
  }
}
