module.exports = function makeListMeasures ({ measuresDb }) {
  return function listMeasures (callback) {
    measuresDb.findAll(postFindAll)

    function postFindAll (err, measures) {
      return callback(
        err,
        measures
      )
    }
  }
}
