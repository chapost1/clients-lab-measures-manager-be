module.exports = function makeValidatePositiveInteger ({ invalidFieldError, missingRequiredFieldError }) {
  return function validatePositiveInteger ({ integer, fieldName = 'id', isRequired = true } = {}) {
    const isFound = integer !== null && integer !== undefined
    if (!isFound) {
      if (isRequired) {
        return { error: missingRequiredFieldError(fieldName), proper: null }
      } else {
        return { error: null, proper: null }
      }
    }

    if (integer === 0) {
      return { error: invalidFieldError(fieldName), proper: null }
    }

    integer = Number(integer)

    if (typeof integer !== 'number' || isNaN(integer)) {
      return { error: invalidFieldError(fieldName), proper: null }
    }

    const isPositiveInt = Number.isInteger(integer) && integer > 0

    if (!isPositiveInt) {
      return { error: invalidFieldError(fieldName), proper: null }
    }

    return { error: null, proper: integer }
  }
}
