const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')
const makeMakeValidateEmail = require('./validate-email')
const isEmail = require('validator/lib/isEmail')
const makeMakeValidateStringInput = require('./validate-string-input')
const { ValueError } = require('../../common/custom-error-types')
const htmlSanitizer = require('../html-sanitizer')

const fieldName = 'testFieldName'

describe('validateEmail', () => {
  let stringValidatorIsCalled = false

  beforeEach(() => {
    stringValidatorIsCalled = false
  })

  const makeValidateStringInput = makeMakeValidateStringInput({ missingRequiredFieldError, invalidFieldError, emptyFieldError })
  const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })
  const makeValidateEmail = makeMakeValidateEmail({ invalidFieldError })

  const spiedValidateStringInput = (...args) => {
    stringValidatorIsCalled = true
    return validateStringInput.call(this, ...args)
  }
  const validateEmail = makeValidateEmail({ isEmail, validateStringInput: spiedValidateStringInput })

  it('should return error if required field is missing', () => {
    const response = validateEmail({ email: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validateEmail({ email: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.proper).toBeNull()
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

  it('should return proper email if string as bool', () => {
    const email = 'foo@bar.com'
    const response = validateEmail({ email, fieldName, isRequired: true })
    expect(response.error).toBeNull()
    expect(response.proper).toBe(email)
  })

  it('should string validator to be called', () => {
    const email = 'foo@bar.com'
    validateEmail({ email, fieldName, isRequired: true })
    expect(stringValidatorIsCalled).toBe(true)
  })
})
