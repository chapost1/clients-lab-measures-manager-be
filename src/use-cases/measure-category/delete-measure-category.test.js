const setupDb = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeDeleteMeasureCategory = require('./delete-measure-category')
const { validatePositiveInteger } = require('../../models/validators')
const makeAddMeasureCategory = require('./add-measure-category')
const makeListMeasuresCategories = require('./list-measures-categories')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const { NOT_FOUND_ERROR } = require('../error-types')
const getMockMeasureCategory = require('../../models/measure-category/fixture')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('deleteMeasureCategory', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const deleteMeasureCategory = makeDeleteMeasureCategory({ measuresCategoriesDb, validatePositiveInteger })
  const addMeasureCategory = makeAddMeasureCategory({ measuresCategoriesDb })
  const listMeasuresCategories = makeListMeasuresCategories({ measuresCategoriesDb })

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
    deleteMeasureCategory(null, err => {
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
    deleteMeasureCategory('rewfsd', err => {
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
    deleteMeasureCategory(1, err => { // nothing exists by default
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
