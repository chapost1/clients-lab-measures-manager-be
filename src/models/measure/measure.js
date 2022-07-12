module.exports = function buildMakeMeasure ({ validatePositiveInteger, validateStringInput }) {
  return function makeMeasure ({
    name,
    categoryId,
    valueTypeId,
    id = null
  } = {}) {
    const { error: nameError, proper: properName } =
    validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: categoryIdError, proper: properCategoryId } =
    validatePositiveInteger({ integer: categoryId, fieldName: 'categoryId', isRequired: true })
    if (categoryIdError) {
      return { error: categoryIdError, data: properCategoryId }
    }

    const { error: valueTypeIdError, proper: properValueTypeId } =
    validatePositiveInteger({ integer: valueTypeId, fieldName: 'valueTypeId', isRequired: true })
    if (valueTypeIdError) {
      return { error: valueTypeIdError, data: properValueTypeId }
    }

    const { error: idError, proper: properId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: properId }
    }

    return {
      error: null,
      data: Object.freeze({
        name: properName,
        categoryId: properCategoryId,
        valueTypeId: properValueTypeId,
        id: properId
      })
    }
  }
}
