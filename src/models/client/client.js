module.exports = function buildMakeClient ({ validatePositiveInteger, validateStringInput, validateEmail, validateDate, validateBoolean }) {
  return function makeClient ({
    id = null,
    name,
    birthDate,
    isActive,
    sexId,
    email,
    address
  } = {}) {
    const { error: nameError, moderated: moderatedName } =
      validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: birthDateError, moderated: moderatedBirthDateAsString } =
      validateStringInput({ string: birthDate, fieldName: 'birthDate', isRequired: true })
    if (birthDateError) {
      return { error: birthDateError, data: null }
    }

    const { error: emailStrError, moderated: moderatedEmailAsString } =
      validateStringInput({ string: email, fieldName: 'email', isRequired: true })
    if (emailStrError) {
      return { error: emailStrError, data: null }
    }

    const { error: addressError, moderated: moderatedAddress } =
      validateStringInput({ string: address, fieldName: 'address', isRequired: true })
    if (addressError) {
      return { error: addressError, data: null }
    }

    const { error: sexIdError, moderated: moderatedSexId } =
      validatePositiveInteger({ integer: sexId, fieldName: 'sexId', isRequired: true })
    if (sexIdError) {
      return { error: sexIdError, data: null }
    }

    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: moderatedId }
    }

    const { error: emailError, moderated: moderatedEmail } =
    validateEmail({ email: moderatedEmailAsString, fieldName: 'email', isRequired: true })
    if (emailError) {
      return { error: emailError, data: null }
    }

    const { error: dateError, moderated: moderatedBirthDate } =
    validateDate({ date: moderatedBirthDateAsString, fieldName: 'birthDate', isRequired: true })
    if (dateError) {
      return { error: dateError, data: null }
    }

    const { error: isActiveError, moderated: moderatedIsActive } =
    validateBoolean({ bool: isActive, fieldName: 'isActive', isRequired: true })
    if (isActiveError) {
      return { error: isActiveError, data: null }
    }

    return {
      error: null,
      data: Object.freeze({
        id: moderatedId,
        name: moderatedName,
        birthDate: moderatedBirthDate,
        isActive: moderatedIsActive,
        sexId: moderatedSexId,
        email: moderatedEmail,
        address: moderatedAddress
      })
    }
  }
}
