const makeClient = require('../../models/client/index')
const { SEX_TYPE } = require('../../models/models-types')

module.exports = function makeAddClient ({
  clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError
}) {
  return function addMeasure (clientInfo, callback) {
    const { error, data: client } = makeClient(clientInfo)
    if (error) {
      return callback(new ModelConstructionError(error.message))
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
