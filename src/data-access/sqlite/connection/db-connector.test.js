const makeCloseDbConnections = require('./close-db-connections')
const makeMakeDbConnector = require('./db-connector')

const dbPath = process.env.SQLITE_DB_PATH

describe('dbConnector.connectDb', () => {
  const connections = {}

  const closeDbConnections = makeCloseDbConnections({ connections })
  const makeDbConnector = makeMakeDbConnector({ connections })

  beforeEach(done => {
    closeDbConnections(() => {
      Object.keys(connections).forEach(key => delete connections[key])
      done()
    })
  })

  it('should add property of dbPath to the connections', done => {
    const dbConnector = makeDbConnector({ dbPath })
    try {
      expect(connections[dbPath]).toBeUndefined()
    } catch (e) {
      done(e)
    }
    dbConnector.connectDb((err, db) => {
      if (err) {
        return done(err)
      }
      try {
        expect(connections[dbPath] === db).toBeTruthy()
        return done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('should add db with open state as true', done => {
    const dbConnector = makeDbConnector({ dbPath })
    try {
      expect(connections[dbPath]).toBeUndefined()
    } catch (e) {
      done(e)
    }
    dbConnector.connectDb((err, db) => {
      if (err) {
        return done(err)
      }
      try {
        expect(db.open).toBeTruthy()
        done()
      } catch (e) {
        done(e)
      }
    })
  })
})
