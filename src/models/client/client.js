const { missingRequiredFieldError } = require('../errors')

module.exports = function buildMakeClient ({
  validatePositiveInteger,
  validateStringInput,
  validateEmail,
  validateDate,
  validateBoolean,
  validateMobilePhone
}) {
  return function makeClient ({
    id = null,
    name,
    birthDate,
    isActive,
    sex,
    contact
  } = {}) {
    const { error: nameError, proper: properName } =
      validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: dateError, proper: properBirthDate } =
    validateDate({ date: birthDate, fieldName: 'birthDate', isRequired: true })
    if (dateError) {
      return { error: dateError, data: null }
    }

    if (!contact && typeof contact !== 'object') {
      return { error: missingRequiredFieldError('contact'), data: null }
    }
    const { error: emailError, proper: properEmail } =
    validateEmail({ email: contact.email, fieldName: 'contact.email', isRequired: true })
    if (emailError) {
      return { error: emailError, data: null }
    }

    const { error: phoneNumberError, proper: properPhoneNumber } =
    validateMobilePhone({ phoneNumber: contact.phoneNumber, fieldName: 'contact.phoneNumber', isRequired: true })
    if (phoneNumberError) {
      return { error: phoneNumberError, data: null }
    }

    const { error: addressError, proper: properAddress } =
      validateStringInput({ string: contact.address, fieldName: 'contact.address', isRequired: true })
    if (addressError) {
      return { error: addressError, data: null }
    }

    if (!sex && typeof sex !== 'object') {
      return { error: missingRequiredFieldError('sex'), data: null }
    }
    const { error: sexIdError, proper: properSexId } =
      validatePositiveInteger({ integer: sex.id, fieldName: 'sex.id', isRequired: true })
    if (sexIdError) {
      return { error: sexIdError, data: null }
    }

    const { error: idError, proper: properId } =
    validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: properId }
    }

    const { error: isActiveError, proper: properIsActive } =
    validateBoolean({ bool: isActive, fieldName: 'isActive', isRequired: true })
    if (isActiveError) {
      return { error: isActiveError, data: null }
    }

    return {
      error: null,
      data: Object.freeze({
        id: properId,
        name: properName,
        birthDate: properBirthDate,
        isActive: properIsActive,
        sex: {
          id: properSexId
        },
        contact: {
          email: properEmail,
          address: properAddress,
          phoneNumber: properPhoneNumber
        }
      })
    }
  }
}
