const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const setupDb = require('../../../db/sqlite/index')
const makeAddMeasureCategory = require('./add-measure-category')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const { MODEL_CONSTRUCTION_ERROR } = require('../error-types')
const getMockMeasureCategory = require('../../models/measure-category/fixture')
const { USER_END_DB_ERROR_CONFLICT } = require('../../data-access/error-types')
const fs = require('fs')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('makeAddMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb })

  beforeEach(done => {
    closeDbConnections(reCreateFile)

    function reCreateFile () {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath)
      }
      setupDb({ dbPath }, callback)
    }

    function callback (err) {
      if (err) {
        console.log(`failed to init sqlite db using path: ${dbPath}`)
        return process.exit()
      }
      done()
    }
  })

  it('should fail create model if no param', done => {
    addMeasureCategory(undefined, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if empty object, no name', done => {
    addMeasureCategory({}, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if has name but not string', done => {
    addMeasureCategory({ name: 1 }, (err, addedMeasureCategoryId) => {
      try {
        expect(addedMeasureCategoryId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should create model if object is valid', done => {
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

  it('should fail if category name is already exists model if object is valid', done => {
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
        expect(err.type).toBe(USER_END_DB_ERROR_CONFLICT)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
