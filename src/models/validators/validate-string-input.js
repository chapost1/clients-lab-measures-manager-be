module.exports = function makeMakeValidateStringInput ({ missingRequiredFieldError, invalidFieldError, emptyFieldError }) {
  return function makeValidateStringInput ({ sanitizer }) {
    return function validateStringInput ({ string, fieldName = 'name', isRequired = true } = {}) {
      const isFound = string !== null && string !== undefined
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), moderated: null }
        } else {
          return { error: null, moderated: null }
        }
      }

      if (typeof string !== 'string') {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      if (string.length < 1) {
        return { error: emptyFieldError(fieldName), moderated: null }
      }
      const sanitized = sanitizer(string)
      if (sanitized.length < 1) {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      return { error: null, moderated: sanitized }
    }
  }
}
