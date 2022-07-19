module.exports = function makeMakeValidateEmail ({ invalidFieldError }) {
  return function makeValidateEmail ({ isEmail, validateStringInput }) {
    return function validateEmail ({ email, fieldName = 'email', isRequired = true } = {}) {
      const { error: emailStrError, proper: properString } =
    validateStringInput({ string: email, fieldName, isRequired })
      if (emailStrError) {
        return { error: emailStrError, proper: null }
      }

      if (!isRequired && !properString) {
        return { error: null, proper: null }
      }

      if (!isEmail(properString)) {
        return { error: invalidFieldError(fieldName), proper: null }
      }

      return { error: null, proper: properString }
    }
  }
}
