const setupDb = require('../../../db/sqlite/index')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeListMeasures = require('./list-measures')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const series = require('async/series')
const getMockMeasure = require('../../models/measure/fixture')
const parseDbMeasure = require('./parse-db-measure')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getMeasure', () => {
  const measuresDb = makeMeasuresDb({ dbConnector })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const listMeasures = makeListMeasures({ measuresDb, parseDbMeasure })

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

    measuresCategoriesDb.insert({ name: measureCategoryName }, postMeasureCategoryInsert)

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
          measuresDb.insert(mockMeasure, callback)
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
