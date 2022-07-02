const invalidFieldError = fieldName => {
  return new Error(`invalid ${fieldName}`)
}

const emptyFieldError = fieldName => {
  return new Error(`field ${fieldName} cannot be empty`)
}

const missingRequiredFieldError = fieldName => {
  return new Error(`${fieldName} field is required`)
}

module.exports = Object.freeze({
  invalidFieldError,
  emptyFieldError,
  missingRequiredFieldError
})
