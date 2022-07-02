const { validatePositiveInteger, makeValidateStringInput } = require('./validators')
const { htmlSanitizer } = require('./utils')
const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('./errors')

const fieldName = 'testFieldName'

describe('validatePositiveInteger', () => {
  it('should return error if required field is missing', () => {
    const response = validatePositiveInteger({ integer: null, fieldName, isRequired: true })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
  })

  it('should not return error not field is required and missing', () => {
    const response = validatePositiveInteger({ integer: null, fieldName, isRequired: false })
    expect(response.error).toBeNull()
    expect(response.moderated).toBeNull()
  })

  it('should return error if not moderatable to a number', () => {
    const response = validatePositiveInteger({ integer: 'text', fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if float', () => {
    const response = validatePositiveInteger({ integer: 1.8, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if NaN', () => {
    const response = validatePositiveInteger({ integer: NaN, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if negative integer', () => {
    const response = validatePositiveInteger({ integer: -2, fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should return error if negative integer (string)', () => {
    const response = validatePositiveInteger({ integer: '-2', fieldName, isRequired: false })
    expect(response.error).toBeInstanceOf(Error)
    expect(response.error).toMatchObject(invalidFieldError(fieldName))
  })

  it('should not return error if actual positive integer', () => {
    const res = validatePositiveInteger({ integer: 2, fieldName, isRequired: true })
    expect(res.error).toBeNull()
    expect(res.moderated).toBe(2)
  })

  it('should not return error if string and parsable to actual positive integer', () => {
    const res = validatePositiveInteger({ integer: '5', fieldName: 'testField', isRequired: false })
    expect(res.error).toBeNull()
    expect(res.moderated).toBe(5)
  })
})

describe('validateStringInput', () => {
  describe('general functionality', () => {
    const validateStringInput = makeValidateStringInput({ sanitizer: text => text })// some dummy sanitizer
    it('should return error if required field is missing', () => {
      const response = validateStringInput({ string: null, fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(missingRequiredFieldError(fieldName))
    })

    it('should not return error not field is required and missing', () => {
      const response = validateStringInput({ string: null, fieldName, isRequired: false })
      expect(response.error).toBeNull()
      expect(response.moderated).toBeNull()
    })

    it('should return error if not string (integer)', () => {
      const response = validateStringInput({ string: 1, fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(invalidFieldError(fieldName))
    })

    it('should return error if not string (float)', () => {
      const response = validateStringInput({ string: 1.6, fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(invalidFieldError(fieldName))
    })

    it('should return error if not string (NaN)', () => {
      const response = validateStringInput({ string: NaN, fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(invalidFieldError(fieldName))
    })

    it('should return error if not string (list of chars)', () => {
      const response = validateStringInput({ string: ['c', 'h', 'a', 'r', 's'], fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(invalidFieldError(fieldName))
    })

    it('should return error if empty string', () => {
      const response = validateStringInput({ string: '', fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(emptyFieldError(fieldName))
    })

    it('should return error if empty string', () => {
      const response = validateStringInput({ string: '', fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(emptyFieldError(fieldName))
    })
  })
  describe('html sanitizer', () => {
    const validateStringInput = makeValidateStringInput({ sanitizer: htmlSanitizer })

    it('should escape html tag, if not empty, to return no error', () => {
      const internalText = 'text'
      const response = validateStringInput({ string: `<div>${internalText}</div>`, fieldName, isRequired: true })
      expect(response.error).toBeNull()
      expect(response.moderated).toBe(internalText)
    })

    it('should return error if text contains only html', () => {
      const response = validateStringInput({ string: '<div></div>', fieldName, isRequired: true })
      expect(response.error).toBeInstanceOf(Error)
      expect(response.error).toMatchObject(invalidFieldError(fieldName))
    })

    it('should escape script html tags and not return error if not empty after sanitization', () => {
      const sideCarText = 'text'
      const response = validateStringInput({ string: `<script>alert(1)</script>${sideCarText}`, fieldName, isRequired: true })
      expect(response.error).toBeNull()
      expect(response.moderated).toBe(sideCarText)
    })
  })
})
