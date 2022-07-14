const { validatePositiveInteger } = require('../../../models/validators')
const resetDatabase = require('../../../../db/sqlite/index')
const makeClientsDb = require('./clients-db')
const { makeDbConnector, closeDbConnections } = require('../index')
const async = require('async')
const parseDbClient = require('./parse-db-client')
const errorHandler = require('../error-handler/index')
const getMockClient = require('../../../models/client/fixture')
const { DbApplicationError } = require('../../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('clientsDb', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if measure sex id does not exists', done => {
    const mockClient = getMockClient()
    const someUnExistingSexId = 999999
    mockClient.sex.id = someUnExistingSexId
    clientsDb.insert(mockClient, postInsert)

    function postInsert (error) {
      try {
        expect(error).not.toBeNull()
        expect(error).toBeInstanceOf(DbApplicationError)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should get client id after have been inserted', done => {
    clientsDb.insert(getMockClient(), postInsert)

    function postInsert (error, id) {
      if (error) {
        return done(error)
      }
      try {
        expect(id).not.toBeNull()
        expect(validatePositiveInteger({ integer: id, isRequire: true }).error).toBeNull()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should be able to findById client after have been inserted', done => {
    let insertedId = null
    const mock = getMockClient()

    clientsDb.insert(mock, postInsert)

    function postInsert (error, id) {
      if (error) {
        return done(error)
      }
      insertedId = id

      clientsDb.findById(id, postGetSingle)
    }

    function postGetSingle (error, found) {
      if (error) {
        return done(error)
      }
      try {
        expect(found).not.toBeNull()
        expect(found.id).toBe(insertedId)
        expect(found.name).toBe(mock.name)
        expect(found.birthDate).toBe(mock.birthDate)
        expect(found.isActive).toBe(mock.isActive)
        expect(found.sex.id).toBe(mock.sex.id)
        expect(found.contact.email).toBe(mock.contact.email)
        expect(found.contact.address).toBe(mock.contact.address)
        expect(found.contact.phoneNumber).toBe(mock.contact.phoneNumber)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should not be able to find one with not exists id, and result should be undefined', done => {
    const notFoundId = 1
    clientsDb.findById(notFoundId, postFindById)

    function postFindById (error, found) {
      if (error) { // no error should be gotten
        return done(error)
      }

      try {
        expect(found).toBeUndefined()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should insert exact items count as expected', done => {
    const insertCount = Math.floor(Math.random() * 4) + 2// 2:5
    const mock = getMockClient()
    const baseName = mock.name

    const insertTasks = []
    for (let i = 0; i < insertCount; i++) {
      insertTasks.push((callback) => {
        mock.name = `${baseName}_${i}`
        clientsDb.insert(mock, callback)
      })
    }

    async.series(insertTasks, error => {
      if (error) {
        return done(error)
      }
      clientsDb.findAll(postGetMulti)
    })

    function postGetMulti (error, clients) {
      if (error) {
        return done(error)
      }
      try {
        expect(clients).not.toBeNull()
        expect(clients.length).toBe(insertCount)
        const names = new Set(clients.map(client => client.name))
        expect(names.size).toBe(insertCount)
        const name = Array.from(names)[0]
        expect(name.includes(baseName)).toBeTruthy()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should fail on insert same name twice', done => {
    const mock = getMockClient()

    async.series([
      callback => clientsDb.insert(mock, callback),
      callback => clientsDb.insert(mock, callback)
    ], error => {
      try {
        expect(error).not.toBeNull()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('should delete one and just one by id', done => {
    // insert 2
    // delete frist one
    // fail on get the deleted one
    // success on get the second one

    const mock = getMockClient()
    let firstId = null
    let secondId = null

    mock.name = mock.name + '1'
    clientsDb.insert(mock, (err, insertedId) => {
      firstId = insertedId
      postInsert(err, insertSecond)
    })

    function insertSecond () {
      mock.name = mock.name + '2'
      clientsDb.insert(mock, (err, insertedId) => {
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
      clientsDb.deleteById(firstId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      clientsDb.findAll(postGetMulti)
    }

    function postGetMulti (error, list) {
      if (error) {
        return done(error)
      }
      try {
        expect(list).not.toBeNull()
        expect(list.length).toBe(1)
        expect(list[0].id).toBe(secondId)
        expect(list[0].birthDate).toBe(mock.birthDate)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should update existing client, and only specific client', done => {
    const mock = getMockClient()
    let firstId = null
    let secondId = null

    const updateMock = getMockClient()
    updateMock.birthDate = '2020-11-01'
    updateMock.contact.email = '123@gmail.co'
    updateMock.name = 'Moshe2'
    updateMock.isActive = !updateMock.isActive

    mock.name = mock.name + '1'
    clientsDb.insert(mock, (err, insertedId) => {
      firstId = insertedId
      postInsert(err, insertSecond)
    })

    function insertSecond () {
      mock.name = mock.name + '2'
      clientsDb.insert(mock, (err, insertedId) => {
        secondId = insertedId
        postInsert(err, updateFirstClient)
      })
    }

    function postInsert (err, next) {
      if (err) {
        return done(err)
      }
      next()
    }

    function updateFirstClient () {
      clientsDb.update({ ...updateMock, id: firstId }, postUpdate)
    }

    function postUpdate (err) {
      if (err) {
        return done(err)
      }
      clientsDb.findAll(postGetMulti)
    }

    function postGetMulti (error, list) {
      if (error) {
        return done(error)
      }
      try {
        expect(list).not.toBeNull()
        expect(list.length).toBe(2)
        const untouched = list.find(client => client.id === secondId)
        const updated = list.find(client => client.id === firstId)

        expect(untouched && updated).toBeTruthy()
        // first 1 does not affected - and on the go, validate findall returned props sanity.
        expect(untouched.name).toBe(mock.name)
        expect(untouched.birthDate).toBe(mock.birthDate)
        expect(untouched.isActive).toBe(mock.isActive)
        expect(untouched.sex.id).toBe(mock.sex.id)
        expect(untouched.contact.email).toBe(mock.contact.email)
        expect(untouched.contact.phoneNumber).toBe(mock.contact.phoneNumber)
        // second one has updated
        expect(updated.name).toBe(updateMock.name)
        expect(updated.birthDate).toBe(updateMock.birthDate)
        expect(updated.isActive).toBe(updateMock.isActive)
        expect(updated.sex.id).toBe(updateMock.sex.id)
        expect(updated.contact.email).toBe(updateMock.contact.email)
        expect(updated.contact.phoneNumber).toBe(updateMock.contact.phoneNumber)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
