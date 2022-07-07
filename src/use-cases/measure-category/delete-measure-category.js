module.exports = function makeDeleteMeasureCategory ({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function deleteMeasureCategory (id, callback) {
    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    measuresCategoriesDb.findById(moderatedId, postFindById)

    function postFindById (err, foundMeasure) {
      if (err) {
        return callback(err)
      } else if (!foundMeasure) {
        return callback(new NotFoundError('measure category with the selected id can not be found'))
      } else {
        measuresCategoriesDb.deleteById(id, postDeleteById)
      }
    }

    function postDeleteById (err) {
      return callback(err)
    }
  }
}
