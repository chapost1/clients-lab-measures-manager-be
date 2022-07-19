const makeMeasure = require('./index')
const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')
const getMockMeasure = require('./fixture')
const { ValueError } = require('../../common/custom-error-types')

describe('makeMeasure', () => {
  describe('param edge cases', () => {
    it('should not throw if object is valid', () => {
      expect(() => makeMeasure(getMockMeasure())).not.toThrow()
    })

    it('should not throw if empty param', () => {
      expect(() => makeMeasure()).not.toThrow()
    })

    it('should return an error if empty param', () => {
      const { error } = makeMeasure()
      expect(error).toBeInstanceOf(ValueError)
    })

    it('should not return error if valid param', () => {
      const { error } = makeMeasure(getMockMeasure())
      expect(error).toBeNull()
    })
  })

  describe('returned measure structure', () => {
    it('should return same structure of measure on valid param', () => {
      const { data: actual } = makeMeasure(getMockMeasure())
      const expected = getMockMeasure()
      expect(actual).toMatchObject(expected)
    })

    it('should return same structure on valid param and not omit id', () => {
      const mock = getMockMeasure()
      mock.id = 1
      const { data: actual } = makeMeasure(mock)
      const expected = mock
      expect(actual).toMatchObject(expected)
    })
  })

  describe('name field', () => {
    it('should return error if name is missing', () => {
      const { error } = makeMeasure({ category: { id: 1 }, valueType: { id: 1 } })
      expect(error).toMatchObject(missingRequiredFieldError('name'))
    })

    it('should return error if name is not a string', () => {
      const { error } = makeMeasure({ name: 1, category: { id: 1 }, valueType: { id: 1 } })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should return error if name length is 0', () => {
      const { error } = makeMeasure({ name: '', category: { id: 1 }, valueType: { id: 1 } })
      expect(error).toMatchObject(emptyFieldError('name'))
    })

    it('should return error if name is html tag', () => {
      const { error } = makeMeasure({ name: '<div></div>', category: { id: 1 }, valueType: { id: 1 } })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should escape html from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasure({ name: `<div>${validText}</div>`, category: { id: 1 }, valueType: { id: 1 } })
      expect(measure.name).toBe(validText)
    })

    it('should escape script html tags from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasure({ name: `<script>alert('nasty security attack')</script>${validText}`, category: { id: 1 }, valueType: { id: 1 } })
      expect(measure.name).toBe(validText)
    })
  })

  describe('category.id field', () => {
    it('should return error if category is missing', () => {
      const { error } = makeMeasure({ name: 'dummy', valueType: { id: 1 } })
      expect(error).toMatchObject(missingRequiredFieldError('category'))
    })

    it('should return error if category id is missing', () => {
      const { error } = makeMeasure({ name: 'dummy', valueType: { id: 1 }, category: {} })
      expect(error).toMatchObject(missingRequiredFieldError('category.id'))
    })

    it('should return error if not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 'str' }, valueType: { id: 1 } })
      expect(error).toMatchObject(invalidFieldError('category.id'))
    })

    it('should return error if negative', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: -1 }, valueType: { id: 1 } })
      expect(error).toMatchObject(invalidFieldError('category.id'))
    })

    it('should return error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 2.4 }, valueType: { id: 1 } })
      expect(error).toMatchObject(invalidFieldError('category.id'))
    })
  })

  describe('valueType.id field', () => {
    it('should return error if valueType is missing', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 } })
      expect(error).toMatchObject(missingRequiredFieldError('valueType'))
    })

    it('should return error if valueType.id is missing', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 }, valueType: {} })
      expect(error).toMatchObject(missingRequiredFieldError('valueType.id'))
    })

    it('should return error if not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 }, valueType: { id: 'str' } })
      expect(error).toMatchObject(invalidFieldError('valueType.id'))
    })

    it('should return error if negative', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 2 }, valueType: { id: -2 } })
      expect(error).toMatchObject(invalidFieldError('valueType.id'))
    })

    it('should return error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 2 }, valueType: { id: 1.5 } })
      expect(error).toMatchObject(invalidFieldError('valueType.id'))
    })
  })

  describe('id field (if exists)', () => {
    it('should return an error if id is not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 }, valueType: { id: 1 }, id: 'a' })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if negative numbrer', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 }, valueType: { id: 1 }, id: -2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', category: { id: 1 }, valueType: { id: 1 }, id: 1.2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })
  })
})
