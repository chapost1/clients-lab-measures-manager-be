module.exports = function makeMakeValidateEmail ({ missingRequiredFieldError, invalidFieldError }) {
  return function makeValidateEmail ({ isEmail }) {
    return function validateEmail ({ email, fieldName = 'email', isRequired = true } = {}) {
      const isFound = email !== undefined && email !== null
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), moderated: null }
        } else {
          return { error: null, moderated: null }
        }
      }

      if (typeof email !== 'string') {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      if (!isEmail(email)) {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      return { error: null, moderated: email }
    }
  }
}
