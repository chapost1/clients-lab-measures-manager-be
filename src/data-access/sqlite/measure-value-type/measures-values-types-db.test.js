const makeMeasuresValuesTypesDb = require('./measures-values-types-db')
const resetDatabase = require('../../../../db/sqlite/index')
const { makeDbConnector, closeDbConnections } = require('../index')
const errorHandler = require('../error-handler/index')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('measuresValuesTypesDb', () => {
  const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector, errorHandler })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should be able to find by id, one which is exists for sure', done => {
    const validValueById = 1// relies on the fact init populate default value types
    measuresValuesTypesDb.findById(validValueById, postFindById)

    function postFindById (error, found) {
      if (error) { // no error should be gotten
        return done(error)
      }

      try {
        expect(found).not.toBeNull()
        expect(found.id).toBe(validValueById)
        expect(found.name).not.toBeFalsy()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should not be able to find one with not exists id, and result should be undefined', done => {
    const invalidValueTypeId = 999999999
    measuresValuesTypesDb.findById(invalidValueTypeId, postFindById)

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
})
