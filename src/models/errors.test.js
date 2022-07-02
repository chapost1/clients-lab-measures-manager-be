const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('./errors')

const fieldErrorsToTest = [
  {
    name: 'invalidFieldError',
    method: invalidFieldError,
    expectedFormat: fieldName => `invalid ${fieldName}`
  },
  {
    name: 'missingRequiredFieldError',
    method: missingRequiredFieldError,
    expectedFormat: fieldName => `${fieldName} field is required`
  },
  {
    name: 'emptyFieldError',
    method: emptyFieldError,
    expectedFormat: fieldName => `field ${fieldName} cannot be empty`
  }
]

const fieldName = 'some_dummy_field_name'

for (const fieldErorr of fieldErrorsToTest) {
  describe(fieldErorr.name, () => {
    it('should be instance of error', () => {
      expect(fieldErorr.method(fieldName)).toBeInstanceOf(Error)
    })

    it('should contain message which its format is as in the specs', () => {
      expect(fieldErorr.method(fieldName).message).toBe(fieldErorr.expectedFormat(fieldName))
    })
  })
}
