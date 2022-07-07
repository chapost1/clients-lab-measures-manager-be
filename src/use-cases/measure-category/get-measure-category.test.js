const resetDatabase = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeGetMeasureCategory = require('./get-measure-category')
const makeAddMeasureCategory = require('./add-measure-category')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const getMockMeasureCategory = require('../../models/measure-category/fixture')
const errorHandler = require('../../data-access/sqlite/error-handler/index')
const { NotFoundError, ValueError, ModelConstructionError } = require('../../common/custom-error-types')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector, errorHandler })

  const getMeasureCategory = makeGetMeasureCategory({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb, ModelConstructionError })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should fail if no id', done => {
    getMeasureCategory(null, err => {
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
    getMeasureCategory(1.2, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(ValueError)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get not found error, if ask for nn existing item', done => {
    // nothing on db at start
    getMeasureCategory(1, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.message).toBe('measure category with the selected id can not be found')
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should get same measure catrgory as inserted', done => {
    // insert
    const mockMeasureCategory = getMockMeasureCategory()
    let insertedId = null
    addMeasureCategory(mockMeasureCategory, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (err, addedMeasureCategoryId) {
      if (err) {
        return done(err)
      }

      insertedId = addedMeasureCategoryId

      getMeasureCategory(insertedId, postGetMeasureCategory)
    }

    function postGetMeasureCategory (err, item) {
      try {
        expect(err).toBeFalsy()
        expect(item.id).toBe(insertedId)
        expect(item.name).toBe(mockMeasureCategory.name)
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
