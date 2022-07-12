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
    sexId,
    email,
    phoneNumber,
    address
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

    const { error: emailError, proper: properEmail } =
    validateEmail({ email, fieldName: 'email', isRequired: true })
    if (emailError) {
      return { error: emailError, data: null }
    }

    const { error: phoneNumberError, proper: properPhoneNumber } =
    validateMobilePhone({ phoneNumber, fieldName: 'phoneNumber', isRequired: true })
    if (phoneNumberError) {
      return { error: phoneNumberError, data: null }
    }

    const { error: addressError, proper: properAddress } =
      validateStringInput({ string: address, fieldName: 'address', isRequired: true })
    if (addressError) {
      return { error: addressError, data: null }
    }

    const { error: sexIdError, proper: properSexId } =
      validatePositiveInteger({ integer: sexId, fieldName: 'sexId', isRequired: true })
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
        sexId: properSexId,
        email: properEmail,
        address: properAddress,
        phoneNumber: properPhoneNumber
      })
    }
  }
}
