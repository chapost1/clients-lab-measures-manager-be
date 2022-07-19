const resetDatabase = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeDeleteMeasureCategory = require('./delete-measure-category')
const { validatePositiveInteger } = require('../../entities/validators')
const makeAddMeasureCategory = require('./add-measure-category')
const makeListMeasuresCategories = require('./list-measures-categories')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const getMockMeasureCategory = require('../../entities/measure-category/fixture')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const { NotFoundError, ValueError, EntityConstructionError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('deleteMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })

  const deleteMeasureCategory = makeDeleteMeasureCategory({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, EntityConstructionError })
  const listMeasuresCategories = makeListMeasuresCategories({ measuresCategoriesDb })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    deleteMeasureCategory(null, err => {
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
    deleteMeasureCategory('rewfsd', err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ValueError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should fail if id is valid but does not exists', done => {
    deleteMeasureCategory(1, err => { // nothing exists by default
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should delete one if exists and only one', done => {
    const mock = getMockMeasureCategory()
    let firstId = null
    let secondId = null

    addMeasureCategory(mock, postFirstMeasureCategoryInsert)

    function postFirstMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      firstId = addedMeasureCategoryId
      mock.name = mock.name + 'suffix'

      addMeasureCategory(mock, postSecondMeasureCategoryInsert)
    }

    function postSecondMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }
      secondId = addedMeasureCategoryId

      deleteMeasureCategory(firstId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      listMeasuresCategories(postGetMulti)
    }

    function postGetMulti (error, list) {
      if (error) {
        return done(error)
      }
      try {
        expect(list).not.toBeNull()
        expect(list.length).toBe(1)
        expect(list[0].id).toBe(secondId)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
