const { NOT_FOUND_ERROR } = require('../error-types')

module.exports = function makeGetMeasure ({ measuresDb, validatePositiveInteger, parseDbMeasure }) {
  return function getMeasure (id, callback) {
    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(idError)
    }

    measuresDb.findById(moderatedId, postFindById)

    function postFindById (err, foundMeasure) {
      if (err) {
        return callback(err)
      } else if (!foundMeasure) {
        const cbError = {
          message: 'measure with the selected id can not be found',
          type: NOT_FOUND_ERROR
        }
        return callback(cbError)
      } else {
        return callback(null, parseDbMeasure(foundMeasure))
      }
    }
  }
}
