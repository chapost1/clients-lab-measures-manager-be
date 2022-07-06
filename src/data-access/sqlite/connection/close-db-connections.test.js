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

  it('should change db open flag to false', done => {
    const dbConnector = makeDbConnector({ dbPath })

    let dbRef = null

    dbConnector.connectDb(postDbConnection)

    function postDbConnection (err, db) {
      if (err) {
        return done(err)
      }
      try {
        expect(connections[dbPath] === db).toBeTruthy()
        expect(db.open).toBeFalsy()
        dbRef = db

        changeOpenStateToTruthy()
      } catch (e) {
        done(e)
      }
    }

    function changeOpenStateToTruthy () {
      dbRef.run('select 1', (err) => {
        if (err) {
          return done(err)
        }
        try {
          expect(dbRef.open).toBeTruthy()
          closeDbConnections(postClose)
        } catch (e) {
          done(e)
        }
      })
    }

    function postClose (err) {
      if (err) {
        return done(err)
      }

      try {
        expect(dbRef.open).toBeFalsy()
        done()
      } catch (e) {
        done(e)
      }
    }
  })

  it('should not return error even if db connections is not open', done => {
    const dbConnector = makeDbConnector({ dbPath })

    dbConnector.connectDb(postDbConnection)

    function postDbConnection (err, db) {
      if (err) {
        return done(err)
      }
      try {
        expect(connections[dbPath] === db).toBeTruthy()

        db.close(error => {
          if (error) {
            // didn't close appropriately earlier
            return done(err)
          }
          closeDbConnections(postClose)
        })
      } catch (e) {
        done(e)
      }
    }

    function postClose (err) {
      if (err) {
        return done(err)
      }

      try {
        expect(err).toBeFalsy()
        done()
      } catch (e) {
        done(e)
      }
    }
  })
})
