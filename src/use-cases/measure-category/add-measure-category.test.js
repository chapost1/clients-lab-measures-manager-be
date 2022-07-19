const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const resetDatabase = require('../../../db/sqlite/index')
const makeAddMeasureCategory = require('./add-measure-category')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const getMockMeasureCategory = require('../../entities/measure-category/fixture')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const { EntityConstructionError, DbConflictError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('makeAddMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })

  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, EntityConstructionError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail create entity if no param', done => {
    addMeasureCategory(undefined, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(EntityConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create entity if empty object, no name', done => {
    addMeasureCategory({}, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(EntityConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create entity if has name but not string', done => {
    addMeasureCategory({ name: 1 }, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(EntityConstructionError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should create entity if object is valid', done => {
    addMeasureCategory(getMockMeasureCategory(), (err, addedMeasureCategoryId) => {
      try {
        expect(err).toBeFalsy()
        expect(addedMeasureCategoryId).not.toBeFalsy()
        expect(addedMeasureCategoryId).toBe(1)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if category name is already exists entity, even if object is valid', done => {
    const mock = getMockMeasureCategory()

    addMeasureCategory(mock, postFirstInsert)

    function postFirstInsert (err) {
      if (err) {
        return done(err)
      }

      addMeasureCategory(mock, postSecondInsert)
    }

    function postSecondInsert (err, addedMeasureCategoryId) {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(DbConflictError)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
