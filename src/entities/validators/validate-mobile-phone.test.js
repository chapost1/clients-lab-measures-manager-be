const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')
const makeMakeValidateMobilePhone = require('./validate-mobile-phone')
const makeMakeValidateStringInput = require('./validate-string-input')
const isMobilePhone = require('./is-mobile-phone')
const { ValueError } = require('../../common/custom-error-types')
const htmlSanitizer = require('../html-sanitizer')

const fieldName = 'testFieldName'

describe('validateMobilePhone', () => {
  let stringValidatorIsCalled = false

  beforeEach(() => {
    stringValidatorIsCalled = false
  })

  const makeValidateStringInput = makeMakeValidateStringInput({ missingRequiredFieldError, invalidFieldError, emptyFieldError })
  const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

  const makeValidateMobilePhone = makeMakeValidateMobilePhone({ invalidFieldError })

  const spiedValidateStringInput = (...args) => {
    stringValidatorIsCalled = true
    return validateStringInput.call(this, ...args)
  }
  const validateMobilePhone = makeValidateMobilePhone({ isMobilePhone, validateStringInput: spiedValidateStringInput })

  it('should return error if required field is missing', () => {
    const response = validateMobilePhone({ phoneNumber: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validateMobilePhone({ phoneNumber: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.proper).toBeNull()
  })

  it('should return error if not phoneNumber (integer)', () => {
    const response = validateMobilePhone({ phoneNumber: 32432, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if not phoneNumber (invalid string)', () => {
    const response = validateMobilePhone({ phoneNumber: 'some string', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if phoneNumber is too short', () => {
    const response = validateMobilePhone({ phoneNumber: '3323', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return not error if phoneNumber as string', () => {
    const response = validateMobilePhone({ phoneNumber: '+972592013982', fieldName, isRequired: true })
    expect(response.error).toBeNull()
  })

  it('should return proper date if string as bool', () => {
    const phoneNumber = '+972592013982'
    const response = validateMobilePhone({ phoneNumber, fieldName, isRequired: true })
    expect(response.error).toBeNull()
    expect(response.proper).toBe(phoneNumber)
  })

  it('should string validator to be called', () => {
    const phoneNumber = '+972592013982'
    validateMobilePhone({ phoneNumber, fieldName, isRequired: true })
    expect(stringValidatorIsCalled).toBe(true)
  })
})
