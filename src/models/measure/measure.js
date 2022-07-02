module.exports = function buildMakeMeasure ({ validatePositiveInteger, validateStringInput }) {
  return function makeMeasure ({
    name,
    categoryId,
    valueTypeId,
    id = null
  } = {}) {
    const { error: nameError, moderated: moderatedName } =
    validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    const { error: categoryIdError, moderated: moderatedCategoryId } =
    validatePositiveInteger({ integer: categoryId, fieldName: 'categoryId', isRequired: true })
    if (categoryIdError) {
      return { error: categoryIdError, data: moderatedCategoryId }
    }

    const { error: valueTypeIdError, moderated: moderatedValueTypeId } =
    validatePositiveInteger({ integer: valueTypeId, fieldName: 'valueTypeId', isRequired: true })
    if (valueTypeIdError) {
      return { error: valueTypeIdError, data: moderatedValueTypeId }
    }

    const { error: idError, moderated: moderatedId } = validatePositiveInteger({ integer: id, fieldName: 'id', isRequired: false })
    if (idError) {
      return { error: idError, data: moderatedId }
    }

    return {
      error: null,
      data: Object.freeze({
        name: moderatedName,
        categoryId: moderatedCategoryId,
        valueTypeId: moderatedValueTypeId,
        id: moderatedId
      })
    }
  }
}
