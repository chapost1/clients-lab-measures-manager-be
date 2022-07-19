const clientsDb = require('../../data-access/sqlite/client/index')
const sexTypesDb = require('../../data-access/sqlite/sex-type/index')
const makeAddClient = require('./add-client')
const makeDeleteClient = require('./delete-client')
const makeGetClient = require('./get-client')
const makeListClients = require('./list-clients')
const makeUpdateClient = require('./update-client')
const unionEntity = require('../../entities/union-entity')
const { validatePositiveInteger } = require('../../entities/validators')
const { EntityConstructionError, NotFoundError, InvalidRationalValueError, ValueError } = require('../../common/custom-error-types')

const addClient = makeAddClient({ clientsDb, sexTypesDb, EntityConstructionError, InvalidRationalValueError })
const deleteClient = makeDeleteClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
const getClient = makeGetClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
const listClients = makeListClients({ clientsDb })
const updateClient = makeUpdateClient({ clientsDb, sexTypesDb, validatePositiveInteger, EntityConstructionError, InvalidRationalValueError, NotFoundError, ValueError, unionEntity })

module.exports = Object.freeze({
  addClient,
  deleteClient,
  getClient,
  listClients,
  updateClient
})
