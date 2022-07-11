module.exports = function makeMakeValidateBoolean ({ missingRequiredFieldError, invalidFieldError }) {
  return function makeValidateBoolean ({ isBoolean }) {
    return function validateBoolean ({ bool, fieldName = 'status', isRequired = true } = {}) {
      const isFound = bool !== undefined && bool !== null
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), moderated: null }
        } else {
          return { error: null, moderated: null }
        }
      }

      if (typeof bool !== 'string' && typeof bool !== 'boolean') {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      if (!isBoolean(bool)) {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      return { error: null, moderated: JSON.parse(bool) }
    }
  }
}
