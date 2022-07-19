const { invalidFieldError, missingRequiredFieldError } = require('../errors')
const makeMakeValidateBoolean = require('./validate-boolean')
const isBoolean = require('validator/lib/isBoolean')
const { ValueError } = require('../../common/custom-error-types')

const fieldName = 'testFieldName'

describe('validateBoolean', () => {
  const makeValidateBoolean = makeMakeValidateBoolean({ missingRequiredFieldError, invalidFieldError })
  const validateBoolean = makeValidateBoolean({ isBoolean })

  it('should return error if required field is missing', () => {
    const response = validateBoolean({ bool: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validateBoolean({ bool: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.proper).toBeNull()
  })

  it('should return error if not bool (integer)', () => {
    const response = validateBoolean({ bool: 1, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if not bool (invalid string)', () => {
    const response = validateBoolean({ bool: 'blah', fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return not error if bool as string', () => {
    const response = validateBoolean({ bool: 'true', fieldName, isRequired: true })
    expect(response.error).toBeNull()
  })

  it('should return proper Bool if string as bool', () => {
    const response = validateBoolean({ bool: 'false', fieldName, isRequired: true })
    expect(response.error).toBeNull()
    expect(response.proper).toBe(false)
  })
})
