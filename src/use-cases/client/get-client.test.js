const resetDatabase = require('../../../db/sqlite/index')
const makeClientsDb = require('../../data-access/sqlite/client/clients-db')
const makeSexTypesDb = require('../../data-access/sqlite/sex-type/sex-types-db')
const makeAddClient = require('./add-client')
const makeGetClient = require('./get-client')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const parseDbClient = require('../../data-access/sqlite/client/parse-db-client')
const getMockClient = require('../../models/client/fixture')
const { NotFoundError, ValueError, ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')
const { CLIENT } = require('../../models/models-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getClient', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })
  const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

  const getClient = makeGetClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
  const addClient = makeAddClient({ clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    getClient(null, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ValueError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if invalid id', done => {
    getClient(1.2, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ValueError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get error if not found', done => {
    // no clients at start
    getClient(1, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.message).toBe(`${CLIENT} with the selected id can not be found`)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get same client as inserted', done => {
    const mock = getMockClient()
    let insertedId = null
    addClient(mock, postMeasureInsert)

    function postMeasureInsert (err, addedClientId) {
      if (err) {
        return done(err)
      }
      insertedId = addedClientId
      getClient(addedClientId, postGetClient)
    }

    function postGetClient (err, client) {
      try {
        expect(err).toBeFalsy()
        expect(client.id).toBe(insertedId)
        expect(client.name).toBe(mock.name)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
