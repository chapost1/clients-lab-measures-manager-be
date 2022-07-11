// module.exports = function getMockClient () {
//   return {
//     id: null,
//     name: 'Roy Sabah',
//     birthDate: '2011-08-04',
//     isActive: true,
//     sexId: 1,
//     email: 'foo@bar.com',
//     address: 'Modi\'in, Shmuel Hanavi 14'
//   }
// }

// module.exports = function buildMakeClient ({ validatePositiveInteger, validateStringInput, isEmail, isDate, isBoolean }) {
//   return function makeClient ({
//     id = null,
//     name,
//     birthDate,
//     isActive = false,
//     sexId,
//     email,
//     address
//   } = {}) {
//     const { error: nameError, moderated: moderatedName } =
//       validateStringInput({ string: name, fieldName: 'name', isRequired: true })
//     if (nameError) {
//       return { error: nameError, data: null }
//     }

//     const { error: birthDateError, moderated: moderatedBirthDate } =
//       validateStringInput({ string: birthDate, fieldName: 'birthDate', isRequired: true })
//     if (birthDateError) {
//       return { error: birthDateError, data: null }
//     }

//     const { error: emailError, moderated: moderatedEmail } =
//       validateStringInput({ string: email, fieldName: 'email', isRequired: true })
//     if (emailError) {
//       return { error: emailError, data: null }
//     }

//     const { error: addressError, moderated: moderatedAddress } =
//       validateStringInput({ string: address, fieldName: 'address', isRequired: true })
//     if (addressError) {
//       return { error: addressError, data: null }
//     }

//     const { error: sexIdError, moderated: moderatedSexId } =
//       validatePositiveInteger({ integer: sexId, fieldName: 'sexId', isRequired: true })
//     if (sexIdError) {
//       return { error: sexIdError, data: null }
//     }

//     const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
//     if (idError) {
//       return { error: idError, data: moderatedId }
//     }

//     if (!isEmail(email)) {
//       return { error: emailError, data: null }
//     }

//     return {
//       error: null,
//       data: Object.freeze({
//         name: moderatedName,
//         categoryId: moderatedCategoryId,
//         valueTypeId: moderatedValueTypeId,
//         id: moderatedId
//       })
//     }
//   }
// }
