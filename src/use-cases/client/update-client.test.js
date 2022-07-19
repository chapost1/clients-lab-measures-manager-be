const resetDatabase = require('../../../db/sqlite/index')
const makeClientsDb = require('../../data-access/sqlite/client/clients-db')
const makeSexTypesDb = require('../../data-access/sqlite/sex-type/sex-types-db')
const makeAddClient = require('./add-client')
const makeGetClient = require('./get-client')
const makeUpdateClient = require('./update-client')
const { validatePositiveInteger } = require('../../entities/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const unionEntity = require('../../entities/union-entity')
const parseDbClient = require('../../data-access/sqlite/client/parse-db-client')
const getMockClient = require('../../entities/client/fixture')
const { EntityConstructionError, InvalidRationalValueError, NotFoundError, ValueError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('updateClient', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })
  const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

  const addClient = makeAddClient({ clientsDb, sexTypesDb, EntityConstructionError, InvalidRationalValueError })
  const getClient = makeGetClient({ clientsDb, validatePositiveInteger, NotFoundError, ValueError })
  const updateClient = makeUpdateClient({ clientsDb, sexTypesDb, unionEntity, validatePositiveInteger, InvalidRationalValueError, EntityConstructionError, NotFoundError, ValueError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    const mock = getMockClient()
    updateClient(mock, err => {
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
    const mock = getMockClient()
    mock.id = 'as'
    updateClient(mock, err => {
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
    const mock = getMockClient()
    mock.id = 1
    updateClient(mock, err => { // nothing exists by default
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  describe('missing fields', () => {
    it('should succeed with id only', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId

        updateClient({ id: insertedId }, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })

    it('should succeed with missing name', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        delete localMock.name
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })

    it('should succeed with missing birth date', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        delete localMock.birthDate
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })

    it('should succeed with missing isActive', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        delete localMock.isActive
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })

    it('should succeed with missing sex', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        delete localMock.sex
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })

    it('should succeed with missing contact', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        delete localMock.contact
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        done(err)
      }
    })
  })

  describe('invalid fields', () => {
    it('should fail with invalid name', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.name = 123
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })

    it('should fail with invalid isActive', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.isActive = 'dummy not bool'
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })

    it('should fail with invalid birth date', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.birthDate = 'not a date'
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })

    it('should fail with invalid email', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.contact.email = 'not an email'
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })

    it('should fail with invalid phone number', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.contact.phoneNumber = 13232
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })

    it('should fail with invalid address', done => {
      let insertedId = null
      const mock = getMockClient()
      addClient(mock, postClientInsert)

      function postClientInsert (err, addedClientId) {
        if (err) {
          return done(err)
        }
        insertedId = addedClientId
        const localMock = getMockClient()
        localMock.id = insertedId
        localMock.contact.address = 13232
        updateClient(localMock, postUpdate)
      }

      function postUpdate (err) {
        try {
          expect(err).toBeInstanceOf(EntityConstructionError)
          done()
        } catch (e) {
          done(e)
        }
      }
    })
  })

  it('should take affect on update', done => {
    let insertedId = null
    const mock = getMockClient()
    mock.name = 'Tamir'
    mock.contact.email = 'foo@bar.com'
    mock.sex.id = 1

    const updateField = {
      name: 'Moshe',
      contactEmail: 'foo@gmail.co.il',
      sexId: 2
    }

    addClient(mock, postClientInsert)

    function postClientInsert (err, addedClientId) {
      if (err) {
        return done(err)
      }
      insertedId = addedClientId
      const localMock = getMockClient()
      localMock.id = insertedId
      localMock.name = updateField.name
      localMock.contact.email = updateField.contactEmail
      localMock.sex.id = updateField.sexId
      updateClient(localMock, postUpdate)
    }

    function postUpdate (err) {
      if (err) {
        return done(err)
      }
      getClient(insertedId, postGet)
    }

    function postGet (err, client) {
      if (err) {
        return done(err)
      }
      try {
        expect(client).not.toBeNull()
        expect(client.name).toBe(updateField.name)
        expect(client.contact.email).toBe(updateField.contactEmail)
        expect(client.sex.id).toBe(updateField.sexId)
        done()
      } catch (e) {
        done(e)
      }
    }
  })

  it('should not take affect on another clients', done => {
    let firstId = null
    let secondId = null
    const original = getMockClient()
    original.name = 'Tamir'
    original.contact.email = 'foo@bar.com'
    original.sex.id = 1

    const updateField = {
      name: 'Moshe',
      contactEmail: 'foo@gmail.co.il',
      sexId: 2
    }

    addClient(original, postFirstClientInsert)

    function postFirstClientInsert (err, addedClientId) {
      if (err) {
        return done(err)
      }
      firstId = addedClientId

      const originalCopy = JSON.parse(JSON.stringify(original))

      originalCopy.name = original.name + '____1'// unique name
      addClient(originalCopy, postSecondClientInsert)
    }

    function postSecondClientInsert (err, addedClientId) {
      if (err) {
        return done(err)
      }
      secondId = addedClientId

      const localMock = getMockClient()
      localMock.id = secondId
      localMock.name = updateField.name
      localMock.contact.email = updateField.contactEmail
      localMock.sex.id = updateField.sexId
      updateClient(localMock, postUpdate)
    }

    function postUpdate (err) {
      if (err) {
        return done(err)
      }
      getClient(secondId, postGetSecond)
    }

    // validate effect
    function postGetSecond (err, client) {
      if (err) {
        return done(err)
      }
      try {
        expect(client).not.toBeNull()
        expect(client.name).toBe(updateField.name)
        expect(client.contact.email).toBe(updateField.contactEmail)
        expect(client.sex.id).toBe(updateField.sexId)

        getClient(firstId, postGetFirst)
      } catch (e) {
        done(e)
      }
    }

    // validate no effect on others
    function postGetFirst (err, client) {
      if (err) {
        return done(err)
      }
      try {
        expect(client).not.toBeNull()
        expect(client.name).toBe(original.name)
        expect(client.contact.email).toBe(original.contact.email)
        expect(client.sex.id).toBe(original.sex.id)

        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
