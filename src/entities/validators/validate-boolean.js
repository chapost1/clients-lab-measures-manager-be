module.exports = function makeMakeValidateBoolean ({ missingRequiredFieldError, invalidFieldError }) {
  return function makeValidateBoolean ({ isBoolean }) {
    return function validateBoolean ({ bool, fieldName = 'status', isRequired = true } = {}) {
      const isFound = bool !== undefined && bool !== null
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), proper: null }
        } else {
          return { error: null, proper: null }
        }
      }

      if (typeof bool !== 'string' && typeof bool !== 'boolean') {
        return { error: invalidFieldError(fieldName), proper: null }
      }

      const stringifiedBool = bool.toString()

      if (!isBoolean(stringifiedBool)) {
        return { error: invalidFieldError(fieldName), proper: null }
      }
      const properBool = (stringifiedBool === 'true')
      return { error: null, proper: properBool }
    }
  }
}
