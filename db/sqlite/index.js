const createSchema = require('./ddl')
const setupDefaultData = require('./dml')
const async = require('async')
const fs = require('fs')

function resetDatabase ({ dbPath } = { dbPath: process.env.SQLITE_DB_PATH }, mainCallback) {
  console.log('reset database...')
  try {
    const dbPathDir = process.env.SQLITE_DB_PATH_DIR
    if (dbPathDir) {
      if (!fs.existsSync(dbPathDir)) {
        fs.mkdirSync(dbPathDir, { recursive: true })
      }
    } else {
      return mainCallback('failed to init db dir, no db path dir var has been given')
    }
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath)
    }
  } catch (e) {
    return mainCallback(e)
  }

  async.waterfall([
    callback => createSchema({ dbPath }, callback),
    callback => setupDefaultData({ dbPath }, callback)
  ], err => {
    if (err) {
      console.log('resetDatabase has been failed...')
      console.log(`ERR: ${err}`)
    } else {
      console.log('resetDatabase complete...')
    }
    mainCallback(err)
  })
}

if (require.main === module) {
  // called directly
  resetDatabase(undefined, err => process.exit(Number(Boolean(err))))
} else {
  // required as a module
}

module.exports = resetDatabase
