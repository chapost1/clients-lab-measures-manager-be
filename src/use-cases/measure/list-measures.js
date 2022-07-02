module.exports = function makeListMeasures ({ measuresDb, parseDbMeasure }) {
  return function listMeasures (callback) {
    measuresDb.findAll(postFindAll)

    function postFindAll (err, measures) {
      return callback(
        err,
        measures.map(measure => parseDbMeasure(measure))
      )
    }
  }
}
