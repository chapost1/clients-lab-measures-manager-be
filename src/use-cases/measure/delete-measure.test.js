const resetDatabase = require('../../../db/sqlite/index')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresValuesTypesDb = require('../../data-access/sqlite/measure-value-type/measures-values-types-db')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeDeleteMeasure = require('./delete-measure')
const makeAddMeasure = require('./add-measure')
const makeListMeasures = require('./list-measures')
const makeAddMeasureCategory = require('../measure-category/add-measure-category')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const { NOT_FOUND_ERROR } = require('../error-types')
const getMockMeasure = require('../../models/measure/fixture')
const parseDbMeasure = require('./parse-db-measure')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('deleteMeasure', () => {
  const measuresDb = makeMeasuresDb({ dbConnector })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })
  const measuresValuesTypesDb = makeMeasuresValuesTypesDb({ dbConnector })

  const deleteMeasure = makeDeleteMeasure({ measuresDb, validatePositiveInteger })
  const addMeasure = makeAddMeasure({ measuresDb, measuresCategoriesDb, measuresValuesTypesDb })
  const listMeasures = makeListMeasures({ measuresDb, parseDbMeasure })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    deleteMeasure(null, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(Error)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if invalid id', done => {
    deleteMeasure('a1', err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(Error)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if id is valid but does not exists', done => {
    deleteMeasure(1, err => { // nothing exists by default
      try {
        expect(err).not.toBeFalsy()
        expect(err.type).toBe(NOT_FOUND_ERROR)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should delete one if exists and only one', done => {
    const mockMeasure = getMockMeasure()
    let firstMeasureId = null
    let secondMeasureId = null

    addMeasureCategory({ name: 'category-name' }, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mockMeasure.categoryId = addedMeasureCategoryId

      insertFirstMeasure()
    }

    function insertFirstMeasure () {
      mockMeasure.name = mockMeasure.name + '1'
      addMeasure(mockMeasure, (err, insertedId) => {
        firstMeasureId = insertedId
        postInsertMeasure(err, insertSecondMeasure)
      })
    }

    function insertSecondMeasure () {
      mockMeasure.name = mockMeasure.name + '2'
      addMeasure(mockMeasure, (err, insertedId) => {
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
      deleteMeasure(firstMeasureId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      listMeasures(postGetMulti)
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
