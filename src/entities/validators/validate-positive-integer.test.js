const makeValidatePositiveInteger = require('./validate-positive-integer')
const { ValueError } = require('../../common/custom-error-types')
const { invalidFieldError, missingRequiredFieldError } = require('../errors')

const fieldName = 'testFieldName'

describe('validatePositiveInteger', () => {
  const validatePositiveInteger = makeValidatePositiveInteger({ invalidFieldError, missingRequiredFieldError })

  it('should return error if required field is missing', () => {
    const response = validatePositiveInteger({ integer: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error, if field is not required and missing', () => {
    const response = validatePositiveInteger({ integer: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.proper).toBeNull()
  })

  it('should return error if not moderatable to a number', () => {
    const response = validatePositiveInteger({ integer: 'text', fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if float', () => {
    const response = validatePositiveInteger({ integer: 1.8, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if NaN', () => {
    const response = validatePositiveInteger({ integer: NaN, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if negative integer', () => {
    const response = validatePositiveInteger({ integer: -2, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if negative integer (string)', () => {
    const response = validatePositiveInteger({ integer: '-2', fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(ValueError)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should not return error if actual positive integer', () => {
    const res = validatePositiveInteger({ integer: 2, fieldName, isRequired: true })
    expect(res.error).toBeNull()
    expect(res.proper).toBe(2)
  })

  it('should not return error if string and parsable to actual positive integer', () => {
    const res = validatePositiveInteger({ integer: '5', fieldName: 'testField', isRequired: false })
    expect(res.error).toBeNull()
    expect(res.proper).toBe(5)
  })
})
