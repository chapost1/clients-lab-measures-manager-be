const { NOT_FOUND_ERROR } = require('../error-types')

module.exports = function makeGetMeasureCategory ({ measuresCategoriesDb, validatePositiveInteger }) {
  return function getMeasureCategory (id, callback) {
    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(idError)
    }

    measuresCategoriesDb.findById(moderatedId, postFindById)

    function postFindById (err, foundMeasureCategory) {
      if (err) {
        return callback(err)
      } else if (!foundMeasureCategory) {
        const cbError = {
          message: 'measure category with the selected id can not be found',
          type: NOT_FOUND_ERROR
        }
        return callback(cbError)
      } else {
        return callback(null, foundMeasureCategory)
      }
    }
  }
}
