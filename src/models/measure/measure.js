const { missingRequiredFieldError } = require('../errors')

module.exports = function buildMakeMeasure ({ validatePositiveInteger, validateStringInput }) {
  return function makeMeasure ({
    name,
    category,
    valueType,
    id = null
  } = {}) {
    const { error: nameError, proper: properName } =
    validateStringInput({ string: name, fieldName: 'name', isRequired: true })
    if (nameError) {
      return { error: nameError, data: null }
    }

    if (!category && typeof category !== 'object') {
      return { error: missingRequiredFieldError('category'), data: null }
    }
    const { error: categoryIdError, proper: properCategoryId } =
    validatePositiveInteger({ integer: category.id, fieldName: 'category.id', isRequired: true })
    if (categoryIdError) {
      return { error: categoryIdError, data: properCategoryId }
    }

    if (!valueType && typeof valueType !== 'object') {
      return { error: missingRequiredFieldError('valueType'), data: null }
    }
    const { error: valueTypeIdError, proper: properValueTypeId } =
    validatePositiveInteger({ integer: valueType.id, fieldName: 'valueType.id', isRequired: true })
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
        id: properId,
        name: properName,
        category: {
          id: properCategoryId
        },
        valueType: {
          id: properValueTypeId
        }
      })
    }
  }
}
