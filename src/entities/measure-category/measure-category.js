module.exports = function buildMeasureCategory ({ validatePositiveInteger, validateStringInput }) {
  return function makeMeasureCategory ({
    name,
    id = null
  } = {}) {
    const { error: nameError, proper: properName } =
    validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: idError, proper: properId } =
    validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: null }
    }

    return {
      error: null,
      data: Object.freeze({
        name: properName,
        id: properId
      })
    }
  }
}
