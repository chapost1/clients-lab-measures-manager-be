module.exports = function makeGetMeasure ({ measuresDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function getMeasure (id, callback) {
    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    measuresDb.findById(moderatedId, postFindById)

    function postFindById (err, foundMeasure) {
      if (err) {
        return callback(err)
      } else if (!foundMeasure) {
        return callback(new NotFoundError('measure with the selected id can not be found'))
      } else {
        return callback(null, foundMeasure)
      }
    }
  }
}
