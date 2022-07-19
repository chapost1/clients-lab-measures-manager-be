const makeClient = require('../../entities/client/index')
const { CLIENT, SEX_TYPE } = require('../../entities/entities-types')

module.exports = function makeUpdateClient ({
  clientsDb,
  sexTypesDb,
  unionEntity,
  validatePositiveInteger,
  InvalidRationalValueError,
  EntityConstructionError,
  NotFoundError,
  ValueError
}) {
  return function updateClient (clientInfo, callback) {
    const { id } = clientInfo

    const { error: idError, proper: properId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    if (clientInfo.sex?.id) {
      sexTypesDb.findById(clientInfo.sex.id, postFindSexTypeById)

      function postFindSexTypeById (err, valueType) {
        if (err) {
          return callback(err)
        }
        if (!valueType) {
          return callback(new InvalidRationalValueError(`${SEX_TYPE} id does not exists`))
        }

        clientsDb.findById(properId, postFindById)
      }
    } else {
      clientsDb.findById(properId, postFindById)
    }

    function postFindById (err, foundClient) {
      if (err) {
        return callback(err)
      } else if (!foundClient) {
        return callback(new NotFoundError(`${CLIENT} with the selected id can not be found`))
      } else {
        const newClientInfo = unionEntity({
          currentState: foundClient,
          newState: clientInfo,
          idOverwrite: properId
        })

        const { error, data: client } = makeClient(newClientInfo)
        if (error) {
          return callback(new EntityConstructionError(error.message))
        }

        clientsDb.update(client, postUpdate)
      }
    }

    function postUpdate (err) {
      return callback(err)
    }
  }
}
