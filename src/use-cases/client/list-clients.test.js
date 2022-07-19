const resetDatabase = require('../../../db/sqlite/index')
const makeClientsDb = require('../../data-access/sqlite/client/clients-db')
const makeSexTypesDb = require('../../data-access/sqlite/sex-type/sex-types-db')
const makeAddClient = require('./add-client')
const makeListClients = require('./list-clients')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const async = require('async')
const parseDbClient = require('../../data-access/sqlite/client/parse-db-client')
const getMockClient = require('../../models/client/fixture')
const { ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('listClients', () => {
  const clientsDb = makeClientsDb({ dbConnector, parseDbClient, errorHandler })
  const sexTypesDb = makeSexTypesDb({ dbConnector, errorHandler })

  const addClient = makeAddClient({ clientsDb, sexTypesDb, ModelConstructionError, InvalidRationalValueError })
  const listClients = makeListClients({ clientsDb })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  // should return arr
  it('should return array type', done => {
    listClients((err, emptyList) => {
      if (err) {
        return done(err)
      }
      try {
        expect(Array.isArray(emptyList)).toBe(true)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should return empty array if nothing were added yet', done => {
    listClients((err, emptyList) => {
      if (err) {
        return done(err)
      }
      try {
        expect(emptyList.length).toBe(0)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get same count of clients as added', done => {
    const insertCount = Math.floor(Math.random() * 4) + 2// 2:5
    const mock = getMockClient()
    const baseName = mock.name

    const insertTasks = []
    for (let i = 0; i < insertCount; i++) {
      insertTasks.push((callback) => {
        mock.name = `${baseName}_${i}`
        addClient(mock, callback)
      })
    }

    async.series(insertTasks, error => {
      if (error) {
        return done(error)
      }
      listClients(postListClients)
    })

    function postListClients (error, clients) {
      if (error) {
        return done(error)
      }
      try {
        expect(error).toBeNull()
        expect(clients).not.toBeNull()
        expect(clients.length).toBe(insertCount)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
