const { missingRequiredFieldError, invalidFieldError, emptyFieldError } = require('./errors')

const validatePositiveInteger = ({ integer, fieldName = 'id', isRequired = true } = {}) => {
  const isFound = integer !== null && integer !== undefined
  if (!isFound) {
    if (isRequired) {
      return { error: missingRequiredFieldError(fieldName), moderated: null }
    } else {
      return { error: null, moderated: null }
    }
  }

  if (integer === 0) {
    return { error: invalidFieldError(fieldName), moderated: null }
  }

  integer = Number(integer)

  if (typeof integer !== 'number' || isNaN(integer)) {
    return { error: invalidFieldError(fieldName), moderated: null }
  }

  const isPositiveInt = Number.isInteger(integer) && integer > 0

  if (!isPositiveInt) {
    return { error: invalidFieldError(fieldName), moderated: null }
  }

  return { error: null, moderated: integer }
}

const makeValidateStringInput = ({ sanitizer }) => {
  return function validateStringInput ({ string, fieldName = 'name', isRequired = true } = {}) {
    const isFound = string !== undefined && string !== null
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

module.exports = Object.freeze({
  validatePositiveInteger,
  makeValidateStringInput
})
