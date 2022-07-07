const resetDatabase = require('../../../db/sqlite/index')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/measures-values-types-db')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeGetMeasure = require('./get-measure')
const makeAddMeasure = require('./add-measure')
const makeAddMeasureCategory = require('../measure-category/add-measure-category')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const getMockMeasure = require('../../models/measure/fixture')
const parseDbMeasure = require('../../data-access/sqlite/measure/parse-db-measure')
const { NotFoundError, ValueError, ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getMeasure', () => {
  const measuresDb = makeMeasuresDb({ dbConnector, parseDbMeasure, errorHandler })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })
  const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector, errorHandler })

  const getMeasure = makeGetMeasure({ measuresDb, validatePositiveInteger, NotFoundError, ValueError })
  const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb, ModelConstructionError, InvalidRationalValueError })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, ModelConstructionError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    getMeasure(null, err => {
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
    getMeasure(1.2, err => {
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
    // no measures at start
    getMeasure(1, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.message).toBe('measure with the selected id can not be found')
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get same measure as inserted', done => {
    // insert
    const mockMeasure = getMockMeasure()
    const categoryName = 'test_category_name'
    let insertedMeasureId = null
    // let's insert some categoryId so we can use it
    addMeasureCategory({ name: categoryName }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (err, addedMeasureCategoryId) {
      if (err) {
        return done(err)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      addMeasure(mockMeasure, postMeasureInsert)
    }

    function postMeasureInsert (err, addedMeasureId) {
      if (err) {
        return done(err)
      }
      insertedMeasureId = addedMeasureId
      getMeasure(addedMeasureId, postGetMeasure)
    }

    function postGetMeasure (err, measure) {
      try {
        expect(err).toBeFalsy()
        expect(measure.id).toBe(insertedMeasureId)
        expect(measure.name).toBe(mockMeasure.name)
        expect(measure.categoryName).toBe(categoryName)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
