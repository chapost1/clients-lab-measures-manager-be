module.exports = function makeMakeValidateMobilePhone ({ missingRequiredFieldError, invalidFieldError }) {
  return function makeValidateMobilePhone ({ isMobilePhone }) {
    return function validateMobilePhone ({ phoneNumber, fieldName = 'phoneNumber', isRequired = true } = {}) {
      const isFound = phoneNumber !== undefined && phoneNumber !== null
      if (!isFound) {
        if (isRequired) {
          return { error: missingRequiredFieldError(fieldName), moderated: null }
        } else {
          return { error: null, moderated: null }
        }
      }

      if (typeof phoneNumber !== 'string') {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      if (!isMobilePhone(phoneNumber)) {
        return { error: invalidFieldError(fieldName), moderated: null }
      }

      return { error: null, moderated: phoneNumber }
    }
  }
}
