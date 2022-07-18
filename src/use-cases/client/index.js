const clientsDb = require('../../data-access/sqlite/client/index')
const sexTypesDb = require('../../data-access/sqlite/sex-type/index')
const makeAddClient = require('./add-client')
const makeDeleteClient = require('./delete-client')
const makeGetClient = require('./get-client')
const makeListClients = require('./list-clients')
const makeUpdateClient = require('./update-client')
const unionModel = require('../../models/union-model')
const { validatePositiveInteger } = require('../../models/validators')
const { ModelConstructionError, NotFoundError, InvalidRationalValueError, ValueError } = require('../../common/custom-error-types')

const addClient = makeAddClient({ clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError })
const deleteClient = makeDeleteClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
const getClient = makeGetClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
const listClients = makeListClients({ clientsDb })
const updateClient = makeUpdateClient({ clientsDb, sexTypesDb, validatePositiveInteger, ModelConstructionError, InvalidRationalValueError, NotFoundError, ValueError, unionModel })

module.exports = Object.freeze({
  addClient,
  deleteClient,
  getClient,
  listClients,
  updateClient
})
