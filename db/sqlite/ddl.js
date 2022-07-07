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
      callback => enableForeignKey(db, callback),
      callback => createMeasuresValuesTypesTable(db, callback),
      callback => createMeasuresCategoriesTable(db, callback),
      callback => createMeasuresTable(db, callback),
      callback => createTriggerToDeleteMeasureOnItsCategoryDelete(db, callback),
      callback => createTriggerToDeleteMeasureOnItsValueTypeDelete(db, callback),
      callback => createSexTable(db, callback),
      callback => createMeasuresNormTable(db, callback),
      callback => createTriggerToDeleteMeasureNormOnItsMeasureDelete(db, callback),
      callback => createTriggerToDeleteMeasureNormOnItsSexDelete(db, callback),
      callback => createClientsTable(db, callback),
      callback => createClientsKeyValuePairsTable(db, callback),
      callback => createTriggerToDeleteKeyValuePairOnItsClientDelete(db, callback),
      callback => createClientsMeasuresTable(db, callback),
      callback => createTriggerToDeleteClientMeasureOnItsClientDelete(db, callback),
      callback => createTriggerToDeleteClientMeasureOnItsMeasureDelete(db, callback)
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

function enableForeignKey (db, callback) {
  console.log('enableForeignKey')
  const sql =
    `PRAGMA foreign_keys = ON`
  db.run(sql, [], callback)
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

function createTriggerToDeleteMeasureOnItsCategoryDelete (db, callback) {
  console.log('createTriggerToDeleteMeasureOnItsCategoryDelete')
  const sql =
      `CREATE trigger delete_measures_with_deleted_categories_trigger
       BEFORE DELETE ON measures_categories
       FOR EACH ROW
       BEGIN
          DELETE FROM measures
          WHERE category_id = OLD.id;
       END;`
  db.run(sql, [], callback)
}

function createTriggerToDeleteMeasureOnItsValueTypeDelete (db, callback) {
  console.log('createTriggerToDeleteMeasureOnItsValueTypeDelete')
  const sql =
      `CREATE trigger delete_measures_with_deleted_value_types_trigger
       BEFORE DELETE ON measures_values_types
       FOR EACH ROW
       BEGIN
          DELETE FROM measures
          WHERE value_type_id = OLD.id;
       END;`
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

function createTriggerToDeleteMeasureNormOnItsMeasureDelete (db, callback) {
  console.log('createTriggerToDeleteMeasureNormOnItsMeasureDelete')
  const sql =
      `CREATE trigger delete_measures_norm_with_deleted_measure_trigger
       BEFORE DELETE ON measures
       FOR EACH ROW
       BEGIN
          DELETE FROM measures_norms
          WHERE measure_id = OLD.id;
       END;`
  db.run(sql, [], callback)
}

function createTriggerToDeleteMeasureNormOnItsSexDelete (db, callback) {
  console.log('createTriggerToDeleteMeasureNormOnItsSexDelete')
  const sql =
      `CREATE trigger delete_measures_norm_with_its_sex_deleted_trigger
       BEFORE DELETE ON sex
       FOR EACH ROW
       BEGIN
          DELETE FROM measures_norms
          WHERE sex_id = OLD.id;
       END;`
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

function createTriggerToDeleteKeyValuePairOnItsClientDelete (db, callback) {
  console.log('createTriggerToDeleteKeyValuePairOnItsClientDelete')
  const sql =
      `CREATE trigger delete_kv_pair_with_its_client_deleted_trigger
       BEFORE DELETE ON clients
       FOR EACH ROW
       BEGIN
          DELETE FROM clients_key_value_pairs
          WHERE client_id = OLD.id;
       END;`
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

function createTriggerToDeleteClientMeasureOnItsClientDelete (db, callback) {
  console.log('createTriggerToDeleteClientMeasureOnItsClientDelete')
  const sql =
      `CREATE trigger delete_client_measure_with_its_client_deleted_trigger
       BEFORE DELETE ON clients
       FOR EACH ROW
       BEGIN
          DELETE FROM clients_measures
          WHERE client_id = OLD.id;
       END;`
  db.run(sql, [], callback)
}

function createTriggerToDeleteClientMeasureOnItsMeasureDelete (db, callback) {
  console.log('createTriggerToDeleteClientMeasureOnItsMeasureDelete')
  const sql =
      `CREATE trigger delete_client_measure_with_its_measure_deleted_trigger
       BEFORE DELETE ON measures
       FOR EACH ROW
       BEGIN
          DELETE FROM clients_measures
          WHERE measure_id = OLD.id;
       END;`
  db.run(sql, [], callback)
}

module.exports = createSchema
