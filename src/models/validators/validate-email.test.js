const { invalidFieldError, missingRequiredFieldError } = require('../errors')
const makeMakeValidateEmail = require('./validate-email')
const isEmail = require('validator/lib/isEmail')
const { ValueError } = require('../../common/custom-error-types')

const fieldName = 'testFieldName'

describe('validateEmail', () => {
  const makeValidateEmail = makeMakeValidateEmail({ missingRequiredFieldError, invalidFieldError })
  const validateEmail = makeValidateEmail({ isEmail })

  it('should return error if required field is missing', () => {
    const response = validateEmail({ email: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validateEmail({ email: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.moderated).toBeNull()
  })

  it('should return error if not email (integer)', () => {
    const response = validateEmail({ email: 32432, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if not email (invalid string)', () => {
    const response = validateEmail({ email: 'some string', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if wrong email format', () => {
    const response = validateEmail({ email: 'some.com', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if wrong email format', () => {
    const response = validateEmail({ email: 'wwowowowo@@a', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should not return error if actual email', () => {
    const response = validateEmail({ email: 'foo@bar.com', fieldName, isRequired: true })
    expect(response.error).toBeNull()
  })

  it('should return moderated email if string as bool', () => {
    const email = 'foo@bar.com'
    const response = validateEmail({ email, fieldName, isRequired: true })
    expect(response.error).toBeNull()
    expect(response.moderated).toBe(email)
  })
})
