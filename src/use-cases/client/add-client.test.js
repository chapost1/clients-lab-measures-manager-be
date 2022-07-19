const resetDatabase = require('../../../db/sqlite/index')
const makeClientsDb = require('../../data-access/sqlite/client/clients-db')
const makeSexTypesDb = require('../../data-access/sqlite/sex-type/sex-types-db')
const makeAddClient = require('./add-client')
const getMockClient = require('../../models/client/fixture')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const parseDbClient = require('../../data-access/sqlite/client/parse-db-client')
const { ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')
const { SEX_TYPE } = require('../../models/models-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('addClient', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })
  const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

  const addClient = makeAddClient({ clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail create model if no sex', done => {
    const mock = getMockClient()
    delete mock.sex
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no sex id', done => {
    const mock = getMockClient()
    delete mock.sex.id
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no name', done => {
    const mock = getMockClient()
    delete mock.name
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no name', done => {
    const mock = getMockClient()
    delete mock.name
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if birth date', done => {
    const mock = getMockClient()
    delete mock.birthDate
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no isActive', done => {
    const mock = getMockClient()
    delete mock.isActive
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no contact', done => {
    const mock = getMockClient()
    delete mock.contact
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no contact.email', done => {
    const mock = getMockClient()
    delete mock.contact.email
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no contact.phoneNumber', done => {
    const mock = getMockClient()
    delete mock.contact.phoneNumber
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no contact.address', done => {
    const mock = getMockClient()
    delete mock.contact.address
    addClient(mock, (err, addedClientId) => {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ModelConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if sex type id does not exists', done => {
    const invalidSexTypeId = 999999999
    const mock = getMockClient()
    mock.sex.id = invalidSexTypeId
    addClient(mock, postClientInsert)

    function postClientInsert (err, addedClientId) {
      try {
        expect(addedClientId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(InvalidRationalValueError)
        expect(err.message).toBe(`${SEX_TYPE} id does not exists`)
        done()
      } catch (e) {
        done(e)
      }
    }
  })

  it('should succeed if all values are valid and foreign keys ids are existing ones', done => {
    const mock = getMockClient()
    addClient(mock, postClientInsert)

    function postClientInsert (err, addedClientId) {
      try {
        expect(err).toBeFalsy()
        expect(addedClientId).not.toBeFalsy()
        expect(typeof addedClientId).toBe('number')
        expect(addedClientId).toBeGreaterThan(0)
        expect(addedClientId).toBe(1)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
