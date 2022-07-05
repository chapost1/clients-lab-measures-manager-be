const setupDb = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeGetMeasureCategory = require('./get-measure-category')
const makeAddMeasureCategory = require('./add-measure-category')
const { validatePositiveInteger } = require('../../models/validators')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const { NOT_FOUND_ERROR } = require('../error-types')
const getMockMeasureCategory = require('../../models/measure-category/fixture')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const getMeasureCategory = makeGetMeasureCategory({ measuresCategoriesDb, validatePositiveInteger })
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

  it('should fail if no id', done => {
    getMeasureCategory(null, err => {
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
    getMeasureCategory(1.2, err => {
      try {
        expect(err).not.toBeFalsy()
        expect(err).toBeInstanceOf(Error)
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
        expect(err.type).toBe(NOT_FOUND_ERROR)
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
