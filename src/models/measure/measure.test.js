const makeMeasure = require('./index')
const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')

describe('makeMeasure', () => {
  const getMockMeasure = () => {
    return {
      name: 'Gripper',
      categoryId: 1,
      valueTypeId: 1,
      id: null
    }
  }

  describe('param edge cases', () => {
    it('should not throw if object is valid', () => {
      expect(() => makeMeasure(getMockMeasure())).not.toThrow()
    })

    it('should not throw if empty param', () => {
      expect(() => makeMeasure()).not.toThrow()
    })

    it('should return an error if empty param', () => {
      const { error } = makeMeasure()
      expect(error).toBeInstanceOf(Error)
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
      const { error } = makeMeasure({ categoryId: 1, valueTypeId: 1 })
      expect(error).toMatchObject(missingRequiredFieldError('name'))
    })

    it('should return error if name is not a string', () => {
      const { error } = makeMeasure({ name: 1, categoryId: 1, valueTypeId: 1 })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should return error if name length is 0', () => {
      const { error } = makeMeasure({ name: '', categoryId: 1, valueTypeId: 1 })
      expect(error).toMatchObject(emptyFieldError('name'))
    })

    it('should return error if name is html tag', () => {
      const { error } = makeMeasure({ name: '<div></div>', categoryId: 1, valueTypeId: 1 })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should escape html from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasure({ name: `<div>${validText}</div>`, categoryId: 1, valueTypeId: 1 })
      expect(measure.name).toBe(validText)
    })

    it('should escape script html tags from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasure({ name: `<script>alert('nasty security attack')</script>${validText}`, categoryId: 1, valueTypeId: 1 })
      expect(measure.name).toBe(validText)
    })
  })

  describe('categoryId field', () => {
    it('should return error if missing', () => {
      const { error } = makeMeasure({ name: 'dummy', valueTypeId: 1 })
      expect(error).toMatchObject(missingRequiredFieldError('categoryId'))
    })

    it('should return error if not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 'str', valueTypeId: 1 })
      expect(error).toMatchObject(invalidFieldError('categoryId'))
    })

    it('should return error if negative', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: -1, valueTypeId: 1 })
      expect(error).toMatchObject(invalidFieldError('categoryId'))
    })

    it('should return error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 2.4, valueTypeId: 1 })
      expect(error).toMatchObject(invalidFieldError('categoryId'))
    })
  })

  describe('valueTypeId field', () => {
    it('should return error if missing', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 1 })
      expect(error).toMatchObject(missingRequiredFieldError('valueTypeId'))
    })

    it('should return error if not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 1, valueTypeId: 'str' })
      expect(error).toMatchObject(invalidFieldError('valueTypeId'))
    })

    it('should return error if negative', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 2, valueTypeId: -2 })
      expect(error).toMatchObject(invalidFieldError('valueTypeId'))
    })

    it('should return error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 2, valueTypeId: 1.5 })
      expect(error).toMatchObject(invalidFieldError('valueTypeId'))
    })
  })

  describe('id field (if exists)', () => {
    it('should return an error if id is not a number', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 1, valueTypeId: 1, id: 'a' })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if negative numbrer', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 1, valueTypeId: 1, id: -2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if float', () => {
      const { error } = makeMeasure({ name: 'dummy', categoryId: 1, valueTypeId: 1, id: 1.2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })
  })
})
