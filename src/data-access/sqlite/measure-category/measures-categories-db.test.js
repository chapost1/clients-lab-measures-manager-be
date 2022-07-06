const makeMeasuresCategoriesDb = require('../measure-category/measures-categories-db')
const { validatePositiveInteger } = require('../../../models/validators')
const resetDatabase = require('../../../../db/sqlite/index')
const { makeDbConnector, closeDbConnections } = require('../index')
const series = require('async/series')
const getMockMeasureCategory = require('../../../models/measure-category/fixture')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('measuresCategoriesDb', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  beforeEach(done => {
    closeDbConnections(() => resetDatabase({ dbPath }, err => done(err)))
  })

  it('should get measure category id after have been inserted', done => {
    measuresCategoriesDb.insert(getMockMeasureCategory(), callback)
    function callback (error, addedId) {
      if (error) {
        return done(error)
      }
      try {
        expect(addedId).not.toBeNull()
        expect(validatePositiveInteger({ integer: addedId, isRequire: true }).error).toBeNull()
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should be able to get measure category after have been inserted', done => {
    const mock = getMockMeasureCategory()

    measuresCategoriesDb.insert(mock, postMeasureCategoryInsert)

    function postMeasureCategoryInsert (error, addedMeasureCategoryId) {
      if (error) {
        return done(error)
      }

      mock.id = addedMeasureCategoryId
      measuresCategoriesDb.findById(mock.id, postGetSingle)
    }

    function postGetSingle (error, found) {
      if (error) {
        return done(error)
      }
      try {
        expect(found).not.toBeNull()
        expect(found.id).toBe(mock.id)
        expect(found.name).toBe(mock.name)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should insert exact items count as expected', done => {
    const insertCount = Math.floor(Math.random() * 4) + 2// 2:5
    const mockMeasure = getMockMeasureCategory()
    const baseMeasureName = mockMeasure.name

    const insertTasks = []
    for (let i = 0; i < insertCount; i++) {
      insertTasks.push((callback) => {
        mockMeasure.name = `${baseMeasureName}_${i}`
        measuresCategoriesDb.insert(mockMeasure, callback)
      })
    }

    series(insertTasks, error => {
      if (error) {
        return done(error)
      }
      measuresCategoriesDb.findAll(postGetMulti)
    })

    function postGetMulti (error, list) {
      if (error) {
        return done(error)
      }
      try {
        expect(list).not.toBeNull()
        expect(list.length).toBe(insertCount)
        done()
      } catch (error) {
        done(error)
      }
    }
  })

  it('should fail on insert same name twice', done => {
    const mockMeasure = getMockMeasureCategory()

    series([
      callback => measuresCategoriesDb.insert(mockMeasure, callback),
      callback => measuresCategoriesDb.insert(mockMeasure, callback)
    ], error => {
      try {
        expect(error).not.toBeNull()
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('should delete one and just one by id', done => {
    // insert 2
    // delete frist one
    // fail on get the deleted one
    // success on get the second one

    const mockMeasure = getMockMeasureCategory()
    let firstId = null
    let secondId = null

    insertFirst()

    function insertFirst () {
      mockMeasure.name = mockMeasure.name + '1'
      measuresCategoriesDb.insert(mockMeasure, (err, insertedId) => {
        firstId = insertedId
        postInsert(err, insertSecond)
      })
    }

    function insertSecond () {
      mockMeasure.name = mockMeasure.name + '2'
      measuresCategoriesDb.insert(mockMeasure, (err, insertedId) => {
        secondId = insertedId
        postInsert(err, deleteFirst)
      })
    }

    function postInsert (err, next) {
      if (err) {
        return done(err)
      }
      next()
    }

    function deleteFirst () {
      measuresCategoriesDb.deleteById(firstId, postDelete)
    }

    function postDelete (err) {
      if (err) {
        return done(err)
      }
      measuresCategoriesDb.findAll(postGetMulti)
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
