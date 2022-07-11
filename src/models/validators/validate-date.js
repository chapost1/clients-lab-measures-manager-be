module.exports = function makeMakeValidateDate ({ missingRequiredFieldError, invalidFieldError }) {
  return function makeValidateDate ({ isDate }) {
    return function validateDate ({ date, fieldName = 'status', isRequired = true } = {}) {
      const isFound = date !== undefined && date !== null
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), moderated: null }
        } else {
          return { error: null, moderated: null }
        }
      }

      if (typeof date !== 'string') {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      if (!isDate(date)) {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      return { error: null, moderated: date }
    }
  }
}
