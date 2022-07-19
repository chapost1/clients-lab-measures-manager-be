module.exports = function makeSexTypesDb ({ dbConnector }) {
  return Object.freeze({
    findById
  })

  function findById (id, callback) {
    const sql = 'SELECT id, name FROM sex_types WHERE id = ?'

    dbConnector.getSingle(sql, [id], callback)
  }
}
