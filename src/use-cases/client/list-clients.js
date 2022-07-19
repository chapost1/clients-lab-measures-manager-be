module.exports = function makeListClients ({ clientsDb }) {
  return function listClients (callback) {
    clientsDb.findAll(postFindAll)

    function postFindAll (err, clients) {
      return callback(
        err,
        clients
      )
    }
  }
}
