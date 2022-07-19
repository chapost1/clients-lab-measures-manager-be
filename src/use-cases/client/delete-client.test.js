const resetDatabase = require('../../../db/sqlite/index')
const makeClientsDb = require('../../data-access/sqlite/client/clients-db')
const makeSexTypesDb = require('../../data-access/sqlite/sex-type/sex-types-db')
const makeAddClient = require('./add-client')
const makeDeleteClient = require('./delete-client')
const makeListClients = require('./list-clients')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const parseDbClient = require('../../data-access/sqlite/client/parse-db-client')
const getMockClient = require('../../models/client/fixture')
const { NotFoundError, ValueError, ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('deleteClient', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })
  const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

  const deleteClient = makeDeleteClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
  const addClient = makeAddClient({ clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError })
  const listClients = makeListClients({ clientsDb })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    deleteClient(null, err => {
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
    deleteClient('a1', err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ValueError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if id is valid but does not exists', done => {
    deleteClient(1, err => { // nothing exists by default
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should delete one if exists and only one', done => {
    const mock = getMockClient()
    let firstId = null
    let secondId = null

    insertFirst()

    function insertFirst () {
      mock.name = mock.name + '1'
      addClient(mock, (err, insertedId) => {
        firstId = insertedId
        postInsert(err, insertSecond)
      })
    }

    function insertSecond () {
      mock.name = mock.name + '2'
      addClient(mock, (err, insertedId) => {
        secondId = insertedId
        postInsert(err, deleteFirst)
      })
    }

    function postInsert (err, next) {
      if (err) {
        return done(err)
      }
      next()
    }

    function deleteFirst () {
      deleteClient(firstId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      listClients(postGetMulti)
    }

    function postGetMulti (error, clients) {
      if (error) {
        return done(error)
      }
      try {
        expect(clients).not.toBeNull()
        expect(clients.length).toBe(1)
        expect(clients[0].id).toBe(secondId)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
