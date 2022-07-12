const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')
const makeMakeValidateDate = require('./validate-date')
const isDate = require('validator/lib/isDate')
const makeMakeValidateStringInput = require('./validate-string-input')
const { ValueError } = require('../../common/custom-error-types')
const htmlSanitizer = require('../html-sanitizer')

const fieldName = 'testFieldName'

describe('validateDate', () => {
  let stringValidatorIsCalled = false

  beforeEach(() => {
    stringValidatorIsCalled = false
  })

  const makeValidateStringInput = makeMakeValidateStringInput({ missingRequiredFieldError, invalidFieldError, emptyFieldError })
  const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

  const makeValidateDate = makeMakeValidateDate({ invalidFieldError })

  const spiedValidateStringInput = (...args) => {
    stringValidatorIsCalled = true
    return validateStringInput.call(this, ...args)
  }
  const validateDate = makeValidateDate({ isDate, validateStringInput: spiedValidateStringInput })

  console.log(stringValidatorIsCalled)
  it('should return error if required field is missing', () => {
    const response = validateDate({ date: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validateDate({ date: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.proper).toBeNull()
  })

  it('should return error if not date (integer)', () => {
    const response = validateDate({ date: 32432, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if not date (invalid string)', () => {
    const response = validateDate({ date: 'some string', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if date as string with wrong days count', () => {
    const response = validateDate({ date: '2011-12-40', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return not error if date as string', () => {
    const response = validateDate({ date: '2011-12-08', fieldName, isRequired: true })
    expect(response.error).toBeNull()
  })

  it('should return proper date if string as bool', () => {
    const date = '2011-12-08'
    const response = validateDate({ date, fieldName, isRequired: true })
    expect(response.error).toBeNull()
    expect(response.proper).toBe(date)
  })

  it('should string validator to be called', () => {
    const date = '2011-12-08'
    validateDate({ date, fieldName, isRequired: true })
    expect(stringValidatorIsCalled).toBe(true)
  })
})
