module.exports = function makeMeasuresCategoriesDb ({ dbConnector, errorHandler }) {
  return Object.freeze({
    insert,
    findById,
    findAll,
    deleteById
  })

  function findById (id, callback) {
    const sql = 'SELECT id, name FROM measures_categories WHERE id = ?'

    dbConnector.getSingle(sql, [id], callback)
  }

  function findAll (callback) {
    const sql = 'SELECT id, name FROM measures_categories'
    dbConnector.getMulti(sql, [], callback)
  }

  function insert ({ name } = {}, callback) {
    const sql =
              `INSERT INTO measures_categories (name)
              VALUES (?)`

    dbConnector.insert(sql, [name], postInsert)

    function postInsert (err) {
      if (err) {
        return callback(errorHandler(err))
      }
      callback(null, this.lastID)
    }
  }

  function deleteById (id, callback) {
    const sql =
    `DELETE FROM measures_categories
     WHERE id = ?`

    dbConnector.execute(sql, [id], callback)
  }
}
