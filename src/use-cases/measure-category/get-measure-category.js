module.exports = function makeGetMeasureCategory ({ measuresCategoriesDb, validatePositiveInteger, NotFoundError, ValueError }) {
  return function getMeasureCategory (id, callback) {
    const { error: idError, proper: properId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: true })
    if (idError) {
      return callback(new ValueError(idError.message))
    }

    measuresCategoriesDb.findById(properId, postFindById)

    function postFindById (err, foundMeasureCategory) {
      if (err) {
        return callback(err)
      } else if (!foundMeasureCategory) {
        return callback(new NotFoundError('measure category with the selected id can not be found'))
      } else {
        return callback(null, foundMeasureCategory)
      }
    }
  }
}
