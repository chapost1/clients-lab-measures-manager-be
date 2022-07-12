module.exports = function makeMakeValidateMobilePhone ({ invalidFieldError }) {
  return function makeValidateMobilePhone ({ isMobilePhone, validateStringInput }) {
    return function validateMobilePhone ({ phoneNumber, fieldName = 'phoneNumber', isRequired = true } = {}) {
      const { error: phoneStrError, proper: properString } =
    validateStringInput({ string: phoneNumber, fieldName, isRequired })
      if (phoneStrError) {
        return { error: phoneStrError, proper: null }
      }

      if (!isRequired && !properString) {
        return { error: null, proper: null }
      }

      if (!isMobilePhone(properString)) {
        return { error: invalidFieldError(fieldName), proper: null }
      }

      return { error: null, proper: properString }
    }
  }
}
