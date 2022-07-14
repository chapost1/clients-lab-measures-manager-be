module.exports = function makeClientsDb ({ dbConnector, parseDbClient, errorHandler }) {
  return Object.freeze({
    insert,
    update,
    findById,
    findAll,
    deleteById
  })

  function findById (id, callback) {
    const sql =
      `SELECT clients.id, clients.name, clients.birth_date,
              clients.is_active, clients.email, clients.phone_number,
              clients.address, clients.sex_id, sex.name as sex_name
       FROM clients clients
       INNER JOIN sex sex ON (clients.sex_id = sex.id)
       WHERE clients.id = ?`

    dbConnector.getSingle(sql, [id], (err, client) => {
      if (err) {
        return callback(err)
      }

      if (client) {
        return callback(null, parseDbClient(client))
      }

      return callback(null, undefined)
    })
  }

  function findAll (callback) {
    const sql =
      `SELECT clients.id, clients.name, clients.birth_date,
      clients.is_active, clients.email, clients.phone_number,
      clients.address, clients.sex_id, sex.name as sex_name
      FROM clients clients
      INNER JOIN sex sex ON (clients.sex_id = sex.id)`

    dbConnector.getMulti(sql, [], (err, clients) => {
      if (err) {
        return callback(err)
      }
      return callback(null, clients.map(client => parseDbClient(client)))
    })
  }

  function insert ({
    name,
    birthDate,
    isActive,
    sex,
    contact
  } = {}, callback) {
    const sql =
      `INSERT INTO clients (name, birth_date, is_active, sex_id, email, phone_number, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`

    dbConnector.insert(
      sql,
      [name, birthDate, Number(isActive), sex.id, contact.email, contact.phoneNumber, contact.address],
      postInsert
    )
    function postInsert (err, info) {
      if (err) {
        return callback(errorHandler(err))
      }
      callback(null, info.lastInsertRowid)
    }
  }

  function update ({
    id,
    name,
    birthDate,
    isActive,
    sex,
    contact
  } = {}, callback) {
    const sql =
      `UPDATE clients
       SET name = ?, birth_date = ?, is_active = ?,
           sex_id = ?, email = ?, phone_number = ?,
           address = ?
       WHERE id = ?`

    dbConnector.execute(
      sql,
      [name, birthDate, Number(isActive), sex.id, contact.email, contact.phoneNumber, contact.address, id],
      callback
    )
  }

  function deleteById (id, callback) {
    const sql =
      `DELETE FROM clients
       WHERE id = ?`

    dbConnector.execute(sql, [id], callback)
  }
}
