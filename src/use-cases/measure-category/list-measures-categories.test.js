const setupDb = require('../../../db/sqlite/index')
const makeMeasuresCategoriesDb = require('../../data-access/sqlite/measure-category/measures-categories-db')
const makeListMeasuresCategories = require('./list-measures-categories')
const makeAddMeasureCategory = require('./add-measure-category')
const { makeDbConnector, closeDbConnections } = require('../../data-access/sqlite/index')
const fs = require('fs')
const series = require('async/series')
const getMockMeasureCategory = require('../../models/measure-category/fixture')

const dbPath = process.env.SQLITE_DB_PATH

const dbConnector = makeDbConnector({ dbPath })

describe('getMeasure', () => {
  const measuresCategoriesDb = makeMeasuresCategoriesDb({ dbConnector })

  const listMeasuresCategories = makeListMeasuresCategories({ measuresCategoriesDb })
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

  // should return arr (nothing added)
  it('should return array type', done => {
    listMeasuresCategories((err, emptyList) => {
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

  it('should return empty array if no measures categories are added', done => {
    listMeasuresCategories((err, emptyList) => {
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

  it('should get same count of measures categories as added', done => {
    const insertCount = Math.floor(Math.random() * 4) + 2// 2:5
    const mockMeasureCategory = getMockMeasureCategory()
    const baseName = mockMeasureCategory.name

    const insertTasks = []
    for (let i = 0; i < insertCount; i++) {
      insertTasks.push((callback) => {
        mockMeasureCategory.name = `${baseName}_${i}`
        addMeasureCategory(mockMeasureCategory, callback)
      })
    }

    series(insertTasks, error => {
      if (error) {
        return done(error)
      }
      listMeasuresCategories(postListOperation)
    })

    function postListOperation (error, list) {
      if (error) {
        return done(error)
      }
      try {
        expect(error).toBeNull()
        expect(list).not.toBeNull()
        expect(list.length).toBe(insertCount)
        done()
      } catch (error) {
        done(error)
      }
    }
  })
})
