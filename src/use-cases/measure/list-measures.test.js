const resetDatabase = require('../../../db/sqlite/index')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/measures-values-types-db')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeListMeasures = require('./list-measures')
const makeAddMeasure = require('./add-measure')
const makeAddMeasureCategory = require('../measure-category/add-measure-category')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const series = require('async/series')
const getMockMeasure = require('../../models/measure/fixture')
const parseDbMeasure = require('../../data-access/sqlite/measure/parse-db-measure')
const { ModelConstructionError, InvalidRationalValueError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('listMeasures', () => {
  const measuresDb = makeMeasuresDb({ dbConnector, parseDbMeasure, errorHandler })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })
  const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector, errorHandler })

  const listMeasures = makeListMeasures({ measuresDb })
  const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb, ModelConstructionError, InvalidRationalValueError })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, ModelConstructionError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  // should return arr (no measures added)
  it('should return array type', done => {
    listMeasures((err, emptyList) => {
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

  it('should return empty array if no measures are added', done => {
    listMeasures((err, emptyList) => {
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

  it('should get same count of measures as added', done => {
    const insertCount = Math.floor(Math.random() * 4) + 2// 2:5
    const mockMeasure = getMockMeasure()
    const baseMeasureName = mockMeasure.name
    const measureCategoryName = 'dummyCategory'

    addMeasureCategory({ name: measureCategoryName }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      insertMultiMeasures()
    }

    function insertMultiMeasures () {
      const insertTasks = []
      for (let i = 0; i < insertCount; i++) {
        insertTasks.push((callback) => {
          mockMeasure.name = `${baseMeasureName}_${i}`
          addMeasure(mockMeasure, callback)
        })
      }

      series(insertTasks, error => {
        if (error) {
          return done(error)
        }
        listMeasures(postListMeasures)
      })
    }

    function postListMeasures (error, measures) {
      if (error) {
        return done(error)
      }
      try {
        expect(error).toBeNull()
        expect(measures).not.toBeNull()
        expect(measures.length).toBe(insertCount)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
