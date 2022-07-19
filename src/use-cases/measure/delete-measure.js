const { MEASURE } = require('../../entities/entities-types')

module.exports = function makeDeleteMeasure ({ measuresDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function deleteMeasure (id, callback) {
    const { error: idError, proper: properId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    measuresDb.findById(properId, postFindById)

    function postFindById (err, foundMeasure) {
      if (err) {
        return callback(err)
      } else if (!foundMeasure) {
        return callback(new NotFoundError(`${MEASURE} with the selected id can not be found`))
      } else {
        measuresDb.deleteById(id, postDeleteById)
      }
    }

    function postDeleteById (err) {
      return callback(err)
    }
  }
}
