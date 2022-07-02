const errorHandler = require('../error-handling')

module.exports = function makeMeasuresDb ({ dbConnector }) {
  return Object.freeze({
    insert,
    findById,
    findAll,
    deleteById
  })

  function findById (id, callback) {
    const sql =
    `SELECT measures.id, measures.name, measures_categories.name as category_name, measures_values_types.name as value_type_name
     FROM measures measures
     INNER JOIN measures_categories measures_categories ON (measures.category_id = measures_categories.id)
     INNER JOIN measures_values_types measures_values_types ON (measures.value_type_id = measures_values_types.id)
     WHERE measures.id = ?`

    dbConnector.getSingle(sql, [id], callback)
  }

  function findAll (callback) {
    const sql =
    `SELECT measures.id, measures.name, measures_categories.name as category_name, measures_values_types.name as value_type_name
     FROM measures measures
     INNER JOIN measures_categories measures_categories ON (measures.category_id = measures_categories.id)
     INNER JOIN measures_values_types measures_values_types ON (measures.value_type_id = measures_values_types.id)`

    dbConnector.getMulti(sql, [], callback)
  }

  function insert ({ name, categoryId, valueTypeId } = {}, callback) {
    const sql =
    `INSERT INTO measures (name, category_id, value_type_id)
    VALUES (?, ?, ?)`

    dbConnector.insert(sql, [name, categoryId, valueTypeId], postInsert)
    function postInsert (err) {
      if (err) {
        return callback(errorHandler(err))
      }
      callback(null, this.lastID)
    }
  }

  function deleteById (id, callback) {
    const sql =
    `DELETE FROM measures
     WHERE id = ?`

    dbConnector.execute(sql, [id], callback)
  }
}
