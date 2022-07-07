const makeCloseDbConnections = require('./close-db-connections')
const makeMakeDbConnector = require('./db-connector')

const dbPath = process.env.SQLITE_DB_PATH

describe('closeDbConnections', () => {
  const connections = {}

  const closeDbConnections = makeCloseDbConnections({ connections })
  const makeDbConnector = makeMakeDbConnector({ connections })

  beforeEach(() => {
    Object.keys(connections).forEach(key => delete connections[key])
  })

  it('should not throw if no connections to close', done => {
    closeDbConnections((err) => {
      if (err) {
        return done(err)
      }
      done()
    })
  })

  it('should change open flag to false, on close connection', done => {
    const dbConnector = makeDbConnector({ dbPath })

    let dbRef = null

    dbConnector.connectDb(postDbConnection)

    function postDbConnection (err, db) {
      if (err) {
        return done(err)
      }
      try {
        expect(connections[dbPath] === db).toBeTruthy()
        dbRef = db
        closeDbConnections(postClose)
      } catch (e) {
        done(e)
      }
    }

    function postClose (err) {
      if (err) {
        return done(err)
      }

      try {
        expect(dbRef.open).toBeFalsy()
        expect(connections[dbPath]).toBeUndefined()
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
