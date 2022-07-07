const { ValueError } = require('../common/custom-error-types')

const invalidFieldError = fieldName => {
  return new ValueError(`invalid ${fieldName}`)
}

const emptyFieldError = fieldName => {
  return new ValueError(`field ${fieldName} cannot be empty`)
}

const missingRequiredFieldError = fieldName => {
  return new ValueError(`${fieldName} field is required`)
}

module.exports = Object.freeze({
  invalidFieldError,
  emptyFieldError,
  missingRequiredFieldError
})
