module.exports = function makeMakeValidateDate ({ invalidFieldError }) {
  return function makeValidateDate ({ isDate, validateStringInput }) {
    return function validateDate ({ date, fieldName = 'status', isRequired = true } = {}) {
      const { error: dateStrError, proper: properString } =
    validateStringInput({ string: date, fieldName, isRequired })
      if (dateStrError) {
        return { error: dateStrError, proper: null }
      }

      if (!isRequired && !properString) {
        return { error: null, proper: null }
      }

      if (!isDate(properString)) {
        return { error: invalidFieldError(fieldName), proper: null }
      }

      return { error: null, proper: properString }
    }
  }
}
