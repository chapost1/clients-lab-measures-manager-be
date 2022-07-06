const { makeDbConnector, closeDbConnections } = require('../../src/data-access/sqlite/index')
const waterfall = require('async/waterfall')

function createSchema ({ dbPath } = { }, mainCallback) {
  if (!dbPath) {
    return mainCallback(Error('createSchema: missing dbPath'))
  }
  const postDbConnection = (err, db) => {
    if (err) {
      return mainCallback(err)
    }

    console.log('Setting up database...')

    waterfall([
      callback => createMeasuresValuesTypesTable(db, callback),
      callback => createMeasuresCategoriesTable(db, callback),
      callback => createMeasuresTable(db, callback),
      callback => createSexTable(db, callback),
      callback => createMeasuresNormTable(db, callback),
      callback => createClientsTable(db, callback),
      callback => createClientsKeyValuePairsTable(db, callback),
      callback => createClientsMeasuresTable(db, callback)
    ], err => {
      if (err) {
        console.log('Database setup has been failed...')
        console.log(`ERR: ${err}`)
      } else {
        console.log('Database setup complete...')
      }
      closeDbConnections(() => mainCallback(err))
    })
  }

  console.log('Conntectiong to database...')
  console.log(`db path: ${dbPath}`)
  const dbConnector = makeDbConnector({ dbPath })
  dbConnector.connectDb(postDbConnection)
}

function createMeasuresValuesTypesTable (db, callback) {
  console.log('createMeasuresValuesTypesTable')
  const sql =
    `CREATE TABLE measures_values_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`
  db.run(sql, [], callback)
}

function createMeasuresCategoriesTable (db, callback) {
  console.log('createMeasuresCategoriesTable')
  const sql =
      `CREATE TABLE measures_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        )`
  db.run(sql, [], callback)
}

function createMeasuresTable (db, callback) {
  console.log('createMeasuresTable')
  const sql =
      `CREATE TABLE measures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        category_id INTEGER,
        value_type_id INTEGER,
        FOREIGN KEY (value_type_id)
          REFERENCES measures_values_types (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION,
        FOREIGN KEY (category_id)
          REFERENCES measures_categories (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )`
  db.run(sql, [], callback)
}

function createSexTable (db, callback) {
  console.log('createSexTable')
  const sql =
    `CREATE TABLE sex (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`
  db.run(sql, [], callback)
}

function createMeasuresNormTable (db, callback) {
  console.log('createMeasuresNormTable')
  const sql =
      `CREATE TABLE measures_norms (
        measure_id INTEGER NOT NULL,
        min_age TINYINT NOT NULL,
        max_age TINYINT NOT NULL,
        sex_id INTEGER NOT NULL,
        weight REAL,
        value REAL NOT NULL,
        FOREIGN KEY (measure_id)
          REFERENCES measures (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION,
        FOREIGN KEY (sex_id)
          REFERENCES sex (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )`
  db.run(sql, [], callback)
}

function createClientsTable (db, callback) {
  console.log('createClientsTable')
  const sql =
      `CREATE TABLE clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        birth_date DATE NOT NULL,
        name TEXT NOT NULL UNIQUE,
        is_active BOOLEAN NOT NULL,
        sex_id INTEGER NOT NULL,
        email TEXT,
        phone_number TEXT,
        address TEXT,
        FOREIGN KEY (sex_id)
          REFERENCES sex (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )`
  db.run(sql, [], callback)
}

function createClientsKeyValuePairsTable (db, callback) {
  console.log('createClientsKeyValuePairsTable')
  const sql =
      `CREATE TABLE clients_key_value_pairs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        FOREIGN KEY (client_id)
          REFERENCES clients (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )`
  db.run(sql, [], callback)
}

function createClientsMeasuresTable (db, callback) {
  console.log('createClientsMeasuresTable')
  const sql =
      `CREATE TABLE clients_measures (
        measure_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        date DATE NOT NULL,
        value REAL NOT NULL,
        FOREIGN KEY (measure_id)
          REFERENCES measures (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION,
        FOREIGN KEY (client_id)
          REFERENCES clients (id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )`
  db.run(sql, [], callback)
}

module.exports = createSchema
