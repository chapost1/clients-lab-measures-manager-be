const makeMeasureCategory = require('./index')
const { invalidFieldError, missingRequiredFieldError, emptyFieldError } = require('../errors')

describe('makeMeasureCategory', () => {
  const getMockMeasureCategory = () => {
    return {
      name: 'Blood',
      id: null
    }
  }

  describe('param edge cases', () => {
    it('should not throw if object is valid', () => {
      expect(() => makeMeasureCategory(getMockMeasureCategory())).not.toThrow()
    })

    it('should not throw if empty param', () => {
      expect(() => makeMeasureCategory()).not.toThrow()
    })

    it('should return an error if empty param', () => {
      const { error } = makeMeasureCategory()
      expect(error).toBeInstanceOf(Error)
    })

    it('should not return error if valid param', () => {
      const { error } = makeMeasureCategory(getMockMeasureCategory())
      expect(error).toBeNull()
    })
  })

  describe('returned measure_category structure', () => {
    it('should return same structure of measure_category on valid param', () => {
      const { data: actual } = makeMeasureCategory(getMockMeasureCategory())
      const expected = getMockMeasureCategory()
      expect(actual).toMatchObject(expected)
    })

    it('should return same structure on valid param and not omit id', () => {
      const mock = getMockMeasureCategory()
      mock.id = 1
      const { data: actual } = makeMeasureCategory(mock)
      const expected = mock
      expect(actual).toMatchObject(expected)
    })
  })

  describe('name field', () => {
    it('should return error if name is missing', () => {
      const { error } = makeMeasureCategory({})
      expect(error).toMatchObject(missingRequiredFieldError('name'))
    })

    it('should return error if name is not a string', () => {
      const { error } = makeMeasureCategory({ name: 1 })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should return error if name length is 0', () => {
      const { error } = makeMeasureCategory({ name: '' })
      expect(error).toMatchObject(emptyFieldError('name'))
    })

    it('should return error if name is html tag', () => {
      const { error } = makeMeasureCategory({ name: '<div></div>' })
      expect(error).toMatchObject(invalidFieldError('name'))
    })

    it('should escape html from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasureCategory({ name: `<div>${validText}</div>` })
      expect(measure.name).toBe(validText)
    })

    it('should escape script html tags from name', () => {
      const validText = 'text'
      const { data: measure } = makeMeasureCategory({ name: `<script>alert('nasty security attack')</script>${validText}` })
      expect(measure.name).toBe(validText)
    })
  })

  describe('id field (if exists)', () => {
    it('should return an error if id is not a number', () => {
      const { error } = makeMeasureCategory({ name: 'dummy', id: 'a' })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if negative numbrer', () => {
      const { error } = makeMeasureCategory({ name: 'dummy', id: -2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })

    it('should return an error if float', () => {
      const { error } = makeMeasureCategory({ name: 'dummy', id: 1.2 })
      expect(error).toMatchObject(invalidFieldError('id'))
    })
  })
})
