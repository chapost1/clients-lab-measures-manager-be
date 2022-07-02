module.exports = function makeMeasuresValuesTypesDb ({ dbConnector }) {
  return Object.freeze({
    findById
  })

  function findById (id, callback) {
    const sql = 'SELECT id, name FROM measures_values_types WHERE id = ?'

    dbConnector.getSingle(sql, [id], callback)
  }
}
