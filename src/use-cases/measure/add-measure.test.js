const setupDb = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/measures-values-types-db')
const makeAddMeasure = require('./add-measure')
const makeAddMeasureCategory = require('../measure-category/add-measure-category')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const { MODEL_CONSTRUCTION_ERROR, INVALID_RATIONAL_VALUE_ERROR } = require('../error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('addMeasure', () => {
  const measuresDb = makeMeasuresDb({ dbConnector })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })
  const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector })

  const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb })
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

  it('should fail create model if no category id', done => {
    addMeasure({ name: 'hello', valueTypeId: 1 }, (err, addedMesureId) => {
      try {
        expect(addedMesureId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no value type id', done => {
    addMeasure({ name: 'hello', categoryId: 1 }, (err, addedMesureId) => {
      try {
        expect(addedMesureId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail create model if no name', done => {
    addMeasure({ valueTypeId: 1, categoryId: 1 }, (err, addedMesureId) => {
      try {
        expect(addedMesureId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(MODEL_CONSTRUCTION_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if category id does not exists', done => {
    // no categories have been inserted atm (assumption: before each -> clear all)
    addMeasure({ name: 'some-valid-name', valueTypeId: 1, categoryId: 1 }, (err, addedMesureId) => {
      try {
        expect(addedMesureId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(INVALID_RATIONAL_VALUE_ERROR)
        expect(err.message).toBe('measure category id does not exists')
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if value type id does not exists', done => {
    // let's insert some categoryId so we can use it (so we know it won't fail on invalid category id...)
    addMeasureCategory({ name: 'test' }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (err, addedMeasureCategoryId) {
      if (err) {
        return done(err)
      }

      // value type id is designed to be some finite number as this is a behavioral value, so numerous value will never be exist on setup
      const invalidValueTypeId = 999999999
      addMeasure({ name: 'some-valid-name', valueTypeId: invalidValueTypeId, categoryId: 1 }, postMeasureInsert)
    }

    function postMeasureInsert (err, addedMeasureId) {
      try {
        expect(addedMeasureId).toBeFalsy()
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(INVALID_RATIONAL_VALUE_ERROR)
        expect(err.message).toBe('measure value type id does not exists')
        done()
      } catch (e) {
        done(e)
      }
    }
  })

  it('should succeed if all values are valid and foreign keys ids are existing ones', done => {
    // let's insert some categoryId so we can use it
    addMeasureCategory({ name: 'test' }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (err, addedMeasureCategoryId) {
      if (err) {
        return done(err)
      }

      addMeasure({ name: 'some-valid-name', valueTypeId: 1, categoryId: addedMeasureCategoryId }, postMeasureInsert)
    }

    function postMeasureInsert (err, addedMeasureId) {
      try {
        expect(err).toBeFalsy()
        expect(addedMeasureId).not.toBeFalsy()
        expect(typeof addedMeasureId).toBe('number')
        expect(addedMeasureId).toBeGreaterThan(0)
        expect(addedMeasureId).toBe(1)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
