module.exports = function buildMeasureCategory ({ validatePositiveInteger, validateStringInput }) {
  return function makeMeasureCategory ({
    name,
    id = null
  } = {}) {
    const { error: nameError, moderated: moderatedName } =
    validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: idError, moderated: moderatedId } =
    validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: null }
    }

    return {
      error: null,
      data: Object.freeze({
        name: moderatedName,
        id: moderatedId
      })
    }
  }
}
