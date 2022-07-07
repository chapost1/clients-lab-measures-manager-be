const makeMeasuresCategoriesDb = require('../measure-category/measures-categories-db')
const { validatePositiveInteger } = require('../../../models/validators')
const resetDatabase = require('../../../../db/sqlite/index')
const makeMeasuresDb = require('./measures-db')
const { makeDbConnector, closeDbConnections } = require('../index')
const async = require('async')
const parseDbMeasure = require('./parse-db-measure')
const errorHandler = require('../error-handler/index')
const getMockMeasure = require('../../../models/measure/fixture')
const getMockMeasureCategory = require('../../../models/measure-category/fixture')
const { DbApplicationError } = require('../../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('measuresDb', () => {
  const measuresDb = makeMeasuresDb({ dbConnector, parseDbMeasure, errorHandler })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if measure category does not exists', done => {
    function callback (error) {
      try {
        expect(error).not.toBeNull()
        expect(error).toBeInstanceOf(DbApplicationError)
        done()
      } catch (error) {
        done(error)
      }
    }
    measuresDb.insert(getMockMeasure(), callback)
  })

  it('should get measure id after have been inserted', done => {
    const mockMeasureCategory = getMockMeasureCategory()

    measuresCategoriesDb.insert(mockMeasureCategory, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error) {
      if (error) {
        return done(error)
      }

      measuresDb.insert(getMockMeasure(), postInsertMeasure)
    }

    function postInsertMeasure (error, addedMeasureId) {
      if (error) {
        return done(error)
      }
      try {
        expect(addedMeasureId).not.toBeNull()
        expect(validatePositiveInteger({ integer: addedMeasureId, isRequire: true }).error).toBeNull()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should be able to get measure after have been inserted', done => {
    let insertedId = null
    const mockMeasure = getMockMeasure()
    const measureCategoryName = 'dummyCategory'

    measuresCategoriesDb.insert({ name: measureCategoryName }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      measuresDb.insert(mockMeasure, postInsert)
    }

    function postInsert (error, addedMeasureId) {
      if (error) {
        return done(error)
      }
      insertedId = addedMeasureId

      measuresDb.findById(addedMeasureId, postGetSingle)
    }

    function postGetSingle (error, foundMeasure) {
      if (error) {
        return done(error)
      }
      try {
        expect(foundMeasure).not.toBeNull()
        expect(foundMeasure.id).toBe(insertedId)
        expect(foundMeasure.name).toBe(mockMeasure.name)
        expect(foundMeasure.categoryName).toBe(measureCategoryName)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should insert exact items count as expected', done => {
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

      async.series(insertTasks, error => {
        if (error) {
          return done(error)
        }
        measuresDb.findAll(postGetMulti)
      })
    }

    function postGetMulti (error, measures) {
      if (error) {
        return done(error)
      }
      try {
        expect(measures).not.toBeNull()
        expect(measures.length).toBe(insertCount)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should fail on insert same name twice', done => {
    const mockMeasure = getMockMeasure()
    const measureCategoryName = 'dummyCategory'

    measuresCategoriesDb.insert({ name: measureCategoryName }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      async.series([
        callback => measuresDb.insert(mockMeasure, callback),
        callback => measuresDb.insert(mockMeasure, callback)
      ], error => {
        try {
          expect(error).not.toBeNull()
          done()
        } catch (error) {
          done(error)
        }
      })
    }
  })

  it('should delete one and just one by id', done => {
    // insert 2
    // delete frist one
    // fail on get the deleted one
    // success on get the second one

    const mockMeasure = getMockMeasure()
    const measureCategoryName = 'dummyCategory'
    let firstMeasureId = null
    let secondMeasureId = null

    measuresCategoriesDb.insert({ name: measureCategoryName }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      insertFirstMeasure()
    }

    function insertFirstMeasure () {
      mockMeasure.name = mockMeasure.name + '1'
      measuresDb.insert(mockMeasure, (err, insertedId) => {
        firstMeasureId = insertedId
        postInsertMeasure(err, insertSecondMeasure)
      })
    }

    function insertSecondMeasure () {
      mockMeasure.name = mockMeasure.name + '2'
      measuresDb.insert(mockMeasure, (err, insertedId) => {
        secondMeasureId = insertedId
        postInsertMeasure(err, deleteFirstMeasure)
      })
    }

    function postInsertMeasure (err, next) {
      if (err) {
        return done(err)
      }
      next()
    }

    function deleteFirstMeasure () {
      measuresDb.deleteById(firstMeasureId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      measuresDb.findAll(postGetMulti)
    }

    function postGetMulti (error, measures) {
      if (error) {
        return done(error)
      }
      try {
        expect(measures).not.toBeNull()
        expect(measures.length).toBe(1)
        expect(measures[0].id).toBe(secondMeasureId)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
