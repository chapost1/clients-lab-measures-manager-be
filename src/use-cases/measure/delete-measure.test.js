const setupDb = require('../../../db/sqlite/index')
const makeMeasuresDb = require('../../data-access/sqlite/measure/measures-db')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeDeleteMeasure = require('./delete-measure')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const { NOT_FOUND_ERROR } = require('../error-types')
const getMockMeasure = require('../../models/measure/fixture')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('deleteMeasure', () => {
  const measuresDb = makeMeasuresDb({ dbConnector })
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const deleteMeasure = makeDeleteMeasure({ measuresDb, validatePositiveInteger })

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

    measuresCategoriesDb.insert({ name: 'category-name' }, postMeasureCategoryInsert)

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
