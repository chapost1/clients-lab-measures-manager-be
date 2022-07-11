module.exports = function makeValidatePositiveInteger ({ invalidFieldError, missingRequiredFieldError }) {
  return function validatePositiveInteger ({ integer, fieldName = 'id', isRequired = true } = {}) {
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
}
