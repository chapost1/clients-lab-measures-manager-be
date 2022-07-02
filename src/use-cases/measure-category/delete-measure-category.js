const { NOT_FOUND_ERROR } = require('../error-types')

module.exports = function makeDeleteMeasureCategory ({ measuresCategoriesDb, validatePositiveInteger }) {
  return function deleteMeasureCategory (id, callback) {
    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(idError)
    }

    measuresCategoriesDb.findById(moderatedId, postFindById)

    function postFindById (err, foundMeasure) {
      if (err) {
        return callback(err)
      } else if (!foundMeasure) {
        const cbError = {
          message: 'measure category with the selected id can not be found',
          type: NOT_FOUND_ERROR
        }
        return callback(cbError)
      } else {
        measuresCategoriesDb.deleteById(id, postDeleteById)
      }
    }

    function postDeleteById (err) {
      return callback(err)
    }
  }
}
